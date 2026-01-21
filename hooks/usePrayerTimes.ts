import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getPrayerTimesByDate,
  findNextPrayer,
  formatGregorianDate,
  formatHijriDate,
  addMinutesToTime,
} from "@lib/prayer-times-helpers";

// ============================================================================
// Types
// ============================================================================

export interface PrayerTime {
  name: string;
  begins?: string;
  jamaah?: string;
  isActive?: boolean;
  isJumuah?: boolean;
  khutbah?: string;
}

export interface DateInfo {
  gregorian: string;
  hijri: string;
}

export interface UsePrayerTimesOptions {
  prayerTimes: any[];
  settings?: any;
  currentDate: Date;
}

// ============================================================================
// Hook
// ============================================================================

export function usePrayerTimes({
  prayerTimes: initialPrayerTimes,
  settings,
  currentDate,
}: UsePrayerTimesOptions) {
  // Get current day's prayer time data
  const currentPrayerTimeData = useMemo(() => {
    return getPrayerTimesByDate(initialPrayerTimes, currentDate);
  }, [initialPrayerTimes, currentDate]);

  // Find next prayer
  const nextPrayer = useMemo(() => {
    return findNextPrayer(currentPrayerTimeData, currentDate) || {
      name: "FAJR",
      time: "00:00",
    };
  }, [currentPrayerTimeData, currentDate]);

  // Check if viewing today
  const isViewingToday = useMemo(() => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }, [currentDate]);

  // Transform API data to UI format for prayer times display
  const transformedPrayerTimes = useMemo(() => {
    if (!currentPrayerTimeData) return [];

    const nextPrayerName = isViewingToday ? nextPrayer.name : null;
    const isFriday = currentDate.getDay() === 5;
    const shouldReplaceWithJumuah =
      isFriday &&
      settings?.jumuahSettings?.enabled &&
      settings?.jumuahSettings?.replacesDhuhr;

    const prayers: PrayerTime[] = [
      {
        name: "Fajr",
        begins: currentPrayerTimeData.fajr,
        jamaah: addMinutesToTime(
          currentPrayerTimeData.fajr,
          currentPrayerTimeData.fajrIqamahDelay
        ),
        isActive: nextPrayerName === "FAJR",
      },
      {
        name: "Sunrise",
        begins: currentPrayerTimeData.sunrise,
      },
    ];

    if (shouldReplaceWithJumuah) {
      prayers.push({
        name: "Jumua'ah 1",
        khutbah: settings.jumuahSettings.khutbahTime,
        jamaah: settings.jumuahSettings.iqamahTime,
        isActive: nextPrayerName === "DHUHR",
        isJumuah: true,
      });

      if (settings.jumuahSettings.enableSecondJumuah) {
        prayers.push({
          name: "Jumua'ah 2",
          khutbah: settings.jumuahSettings.secondKhutbahTime,
          jamaah: settings.jumuahSettings.secondIqamahTime,
          isActive: false,
          isJumuah: true,
        });
      }
    } else {
      prayers.push({
        name: "Zuhr",
        begins: currentPrayerTimeData.dhuhr,
        jamaah: addMinutesToTime(
          currentPrayerTimeData.dhuhr,
          currentPrayerTimeData.dhuhrIqamahDelay
        ),
        isActive: nextPrayerName === "DHUHR",
      });
    }

    prayers.push(
      {
        name: "'Asr",
        begins: currentPrayerTimeData.asr,
        jamaah: addMinutesToTime(
          currentPrayerTimeData.asr,
          currentPrayerTimeData.asrIqamahDelay
        ),
        isActive: nextPrayerName === "ASR",
      },
      {
        name: "Maghrib",
        begins: currentPrayerTimeData.maghrib,
        jamaah: addMinutesToTime(
          currentPrayerTimeData.maghrib,
          currentPrayerTimeData.maghribIqamahDelay
        ),
        isActive: nextPrayerName === "MAGHRIB",
      },
      {
        name: "'Isha",
        begins: currentPrayerTimeData.isha,
        jamaah: addMinutesToTime(
          currentPrayerTimeData.isha,
          currentPrayerTimeData.ishaIqamahDelay
        ),
        isActive: nextPrayerName === "ISHA",
      }
    );

    return prayers;
  }, [currentPrayerTimeData, nextPrayer, isViewingToday, currentDate, settings]);

  // Format date info
  const dateInfo = useMemo<DateInfo>(() => {
    if (!currentPrayerTimeData) {
      return {
        gregorian: formatGregorianDate(currentDate),
        hijri: "",
      };
    }

    return {
      gregorian: formatGregorianDate(currentDate),
      hijri: formatHijriDate(currentPrayerTimeData.hijriDate),
    };
  }, [currentDate, currentPrayerTimeData]);

  return {
    prayerTimes: transformedPrayerTimes,
    dateInfo,
    nextPrayer,
    isViewingToday,
    currentPrayerTimeData,
  };
}
