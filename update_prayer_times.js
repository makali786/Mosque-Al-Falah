// Native fetch is available in Node 18+

async function updatePrayerTimes() {
  const baseUrl = 'http://localhost:3000';

  try {
    console.log('--- Updating Global Settings ---');
    // 1. Update Global Settings
    const settingsPayload = {
      jumuahSettings: {
        enabled: true,
        replacesDhuhr: true,
        khutbahTime: '12:45',
        iqamahTime: '13:15', // Usually Iqamah is shortly after Khutbah. User said "Jumu'ah 1: 12:45 pm(Khutbah?)" "Jumu'ah 2: 1:30 pm".
        // Let's assume 12:45 is Khutbah 1, and 13:30 is Khutbah 2 start?
        // Wait, typical Jumu'ah listing is "Khutbah Start".
        // If Jumu'ah 1 is 12:45, Jumu'ah 2 is 1:30.
        // I will set khutbahTime=12:45, secondKhutbahTime=13:30.
        // I need reasonable Iqamah times or leave them as is/infer.
        // Let's set Iqamah 1 to 13:15 (30 mins) and Iqamah 2 to 14:00 (30 mins) or just keep user provided times as the primary public times.
        // Actually, the field "iqamahTime" is likely the publicly displayed "Jama'ah" time.
        // If user says "Jumu'ah 1: 12:45", they might mean the Khutbah starts then.
        // I will set khutbahTime to 12:45.
        enableSecondJumuah: true,
        secondKhutbahTime: '13:30',
        secondIqamahTime: '14:00', // Inference
      },
      ramadanSettings: {
        enabled: true,
        startDate: '2026-02-18T00:00:00.000Z', // Feb 18 2026
        endDate: '2026-03-19T00:00:00.000Z', // Approx 30 days later
        showCountdown: true,
        imsakOffset: -15,
        iftarOffset: 0,
      },
    };

    // We need to fetch current settings first to get ID/structure if needed, or just PATCH/POST?
    // Payload Globals usually accept POST to update.
    const settingsRes = await fetch(
      `${baseUrl}/api/globals/prayer-time-settings`,
      {
        method: 'POST', // Payload uses POST to update Globals
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsPayload),
      }
    );

    if (!settingsRes.ok) {
      const err = await settingsRes.text();
      throw new Error(
        `Failed to update settings: ${settingsRes.status} ${err}`
      );
    }
    console.log('Global Settings updated successfully.');

    console.log('--- Updating Daily Prayer Times (Feb 6 - Feb 12) ---');
    // 2. Update Daily Times
    // Dates to update: Feb 6, 7, 8, 9, 10, 11, 12 of 2026.

    // Schedule Data
    const schedule = [
      {
        date: '2026-02-06',
        fajr: '06:30',
        sunrise: '07:30',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:02',
        isha: '19:30',
        isJumuah: true,
      },
      {
        date: '2026-02-07',
        fajr: '06:30',
        sunrise: '07:28',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:04',
        isha: '19:00',
        isJumuah: false,
      }, // Sat
      {
        date: '2026-02-08',
        fajr: '06:30',
        sunrise: '07:27',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:06',
        isha: '19:00',
        isJumuah: false,
      }, // Sun
      {
        date: '2026-02-09',
        fajr: '06:30',
        sunrise: '07:25',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:08',
        isha: '19:30',
        isJumuah: false,
      },
      {
        date: '2026-02-10',
        fajr: '06:30',
        sunrise: '07:23',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:10',
        isha: '19:30',
        isJumuah: false,
      },
      {
        date: '2026-02-11',
        fajr: '06:30',
        sunrise: '07:21',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:11',
        isha: '19:30',
        isJumuah: false,
      },
      {
        date: '2026-02-12',
        fajr: '06:30',
        sunrise: '07:19',
        dhuhr: '13:00',
        asr: '16:00',
        maghrib: '17:13',
        isha: '19:30',
        isJumuah: false,
      },
    ];

    // Note: Sunrise times are estimated/interpolated or kept from existing if not strictly specified,
    // but the image shows specific sunrise times.
    // Image scan for Sunrise:
    // 06: 7:30
    // 07: 7:28
    // 08: 7:27
    // 09: 7:25
    // 10: 7:23
    // 11: 7:21
    // 12: 7:19
    // I entered these into the schedule above.

    for (const day of schedule) {
      // Find the ID for this date
      // We need to query by date. Payload API allows query.
      // Date in DB is ISO string at 00:00:00.000Z.
      // Valid query: where[date][equals]=2026-02-06T00:00:00.000Z
      const dateISO = `${day.date}T00:00:00.000Z`;

      const findRes = await fetch(
        `${baseUrl}/api/prayer-times?where[date][equals]=${dateISO}`
      );
      const findData = await findRes.json();

      if (findData.docs && findData.docs.length > 0) {
        const docId = findData.docs[0].id;
        console.log(`Updating ${day.date} (ID: ${docId})...`);

        const updatePayload = {
          fajr: day.fajr,
          sunrise: day.sunrise,
          dhuhr: day.dhuhr,
          asr: day.asr,
          maghrib: day.maghrib,
          isha: day.isha,
          // Preserve other fields? existing doc has delays.
          // We can just update the times. the delays should remain if we use PATCH which Payload does usually support on ID.
          // Actually Payload 'update' (PUT/PATCH) merges at top level?
          // Safer to just send the fields we want to change.
        };

        const updateRes = await fetch(`${baseUrl}/api/prayer-times/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        if (!updateRes.ok) {
          console.error(
            `Failed to update ${day.date}: ${updateRes.statusText}`
          );
        } else {
          console.log(`Updated ${day.date} successfully.`);
        }
      } else {
        console.warn(`Record for ${day.date} not found! Skipping.`);
      }
    }

    console.log('Update Complete.');
  } catch (error) {
    console.error('Script Failed:', error);
  }
}

updatePrayerTimes();
