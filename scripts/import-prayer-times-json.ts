import fs from 'fs';
import path from 'path';
import { getPayload } from 'payload';
import configPromise from '../payload.config';

const PRAYER_TIME_FILE = path.join(process.cwd(), 'prayer-time.json');

// Util to parse "H:MM" or "HH:MM" or "H.MM" to minutes
function timeToMinutes(timeStr: string | null): number {
  if (!timeStr) return 0;
  // Normalize separators: replace . with :
  const normalized = timeStr.replace('.', ':');
  const [h, m] = normalized.split(':').map(Number);
  return h * 60 + m;
}

// Util to normalize time string to "HH:mm" for DB
function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  const normalized = timeStr.replace('.', ':');
  const [h, m] = normalized.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
}

const RAMADAN_FILE = path.join(process.cwd(), 'ramadan-prayer-time.json');

const importPrayerTimes = async () => {
  const payload = await getPayload({ config: configPromise });
  console.log('Starting Prayer Times Import (JSON with Ramadan Merge)...');

  if (!fs.existsSync(PRAYER_TIME_FILE)) {
    console.error(`File not found: ${PRAYER_TIME_FILE}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(PRAYER_TIME_FILE, 'utf-8');
  const jsonData = JSON.parse(fileContent);
  const prayerTimes2026 = jsonData.prayer_times_2026;

  let ramadanMap = new Map<string, any>();
  if (fs.existsSync(RAMADAN_FILE)) {
    const rContent = fs.readFileSync(RAMADAN_FILE, 'utf-8');
    const rJson = JSON.parse(rContent);
    // Build map: 'YYYY-MM-DD' -> Data
    // "gregorian_date": "Wed 18 Feb"
    const monthMap: Record<string, string> = {
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
      Jan: '01',
    };

    rJson.ramadhan_timetable_2026.forEach((rDay: any) => {
      // Parse "Wed 18 Feb" -> "2026-02-18"
      const parts = rDay.gregorian_date.split(' '); // ["Wed", "18", "Feb"]
      if (parts.length >= 3) {
        const dayPart = parts[1].padStart(2, '0');
        const monthStr = parts[2].trim();
        const monthNum = monthMap[monthStr];
        if (monthNum) {
          const dateKey = `2026-${monthNum}-${dayPart}`;
          ramadanMap.set(dateKey, rDay);
        }
      }
    });
    console.log(`Loaded ${ramadanMap.size} Ramadan days.`);
  }

  // Order of months in the JSON keys might not be guaranteed, or maybe they are?
  // It's better to rely on known month names order.
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  // State for carrying forward Jamaat times
  const currentJamaat = {
    fajr: '',
    dhuhr: '', // This tracks Dhur Jamaat (non-friday)
    asr: '',
    maghrib: '',
    isha: '',
  };

  // Note: Unlike the explicit table where " implies "same as above",
  // in the JSON, "null" implies "same as above".
  // However, for 'dhur_jumua', on Fridays it changes to Jumua time.
  // We should be careful not to overwrite the "Standard Dhur Jamaat" with "Jumua Time" permanently.
  // Usually, Dhur Jamaat is constant (e.g. 1:00), and Jumua flips to 12:45/1:30 just for Friday.
  // Then Saturday it goes back to 1:00.
  // The JSON for Saturday might be "null" (meaning same as Friday?? No, same as last *explicit* Dhur?).
  // Let's look at the data structure again.
  // Jan 02 (Fri): dhur_jumua: "12:45"
  // Jan 03 (Sat): dhur_jumua: "1:00"
  // Jan 04 (Sun): dhur_jumua: null
  // So Saturday explicitly resets it to 1:00. null on Sunday means 1:00.
  // So we can just blindly update our "current" state with whatever non-null value we see.

  let processedCount = 0;

  for (let mIndex = 0; mIndex < months.length; mIndex++) {
    const monthKey = months[mIndex];
    const days = prayerTimes2026[monthKey];

    if (!days) {
      console.warn(`No data for month: ${monthKey}`);
      continue;
    }

    console.log(`Processing ${monthKey}...`);

    for (const day of days) {
      // 5. Construct Date (Moved up for check)
      // e.g. 2026-01-01
      const dateDay = day.date.padStart(2, '0');
      const monthNum = String(mIndex + 1).padStart(2, '0');
      const dateStr = `2026-${monthNum}-${dateDay}`;

      const isFriday = day.day === 'Fri';

      // CHECK RAMADAN OVERRIDE
      const ramadanData = ramadanMap.get(dateStr);

      // 1. Get/Update Jamaat Times
      // Priority: Ramadan Data > PrayerTime JSON > Current State

      if (ramadanData) {
        // Override Current State for future days too? Yes, Ramadan times usually stick for the month.
        if (ramadanData.fajr_jamaah)
          currentJamaat.fajr = ramadanData.fajr_jamaah;
        if (ramadanData.dhuhr_jamaah)
          currentJamaat.dhuhr = ramadanData.dhuhr_jamaah;
        if (ramadanData.asr_jamaah) currentJamaat.asr = ramadanData.asr_jamaah;
        // Maghrib Jamaat = 5 mins after Iftaar (Adhaan)
        if (ramadanData.iftaar_maghrib_adhaan) {
          const maghribVal = formatTime(ramadanData.iftaar_maghrib_adhaan);
          const maghribMins = timeToMinutes(maghribVal);
          const jamMins = maghribMins + 5;
          const h = Math.floor(jamMins / 60);
          const m = jamMins % 60;
          currentJamaat.maghrib = `${h}:${Object.is(NaN, m) ? '00' : String(m).padStart(2, '0')}`;
        }
        if (ramadanData.esha_jamaah_taraweeh)
          currentJamaat.isha = ramadanData.esha_jamaah_taraweeh;
      } else {
        // Standard Logic
        if (day.jamaat_times.fajr) currentJamaat.fajr = day.jamaat_times.fajr;
        if (day.jamaat_times.dhur_jumua)
          currentJamaat.dhuhr = day.jamaat_times.dhur_jumua;
        if (day.jamaat_times.asr) currentJamaat.asr = day.jamaat_times.asr;
        if (day.jamaat_times.maghrib)
          currentJamaat.maghrib = day.jamaat_times.maghrib;
        if (day.jamaat_times.isha) currentJamaat.isha = day.jamaat_times.isha;
      }

      // 2. Parse Start Times and convert to 24h
      // Helper to convert to 24h format based on prayer type context
      const to24h = (
        time: string | null | undefined,
        type: 'am' | 'pm' | 'dhuhr'
      ) => {
        if (!time) return '';
        let [h, m] = time.replace('.', ':').split(':').map(Number); // Normalize separator here too
        if (isNaN(h) || isNaN(m)) return '';

        if (type === 'am') {
          if (h === 12) h = 0; // 12 AM -> 00
        } else if (type === 'pm') {
          if (h < 12) h += 12; // 1 PM -> 13, 11 PM -> 23
        } else if (type === 'dhuhr') {
          // Dhuhr is tricky. 11:xx is AM. 12:xx is PM. 1:xx is PM.
          // Assumes Dhuhr is between 11 AM and 3 PM.
          if (h < 11) h += 12; // 1:00 -> 13:00.
          // 11 stays 11. 12 stays 12.
        }

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      };

      // If Ramadan, Suhoor Ends = Fajr Start, Iftaar = Maghrib Start
      const fajrRaw = day.beginning_times.subha_sadiq;
      const maghribRaw = day.beginning_times.maghrib_adhaan;
      let fajrStart = to24h(fajrRaw, 'am');
      let maghribStart = to24h(maghribRaw, 'pm');

      if (ramadanData) {
        if (ramadanData.suhoor_ends)
          fajrStart = to24h(ramadanData.suhoor_ends, 'am');
        if (ramadanData.iftaar_maghrib_adhaan)
          maghribStart = to24h(ramadanData.iftaar_maghrib_adhaan, 'pm');
      }

      const sunrise = to24h(day.beginning_times.sun_rise, 'am');
      const dhuhrStart = to24h(day.beginning_times.dhur, 'dhuhr');
      const asrStart = to24h(day.beginning_times.asr, 'pm');
      const ishaStart = to24h(day.beginning_times.isha, 'pm');

      // 3. Prepare Jamaat Times for this day
      // CurrentJamaat is stored as raw? No, let's normalize currentJamaat to 24h as well when updating it?
      // Or normalize here.
      // Since currentJamaat comes from raw strings like "1:30" (Dhuhr) or "5:45" (Fajr), we need to know the context.
      // Better to normalize `currentJamaat` values on the fly using the same logic.

      const fajrJam = to24h(currentJamaat.fajr, 'am');
      const dhuhrJam = to24h(currentJamaat.dhuhr, 'dhuhr');
      const asrJam = to24h(currentJamaat.asr, 'pm');

      // Special case for Maghrib Jamaat override in Ramadan loop (already calculated minutes, checks out)
      // But wait! In the loop above (Ramadan override), I set `currentJamaat.maghrib` to "H:MM".
      // If `h` was calculated from minutes, was it 24h?
      // `jamMins / 60`. If `maghribStart` (Ramadan) was "5:26", H=5 (AM? No PM).
      // `timeToMinutes` uses raw H. 5*60.
      // So H will be 5.
      // So `currentJamaat.maghrib` will be "5:31".
      // Then `to24h("5:31", 'pm')` -> "17:31". Correct.
      // BUT `timeToMinutes` in `calcDelay` expects 24h now?
      // Yes, if I pass 24h strings to `timeToMinutes`, it works correctly.

      const maghribJam = to24h(currentJamaat.maghrib, 'pm');
      const ishaJam = to24h(currentJamaat.isha, 'pm');

      // 4. Calculate Delays
      const calcDelay = (start: string, jam: string) => {
        if (!start || !jam) return 0;
        const sM = timeToMinutes(start);
        const jM = timeToMinutes(jam);
        let diff = jM - sM;
        // If jam is next day (e.g. Isha 00:15 vs 23:00 Start? Unlikely.
        // Or Start 23:50, Jamaat 00:10.
        // 00:10 is 10 mins. 23:50 is 1430. 10 - 1430 = -1420.
        // -1420 + 1440 = 20 mins. Correct.
        if (diff < 0) diff += 24 * 60;
        return diff;
      };

      const fajrDelay = calcDelay(fajrStart, fajrJam);
      const dhuhrDelay = calcDelay(dhuhrStart, dhuhrJam);
      const asrDelay = calcDelay(asrStart, asrJam);
      const maghribDelay = calcDelay(maghribStart, maghribJam);
      const ishaDelay = calcDelay(ishaStart, ishaJam);

      // 6. DB Update
      try {
        const existing = await payload.find({
          collection: 'prayer-times',
          where: { date: { equals: dateStr } },
        });

        const data = {
          date: dateStr,
          hijriDate: day.islamic_date, // Could override with ramadanData.ramadhan_day + ' Ramadhan' if needed
          fajr: fajrStart,
          sunrise: sunrise,
          dhuhr: dhuhrStart,
          asr: asrStart,
          maghrib: maghribStart,
          isha: ishaStart,
          fajrIqamahDelay: fajrDelay,
          dhuhrIqamahDelay: dhuhrDelay,
          asrIqamahDelay: asrDelay,
          maghribIqamahDelay: maghribDelay,
          ishaIqamahDelay: ishaDelay,
          isJumuah: isFriday,
        };

        if (existing.totalDocs > 0) {
          await payload.update({
            collection: 'prayer-times',
            id: existing.docs[0].id,
            data: data,
          });
        } else {
          await payload.create({
            collection: 'prayer-times',
            data: data,
          });
        }
        processedCount++;
      } catch (err) {
        console.error(`Error processing ${dateStr}:`, err);
      }
    }
  }

  console.log(`Successfully processed ${processedCount} days.`);
  process.exit(0);
};

importPrayerTimes();
