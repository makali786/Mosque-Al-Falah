'use client';

import PrayerTimesSection from '@/components/common/PrayerTimesSection';
import {
  exportToCSV,
  exportToICal,
  exportToJSON,
  exportToPDF,
} from '@lib/prayer-times-export';
import { useMemo, useState } from 'react';
import {
  IoCalendar,
  IoChevronDown,
  IoCode,
  IoDocument,
  IoDocumentText,
} from 'react-icons/io5';

interface PrayerTimesWrapperProps {
  initialPrayerTimes: any[];
  settings: any;
}

type ExportFormat = 'pdf' | 'csv' | 'ical' | 'json';

export default function PrayerTimesWrapper({
  initialPrayerTimes,
  settings,
}: PrayerTimesWrapperProps) {
  const [activeTab, setActiveTab] = useState<'prayer-time' | 'calendar'>(
    'prayer-time'
  );
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isRamadanDownloadOpen, setIsRamadanDownloadOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Get year from prayer times for download button
  const displayYear = useMemo(() => {
    return calendarYear;
  }, [calendarYear]);

  // Handle export based on format
  const handleExport = async (format: ExportFormat) => {
    setIsDownloadOpen(false);

    // Filter prayer times for the selected year
    const yearData = initialPrayerTimes.filter(pt => {
      const date = new Date(pt.date);
      return date.getFullYear() === displayYear;
    });

    if (yearData.length === 0) {
      alert(`No prayer times data available for ${displayYear}`);
      return;
    }

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(yearData, displayYear);
          break;
        case 'csv':
          exportToCSV(yearData, displayYear);
          break;
        case 'ical':
          exportToICal(yearData, displayYear);
          break;
        case 'json':
          exportToJSON(yearData, displayYear);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export prayer times. Please try again.');
    }
  };

  const handleRamadanExport = async (format: ExportFormat) => {
    setIsRamadanDownloadOpen(false);

    // Filter prayer times for the selected year
    const yearData = initialPrayerTimes.filter(pt => {
      const date = new Date(pt.date);
      return date.getFullYear() === displayYear;
    });

    // Filter for Ramadan
    const ramadanData = yearData.filter(pt => {
      if (!pt.hijriDate) return false;
      const hijriDateLower = pt.hijriDate.toLowerCase();

      // Check for month name
      if (
        hijriDateLower.includes('ramadan') ||
        hijriDateLower.includes('ramadhan')
      ) {
        return true;
      }

      // Check for numeric month index (1-based), Ramadan is the 9th month
      const parts = pt.hijriDate.trim().split(/\s+/);
      if (parts.length >= 2) {
        return parseInt(parts[1]) === 9;
      }

      return false;
    });

    if (ramadanData.length === 0) {
      alert(`No Ramadan prayer times available for ${displayYear}`);
      return;
    }

    const title = `Ramadan Timetable ${displayYear}`;
    const fileName = `ramadan-timetable-${displayYear}`;

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(ramadanData, displayYear, title, `${fileName}.pdf`);
          break;
        case 'csv':
          exportToCSV(ramadanData, displayYear, `${fileName}.csv`);
          break;
        case 'ical':
          exportToICal(ramadanData, displayYear, `${fileName}.ics`);
          break;
        case 'json':
          exportToJSON(ramadanData, displayYear, `${fileName}.json`);
          break;
      }
    } catch (error) {
      console.error('Ramadan export failed:', error);
      alert('Failed to export Ramadan timetable. Please try again.');
    }
  };

  const exportOptions = [
    {
      format: 'pdf' as ExportFormat,
      label: 'PDF Document',
      icon: IoDocumentText,
    },
    {
      format: 'csv' as ExportFormat,
      label: 'CSV Spreadsheet',
      icon: IoDocument,
    },
    {
      format: 'ical' as ExportFormat,
      label: 'iCalendar (.ics)',
      icon: IoCalendar,
    },
    { format: 'json' as ExportFormat, label: 'JSON Data', icon: IoCode },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 section-padding-prayer pt-8">
        {/* Toggle Switch */}
        <div className="bg-[#FAFAFA] p-1 rounded-lg flex w-full flex-wrap md:w-auto">
          <button
            onClick={() => setActiveTab('prayer-time')}
            className={`flex-1 md:flex-none px-4 md:px-10 py-2.5 rounded-md text-sm md:text-base font-medium transition-all md:min-w-[174px] md:max-w-[174px] cursor-pointer text-center whitespace-nowrap ${activeTab === 'prayer-time'
              ? 'bg-white text-[#18181B] shadow-sm'
              : 'text-[#71717A] hover:text-[#18181B]'
              }`}
          >
            Prayer Time
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 md:flex-none px-4 md:px-10 py-2.5 rounded-md text-sm md:text-base font-medium transition-all md:min-w-[174px] md:max-w-[174px] cursor-pointer text-center whitespace-nowrap ${activeTab === 'calendar'
              ? 'bg-white text-[#18181B] shadow-sm'
              : 'text-[#71717A] hover:text-[#18181B]'
              }`}
          >
            Calendar
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-sm sm:text-base cursor-pointer hover:bg-[#18181B] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>Download {displayYear} timetable</span>
              <IoChevronDown
                className={`w-4 h-4 transition-transform ${isDownloadOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDownloadOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDownloadOpen(false)}
                />

                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[220px] z-20 border border-gray-200">
                  {exportOptions.map(({ format, label, icon: Icon }) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 text-sm"
                    >
                      <Icon className="w-5 h-5 text-[#006FEE]" />
                      <span className="text-[#18181B] font-medium">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            {/* <button
              onClick={() => setIsRamadanDownloadOpen(!isRamadanDownloadOpen)}
              className="bg-[#27272A] w-full sm:w-auto text-white px-6 py-3 rounded-lg text-sm sm:text-base cursor-pointer hover:bg-[#18181B] transition-colors flex items-center gap-2"
            >
              <span>Ramadan Timetable</span>
              <IoChevronDown
                className={`w-4 h-4 transition-transform ${
                  isRamadanDownloadOpen ? 'rotate-180' : ''
                }`}
              />
            </button> */}

            {/* Ramadan Dropdown Menu */}
            {isRamadanDownloadOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsRamadanDownloadOpen(false)}
                />

                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[220px] z-20 border border-gray-200">
                  {exportOptions.map(({ format, label, icon: Icon }) => (
                    <button
                      key={format}
                      onClick={() => handleRamadanExport(format)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 text-sm"
                    >
                      <Icon className="w-5 h-5 text-[#006FEE]" />
                      <span className="text-[#18181B] font-medium">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PrayerTimesSection
        activeTab={activeTab}
        prayerTimes={initialPrayerTimes}
        settings={settings}
        onYearChange={setCalendarYear}
      />
    </>
  );
}
