import { getNextOccurrence } from '../lib/recurring-events';
import * as fs from 'fs';

const testEvent: any = {
    timing: {
        startDate: '2026-03-10T10:00:00.000Z',
        endDate: '2026-03-10T12:00:00.000Z',
        timezone: 'UTC',
    },
    recurrence: {
        isRecurring: true,
        frequency: 'weekly',
        weeklyPattern: ['2'], // Tuesday (Matches Mar 10, 17)
    }
};

// Mock "now" as March 17, 2026 at 11:00 AM (during the event)
const duringTime = new Date('2026-03-17T11:00:00.000Z');
const resultDuring = getNextOccurrence(testEvent, duringTime);

// Mock "now" as March 17, 2026 at 1:00 PM (after the event)
const afterTime = new Date('2026-03-17T13:00:00.000Z');
const resultAfter = getNextOccurrence(testEvent, afterTime);

const output = `DURING: ${resultDuring?.toISOString()}\nAFTER: ${resultAfter?.toISOString()}`;
fs.writeFileSync('scripts/test-results.txt', output);
console.log('Results written to scripts/test-results.txt');
