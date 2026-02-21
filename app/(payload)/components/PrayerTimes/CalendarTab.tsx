'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import EditPrayerTimeModal from './EditPrayerTimeModal';
import {
  PrayerTimeData,
  calculateIqamahTime,
  createPrayerTime,
  fetchPrayerTimes,
  formatTime12Hour,
  parseTo24Hour,
  updatePrayerTime,
} from './api';

interface DisplayPrayerTime {
  id?: string;
  date: string;
  dateISO: string;
  hijri: { day: number; month: string; year: string };
  fajr: { start: string; iqamah: string };
  shuruq: string;
  dhuhr: { start: string; iqamah: string };
  asr: { start: string; iqamah: string };
  maghrib: { start: string; iqamah: string };
  isha: { start: string; iqamah: string };
  isFriday: boolean;
  rawData?: PrayerTimeData;
}

const CalendarTab: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [prayerTimes, setPrayerTimes] = useState<DisplayPrayerTime[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [selectedPrayerTime, setSelectedPrayerTime] =
    useState<PrayerTimeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View Options
  const [showIqamah, setShowIqamah] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  // Edits tracking: map of dateISO -> Partial<PrayerTimeData>
  const [edits, setEdits] = useState<Record<string, Partial<PrayerTimeData>>>(
    {}
  );

  const dateInputRef = useRef<HTMLInputElement>(null);

  const generateFallbackData = useCallback(
    (month: number, year: number): DisplayPrayerTime[] => {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month - 1, day);
        const isFriday = date.getDay() === 5;
        const dateISO = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Basic fallback values
        return {
          date: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          dateISO,
          hijri: { day: 11 + i, month: 'Rajab', year: '1447H' }, // Dummy hijri
          fajr: { start: '4:19 AM', iqamah: '4:39 AM' },
          shuruq: '6:19 AM',
          dhuhr: { start: '1:01 PM', iqamah: '1:16 PM' },
          asr: { start: '4:31 PM', iqamah: '4:46 PM' },
          maghrib: { start: '7:41 PM', iqamah: '7:51 PM' },
          isha: { start: '9:31 PM', iqamah: '9:46 PM' },
          isFriday,
        };
      });
    },
    []
  );

  const convertToDisplayFormat = useCallback(
    (data: PrayerTimeData): DisplayPrayerTime => {
      const [year, month, day] = data.date.split('T')[0].split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const isFriday = date.getDay() === 5;

      return {
        id: data.id,
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        dateISO: data.date.split('T')[0],
        hijri: {
          day: parseInt(data.hijriDate?.split(' ')[0] || '1'),
          month: data.hijriDate?.split(' ')[1] || 'Rajab',
          year: data.hijriDate?.split(' ')[2] || '1447H',
        },
        fajr: {
          start: formatTime12Hour(data.fajr),
          iqamah: formatTime12Hour(
            calculateIqamahTime(data.fajr, data.fajrIqamahDelay ?? 20)
          ),
        },
        shuruq: formatTime12Hour(data.sunrise),
        dhuhr: {
          start: formatTime12Hour(data.dhuhr),
          iqamah: formatTime12Hour(
            calculateIqamahTime(data.dhuhr, data.dhuhrIqamahDelay ?? 15)
          ),
        },
        asr: {
          start: formatTime12Hour(data.asr),
          iqamah: formatTime12Hour(
            calculateIqamahTime(data.asr, data.asrIqamahDelay ?? 15)
          ),
        },
        maghrib: {
          start: formatTime12Hour(data.maghrib),
          iqamah: formatTime12Hour(
            calculateIqamahTime(data.maghrib, data.maghribIqamahDelay ?? 10)
          ),
        },
        isha: {
          start: formatTime12Hour(data.isha),
          iqamah: formatTime12Hour(
            calculateIqamahTime(data.isha, data.ishaIqamahDelay ?? 15)
          ),
        },
        isFriday,
        rawData: data,
      };
    },
    []
  );

  const loadPrayerTimes = useCallback(async () => {
    setLoading(true);
    setEdits({}); // Clear edits on month change
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const apiData = await fetchPrayerTimes(month, year);

      if (apiData.length > 0) {
        const displayData = apiData.map(convertToDisplayFormat);
        const fallback = generateFallbackData(month, year);
        const mergedData = fallback.map(fallbackDay => {
          const apiDay = displayData.find(
            d => d.dateISO === fallbackDay.dateISO
          );
          return apiDay || fallbackDay;
        });
        setPrayerTimes(mergedData);
      } else {
        setPrayerTimes(generateFallbackData(month, year));
      }
    } catch (error) {
      console.error('Failed to load prayer times:', error);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      setPrayerTimes(generateFallbackData(month, year));
    } finally {
      setLoading(false);
    }
  }, [currentDate, convertToDisplayFormat, generateFallbackData]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  const handleRowClick = (day: DisplayPrayerTime) => {
    if (isEditMode) return; // Disable modal in edit mode

    if (day.rawData) {
      setSelectedPrayerTime(day.rawData);
    } else {
      const [year, month, dayNum] = day.dateISO.split('-').map(Number);
      const date = new Date(year, month - 1, dayNum);
      setSelectedPrayerTime({
        date: day.dateISO,
        hijriDate: `${day.hijri.day} ${day.hijri.month} ${day.hijri.year}`,
        fajr: '04:19',
        sunrise: '06:19',
        dhuhr: '13:01',
        asr: '16:31',
        maghrib: '19:41',
        isha: '21:31',
        fajrIqamahDelay: 20,
        dhuhrIqamahDelay: 15,
        asrIqamahDelay: 15,
        maghribIqamahDelay: 10,
        ishaIqamahDelay: 15,
        isJumuah: date.getDay() === 5,
      });
    }
    setIsModalOpen(true);
  };

  const handleModalSave = async (data: Partial<PrayerTimeData>) => {
    if (!selectedPrayerTime) return;
    try {
      if (selectedPrayerTime.id) {
        await updatePrayerTime(selectedPrayerTime.id, data);
      } else {
        await createPrayerTime({
          ...selectedPrayerTime,
          ...data,
        } as PrayerTimeData);
      }
      await loadPrayerTimes();
    } catch (error) {
      console.error('Failed to save prayer time:', error);
      throw error;
    }
  };

  const goToPreviousMonth = () =>
    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [year, month] = value.split('-').map(Number);
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  // Inline Edit Handlers
  const handleEditChange = (
    dateISO: string,
    field: keyof PrayerTimeData,
    value: string
  ) => {
    setEdits(prev => ({
      ...prev,
      [dateISO]: {
        ...(prev[dateISO] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setSavingChanges(true);
    try {
      const promises = Object.entries(edits).map(async ([dateISO, changes]) => {
        const originalDay = prayerTimes.find(d => d.dateISO === dateISO);
        if (!originalDay) return;

        if (originalDay.rawData?.id) {
          // Update existing
          await updatePrayerTime(originalDay.rawData.id, changes);
        } else {
          // Create new
          const [y, m, d] = dateISO.split('-').map(Number);
          const defaultData: PrayerTimeData = {
            date: dateISO,
            hijriDate: `${originalDay.hijri.day} ${originalDay.hijri.month} ${originalDay.hijri.year}`,
            fajr: '04:19',
            sunrise: '06:19',
            dhuhr: '13:01',
            asr: '16:31',
            maghrib: '19:41',
            isha: '21:31',
            fajrIqamahDelay: 20,
            dhuhrIqamahDelay: 15,
            asrIqamahDelay: 15,
            maghribIqamahDelay: 10,
            ishaIqamahDelay: 15,
            isJumuah: new Date(y, m - 1, d).getDay() === 5,
            ...(originalDay.rawData || {}),
          };
          await createPrayerTime({ ...defaultData, ...changes });
        }
      });

      await Promise.all(promises);
      setIsEditMode(false);
      setEdits({});
      await loadPrayerTimes();
      alert('Changes saved successfully');
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save some changes. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  const handleCancelEdit = () => {
    if (Object.keys(edits).length > 0) {
      if (
        !confirm(
          'You have unsaved changes. Are you sure you want to discard them?'
        )
      )
        return;
    }
    setIsEditMode(false);
    setEdits({});
  };

  // Helper to render editable input
  const renderTimeInput = (
    day: DisplayPrayerTime,
    field: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
    currentValue: string
  ) => {
    const isFriday = day.isFriday;
    if (isFriday && field === 'dhuhr') return null; // Skip Dhuhr on Jumuah if represented differently

    const dateISO = day.dateISO;
    const editedValue = edits[dateISO]?.[field];

    // Determine value to show: edited > rawData > fallback
    // Note: displayData is already formatted (12h), but inputs need 24h
    // We store inputs in 24h format in 'edits'

    const rawValue = day.rawData?.[field] || currentValue; // Using 24h or 12h depending on source?
    // Wait, convertToDisplayFormat formats to 12h.
    // We need 24h for input type="time".

    // If we have rawData, it's 24h or "HH:mm".
    // If we have fallback, it's "4:19 AM", need to parse.

    const get24h = (val: string) => {
      if (val.includes('M')) return parseTo24Hour(val); // 12h to 24h
      return val;
    };

    const value24 = editedValue !== undefined ? editedValue : get24h(rawValue);

    return (
      <input
        type="time"
        className="w-full text-center border border-gray-300 rounded px-1 py-1 text-sm focus:border-blue-500 focus:outline-none"
        value={value24}
        onChange={e => handleEditChange(dateISO, field, e.target.value)}
      />
    );
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const currentMonthValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span className="text-sm font-medium">
              You are in edit mode. Make your changes and click Save Changes
              when done.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={savingChanges}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md flex items-center gap-2"
            >
              {savingChanges ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Header controls - Hidden in Edit Mode? Reference shows standard header in bg, but usually specialized header replaces or sits below. 
          Actually screenshot 3 shows the banner REPLACING the standard header or sitting above it. 
          The header with "Calendar   Settings..." is the tabs. 
          The control bar (buttons) seems to be REPLACED or Overlayed by the "You are in edit mode" bar.
          Let's verify. Screenshot 3 has "Prayer Times Management" title, Tabs, THEN "You are in edit mode" bar. 
          The date nav seems to be GONE in edit mode screenshot.
          I'll hide the nav bar if isEditMode.
      */}

      {!isEditMode && (
        <div className="flex flex-wrap items-center justify-between p-4 border-b gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="inline-flex items-center justify-center p-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors w-9 h-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => dateInputRef.current?.showPicker()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors bg-white min-w-[140px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>{monthYear}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto text-gray-400"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <input
                ref={dateInputRef}
                type="month"
                value={currentMonthValue}
                onChange={handleMonthChange}
                className="absolute inset-0 opacity-0 pointer-events-none"
                style={{
                  visibility: 'hidden',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                }}
              />
            </div>

            <button
              onClick={goToNextMonth}
              className="inline-flex items-center justify-center p-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors w-9 h-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIqamah(!showIqamah)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors text-sm font-medium ${!showIqamah ? 'bg-gray-100 border-gray-300 text-gray-900' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{showIqamah ? 'Hide Iqamah' : 'Show Iqamah'}</span>
            </button>

            <button
              onClick={() => setIsEditMode(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              <span>Edit</span>
            </button>

            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Loading prayer times...
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-3 text-left font-semibold text-gray-900 w-[180px]">
                Date
              </th>
              <th className="p-3 text-left font-semibold text-gray-900 border-l border-gray-100">
                Hijri
              </th>
              <th className="p-3 text-center font-semibold text-gray-900 uppercase tracking-wider border-l border-gray-100">
                Fajr
              </th>
              <th className="p-3 text-center font-semibold text-gray-900 uppercase tracking-wider border-l border-gray-100">
                Shuruq
              </th>
              <th className="p-3 text-center font-semibold text-gray-900 uppercase tracking-wider border-l border-gray-100">
                Dhuhr
              </th>
              <th className="p-3 text-center font-semibold text-gray-900 uppercase tracking-wider border-l border-gray-100">
                Asr
              </th>
              <th className="p-3 text-center font-semibold text-gray-900 uppercase tracking-wider border-l border-gray-100">
                Maghrib
              </th>
              <th className="p-3 text-center font-semibold text-gray-900 uppercase tracking-wider border-l border-gray-100">
                Isha
              </th>
              {isEditMode && (
                <th className="p-3 text-center font-semibold text-gray-900 border-l border-gray-100 w-[80px]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {prayerTimes.map(day => (
              <tr
                key={day.dateISO}
                onClick={() => handleRowClick(day)}
                className={`
                  border-b border-gray-100 hover:bg-blue-50 transition-colors
                  ${day.isFriday ? 'bg-green-50/50' : ''}
                  ${!isEditMode ? 'cursor-pointer' : ''}
                `}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {day.date}
                    </span>
                    {day.isFriday && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Jumu'ah
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 border-l border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {day.hijri.day}
                    </span>
                    <span className="text-xs text-gray-500">
                      {day.hijri.month}
                    </span>
                    <span className="text-xs text-gray-400">
                      {day.hijri.year}
                    </span>
                  </div>
                </td>

                {/* FAJR */}
                <td className="p-3 text-center border-l border-gray-100">
                  {isEditMode ? (
                    renderTimeInput(day, 'fajr', day.fajr.start)
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">
                        {day.fajr.start}
                      </div>
                      {showIqamah && (
                        <div className="text-xs text-gray-500 mt-1">
                          {day.fajr.iqamah}
                        </div>
                      )}
                    </>
                  )}
                </td>

                {/* SHURUQ */}
                <td className="p-3 text-center border-l border-gray-100">
                  {isEditMode ? (
                    renderTimeInput(day, 'sunrise', day.shuruq)
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">
                        {day.shuruq}
                      </div>
                      {showIqamah && (
                        <div className="text-xs text-gray-400 mt-1">—</div>
                      )}
                    </>
                  )}
                </td>

                {/* DHUHR */}
                <td className="p-3 text-center border-l border-gray-100">
                  {day.isFriday ? (
                    <div>
                      <span className="font-semibold text-green-700">
                        Jumu'ah
                      </span>
                      {showIqamah && (
                        <div className="text-xs text-green-600 mt-1">
                          1:00 PM
                        </div>
                      )}
                    </div>
                  ) : isEditMode ? (
                    renderTimeInput(day, 'dhuhr', day.dhuhr.start)
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">
                        {day.dhuhr.start}
                      </div>
                      {showIqamah && (
                        <div className="text-xs text-gray-500 mt-1">
                          {day.dhuhr.iqamah}
                        </div>
                      )}
                    </>
                  )}
                </td>

                {/* ASR */}
                <td className="p-3 text-center border-l border-gray-100">
                  {isEditMode ? (
                    renderTimeInput(day, 'asr', day.asr.start)
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">
                        {day.asr.start}
                      </div>
                      {showIqamah && (
                        <div className="text-xs text-gray-500 mt-1">
                          {day.asr.iqamah}
                        </div>
                      )}
                    </>
                  )}
                </td>

                {/* MAGHRIB */}
                <td className="p-3 text-center border-l border-gray-100">
                  {isEditMode ? (
                    renderTimeInput(day, 'maghrib', day.maghrib.start)
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">
                        {day.maghrib.start}
                      </div>
                      {showIqamah && (
                        <div className="text-xs text-gray-500 mt-1">
                          {day.maghrib.iqamah}
                        </div>
                      )}
                    </>
                  )}
                </td>

                {/* ISHA */}
                <td className="p-3 text-center border-l border-gray-100">
                  {isEditMode ? (
                    renderTimeInput(day, 'isha', day.isha.start)
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">
                        {day.isha.start}
                      </div>
                      {showIqamah && (
                        <div className="text-xs text-gray-500 mt-1">
                          {day.isha.iqamah}
                        </div>
                      )}
                    </>
                  )}
                </td>

                {/* Actions Collumn for Edit Mode */}
                {isEditMode && (
                  <td className="p-3 text-center border-l border-gray-100">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy to next day"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditPrayerTimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        prayerTime={selectedPrayerTime}
      />
    </div>
  );
};

export default CalendarTab;
