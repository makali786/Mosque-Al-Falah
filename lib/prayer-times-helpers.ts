// Helper functions for prayer times

interface PrayerTimeData {
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
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return date.toTimeString().slice(0, 5);
}

// Get prayer times for a specific date
export function getPrayerTimesByDate(
  prayerTimes: PrayerTimeData[],
  date: Date
): PrayerTimeData | null {
  if (!prayerTimes || prayerTimes.length === 0) return null;
  // Use local date components to avoid timezone shifts (e.g., UTC+5 shifting 00:00 to previous day)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
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
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-GB', options);
}

// Format hijri date
export function formatHijriDate(hijriDate: string): string {
  // hijriDate format from API: "1 12 1441446" (day month year)
  // Parse and format it properly
  if (!hijriDate) return '';
  const parts = hijriDate.trim().split(' ');
  if (parts.length < 3) return hijriDate;

  const day = parts[0];
  const monthNum = parseInt(parts[1]);
  const year = parts[2];

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

  const monthName = hijriMonths[monthNum - 1] || `Month ${monthNum}`;
  return `${monthName} ${day}, ${year} AH`;
}

// Find next prayer - accepts selected date to determine if it's today
export function findNextPrayer(
  prayerTimeData: PrayerTimeData | null,
  selectedDate?: Date
): { name: string; time: string } | null {
  if (!prayerTimeData) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selected = selectedDate
    ? new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    : today;

  // If selected date is not today, return first prayer (Fajr) with no countdown
  if (selected.getTime() !== today.getTime()) {
    return { name: 'FAJR', time: prayerTimeData.fajr };
  }

  // Only calculate next prayer if viewing today
  const currentTime = now.getHours() * 60 + now.getMinutes();

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
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Determine which prayer is currently active
export function getCurrentActivePrayer(
  prayerTimeData: PrayerTimeData | null
): string | null {
  if (!prayerTimeData) return null;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

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
