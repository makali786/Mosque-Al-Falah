const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('prayer_data_export.json', 'utf8'));
  const feb2026 = data.prayerTimes.docs.filter(
    d =>
      d.date.startsWith('2026-02-1') ||
      d.date.startsWith('2026-02-2') ||
      d.date.startsWith('2026-03')
  );

  console.log(`Found ${feb2026.length} records for Feb/Mar 2026.`);

  if (feb2026.length > 0) {
    console.log('Sample Records:');
    feb2026.slice(0, 5).forEach(d => {
      console.log(`Date: ${d.date} | Hijri: ${d.hijriDate}`);
    });

    // Find records with 9th month
    const ramadanRecords = feb2026.filter(d => {
      const parts = d.hijriDate.trim().split(' ');
      const month = parseInt(parts[1]);
      return month === 9;
    });

    console.log(`Records with Month 9: ${ramadanRecords.length}`);
    if (ramadanRecords.length > 0) {
      console.log('First Ramadan Record:', ramadanRecords[0]);
    } else {
      console.log('No records found with month index 9.');
      // Check what month index is present for Feb 18+ (Start of Ramadan)
      const startRamadan = feb2026.find(d => d.date.startsWith('2026-02-18'));
      if (startRamadan) {
        console.log('Feb 18 Record:', startRamadan);
      }
    }
  }
} catch (e) {
  console.error(e);
}
