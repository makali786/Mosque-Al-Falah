const fs = require('fs');

async function exportData() {
  try {
    const baseUrl = 'http://localhost:3000';

    console.log('Fetching Global Settings...');
    const settingsRes = await fetch(
      `${baseUrl}/api/globals/prayer-time-settings`
    );
    if (!settingsRes.ok)
      throw new Error(`Failed to fetch settings: ${settingsRes.statusText}`);
    const settings = await settingsRes.json();

    console.log('Fetching Prayer Times Collection...');
    const timesRes = await fetch(`${baseUrl}/api/prayer-times?limit=10000`);
    if (!timesRes.ok)
      throw new Error(`Failed to fetch prayer times: ${timesRes.statusText}`);
    const times = await timesRes.json();

    const exportData = {
      timestamp: new Date().toISOString(),
      settings,
      prayerTimes: times,
    };

    fs.writeFileSync(
      'prayer_data_export.json',
      JSON.stringify(exportData, null, 2)
    );
    console.log('Export completed: prayer_data_export.json');
    console.log(`Exported ${times.docs.length} prayer time records.`);
  } catch (error) {
    console.error('Export failed:', error);
  }
}

exportData();
