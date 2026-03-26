/**
 * Utility functions for handling event dates correctly
 * These functions preserve the date/time as stored without timezone conversion issues
 */

/**
 * Extract date components from an ISO date string without timezone conversion
 * Returns the date as it was stored (YYYY-MM-DD)
 */
export function extractDateString(dateString: string | undefined | null): string {
  if (!dateString) return '';
  // Extract YYYY-MM-DD from ISO string (first 10 characters)
  return dateString.slice(0, 10);
}

/**
 * Create a local Date object from a date string without timezone shift
 * This ensures the date displayed matches what was stored
 */
export function createLocalDate(dateString: string | undefined | null): Date | null {
  if (!dateString) return null;
  const [year, month, day] = extractDateString(dateString).split('-').map(Number);
  if (!year || !month || !day) return null;
  // Create date using local components (month is 0-indexed in JS)
  return new Date(year, month - 1, day);
}

/**
 * Format a date for display (e.g., "12 Feb" or "26 Mar")
 */
export function formatEventDate(dateString: string | undefined | null): string {
  const date = createLocalDate(dateString);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format a date with year (e.g., "12 Feb 2026")
 */
export function formatEventDateWithYear(dateString: string | undefined | null): string {
  const date = createLocalDate(dateString);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time from HH:MM format to display format (e.g., "8:00 PM")
 * Handles timezone properly by using local date
 */
export function formatEventTime(timeString: string | undefined | null): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Create a full Date object combining date and time strings
 * This is used for calendar exports and accurate time calculations
 */
export function combineEventDateTime(
  dateString: string | undefined | null,
  timeString: string | undefined | null
): Date | null {
  if (!dateString) return null;
  
  const [year, month, day] = extractDateString(dateString).split('-').map(Number);
  if (!year || !month || !day) return null;
  
  let hours = 0;
  let minutes = 0;
  
  if (timeString) {
    const [h, m] = timeString.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      hours = h;
      minutes = m;
    }
  }
  
  // Create date in local timezone with specified components
  return new Date(year, month - 1, day, hours, minutes, 0);
}

/**
 * Get duration in milliseconds between two dates
 */
export function getEventDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return end - start;
}

/**
 * Calculate end datetime for an occurrence based on original duration
 */
export function calculateOccurrenceEndDate(
  occurrenceStart: Date,
  originalStartDate: string,
  originalEndDate: string | undefined | null
): Date | null {
  if (!originalEndDate) return null;
  const duration = getEventDuration(originalStartDate, originalEndDate);
  return new Date(occurrenceStart.getTime() + duration);
}
