"use client";

import PrayerTimesSection from "@/components/common/PrayerTimesSection";
import { useState, useMemo } from "react";
import { IoChevronDown, IoDocumentText, IoCalendar, IoCode, IoDocument } from "react-icons/io5";
import { exportToCSV, exportToJSON, exportToICal, exportToPDF } from "@lib/prayer-times-export";

interface PrayerTimesWrapperProps {
  initialPrayerTimes: any[];
  settings: any;
}

type ExportFormat = "pdf" | "csv" | "ical" | "json";

export default function PrayerTimesWrapper({
  initialPrayerTimes,
  settings,
}: PrayerTimesWrapperProps) {
  const [activeTab, setActiveTab] = useState<"prayer-time" | "calendar">("prayer-time");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Get year from prayer times for download button
  const displayYear = useMemo(() => {
    return calendarYear;
  }, [calendarYear]);

  // Handle export based on format
  const handleExport = async (format: ExportFormat) => {
    setIsDownloadOpen(false);

    // Filter prayer times for the selected year
    const yearData = initialPrayerTimes.filter((pt) => {
      const date = new Date(pt.date);
      return date.getFullYear() === displayYear;
    });

    if (yearData.length === 0) {
      alert(`No prayer times data available for ${displayYear}`);
      return;
    }

    try {
      switch (format) {
        case "pdf":
          await exportToPDF(yearData, displayYear);
          break;
        case "csv":
          exportToCSV(yearData, displayYear);
          break;
        case "ical":
          exportToICal(yearData, displayYear);
          break;
        case "json":
          exportToJSON(yearData, displayYear);
          break;
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export prayer times. Please try again.");
    }
  };

  const exportOptions = [
    { format: "pdf" as ExportFormat, label: "PDF Document", icon: IoDocumentText },
    { format: "csv" as ExportFormat, label: "CSV Spreadsheet", icon: IoDocument },
    { format: "ical" as ExportFormat, label: "iCalendar (.ics)", icon: IoCalendar },
    { format: "json" as ExportFormat, label: "JSON Data", icon: IoCode },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 section-padding pt-8">
        {/* Toggle Switch */}
        <div className="bg-[#FAFAFA] p-1 rounded-lg flex w-full flex-wrap md:w-auto">
          <button
            onClick={() => setActiveTab("prayer-time")}
            className={`flex-1 md:flex-none px-4 md:px-10 py-2.5 rounded-md text-sm md:text-base font-medium transition-all md:min-w-[174px] md:max-w-[174px] cursor-pointer text-center whitespace-nowrap ${
              activeTab === "prayer-time"
                ? "bg-white text-[#18181B] shadow-sm"
                : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            Prayer Time
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 md:flex-none px-4 md:px-10 py-2.5 rounded-md text-sm md:text-base font-medium transition-all md:min-w-[174px] md:max-w-[174px] cursor-pointer text-center whitespace-nowrap ${
              activeTab === "calendar"
                ? "bg-white text-[#18181B] shadow-sm"
                : "text-[#71717A] hover:text-[#18181B]"
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
              className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-base cursor-pointer hover:bg-[#18181B] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>Download {displayYear} timetable</span>
              <IoChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDownloadOpen ? "rotate-180" : ""
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
                      <span className="text-[#18181B] font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-base cursor-pointer hover:bg-[#18181B] transition-colors">
            Ramadan Timetable
          </button>
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
