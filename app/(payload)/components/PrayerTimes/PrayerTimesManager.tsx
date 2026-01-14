'use client';

import React, { useState } from 'react';
import ApiView from './ApiView';
import CalendarTab from './CalendarTab';
import ExportTab from './ExportTab';
import JumuahTab from './JumuahTab';
import './prayer-times.css'; // Import isolated styles for Prayer Times
import RamadanTab from './RamadanTab';
import SettingsTab from './SettingsTab';

const PrayerTimesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewMode, setViewMode] = useState<'edit' | 'api'>('edit');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prayer Times Management</h1>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'edit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setViewMode('api')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'api' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            API
          </button>
        </div>
      </div>

      {viewMode === 'api' ? (
        <ApiView />
      ) : (
        <div dir="ltr" data-orientation="horizontal" className="w-full">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="h-10 items-center justify-center rounded-md p-1 grid grid-cols-5 mb-6 bg-gray-100"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'calendar'}
              data-state={activeTab === 'calendar' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('calendar')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Calendar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'settings'}
              data-state={activeTab === 'settings' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'settings' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Settings
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'jumma'}
              data-state={activeTab === 'jumma' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('jumma')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'jumma' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Jumu'ah
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ramadan'}
              data-state={activeTab === 'ramadan' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('ramadan')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'ramadan' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Ramadān
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'export'}
              data-state={activeTab === 'export' ? 'active' : 'inactive'}
              onClick={() => setActiveTab('export')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'export' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Export
            </button>
          </div>

          {activeTab === 'calendar' && <CalendarTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'jumma' && <JumuahTab />}
          {activeTab === 'ramadan' && <RamadanTab />}
          {activeTab === 'export' && <ExportTab />}
        </div>
      )}
    </div>
  );
};

export default PrayerTimesManager;
