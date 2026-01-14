'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  createPrayerTime,
  fetchPrayerTimeSettings,
  updatePrayerTimeSettings,
} from './api';

interface ParsedPrayerTime {
  date: string;
  hijriDate?: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const SettingsTab: React.FC = () => {
  const [method, setMethod] = useState<'auto' | 'custom'>('auto');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedPrayerTime[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchPrayerTimeSettings();
        setMethod(settings.calculationMethod ?? 'auto');
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Parse CSV file
  const parseCSV = (text: string): ParsedPrayerTime[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error(
        'CSV file must have a header row and at least one data row'
      );
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const dateIndex = header.findIndex(
      h => h.includes('date') && !h.includes('hijri')
    );
    const hijriIndex = header.findIndex(h => h.includes('hijri'));
    const fajrIndex = header.findIndex(h => h.includes('fajr'));
    const sunriseIndex = header.findIndex(
      h => h.includes('sunrise') || h.includes('shuruq')
    );
    const dhuhrIndex = header.findIndex(
      h => h.includes('dhuhr') || h.includes('zuhr')
    );
    const asrIndex = header.findIndex(h => h.includes('asr'));
    const maghribIndex = header.findIndex(h => h.includes('maghrib'));
    const ishaIndex = header.findIndex(h => h.includes('isha'));

    if (dateIndex === -1 || fajrIndex === -1 || dhuhrIndex === -1) {
      throw new Error('CSV must have Date, Fajr, and Dhuhr columns');
    }

    const results: ParsedPrayerTime[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < 5) continue;

      // Parse date (supports various formats)
      let dateStr = values[dateIndex];
      let parsedDate: Date;

      // Try to parse the date
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // MM/DD/YYYY or DD/MM/YYYY
          const [a, b, c] = parts.map(Number);
          if (a > 12) {
            // DD/MM/YYYY
            parsedDate = new Date(c, b - 1, a);
          } else {
            // MM/DD/YYYY
            parsedDate = new Date(c, a - 1, b);
          }
        } else {
          parsedDate = new Date(dateStr);
        }
      } else {
        parsedDate = new Date(dateStr);
      }

      if (isNaN(parsedDate.getTime())) {
        console.warn(`Skipping row ${i + 1}: Invalid date "${dateStr}"`);
        continue;
      }

      // Format time to HH:mm
      const formatTime = (time: string): string => {
        if (!time) return '00:00';

        // Remove extra spaces
        time = time.trim();

        // Handle 12-hour format
        const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (match) {
          let [, hours, minutes, period] = match;
          let h = parseInt(hours, 10);

          if (period) {
            if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
            if (period.toUpperCase() === 'AM' && h === 12) h = 0;
          }

          return `${String(h).padStart(2, '0')}:${minutes}`;
        }

        return time;
      };

      results.push({
        date: parsedDate.toISOString().split('T')[0],
        hijriDate: hijriIndex !== -1 ? values[hijriIndex] : undefined,
        fajr: formatTime(values[fajrIndex]),
        sunrise: formatTime(values[sunriseIndex] || '06:00'),
        dhuhr: formatTime(values[dhuhrIndex]),
        asr: formatTime(values[asrIndex] || '15:30'),
        maghrib: formatTime(values[maghribIndex] || '18:30'),
        isha: formatTime(values[ishaIndex] || '20:00'),
      });
    }

