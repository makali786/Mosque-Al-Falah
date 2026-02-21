const fs = require('fs');

// 1. Read the raw text file
const rawText = fs.readFileSync('raw-timesheet.txt', 'utf8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);

const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
let currentYear = 2026;
let currentMonth = 0;
let currentHijriMonth = "";

// State to hold the most recent valid Jama'at time when encountering ditto marks (")
let lastJamaat = { fajr: "", dhuhr: "", asr: "", maghrib: "", isha: "" };
const results = [];

// Helper to convert "HH:MM" to total minutes from midnight
function parseTimeToMinutes(timeStr, isPM) {
    if (!timeStr || timeStr === '"') return null;
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return (hours * 60) + minutes;
}

// Helper to format minutes back to "HH:MM" for the Adhan string
function format24h(minutes) {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

// Regex to capture the start of a row: "01 Thur 12 Rajab ..."
const rowRegex = /^(\d{2})\s+([A-Za-z]+)\s+(\d+)\s*([A-Za-z\-']+)?\s+(.*)$/;

for (let line of lines) {
    // Detect the start of a new calendar month
    for (let i = 0; i < months.length; i++) {
        if (line.includes(`${months[i]} 20`)) {
            currentMonth = i;
            const yearMatch = line.match(/20\d{2}/);
            if (yearMatch) currentYear = parseInt(yearMatch[0]);
            break;
        }
    }

    const match = line.match(rowRegex);
    if (match) {
        const dateNum = match[1];
        const dayName = match[2];
        const hijriDay = match[3];

        // Update Hijri month if present in the row and ignores anomalies like "BST Ends"
        if (match[4] && match[4] !== 'BST') {
            currentHijriMonth = match[4];
        }

        // Split the remaining time string and filter out non-time words
        const tokens = match[5].split(/\s+/);
        const timeTokens = tokens.filter(t => t.includes(':') || t === '"');

        if (timeTokens.length >= 11) {
            // Adhan Times (1st half)
            const aFajr = timeTokens[0];
            const aSunrise = timeTokens[1];
            const aDhuhr = timeTokens[2];
            const aAsr = timeTokens[3];
            const aMaghrib = timeTokens[4];
            const aIsha = timeTokens[5];

            // Jama'at Times (2nd half) - Replace ditto marks with previous valid time
            const jFajr = timeTokens[6] === '"' ? lastJamaat.fajr : timeTokens[6];
            const jDhuhr = timeTokens[7] === '"' ? lastJamaat.dhuhr : timeTokens[7];
            const jAsr = timeTokens[8] === '"' ? lastJamaat.asr : timeTokens[8];
            const jMaghrib = timeTokens[9] === '"' ? lastJamaat.maghrib : timeTokens[9];
            const jIsha = timeTokens[10] === '"' ? lastJamaat.isha : timeTokens[10];

            // Update ditto state tracker
            lastJamaat = { fajr: jFajr, dhuhr: jDhuhr, asr: jAsr, maghrib: jMaghrib, isha: jIsha };

            // Convert Adhan to minutes (Assume Dhuhr is PM if it starts with 1:xx)
            const mAFajr = parseTimeToMinutes(aFajr, false);
            const mASunrise = parseTimeToMinutes(aSunrise, false);
            let mADhuhr = parseTimeToMinutes(aDhuhr, false);
            if (aDhuhr.startsWith('1:')) mADhuhr = parseTimeToMinutes(aDhuhr, true);
            const mAAsr = parseTimeToMinutes(aAsr, true);
            const mAMaghrib = parseTimeToMinutes(aMaghrib, true);
            const mAIsha = parseTimeToMinutes(aIsha, true);

            // Convert Jamaat to minutes
            const mJFajr = parseTimeToMinutes(jFajr, false);
            const mJDhuhr = parseTimeToMinutes(jDhuhr, true);
            const mJAsr = parseTimeToMinutes(jAsr, true);
            const mJMaghrib = parseTimeToMinutes(jMaghrib, true);
            const mJIsha = parseTimeToMinutes(jIsha, true);

            // Build UTC Date Object
            const dateObj = new Date(Date.UTC(currentYear, currentMonth, parseInt(dateNum)));

            results.push({
                date: dateObj.toISOString(),
                hijriDate: `${hijriDay} ${currentHijriMonth}`,
                fajr: format24h(mAFajr),
                sunrise: format24h(mASunrise),
                dhuhr: format24h(mADhuhr),
                asr: format24h(mAAsr),
                maghrib: format24h(mAMaghrib),
                isha: format24h(mAIsha),
                fajrIqamahDelay: Math.max(0, mJFajr - mAFajr),
                dhuhrIqamahDelay: Math.max(0, mJDhuhr - mADhuhr),
                asrIqamahDelay: Math.max(0, mJAsr - mAAsr),
                maghribIqamahDelay: Math.max(0, mJMaghrib - mAMaghrib),
                ishaIqamahDelay: Math.max(0, mJIsha - mAIsha),
                isJumuah: dayName === 'Fri'
            });
        }
    }
}

// 3. Write out to JSON
fs.writeFileSync('prayer-times-payload.json', JSON.stringify(results, null, 2));
console.log(`Successfully processed ${results.length} days of prayer times!`);