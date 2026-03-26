import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Europe/London";

// ============================================================================
// Types
// ============================================================================

export interface PrayerCountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  type: 'athan' | 'iqamah';
  prayerName: string;
  targetTime: string;
}

export interface PrayerInfo {
  name: string;
  athanTime: string;
  iqamahTime?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate countdown to a specific time today
 */
function calculateCountdownToTime(targetTimeMinutes: number): { hours: string; minutes: string; seconds: string } | null {
  const now = dayjs().tz(TIMEZONE);
  const currentMinutes = now.hour() * 60 + now.minute();
  const currentSeconds = now.second();
  
  let diffMinutes = targetTimeMinutes - currentMinutes;
  let diffSeconds = 60 - currentSeconds;
  
  // If target time has passed
  if (diffMinutes < 0 || (diffMinutes === 0 && diffSeconds <= 0)) {
    return null;
  }
  
  // Adjust for seconds
  if (diffSeconds === 60) {
    diffSeconds = 0;
  } else {
    diffMinutes -= 1;
  }
  
  const h = Math.floor(diffMinutes / 60);
  const m = diffMinutes % 60;
  const s = diffSeconds;
  
  return {
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
  };
}

/**
 * Find the current prayer state based on current time
 */
function findCurrentPrayerState(
  prayers: PrayerInfo[],
  currentTimeMinutes: number
): { 
  state: 'before-athan' | 'between-athan-iqamah' | 'between-prayers';
  currentPrayer: PrayerInfo;
  nextPrayer: PrayerInfo;
} {
  for (let i = 0; i < prayers.length; i++) {
    const prayer = prayers[i];
    const athanMinutes = timeToMinutes(prayer.athanTime);
    const iqamahMinutes = prayer.iqamahTime ? timeToMinutes(prayer.iqamahTime) : athanMinutes + 10; // fallback
    
    // Before Athan of this prayer
    if (currentTimeMinutes < athanMinutes) {
      return {
        state: 'before-athan',
        currentPrayer: prayer,
        nextPrayer: prayer,
      };
    }
    
    // Between Athan and Iqamah of this prayer
    if (currentTimeMinutes >= athanMinutes && currentTimeMinutes < iqamahMinutes) {
      return {
        state: 'between-athan-iqamah',
        currentPrayer: prayer,
        nextPrayer: prayer,
      };
    }
    
    // After Iqamah but before next prayer's Athan
    const nextPrayer = prayers[i + 1];
    if (nextPrayer) {
      const nextAthanMinutes = timeToMinutes(nextPrayer.athanTime);
      if (currentTimeMinutes >= iqamahMinutes && currentTimeMinutes < nextAthanMinutes) {
        return {
          state: 'between-prayers',
          currentPrayer: prayer,
          nextPrayer: nextPrayer,
        };
      }
    }
  }
  
  // After all prayers today - return first prayer of next day (Fajr)
  return {
    state: 'between-prayers',
    currentPrayer: prayers[prayers.length - 1],
    nextPrayer: prayers[0],
  };
}

// ============================================================================
// Hook
// ============================================================================

export interface UsePrayerCountdownOptions {
  prayers: PrayerInfo[];
  isActive?: boolean;
}

export function usePrayerCountdown({ 
  prayers, 
  isActive = true 
}: UsePrayerCountdownOptions): PrayerCountdownState {
  const [countdown, setCountdown] = useState<PrayerCountdownState>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    type: 'athan',
    prayerName: prayers[0]?.name || 'Fajr',
    targetTime: prayers[0]?.athanTime || '00:00',
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (!isActive || prayers.length === 0) {
        setCountdown({
          hours: "00",
          minutes: "00",
          seconds: "00",
          type: 'athan',
          prayerName: prayers[0]?.name || 'Fajr',
          targetTime: prayers[0]?.athanTime || '00:00',
        });
        return;
      }

      const now = dayjs().tz(TIMEZONE);
      const currentTimeMinutes = now.hour() * 60 + now.minute();
      
      const { state, currentPrayer, nextPrayer } = findCurrentPrayerState(prayers, currentTimeMinutes);
      
      let result: PrayerCountdownState;
      
      if (state === 'before-athan') {
        // Countdown to Athan
        const athanMinutes = timeToMinutes(nextPrayer.athanTime);
        const timeLeft = calculateCountdownToTime(athanMinutes);
        
        if (timeLeft) {
          result = {
            ...timeLeft,
            type: 'athan',
            prayerName: nextPrayer.name,
            targetTime: nextPrayer.athanTime,
          };
        } else {
          // Athan just passed, recalculate for Iqamah
          const iqamahMinutes = nextPrayer.iqamahTime ? timeToMinutes(nextPrayer.iqamahTime) : athanMinutes + 10;
          const iqamahTimeLeft = calculateCountdownToTime(iqamahMinutes);
          result = {
            ...(iqamahTimeLeft || { hours: "00", minutes: "00", seconds: "00" }),
            type: 'iqamah',
            prayerName: nextPrayer.name,
            targetTime: nextPrayer.iqamahTime || nextPrayer.athanTime,
          };
        }
      } else if (state === 'between-athan-iqamah') {
        // Countdown to Iqamah
        const iqamahMinutes = currentPrayer.iqamahTime 
          ? timeToMinutes(currentPrayer.iqamahTime) 
          : timeToMinutes(currentPrayer.athanTime) + 10;
        const timeLeft = calculateCountdownToTime(iqamahMinutes);
        
        if (timeLeft) {
          result = {
            ...timeLeft,
            type: 'iqamah',
            prayerName: currentPrayer.name,
            targetTime: currentPrayer.iqamahTime || currentPrayer.athanTime,
          };
        } else {
          // Iqamah just passed, go to next prayer's athan
          const nextAthanMinutes = timeToMinutes(nextPrayer.athanTime);
          const nextTimeLeft = calculateCountdownToTime(nextAthanMinutes);
          result = {
            ...(nextTimeLeft || { hours: "00", minutes: "00", seconds: "00" }),
            type: 'athan',
            prayerName: nextPrayer.name,
            targetTime: nextPrayer.athanTime,
          };
        }
      } else if (state === 'between-prayers') {
        // Between Iqamah and next prayer's Athan - countdown to next Athan
        const nextAthanMinutes = timeToMinutes(nextPrayer.athanTime);
        const timeLeft = calculateCountdownToTime(nextAthanMinutes);
        
        if (timeLeft) {
          result = {
            ...timeLeft,
            type: 'athan',
            prayerName: nextPrayer.name,
            targetTime: nextPrayer.athanTime,
          };
        } else {
          // Next Athan just passed (edge case), countdown to its Iqamah
          const nextIqamahMinutes = nextPrayer.iqamahTime 
            ? timeToMinutes(nextPrayer.iqamahTime) 
            : nextAthanMinutes + 10;
          const iqamahTimeLeft = calculateCountdownToTime(nextIqamahMinutes);
          result = {
            ...(iqamahTimeLeft || { hours: "00", minutes: "00", seconds: "00" }),
            type: 'iqamah',
            prayerName: nextPrayer.name,
            targetTime: nextPrayer.iqamahTime || nextPrayer.athanTime,
          };
        }
      } else {
        // After all prayers today - countdown to next day's Fajr
        const nextAthanMinutes = timeToMinutes(nextPrayer.athanTime);
        const timeLeft = calculateCountdownToTime(nextAthanMinutes + 24 * 60); // Add 24 hours for next day
        
        result = {
          ...(timeLeft || { hours: "00", minutes: "00", seconds: "00" }),
          type: 'athan',
          prayerName: nextPrayer.name,
          targetTime: nextPrayer.athanTime,
        };
      }
      
      setCountdown(result);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prayers, isActive]);

  return countdown;
}

/**
 * Transform prayer times from usePrayerTimes to PrayerInfo format
 */
export function transformToPrayerInfo(
  prayerTimes: Array<{
    name: string;
    begins?: string;
    jamaah?: string;
  }>
): PrayerInfo[] {
  // Filter out Sunrise (no athan) and Jumu'ah rows (handled separately)
  return prayerTimes
    .filter(pt => pt.name !== 'Sunrise' && !pt.name.includes("Jumua'ah"))
    .map(pt => ({
      name: pt.name,
      athanTime: pt.begins || '00:00',
      iqamahTime: pt.jamaah,
    }));
}