    return results;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadError(null);
    setParsedData([]);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        throw new Error('No valid prayer times found in the file');
      }

      setParsedData(parsed);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to parse file'
      );
      setUploadedFile(null);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const item of parsedData) {
        try {
          await createPrayerTime({
            date: item.date,
            hijriDate: item.hijriDate,
            fajr: item.fajr,
            sunrise: item.sunrise,
            dhuhr: item.dhuhr,
            asr: item.asr,
            maghrib: item.maghrib,
            isha: item.isha,
            fajrIqamahDelay: 20,
            dhuhrIqamahDelay: 15,
            asrIqamahDelay: 15,
            maghribIqamahDelay: 10,
            ishaIqamahDelay: 15,
            isJumuah: new Date(item.date).getDay() === 5,
          });
          successCount++;
        } catch {
          errorCount++;
        }
      }

      alert(
        `Import complete! ${successCount} entries added, ${errorCount} failed.`
      );

      // Clear the form
      setParsedData([]);
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError('Failed to import prayer times. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrayerTimeSettings({
        calculationMethod: method,
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6" style={{ opacity: 1 }}>
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Step 1 of 4</span>
            <span>25% Complete</span>
          </div>
          <div
            aria-valuemax={100}
            aria-valuemin={0}
            role="progressbar"
            data-state="indeterminate"
            data-max={100}
            className="relative w-full overflow-hidden rounded-full bg-secondary h-2 bg-gray-100"
          >
            <div
              data-state="indeterminate"
              data-max={100}
              className="h-full w-full flex-1 bg-primary transition-all bg-blue-600"
              style={{ transform: 'translateX(-75%)' }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Choose Calculation Method
            </h2>
            <p className="text-gray-500">
              Select how you want to set up your prayer times
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Automatic Calculation Card */}
            <div
              className={`rounded-lg border bg-white shadow-sm cursor-pointer transition-all hover:border-blue-400 hover:shadow-md ${method === 'auto' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200'}`}
              onClick={() => setMethod('auto')}
            >
              <div className="p-6 text-center space-y-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${method === 'auto' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
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
                    className="lucide lucide-calculator h-8 w-8"
                  >
                    <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                    <line x1="8" x2="16" y1="6" y2="6"></line>
                    <line x1="16" x2="16" y1="14" y2="18"></line>
                    <path d="M16 10h.01"></path>
                    <path d="M12 10h.01"></path>
                    <path d="M8 10h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M8 14h.01"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M8 18h.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Automatic Calculation
                </h3>
                <p className="text-center text-gray-500">
                  Automatically calculate prayer times based on your location
                  (coordinates) and calculation method (e.g., ISNA, MWL).
                </p>
              </div>
            </div>

            {/* Import Custom Times Card */}
            <div
              className={`rounded-lg border bg-white shadow-sm cursor-pointer transition-all hover:border-blue-400 hover:shadow-md ${method === 'custom' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200'}`}
              onClick={() => setMethod('custom')}
            >
              <div className="p-6 text-center space-y-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${method === 'custom' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
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
                    className="lucide lucide-file-spreadsheet h-8 w-8"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M8 13h2"></path>
                    <path d="M14 13h2"></path>
                    <path d="M8 17h2"></path>
                    <path d="M14 17h2"></path>
                  </svg>
                </div>
                <h3 className="text-xl text-gray-900 font-semibold mb-2">
                  Import Custom Times
                </h3>
                <p className="text-center text-gray-500">
                  Upload your own prayer times file (CSV or Excel) with
                  pre-defined prayer times for your masjid.
                </p>
              </div>
            </div>
          </div>

          {/* CSV Upload Section - Only shown when custom is selected */}
          {method === 'custom' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Prayer Times File
              </h3>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Upload a CSV file with columns: Date, Fajr, Sunrise, Dhuhr,
                  Asr, Maghrib, Isha
                </p>
                <p className="text-xs text-gray-400">
                  Optional columns: Hijri Date. Times can be in 24-hour (14:30)
                  or 12-hour (2:30 PM) format.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-gray-700 cursor-pointer"
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
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                  Choose File
                </label>
                {uploadedFile && (
                  <span className="text-sm text-gray-600">
                    {uploadedFile.name}
                  </span>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {uploadError}
                </div>
              )}

              {parsedData.length > 0 && (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                    ✓ Found {parsedData.length} prayer time entries ready to
                    import
                  </div>

                  {/* Preview Table */}
                  <div className="overflow-x-auto max-h-48 border rounded-md">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="p-2 text-left font-medium">Date</th>
                          <th className="p-2 text-left font-medium">Fajr</th>
                          <th className="p-2 text-left font-medium">Sunrise</th>
                          <th className="p-2 text-left font-medium">Dhuhr</th>
                          <th className="p-2 text-left font-medium">Asr</th>
                          <th className="p-2 text-left font-medium">Maghrib</th>
                          <th className="p-2 text-left font-medium">Isha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{row.date}</td>
                            <td className="p-2">{row.fajr}</td>
                            <td className="p-2">{row.sunrise}</td>
                            <td className="p-2">{row.dhuhr}</td>
                            <td className="p-2">{row.asr}</td>
                            <td className="p-2">{row.maghrib}</td>
                            <td className="p-2">{row.isha}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedData.length > 5 && (
                      <div className="p-2 text-center text-gray-500 text-xs bg-gray-50 border-t">
                        ... and {parsedData.length - 5} more entries
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleImport}
                    disabled={uploading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Importing...
                      </>
                    ) : (
                      <>
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
                          className="h-4 w-4 mr-2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" x2="12" y1="15" y2="3"></line>
                        </svg>
                        Import {parsedData.length} Entries
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Sample CSV Format */}
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Sample CSV Format:
                </h4>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {`Date,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha
01/01/2026,4:19 AM,6:19 AM,1:01 PM,4:31 PM,7:41 PM,9:31 PM
01/02/2026,4:19 AM,6:19 AM,1:02 PM,4:32 PM,7:42 PM,9:32 PM`}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-gray-700">
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
              className="lucide lucide-chevron-left h-4 w-4 mr-2"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Back to Dashboard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {saving ? 'Saving...' : 'Save & Continue'}
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
              className="lucide lucide-chevron-right h-4 w-4 ml-2"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
