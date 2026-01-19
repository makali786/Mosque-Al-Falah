'use client';

import React, { useEffect, useState } from 'react';
import { PrayerTimeData, calculateIqamahTime, formatTime12Hour } from './api';

interface EditPrayerTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PrayerTimeData>) => Promise<void>;
  prayerTime: PrayerTimeData | null;
}

const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
type PrayerName = (typeof prayers)[number];

const prayerLabels: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Shuruq',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const EditPrayerTimeModal: React.FC<EditPrayerTimeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  prayerTime,
}) => {
  const [formData, setFormData] = useState<Partial<PrayerTimeData>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (prayerTime) {
      setFormData({
        fajr: prayerTime.fajr,
        sunrise: prayerTime.sunrise,
        dhuhr: prayerTime.dhuhr,
        asr: prayerTime.asr,
        maghrib: prayerTime.maghrib,
        isha: prayerTime.isha,
        fajrIqamahDelay: prayerTime.fajrIqamahDelay ?? 20,
        dhuhrIqamahDelay: prayerTime.dhuhrIqamahDelay ?? 15,
        asrIqamahDelay: prayerTime.asrIqamahDelay ?? 15,
        maghribIqamahDelay: prayerTime.maghribIqamahDelay ?? 10,
        ishaIqamahDelay: prayerTime.ishaIqamahDelay ?? 15,
      });
    }
  }, [prayerTime]);

  if (!isOpen || !prayerTime) return null;

  const handleAdhanChange = (prayer: PrayerName, value: string) => {
    setFormData(prev => ({ ...prev, [prayer]: value }));
  };

  const handleDelayChange = (prayer: PrayerName, value: number) => {
    const delayField = `${prayer}IqamahDelay` as keyof PrayerTimeData;
    setFormData(prev => ({ ...prev, [delayField]: value }));
  };

  const getDelay = (prayer: PrayerName): number => {
    const delayField = `${prayer}IqamahDelay` as keyof PrayerTimeData;
    return (formData[delayField] as number) ?? 15;
  };

  const getIqamahTime = (prayer: PrayerName): string => {
    if (prayer === 'sunrise') return '—';
    const adhanTime = formData[prayer] as string;
    const delay = getDelay(prayer);
    const iqamah = calculateIqamahTime(adhanTime, delay);
    return formatTime12Hour(iqamah);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Format date for display
  const dateObj = new Date(prayerTime.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/80" onClick={onClose} />

      {/* Dialog */}
      <div
        role="dialog"
        data-state="open"
        className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg max-w-3xl"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            <div className="flex flex-col">
              <span>{formattedDate}</span>
              {prayerTime.hijriDate && (
                <span className="text-sm font-normal text-gray-500">
                  {prayerTime.hijriDate}
                </span>
              )}
            </div>
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-hidden border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 pl-3 font-medium">Prayer</th>
                <th className="text-left p-2 font-medium">Adhan Time</th>
                <th className="text-left p-2 font-medium">Iqamah Delay</th>
                <th className="text-left p-2 font-medium">Iqamah Time</th>
              </tr>
            </thead>
            <tbody>
              {prayers.map(prayer => (
                <tr key={prayer} className="border-t hover:bg-gray-50">
                  <td className="p-2 pl-3">
                    <span className="font-medium">{prayerLabels[prayer]}</span>
                  </td>
                  <td className="p-2">
                    <input
                      className="flex rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 w-32"
                      type="time"
                      value={formData[prayer] || ''}
                      onChange={e => handleAdhanChange(prayer, e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    {prayer !== 'sunrise' ? (
                      <div className="flex items-center gap-1">
                        <input
                          className="flex rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 w-16"
                          min={0}
                          type="number"
                          value={getDelay(prayer)}
                          onChange={e =>
                            handleDelayChange(
                              prayer,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        <span className="text-sm text-gray-500">min</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-2">
                    <span className="text-sm">
                      {prayer === 'sunrise' ? (
                        <span className="text-gray-500">—</span>
                      ) : (
                        getIqamahTime(prayer)
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-10 px-4 py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-save h-4 w-4 mr-2"
            >
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
              <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
            </svg>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x h-4 w-4"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

export default EditPrayerTimeModal;
