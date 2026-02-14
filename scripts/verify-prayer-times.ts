import { getPayload } from 'payload';
import configPromise from '../payload.config';

const verifyPrayerTimes = async () => {
  const payload = await getPayload({ config: configPromise });

  const checkDate = async (dateStr: string, description: string) => {
    const result = await payload.find({
      collection: 'prayer-times',
      where: {
        date: {
          equals: dateStr,
        },
      },
    });

    if (result.totalDocs > 0) {
      console.log(`\n--- ${description} (${dateStr}) ---`);
      console.log(result.docs[0]);
    } else {
      console.log(`\n--- ${description} (${dateStr}) NOT FOUND ---`);
    }
  };

  console.log('Verifying Prayer Times Data...');

  // Check a standard day
  await checkDate('2026-01-15', 'Standard Day');

  // Check day before Ramadan
  await checkDate('2026-02-17', 'Day Before Ramadan');

  // Check Ramadan Start
  await checkDate('2026-02-18', 'Ramadan Start (1st Ramadan)');

  // Check Ramadan End
  await checkDate('2026-03-19', 'Ramadan End (30th Ramadan)');

  process.exit(0);
};

verifyPrayerTimes();
