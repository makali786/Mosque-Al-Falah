// API utility functions for Prayer Times management

export interface PrayerTimeData {
  id?: string;
  date: string;
  hijriDate?: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajrIqamahDelay?: number;
  dhuhrIqamahDelay?: number;
  asrIqamahDelay?: number;
  maghribIqamahDelay?: number;
  ishaIqamahDelay?: number;
  isJumuah?: boolean;
  notes?: string;
}

export interface PrayerTimeSettings {
  calculationMethod: 'auto' | 'custom';
  jumuahSettings: {
    enabled: boolean;
    replacesDhuhr: boolean;
    khutbahTime: string;
    iqamahTime: string;
    enableSecondJumuah: boolean;
  };
  ramadanSettings: {
    enabled: boolean;
    startDate?: string;
    endDate?: string;
    showCountdown: boolean;
    imsakOffset: number;
    iftarOffset: number;
  };
}

const API_BASE = '/api';

/**
 * Fetch prayer times for a specific month/year
 */
export async function fetchPrayerTimes(
  month: number,
  year: number
): Promise<PrayerTimeData[]> {
  // Construct YYYY-MM-DD manually to prevent timezone offset shifts when using toISOString() on local dates
  const paddedMonth = String(month).padStart(2, '0');
  const dEnd = String(new Date(year, month, 0).getDate()).padStart(2, '0');

  const startDate = `${year}-${paddedMonth}-01`;
  const endDate = `${year}-${paddedMonth}-${dEnd}`;

  return fetchPrayerTimesByRange(startDate, endDate);
}

export async function fetchPrayerTimesByRange(
  startDate: string,
  endDate: string
): Promise<PrayerTimeData[]> {
  const response = await fetch(
    `${API_BASE}/prayer-times?where[date][greater_than_equal]=${startDate}&where[date][less_than_equal]=${endDate}&limit=400&sort=date`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }

  const data = await response.json();
  return data.docs || [];
}

/**
 * Create a new prayer time entry
 */
export async function createPrayerTime(
  prayerTime: Omit<PrayerTimeData, 'id'>
): Promise<PrayerTimeData> {
  const response = await fetch(`${API_BASE}/prayer-times`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prayerTime),
  });

  if (!response.ok) {
    throw new Error(`Failed to create prayer time: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing prayer time entry
 */
export async function updatePrayerTime(
  id: string,
  prayerTime: Partial<PrayerTimeData>
): Promise<PrayerTimeData> {
  const response = await fetch(`${API_BASE}/prayer-times/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prayerTime),
  });

  if (!response.ok) {
    throw new Error(`Failed to update prayer time: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch prayer time settings global
 */
export async function fetchPrayerTimeSettings(): Promise<PrayerTimeSettings> {
  const response = await fetch(`${API_BASE}/globals/prayer-time-settings`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch prayer time settings: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Update prayer time settings global
 */
export async function updatePrayerTimeSettings(
  settings: Partial<PrayerTimeSettings>
): Promise<PrayerTimeSettings> {
  const response = await fetch(`${API_BASE}/globals/prayer-time-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update prayer time settings: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Calculate iqamah time from adhan time and delay
 */
export function calculateIqamahTime(
  adhanTime: string,
  delayMinutes: number
): string {
  if (!adhanTime) return '';

  const [hours, minutes] = adhanTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + delayMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

/**
 * Format time string to 12-hour format with AM/PM
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';

  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Convert 12-hour time to 24-hour format
 */
export function parseTo24Hour(time12: string): string {
  const match = time12.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time12;

  let [, hours, minutes, period] = match;
  let h = parseInt(hours, 10);

  if (period.toUpperCase() === 'PM' && h !== 12) {
    h += 12;
  } else if (period.toUpperCase() === 'AM' && h === 12) {
    h = 0;
  }

  return `${String(h).padStart(2, '0')}:${minutes}`;
}
