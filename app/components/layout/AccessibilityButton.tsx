"use client";

import { useState } from "react";
import Image from "next/image";
import PrayerTimesPanel from "./PrayerTimesPanel";

export default function AccessibilityButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
          style={{ width: "70px", height: "56px" }}
        >
          {/* Prayer Times Icon */}
          <div className="absolute left-5.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-10.5">
            <div className="rotate-180 scale-y-[-1]">
              <Image
                src="/assets/accessibility/icon.svg"
                alt=""
                width={20}
                height={34}
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
