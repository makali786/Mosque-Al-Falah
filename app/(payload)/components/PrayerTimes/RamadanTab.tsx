'use client';

import React, { useEffect, useState } from 'react';
import { fetchPrayerTimeSettings, updatePrayerTimeSettings } from './api';

const RamadanTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ramadanEnabled, setRamadanEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imsakOffset, setImsakOffset] = useState(10);
  const [iftarOffset, setIftarOffset] = useState(0);
  const [showCountdown, setShowCountdown] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchPrayerTimeSettings();
        if (settings.ramadanSettings) {
          setRamadanEnabled(settings.ramadanSettings.enabled ?? false);
          setStartDate(settings.ramadanSettings.startDate?.split('T')[0] ?? '');
          setEndDate(settings.ramadanSettings.endDate?.split('T')[0] ?? '');
          setImsakOffset(Math.abs(settings.ramadanSettings.imsakOffset ?? 10));
          setIftarOffset(settings.ramadanSettings.iftarOffset ?? 0);
          setShowCountdown(settings.ramadanSettings.showCountdown ?? true);
        }
      } catch (error) {
        console.error('Failed to load Ramadan settings:', error);
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
        ramadanSettings: {
          enabled: ramadanEnabled,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          imsakOffset: -Math.abs(imsakOffset), // Store as negative (before Fajr)
          iftarOffset,
          showCountdown,
        },
      });
      alert('Ramadān settings saved successfully!');
    } catch (error) {
      console.error('Failed to save Ramadan settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading Ramadān settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6 text-blue-600">
          Ramadān Settings
        </h2>

        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900 block">
                Ramadān Mode
              </label>
              <div className="text-sm text-gray-500">
                Enable features specific to Ramadān
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={ramadanEnabled}
                onClick={() => setRamadanEnabled(!ramadanEnabled)}
                className={`
                  peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${ramadanEnabled ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
                    ${ramadanEnabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200"></div>

          <div
            className={`space-y-8 ${!ramadanEnabled ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (Approximate)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Approximate)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imsak Offset (Minutes before Fajr)
                </label>
                <input
                  type="number"
                  value={imsakOffset}
                  onChange={e => setImsakOffset(parseInt(e.target.value) || 0)}
                  min={0}
                  max={60}
                  className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default is 10 minutes before Fajr
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Iftar Offset (Minutes after Maghrib)
                </label>
                <input
                  type="number"
                  value={iftarOffset}
                  onChange={e => setIftarOffset(parseInt(e.target.value) || 0)}
                  min={0}
                  max={30}
                  className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <label
                  htmlFor="show-countdown"
                  className="font-medium text-gray-900 cursor-pointer"
                  onClick={() => setShowCountdown(!showCountdown)}
                >
                  Show Countdown to Iftar/Suhoor on Dashboard
                </label>

                <button
                  type="button"
                  id="show-countdown"
                  role="switch"
                  aria-checked={showCountdown}
                  onClick={() => setShowCountdown(!showCountdown)}
                  className={`
                    peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${showCountdown ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
                      ${showCountdown ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
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
              'Save Ramadān Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RamadanTab;
