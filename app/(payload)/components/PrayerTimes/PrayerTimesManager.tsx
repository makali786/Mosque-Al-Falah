'use client';

import React, { useState } from 'react';
import ApiView from './ApiView';
import CalendarTab from './CalendarTab';
import ExportTab from './ExportTab';
import JumuahTab from './JumuahTab';
import './prayer-times.css'; // Import isolated styles for Prayer Times
import RamadanTab from './RamadanTab';
import SettingsTab from './SettingsTab';
import Tabs from '../../../(frontend)/components/common/Tabs';

const PrayerTimesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewMode, setViewMode] = useState<'edit' | 'api'>('edit');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Prayer Times Management</h1>

        <Tabs
          tabs={[
            { id: 'edit', label: 'Edit' },
            { id: 'api', label: 'API' }
          ]}
          activeTab={viewMode}
          onChange={(tabId) => setViewMode(tabId as 'edit' | 'api')}
          variant="pills"
          size="sm"
        />
      </div>

      {viewMode === 'api' ? (
        <ApiView />
      ) : (
        <div dir="ltr" data-orientation="horizontal" className="w-full">
          <Tabs
            tabs={[
              { id: 'calendar', label: 'Calendar' },
              { id: 'settings', label: 'Settings' },
              { id: 'jumma', label: "Jumu'ah" },
              { id: 'ramadan', label: 'Ramadān' },
              { id: 'export', label: 'Export' }
            ]}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId)}
            variant="pills"
            size="sm"
            fullWidth
            className="mb-6"
          />

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
