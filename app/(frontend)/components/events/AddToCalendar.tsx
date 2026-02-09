"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image"; // Assuming we might want icons, or use react-icons
import { cn } from "@lib/cn";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

interface AddToCalendarProps {
    event: {
        title: string;
        description: string;
        location: string;
        startDate: Date;
        endDate: Date;
    };
    className?: string; // To allow custom styling wrapper
}

export default function AddToCalendar({ event, className }: AddToCalendarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { title, description, location, startDate, endDate } = event;

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
    )}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(
        description
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&subject=${encodeURIComponent(
        title
    )}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(
        title
    )}&st=${formatDate(startDate)}&et=${formatDate(endDate)}&desc=${encodeURIComponent(
        description
    )}&in_loc=${encodeURIComponent(location)}`;

    const downloadIcs = () => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${typeof window !== "undefined" ? window.location.href : ""}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const options = [
        { label: "Google Calendar", url: googleUrl, action: null },
        { label: "Outlook / Office 365", url: outlookUrl, action: null },
        { label: "Yahoo Calendar", url: yahooUrl, action: null },
        { label: "Apple / iCal", url: null, action: downloadIcs },
    ];

    return (
        <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3F3F46] text-white rounded-lg text-base cursor-pointer hover:bg-[#27272A] transition-colors"
            >
                Add to calendar
                <FiChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />
            </button>

            {isOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => (
                            <a
                                key={index}
                                href={option.url || "#"}
                                onClick={(e) => {
                                    if (option.action) {
                                        e.preventDefault();
                                        option.action();
                                    }
                                    setIsOpen(false);
                                }}
                                target={option.url ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                role="menuitem"
                            >
                                {option.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
