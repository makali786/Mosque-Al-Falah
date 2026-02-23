import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Initialize plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Europe/London';

// Helper functions for prayer times

export interface PrayerTimeData {
  id: string;
  date: string;
  hijriDate: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajrIqamahDelay: number;
  dhuhrIqamahDelay: number;
  asrIqamahDelay: number;
  maghribIqamahDelay: number;
  ishaIqamahDelay: number;
  isJumuah: boolean;
}

// Add minutes to a time string (format: "HH:MM")
export function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  return dayjs()
    .tz(TIMEZONE)
    .hour(hours)
    .minute(mins + minutes)
    .format('HH:mm');
}

// Get prayer times for a specific date
export function getPrayerTimesByDate(
  prayerTimes: PrayerTimeData[],
  date: Date
): PrayerTimeData | null {
  if (!prayerTimes || prayerTimes.length === 0) return null;
  // Use dayjs with timezone to avoid browser local timezone shifts
  const d = dayjs(date).tz(TIMEZONE);
  const year = d.year();
  const month = String(d.month() + 1).padStart(2, '0');
  const day = String(d.date()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return (
    prayerTimes.find(pt => {
      const ptDate =
        typeof pt.date === 'string' ? pt.date.split('T')[0] : pt.date;
      return ptDate === dateStr;
    }) || null
  );
}

// Format date to readable string
export function formatGregorianDate(date: Date): string {
  const d = dayjs(date).tz(TIMEZONE);
  return d.format('dddd, MMMM D, YYYY');
}

// Format hijri date
export function formatHijriDate(hijriDate: string): string {
  // hijriDate format from API can be:
  // 1. "1 9 1447" (day monthIndex year)
  // 2. "1 Ramadhan" (day monthName)
  // 3. "10 Shaw'waal" (day monthName)
  if (!hijriDate) return '';

  const parts = hijriDate.trim().split(/\s+/);
  if (parts.length < 2) return hijriDate;

  const day = parts[0];
  const secondPart = parts[1];
  const year = parts[2] || '';

  const hijriMonths = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhul-Qadah',
    'Dhul-Hijjah',
  ];

  // If second part is a number, map it to month name
  if (/^\d+$/.test(secondPart)) {
    const monthNum = parseInt(secondPart);
    const monthName = hijriMonths[monthNum - 1] || `Month ${monthNum}`;
    return `${monthName} ${day}${year ? `, ${year}` : ''} AH`;
  }

  // If second part is already a name, just return it formatted
  // Some names might need normalization (e.g., Ramadhan -> Ramadan)
  let monthName = secondPart;
  if (monthName.toLowerCase() === 'ramadhan') monthName = 'Ramadan';
  if (monthName.toLowerCase() === "shaw'waal") monthName = 'Shawwal';

  return `${monthName} ${day}${year ? `, ${year}` : ''} AH`;
}

// Find next prayer - accepts selected date to determine if it's today
export function findNextPrayer(
  prayerTimeData: PrayerTimeData | null,
  selectedDate?: Date
): { name: string; time: string } | null {
  if (!prayerTimeData) return null;

  const now = dayjs().tz(TIMEZONE);

  const selected = selectedDate ? dayjs(selectedDate).tz(TIMEZONE) : now;

  // If selected date is not today, return first prayer (Fajr) with no countdown
  if (selected.format('YYYY-MM-DD') !== now.format('YYYY-MM-DD')) {
    return { name: 'FAJR', time: prayerTimeData.fajr };
  }

  // Only calculate next prayer if viewing today
  const currentTime = now.hour() * 60 + now.minute();

  const prayers = [
    { name: 'FAJR', time: prayerTimeData.fajr },
    // SUNRISE intentionally excluded — it has no Athan and should not appear in the countdown
    { name: 'DHUHR', time: prayerTimeData.dhuhr },
    { name: 'ASR', time: prayerTimeData.asr },
    { name: 'MAGHRIB', time: prayerTimeData.maghrib },
    { name: 'ISHA', time: prayerTimeData.isha },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTime = hours * 60 + minutes;
    if (prayerTime > currentTime) {
      return { name: prayer.name, time: prayer.time };
    }
  }

  // If no prayer left today, return Fajr of next day
  return { name: 'FAJR', time: prayerTimeData.fajr };
}

// Check if selected date is today
export function isToday(date: Date): boolean {
  const now = dayjs().tz(TIMEZONE);
  const d = dayjs(date).tz(TIMEZONE);
  return d.format('YYYY-MM-DD') === now.format('YYYY-MM-DD');
}

// Determine which prayer is currently active
export function getCurrentActivePrayer(
  prayerTimeData: PrayerTimeData | null
): string | null {
  if (!prayerTimeData) return null;

  const now = dayjs().tz(TIMEZONE);
  const currentTime = now.hour() * 60 + now.minute();

  const prayers = [
    { name: 'Fajr', time: prayerTimeData.fajr },
    { name: 'Zuhr', time: prayerTimeData.dhuhr },
    { name: "'Asr", time: prayerTimeData.asr },
    { name: 'Maghrib', time: prayerTimeData.maghrib },
    { name: "'Isha", time: prayerTimeData.isha },
  ];

  // Find the prayer that just passed (current active prayer)
  for (let i = prayers.length - 1; i >= 0; i--) {
    const [hours, minutes] = prayers[i].time.split(':').map(Number);
    const prayerTime = hours * 60 + minutes;
    if (currentTime >= prayerTime) {
      return prayers[i].name;
    }
  }

  // If before Fajr, last night's Isha is active
  return "'Isha";
}
