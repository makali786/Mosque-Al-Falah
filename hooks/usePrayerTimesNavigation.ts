import { useState, useCallback, useEffect } from "react";

// ============================================================================
// Hook for Date Navigation
// ============================================================================

export interface UsePrayerTimesNavigationOptions {
  resetOnMount?: boolean;
}

export function usePrayerTimesNavigation(
  options: UsePrayerTimesNavigationOptions = {}
) {
  const { resetOnMount = false } = options;
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Reset to current date when component mounts (useful for modals/panels)
  useEffect(() => {
    if (resetOnMount) {
      setCurrentDate(new Date());
    }
  }, [resetOnMount]);

  const handlePreviousDay = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const resetToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    currentDate,
    setCurrentDate,
    handlePreviousDay,
    handleNextDay,
    resetToToday,
  };
}
