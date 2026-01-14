'use client';

import React, { useState } from 'react';
import {
  calculateIqamahTime,
  fetchPrayerTimesByRange,
  formatTime12Hour,
  PrayerTimeData,
} from './api';

const ExportTab: React.FC = () => {
  const [format, setFormat] = useState('csv');
  const [range, setRange] = useState('current');
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PrayerTimeData[]>([]);

  const getDateRange = () => {
    const now = new Date();
    // Default to 2026 if current year is not 2026? User design shows "Entire Year (2026)".
    // Let's assume we use the current year or 2026.
    // For "Current Month", we use the actual current month.

    // However, if we are simulating "Jan 2026" as "Current" in the app context (Calendar Tab),
    // we should probably stick to that or just use real system time.
    // Given the seed script was 2025-2026, let's use 2026 as the base if "current" is selected in relation to the app.
    // But typically "Current" means "Now".
    // I'll stick to Real Time for convenience unless implied otherwise. Use 2026 for "Year".

    // Actually, looking at the previous CalendarTab, it defaulted to Jan 2026.
    // Let's settle on:
    // Current Month: Jan 2026 (for consistency with demo) OR Real Current Month.
    // Given usage, let's use Real Date for "Current" logic, but override Year to 2026 for the "Entire Year" option.
    // Actually, let's align with CalendarTab which defaulted to Jan 2026. Let's treat "Now" as Jan 2026 for this demo context?
    // No, safest is to use `new Date()` for logic, but maybe hardcode 2026 for the "Year" option.

    let startDate, endDate;
    const year = 2026; // Hardcode base year for "Year" option
    const currentRealDate = new Date();

    if (range === 'current') {
      const y = currentRealDate.getFullYear();
      const m = currentRealDate.getMonth();
      startDate = new Date(y, m, 1);
      endDate = new Date(y, m + 1, 0);
    } else if (range === 'next') {
      const y = currentRealDate.getFullYear();
      const m = currentRealDate.getMonth() + 1;
      startDate = new Date(y, m, 1);
      endDate = new Date(y, m + 1, 0);
    } else {
      // Entire Year (2026)
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  };

  const fetchData = async () => {
    const { start, end } = getDateRange();
    return await fetchPrayerTimesByRange(start, end);
  };

  const generateCSV = (data: PrayerTimeData[]) => {
    const headers = [
      'Date',
      'Hijri Date',
      'Fajr',
      'Fajr Iqamah',
      'Sunrise',
      'Dhuhr',
      'Dhuhr Iqamah',
      'Asr',
      'Asr Iqamah',
      'Maghrib',
      'Maghrib Iqamah',
      'Isha',
      'Isha Iqamah',
      'Is Jumuah',
    ];

    const rows = data.map(d => {
      const fIq = calculateIqamahTime(d.fajr, d.fajrIqamahDelay ?? 20);
      const dIq = calculateIqamahTime(d.dhuhr, d.dhuhrIqamahDelay ?? 15);
      const aIq = calculateIqamahTime(d.asr, d.asrIqamahDelay ?? 15);
      const mIq = calculateIqamahTime(d.maghrib, d.maghribIqamahDelay ?? 10);
      const iIq = calculateIqamahTime(d.isha, d.ishaIqamahDelay ?? 15);

      return [
        d.date,
        d.hijriDate || '',
        formatTime12Hour(d.fajr),
        formatTime12Hour(fIq),
        formatTime12Hour(d.sunrise),
        formatTime12Hour(d.dhuhr),
        formatTime12Hour(dIq),
        formatTime12Hour(d.asr),
        formatTime12Hour(aIq),
        formatTime12Hour(d.maghrib),
        formatTime12Hour(mIq),
        formatTime12Hour(d.isha),
        formatTime12Hour(iIq),
        d.isJumuah ? 'Yes' : 'No',
      ]
        .map(v => `"${v}"`)
        .join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const handlePreview = async () => {
    setIsExporting(true);
    try {
      const data = await fetchData();
      setPreviewData(data.slice(0, 10)); // Show top 10
      setIsPreviewOpen(true);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch data for preview');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const data = await fetchData();

      if (format === 'csv') {
        const csvContent = generateCSV(data);
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `prayer_times_${range}_${new Date().getTime()}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `prayer_times_${range}_${new Date().getTime()}.json`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`${format.toUpperCase()} export is not yet implemented.`);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to downloading export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Export Prayer Times</h2>

        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Format
              </label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              >
                <option value="csv">CSV (Excel)</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF Calendar</option>
                <option value="ics">iCal (Google Calendar / Outlook)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={range}
                onChange={e => setRange(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              >
                <option value="current">Current Month</option>
                <option value="next">Next Month</option>
                <option value="year">Entire Year (2026)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • Format:{' '}
                <span className="font-medium text-gray-900 uppercase">
                  {format}
                </span>
              </li>
              <li>
                • Range:{' '}
                <span className="font-medium text-gray-900 capitalize">
                  {range === 'current'
                    ? 'Current Month'
                    : range === 'next'
                      ? 'Next Month'
                      : '2026 Full Year'}
                </span>
              </li>
              <li>
                • Includes: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha (and Iqamah
                times)
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handlePreview}
              disabled={isExporting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Preview
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              {isExporting ? 'Processing...' : 'Download Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Preview Data (First 10 Rows)
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 sticky top-0">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Fajr</th>
                    <th className="p-2 border">Shuruq</th>
                    <th className="p-2 border">Dhuhr</th>
                    <th className="p-2 border">Asr</th>
                    <th className="p-2 border">Maghrib</th>
                    <th className="p-2 border">Isha</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.length > 0 ? (
                    previewData.map(d => (
                      <tr key={d.id || d.date} className="border-b">
                        <td className="p-2 border">{d.date}</td>
                        <td className="p-2 border">{d.fajr}</td>
                        <td className="p-2 border">{d.sunrise}</td>
                        <td className="p-2 border">{d.dhuhr}</td>
                        <td className="p-2 border">{d.asr}</td>
                        <td className="p-2 border">{d.maghrib}</td>
                        <td className="p-2 border">{d.isha}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No data found in this range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportTab;
