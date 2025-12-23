"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PrayerTimesPanel from "./PrayerTimesPanel";

export default function AccessibilityButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Shrink when scrolled more than 100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <div className="fixed right-0 top-52 -translate-y-1/2 z-50">
        <button
          onClick={handleToggle}
          className="bg-[#002e62] hover:bg-[#001b3d] flex items-center justify-center transition-all duration-300 rounded-bl-[50px] rounded-tl-[50px] shadow-[0px_4px_6px_-1px_rgba(0,112,243,0.4),0px_2px_4px_-1px_rgba(0,0,0,0.06)] hover:shadow-[0px_6px_8px_-1px_rgba(0,112,243,0.5),0px_3px_5px_-1px_rgba(0,0,0,0.08)]"
          aria-label="Prayer Times"
          style={{
            width: isScrolled ? "56px" : "70px",
            height: isScrolled ? "45px" : "56px",
          }}
        >
          {/* Prayer Times Icon */}
          <div
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300"
            style={{
              left: isScrolled ? "18px" : "22px",
              width: isScrolled ? "20px" : "24px",
              height: isScrolled ? "34px" : "42px",
            }}
          >
            <div className="rotate-180 scale-y-[-1]">
              <Image
                src="/assets/accessibility/icon.svg"
                alt=""
                width={isScrolled ? 16 : 20}
                height={isScrolled ? 27 : 34}
                className="object-contain"
              />
            </div>
          </div>
        </button>
      </div>

      {/* Prayer Times Panel */}
      <PrayerTimesPanel isOpen={isPanelOpen} onClose={handleClose} />
    </>
  );
}
