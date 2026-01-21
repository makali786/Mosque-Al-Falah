import { useState, useEffect } from "react";

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
  const now = new Date();
  const [hours, minutes] = targetTime.split(":").map(Number);

  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // If target time has passed today, set it for tomorrow
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

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
