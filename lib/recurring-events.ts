/**
 * Utility functions for handling recurring events
 */

export interface RecurringEvent {
  timing: {
    startDate: string;
    endDate?: string;
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

  const startDate = new Date(event.timing.startDate);

  // Check recurrence end conditions
  if (
    event.recurrence.recurrenceEnd?.type === 'date' &&
    event.recurrence.recurrenceEnd.endDate
  ) {
    const endDate = new Date(event.recurrence.recurrenceEnd.endDate);
    if (fromDate > endDate) return null;
  }

  let nextOccurrence: Date | null = null;

  if (
    event.recurrence.frequency === 'weekly' &&
    event.recurrence.weeklyPattern
  ) {
    nextOccurrence = findNextWeeklyOccurrence(
      startDate,
      event.recurrence.weeklyPattern,
      fromDate
    );
  } else if (
    event.recurrence.frequency === 'monthly' &&
    event.recurrence.monthlyDay
  ) {
    nextOccurrence = findNextMonthlyOccurrence(
      startDate,
      event.recurrence.monthlyDay,
      fromDate
    );
  }

  // Check if next occurrence is past the end date
  if (
    nextOccurrence &&
    event.recurrence.recurrenceEnd?.type === 'date' &&
    event.recurrence.recurrenceEnd.endDate
  ) {
    const endDate = new Date(event.recurrence.recurrenceEnd.endDate);
    if (nextOccurrence > endDate) {
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
  fromDate: Date
): Date | null {
  const daysAsNumbers = daysOfWeek.map(d => parseInt(d, 10));
  const current = new Date(fromDate);

  // Set to start time
  current.setHours(
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds(),
    0
  );

  // Check if today is a valid day
  const currentDayOfWeek = current.getDay();
  if (daysAsNumbers.includes(currentDayOfWeek)) {
    return current;
  }

  // Look for the next occurrence in the next 14 days
  for (let i = 1; i <= 14; i++) {
    const checkDate = new Date(fromDate);
    checkDate.setDate(fromDate.getDate() + i);
    checkDate.setHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      0
    );

    const dayOfWeek = checkDate.getDay();
    if (daysAsNumbers.includes(dayOfWeek)) {
      return checkDate;
    }
  }

  return null;
}

/**
 * Find the next monthly occurrence on a specific day of the month
 */
function findNextMonthlyOccurrence(
  startDate: Date,
  dayOfMonth: number,
  fromDate: Date
): Date | null {
  const current = new Date(fromDate);

  // Try current month
  current.setDate(dayOfMonth);
  current.setHours(
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds(),
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
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds(),
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
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds(),
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
    const start = new Date(event.timing.startDate);
    const end = event.timing.endDate ? new Date(event.timing.endDate) : null;
    return checkDate >= start && (!end || checkDate <= end);
  }

  // For recurring events, check if today is an occurrence day
  const nextOccurrence = getNextOccurrence(event, checkDate);
  if (!nextOccurrence) return false;

  // Check if we're within the event duration
  const startDate = new Date(event.timing.startDate);
  const endDate = event.timing.endDate ? new Date(event.timing.endDate) : null;

  if (!endDate) {
    // If no end date, it's indefinite once it starts
    return checkDate >= nextOccurrence;
  }

  const eventDuration = endDate.getTime() - startDate.getTime();
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
