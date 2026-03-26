/**
 * Utility functions for handling recurring events
 */

/**
 * Create a local Date object from an ISO date string without timezone shift
 * This ensures the date matches what was stored
 */
function createLocalDate(dateString: string | undefined | null): Date | null {
  if (!dateString) return null;
  const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export interface RecurringEvent {
  timing: {
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
  };
  recurrence?: {
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly';
    weeklyPattern?: string[];
    monthlyDay?: number;
    recurrenceEnd?: {
      type: 'never' | 'date' | 'count';
      endDate?: string;
      occurrences?: number;
    };
  };
}

/**
 * Calculate the next occurrence date for a recurring event
 * @param event The recurring event object
 * @param fromDate The date to calculate from (defaults to now)
 * @returns The next occurrence date, or null if no more occurrences
 */
export function getNextOccurrence(
  event: RecurringEvent,
  fromDate: Date = new Date()
): Date | null {
  if (!event.recurrence?.isRecurring) {
    return null;
  }

  // Use local date creation to avoid timezone shifts
  const startDate = createLocalDate(event.timing.startDate);
  if (!startDate) return null;
  const instanceEndDate = event.timing.endDate 
    ? createLocalDate(event.timing.endDate) 
    : null;
  
  // Parse start time if available (format: "HH:MM")
  // Default to 0 if no time specified
  let startHours = 0;
  let startMinutes = 0;
  if (event.timing.startTime) {
    const [h, m] = event.timing.startTime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      startHours = h;
      startMinutes = m;
    }
  }

  // IMPORTANT: The startDate is always the FIRST occurrence, regardless of pattern.
  // If we're before the startDate, return the startDate itself.
  // If we're on or after the startDate, find the next occurrence following the pattern.
  const startDateWithTime = new Date(startDate);
  startDateWithTime.setHours(startHours, startMinutes, 0, 0);
  
  // If fromDate is before or on the start date, the first occurrence is the startDate itself
  const fromDateOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  if (fromDateOnly <= startDateOnly) {
    return startDateWithTime;
  }
  
  // Otherwise, find the next occurrence following the recurrence pattern
  let currentFromDate = fromDate;

  // Check recurrence end conditions
  if (
    event.recurrence.recurrenceEnd?.type === 'date' &&
    event.recurrence.recurrenceEnd.endDate
  ) {
    const recurrenceEndDate = createLocalDate(event.recurrence.recurrenceEnd.endDate);
    if (recurrenceEndDate && currentFromDate > recurrenceEndDate) return null;
  }

  let nextOccurrence: Date | null = null;

  if (
    event.recurrence.frequency === 'weekly' &&
    event.recurrence.weeklyPattern
  ) {
    nextOccurrence = findNextWeeklyOccurrence(
      startDate,
      event.recurrence.weeklyPattern,
      currentFromDate,
      startHours,
      startMinutes
    );
  } else if (
    event.recurrence.frequency === 'monthly' &&
    event.recurrence.monthlyDay
  ) {
    nextOccurrence = findNextMonthlyOccurrence(
      startDate,
      event.recurrence.monthlyDay,
      currentFromDate,
      startHours,
      startMinutes
    );
  }

  // Check if next occurrence is past the end date
  if (
    nextOccurrence &&
    event.recurrence.recurrenceEnd?.type === 'date' &&
    event.recurrence.recurrenceEnd.endDate
  ) {
    const recurrenceEndDate = createLocalDate(event.recurrence.recurrenceEnd.endDate);
    if (recurrenceEndDate && nextOccurrence > recurrenceEndDate) {
      return null;
    }
  }

  return nextOccurrence;
}

/**
 * Find the next weekly occurrence based on selected days of week
 */
function findNextWeeklyOccurrence(
  startDate: Date,
  daysOfWeek: string[],
  fromDate: Date,
  startHours: number,
  startMinutes: number
): Date | null {
  const daysAsNumbers = daysOfWeek.map(d => parseInt(d, 10));
  
  // Start checking from fromDate
  let checkDate = new Date(fromDate);
  checkDate.setHours(startHours, startMinutes, 0, 0);
  
  // Look for the next occurrence (including today) in the next 14 days
  for (let i = 0; i <= 14; i++) {
    const dayOfWeek = checkDate.getDay();
    if (daysAsNumbers.includes(dayOfWeek)) {
      return new Date(checkDate);
    }
    // Move to next day
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return null;
}

/**
 * Find the next monthly occurrence on a specific day of the month
 */
function findNextMonthlyOccurrence(
  startDate: Date,
  dayOfMonth: number,
  fromDate: Date,
  startHours: number,
  startMinutes: number
): Date | null {
  const current = new Date(fromDate);

  // Try current month
  current.setDate(dayOfMonth);
  current.setHours(
    startHours,
    startMinutes,
    0,
    0
  );

  // Check if today matches the day of month
  if (current.getDate() === dayOfMonth) {
    return current;
  }

  // Try next month
  current.setMonth(current.getMonth() + 1);
  current.setDate(1); // Reset to 1st to avoid date overflow
  current.setDate(dayOfMonth);
  current.setHours(
    startHours,
    startMinutes,
    0,
    0
  );

  // Check if the day exists in next month
  if (current.getDate() === dayOfMonth) {
    return current;
  }

  // If the day doesn't exist (e.g., 31st in a 30-day month), try the month after
  current.setMonth(current.getMonth() + 1);
  current.setDate(1);
  current.setDate(dayOfMonth);
  current.setHours(
    startHours,
    startMinutes,
    0,
    0
  );

  if (current.getDate() === dayOfMonth) {
    return current;
  }

  return null;
}

/**
 * Check if an event is currently happening
 */
export function isEventHappening(
  event: RecurringEvent,
  checkDate: Date = new Date()
): boolean {
  if (!event.recurrence?.isRecurring) {
    // One-time event
    const start = createLocalDate(event.timing.startDate);
    const end = event.timing.endDate ? createLocalDate(event.timing.endDate) : null;
    if (!start) return false;
    return checkDate >= start && (!end || checkDate <= end);
  }

  // For recurring events, check if today is an occurrence day
  const nextOccurrence = getNextOccurrence(event, checkDate);
  if (!nextOccurrence) return false;

  // Check if we're within the event duration
  const eventStartDate = createLocalDate(event.timing.startDate);
  const eventEndDate = event.timing.endDate ? createLocalDate(event.timing.endDate) : null;

  if (!eventEndDate || !eventStartDate) {
    // If no end date, it's indefinite once it starts
    return checkDate >= nextOccurrence;
  }

  const eventDuration = eventEndDate.getTime() - eventStartDate.getTime();
  const occurrenceEnd = new Date(nextOccurrence.getTime() + eventDuration);

  return checkDate >= nextOccurrence && checkDate <= occurrenceEnd;
}

/**
 * Get all upcoming occurrences for a recurring event (useful for calendar views)
 */
export function getUpcomingOccurrences(
  event: RecurringEvent,
  count: number = 10,
  fromDate: Date = new Date()
): Date[] {
  if (!event.recurrence?.isRecurring) {
    return [];
  }

  const occurrences: Date[] = [];
  let currentDate = new Date(fromDate);

  for (let i = 0; i < count; i++) {
    const next = getNextOccurrence(event, currentDate);
    if (!next) break;

    occurrences.push(next);

    // Move to the day after this occurrence to find the next one
    currentDate = new Date(next);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return occurrences;
}
