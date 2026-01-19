import { getPayload } from 'payload';
import configPromise from './payload.config';

const seed = async () => {
  const payload = await getPayload({ config: configPromise });

  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-12-31');

  let currentDate = startDate;
  let count = 0;

  while (currentDate <= endDate) {
    const month = currentDate.getMonth(); // 0-11

    // Simple variation based on month (just for visual difference)
    // Summer (June/July) vs Winter (Dec/Jan)
    const isSummer = month > 3 && month < 9;

    const fajr = isSummer ? '04:00' : '06:00';
    const sunrise = isSummer ? '05:30' : '07:30';
    const dhuhr = '13:00';
    const asr = isSummer ? '17:00' : '15:30';
    const maghrib = isSummer ? '20:30' : '17:00';
    const isha = isSummer ? '22:00' : '19:00';

    const dateISO = currentDate.toISOString().split('T')[0];

    try {
      // Check if exists first to avoid duplicate errors if re-running
      const existing = await payload.find({
        collection: 'prayer-times',
        where: {
          date: {
            equals: dateISO,
          },
        },
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'prayer-times',
          data: {
            date: dateISO,
            hijriDate: `1 ${month + 1} 144${currentDate.getFullYear() - 580}`, // Rough dummy Hijri
            fajr,
            sunrise,
            dhuhr,
            asr,
            maghrib,
            isha,
            fajrIqamahDelay: 20,
            dhuhrIqamahDelay: 15,
            asrIqamahDelay: 15,
            maghribIqamahDelay: 10,
            ishaIqamahDelay: 15,
            isJumuah: currentDate.getDay() === 5, // Friday
          },
        });
        process.stdout.write('.');
      }
    } catch (e) {
      console.error(`Failed on ${dateISO}:`, e);
    }

    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
    count++;
  }

  process.exit(0);
};

seed();
