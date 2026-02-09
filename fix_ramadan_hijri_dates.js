// Native fetch is available in Node 18+

async function fixRamadanHijriDates() {
  const baseUrl = 'http://localhost:3000';

  try {
    console.log(
      '--- Fixing Ramadan 1447 Hijri Dates (Feb 18 - Mar 19 2026) ---'
    );

    // Ramadan 1447 Start: Feb 18, 2026 (1st Ramadan)
    // End: Mar 19, 2026 (30th Ramadan) - Approx

    const startDate = new Date('2026-02-18');
    const endDate = new Date('2026-03-19');

    let currentDate = new Date(startDate);
    let ramadanDay = 1;

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const dateISO = `${dateStr}T00:00:00.000Z`;

      // Construct correct Hijri Date string: "Day Month(9) Year(1447)"
      const hijriDate = `${ramadanDay} 9 1447`;

      console.log(`Processing ${dateStr} -> Expect Hijri: ${hijriDate}`);

      // Find Record
      const findRes = await fetch(
        `${baseUrl}/api/prayer-times?where[date][equals]=${dateISO}`
      );
      const findData = await findRes.json();

      if (findData.docs && findData.docs.length > 0) {
        const doc = findData.docs[0];
        const currentHijri = doc.hijriDate;

        if (currentHijri !== hijriDate) {
          console.log(
            `  Updating ID ${doc.id}: ${currentHijri} -> ${hijriDate}`
          );

          const updateRes = await fetch(
            `${baseUrl}/api/prayer-times/${doc.id}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hijriDate: hijriDate }),
            }
          );

          if (!updateRes.ok) {
            console.error(`  Failed to update: ${updateRes.statusText}`);
          }
        } else {
          console.log(`  Already correct.`);
        }
      } else {
        console.warn(`  Record not found for ${dateStr}`);
      }

      // Increment
      currentDate.setDate(currentDate.getDate() + 1);
      ramadanDay++;
    }

    console.log('Fix Complete.');
  } catch (error) {
    console.error('Script Failed:', error);
  }
}

fixRamadanHijriDates();
