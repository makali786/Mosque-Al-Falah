'use client';

import React, { useEffect, useState } from 'react';
import { fetchPrayerTimeSettings, updatePrayerTimeSettings } from './api';

const JumuahTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jumuahEnabled, setJumuahEnabled] = useState(true);
  const [secondJumuah, setSecondJumuah] = useState(false);
  const [khutbahTime, setKhutbahTime] = useState('13:00');
  const [iqamahTime, setIqamahTime] = useState('13:30');
  const [secondKhutbahTime, setSecondKhutbahTime] = useState('14:00');
  const [secondIqamahTime, setSecondIqamahTime] = useState('14:30');

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchPrayerTimeSettings();
        if (settings.jumuahSettings) {
          setJumuahEnabled(settings.jumuahSettings.enabled ?? true);
          setSecondJumuah(settings.jumuahSettings.enableSecondJumuah ?? false);
          setKhutbahTime(settings.jumuahSettings.khutbahTime ?? '13:00');
          setIqamahTime(settings.jumuahSettings.iqamahTime ?? '13:30');
          setSecondKhutbahTime(settings.jumuahSettings.secondKhutbahTime ?? '14:00');
          setSecondIqamahTime(settings.jumuahSettings.secondIqamahTime ?? '14:30');
        }
      } catch (error) {
        console.error('Failed to load Jumuah settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrayerTimeSettings({
        jumuahSettings: {
          enabled: jumuahEnabled,
          replacesDhuhr: true,
          khutbahTime,
          iqamahTime,
          enableSecondJumuah: secondJumuah,
          secondKhutbahTime,
          secondIqamahTime,
        },
      });
      alert("Jumu'ah settings saved successfully!");
    } catch (error) {
      console.error('Failed to save Jumuah settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading Jumu'ah settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6 text-blue-600">
          Jumu'ah Settings
        </h2>

        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900 block">
                Jumu'ah Mode
              </label>
              <div className="text-sm text-gray-500">
                Enable specific Jumu'ah settings for Fridays
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={jumuahEnabled}
                onClick={() => setJumuahEnabled(!jumuahEnabled)}
                className={`
                  peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${jumuahEnabled ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
                    ${jumuahEnabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200"></div>

          <div
            className={`space-y-6 ${!jumuahEnabled ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {/* First Jumu'ah */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">First Jumu'ah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khutbah Time
                  </label>
                  <input
                    type="time"
                    value={khutbahTime}
                    onChange={e => setKhutbahTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Iqamah Time
                  </label>
                  <input
                    type="time"
                    value={iqamahTime}
                    onChange={e => setIqamahTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                  />
                </div>
              </div>
            </div>

            {/* Second Jumu'ah Settings */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <label
                  htmlFor="second-jumuah"
                  className="font-medium text-gray-900 cursor-pointer"
                  onClick={() => setSecondJumuah(!secondJumuah)}
                >
                  Enable Second Jumu'ah
                </label>
                <button
                  type="button"
                  id="second-jumuah"
                  role="switch"
                  aria-checked={secondJumuah}
                  onClick={() => setSecondJumuah(!secondJumuah)}
                  className={`
                    peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${secondJumuah ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
                      ${secondJumuah ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {secondJumuah && (
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khutbah Time
                    </label>
                    <input
                      type="time"
                      value={secondKhutbahTime}
                      onChange={e => setSecondKhutbahTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Iqamah Time
                    </label>
                    <input
                      type="time"
                      value={secondIqamahTime}
                      onChange={e => setSecondIqamahTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                Saving...
              </>
            ) : (
              "Save Jumu'ah Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JumuahTab;
