// Native fetch is available in Node 18+

async function verifyUpdates() {
  const baseUrl = 'http://localhost:3000';

  try {
    console.log('--- Verifying Global Settings ---');
    const settingsRes = await fetch(
      `${baseUrl}/api/globals/prayer-time-settings`
    );
    const settings = await settingsRes.json();

    console.log(
      'Jumuah Settings:',
      JSON.stringify(settings.jumuahSettings, null, 2)
    );
    console.log(
      'Ramadan Settings:',
      JSON.stringify(settings.ramadanSettings, null, 2)
    );

    // Assertions (Visual check in log)
    if (
      settings.jumuahSettings.khutbahTime === '12:45' &&
      settings.jumuahSettings.secondKhutbahTime === '13:30'
    ) {
      console.log('✅ Jumuah Times Verified');
    } else {
      console.error('❌ Jumuah Times Mismatch');
    }

    if (
      settings.ramadanSettings.enabled === true &&
      settings.ramadanSettings.startDate.startsWith('2026-02-18')
    ) {
      console.log('✅ Ramadan Settings Verified');
    } else {
      console.error('❌ Ramadan Settings Mismatch');
    }

    console.log('--- Verifying Daily Prayer Times (Feb 6 - Feb 12) ---');
    const dates = [
      '2026-02-06',
      '2026-02-07',
      '2026-02-08',
      '2026-02-09',
      '2026-02-10',
      '2026-02-11',
      '2026-02-12',
    ];

    for (const date of dates) {
      const dateISO = `${date}T00:00:00.000Z`;
      const res = await fetch(
        `${baseUrl}/api/prayer-times?where[date][equals]=${dateISO}`
      );
      const data = await res.json();

      if (data.docs.length > 0) {
        const day = data.docs[0];
        console.log(
          `Date: ${date} | Fajr: ${day.fajr} | Dhuhr: ${day.dhuhr} | Asr: ${day.asr} | Maghrib: ${day.maghrib} | Isha: ${day.isha}`
        );
      } else {
        console.error(`❌ Date ${date} NOT FOUND`);
      }
    }
  } catch (error) {
    console.error('Verification Failed:', error);
  }
}

verifyUpdates();
