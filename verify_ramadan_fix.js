const fs = require('fs');

async function verifyRamadanFix() {
  const baseUrl = 'http://localhost:3000';
  const datesToCheck = ['2026-02-18', '2026-03-01', '2026-03-19'];

  console.log('--- Verifying Ramadan 2026 Fix ---');

  for (const date of datesToCheck) {
    const dateISO = `${date}T00:00:00.000Z`;
    try {
      const res = await fetch(
        `${baseUrl}/api/prayer-times?where[date][equals]=${dateISO}`
      );
      const data = await res.json();

      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        const parts = doc.hijriDate.split(' ');
        // Expected format: Day 9 Year
        if (parts[1] === '9') {
          console.log(
            `✅ ${date}: Correctly set to Month 9 (Ramadan). Hijri: ${doc.hijriDate}`
          );
        } else {
          console.error(
            `❌ ${date}: Incorrect Month ${parts[1]}. Hijri: ${doc.hijriDate}`
          );
        }
      } else {
        console.error(`❌ ${date}: Record not found.`);
      }
    } catch (e) {
      console.error(`Error checking ${date}:`, e);
    }
  }
}

verifyRamadanFix();
