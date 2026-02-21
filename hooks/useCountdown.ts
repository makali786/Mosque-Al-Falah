import { useState, useEffect } from "react";
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

export interface CountdownTime {
  hours: string;
  minutes: string;
  seconds: string;
}

// ============================================================================
// Utility Function
// ============================================================================

function calculateCountdown(targetTime: string): CountdownTime {
  const now = dayjs().tz(TIMEZONE);
  const [hours, minutes] = targetTime.split(":").map(Number);

  let target = dayjs().tz(TIMEZONE).hour(hours).minute(minutes).second(0).millisecond(0);

  // If target time has passed today (based on London time), set it for tomorrow
  if (now.isAfter(target)) {
    target = target.add(1, 'day');
  }

  const diffMs = target.diff(now);

  if (diffMs <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const h = Math.floor(diffMs / (1000 * 60 * 60));
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
  };
}

// ============================================================================
// Hook
// ============================================================================

export interface UseCountdownOptions {
  targetTime: string;
  isActive?: boolean; // Only count down when true (e.g., when viewing today)
}

export function useCountdown({ targetTime, isActive = true }: UseCountdownOptions) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (isActive) {
        setCountdown(calculateCountdown(targetTime));
      } else {
        setCountdown({ hours: "00", minutes: "00", seconds: "00" });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTime, isActive]);

  return countdown;
}
