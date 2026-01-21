// Prayer Times Export Utilities
// Supports PDF, CSV, iCal, and JSON formats

import { addMinutesToTime } from "./prayer-times-helpers";

interface PrayerTimeData {
  date: string;
  hijriDate: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fajrIqamahDelay: number;
  dhuhrIqamahDelay: number;
  asrIqamahDelay: number;
  maghribIqamahDelay: number;
  ishaIqamahDelay: number;
}

// ============================================================================
// CSV Export
// ============================================================================

export function exportToCSV(
  prayerTimes: PrayerTimeData[],
  year: number,
  fileName?: string
) {
  const headers = [
    "Date",
    "Day",
    "Hijri Date",
    "Fajr Begins",
    "Fajr Jamaah",
    "Sunrise",
    "Dhuhr Begins",
    "Dhuhr Jamaah",
    "Asr Begins",
    "Asr Jamaah",
    "Maghrib Begins",
    "Maghrib Jamaah",
    "Isha Begins",
    "Isha Jamaah",
  ];

  const rows = prayerTimes.map((pt) => {
    const date = new Date(pt.date);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return [
      date.toLocaleDateString("en-GB"),
      dayNames[date.getDay()],
      pt.hijriDate,
      pt.fajr,
      addMinutesToTime(pt.fajr, pt.fajrIqamahDelay),
      pt.sunrise,
      pt.dhuhr,
      addMinutesToTime(pt.dhuhr, pt.dhuhrIqamahDelay),
      pt.asr,
      addMinutesToTime(pt.asr, pt.asrIqamahDelay),
      pt.maghrib,
      addMinutesToTime(pt.maghrib, pt.maghribIqamahDelay),
      pt.isha,
      addMinutesToTime(pt.isha, pt.ishaIqamahDelay),
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  downloadFile(csvContent, fileName || `prayer-times-${year}.csv`, "text/csv");
}

// ============================================================================
// JSON Export
// ============================================================================

export function exportToJSON(
  prayerTimes: PrayerTimeData[],
  year: number,
  fileName?: string
) {
  const formattedData = prayerTimes.map((pt) => {
    const date = new Date(pt.date);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return {
      date: date.toISOString().split("T")[0],
      day: dayNames[date.getDay()],
      hijriDate: pt.hijriDate,
      prayers: {
        fajr: {
          begins: pt.fajr,
          jamaah: addMinutesToTime(pt.fajr, pt.fajrIqamahDelay),
        },
        sunrise: pt.sunrise,
        dhuhr: {
          begins: pt.dhuhr,
          jamaah: addMinutesToTime(pt.dhuhr, pt.dhuhrIqamahDelay),
        },
        asr: {
          begins: pt.asr,
          jamaah: addMinutesToTime(pt.asr, pt.asrIqamahDelay),
        },
        maghrib: {
          begins: pt.maghrib,
          jamaah: addMinutesToTime(pt.maghrib, pt.maghribIqamahDelay),
        },
        isha: {
          begins: pt.isha,
          jamaah: addMinutesToTime(pt.isha, pt.ishaIqamahDelay),
        },
      },
    };
  });

  const jsonContent = JSON.stringify(
    {
      year,
      mosque: "Mosque Al-Falah",
      generated: new Date().toISOString(),
      prayerTimes: formattedData,
    },
    null,
    2
  );

  downloadFile(
    jsonContent,
    fileName || `prayer-times-${year}.json`,
    "application/json"
  );
}

// ============================================================================
// iCal Export
// ============================================================================

export function exportToICal(
  prayerTimes: PrayerTimeData[],
  year: number,
  fileName?: string
) {
  const events: string[] = [];

  prayerTimes.forEach((pt) => {
    const date = new Date(pt.date);
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");

    // Helper to create event
    const createEvent = (name: string, time: string, description: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const eventDate = new Date(date);
      eventDate.setHours(hours, minutes, 0, 0);

      const startDateTime =
        eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const endDateTime =
        new Date(eventDate.getTime() + 15 * 60000)
          .toISOString()
          .replace(/[-:]/g, "")
          .split(".")[0] + "Z";

      return [
        "BEGIN:VEVENT",
        `UID:${name}-${dateStr}@mosque-al-falah`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]
        }Z`,
        `DTSTART:${startDateTime}`,
        `DTEND:${endDateTime}`,
        `SUMMARY:${name}`,
        `DESCRIPTION:${description}`,
        "LOCATION:Mosque Al-Falah",
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "END:VEVENT",
      ].join("\r\n");
    };

    // Add Fajr
    events.push(
      createEvent(
        "Fajr Prayer",
        pt.fajr,
        `Fajr begins at ${pt.fajr}. Jamaah at ${addMinutesToTime(
          pt.fajr,
          pt.fajrIqamahDelay
        )}`
      )
    );

    // Add Dhuhr
    events.push(
      createEvent(
        "Dhuhr Prayer",
        pt.dhuhr,
        `Dhuhr begins at ${pt.dhuhr}. Jamaah at ${addMinutesToTime(
          pt.dhuhr,
          pt.dhuhrIqamahDelay
        )}`
      )
    );

    // Add Asr
    events.push(
      createEvent(
        "Asr Prayer",
        pt.asr,
        `Asr begins at ${pt.asr}. Jamaah at ${addMinutesToTime(
          pt.asr,
          pt.asrIqamahDelay
        )}`
      )
    );

    // Add Maghrib
    events.push(
      createEvent(
        "Maghrib Prayer",
        pt.maghrib,
        `Maghrib begins at ${pt.maghrib}. Jamaah at ${addMinutesToTime(
          pt.maghrib,
          pt.maghribIqamahDelay
        )}`
      )
    );

    // Add Isha
    events.push(
      createEvent(
        "Isha Prayer",
        pt.isha,
        `Isha begins at ${pt.isha}. Jamaah at ${addMinutesToTime(
          pt.isha,
          pt.ishaIqamahDelay
        )}`
      )
    );
  });

  const icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mosque Al-Falah//Prayer Times//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Prayer Times " + year,
    "X-WR-TIMEZONE:Europe/London",
    "X-WR-CALDESC:Prayer times for Mosque Al-Falah",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  downloadFile(
    icalContent,
    fileName || `prayer-times-${year}.ics`,
    "text/calendar"
  );
}

// ============================================================================
// PDF Export (Client-side using jsPDF)
// ============================================================================

export async function exportToPDF(
  prayerTimes: PrayerTimeData[],
  year: number,
  title?: string,
  fileName?: string
) {
  // Dynamically import jsPDF and autoTable
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Add title
  doc.setFontSize(20);
  doc.text("Mosque Al-Falah", 148, 15, { align: "center" });
  doc.setFontSize(16);
  doc.text(title || `Prayer Times ${year}`, 148, 25, { align: "center" });

  // Prepare table data
  const tableData = prayerTimes.map((pt) => {
    const date = new Date(pt.date);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return [
      date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      dayNames[date.getDay()],
      pt.fajr,
      addMinutesToTime(pt.fajr, pt.fajrIqamahDelay),
      pt.sunrise,
      pt.dhuhr,
      addMinutesToTime(pt.dhuhr, pt.dhuhrIqamahDelay),
      pt.asr,
      addMinutesToTime(pt.asr, pt.asrIqamahDelay),
      pt.maghrib,
      addMinutesToTime(pt.maghrib, pt.maghribIqamahDelay),
      pt.isha,
      addMinutesToTime(pt.isha, pt.ishaIqamahDelay),
    ];
  });

  // Add table
  autoTable(doc, {
    head: [
      [
        "Date",
        "Day",
        { content: "Fajr", colSpan: 2 },
        "Sunrise",
        { content: "Dhuhr", colSpan: 2 },
        { content: "Asr", colSpan: 2 },
        { content: "Maghrib", colSpan: 2 },
        { content: "Isha", colSpan: 2 },
      ],
      [
        "",
        "",
        "Begins",
        "Jamaah",
        "",
        "Begins",
        "Jamaah",
        "Begins",
        "Jamaah",
        "Begins",
        "Jamaah",
        "Begins",
        "Jamaah",
      ],
    ],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 46, 98], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 12 },
    },
  });

  // Save PDF
  doc.save(fileName || `prayer-times-${year}.pdf`);
}

// ============================================================================
// Helper Function
// ============================================================================

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
