"use client";

import React, { useState } from "react";
import Image from "next/image";
import Separator from "../common/Separator";

interface MediaDonationSidebarProps {
  donationSettings: any;
  className?: string;
}

export default function MediaDonationSidebar({
  donationSettings,
  className = "",
}: MediaDonationSidebarProps) {
  const [donationAmount, setDonationAmount] = useState<number | "Other">(10);
  const amounts = [10, 20, 50, 100];

  return (
    <div className={`w-full bg-white rounded-xl ${className}`}>
        {/* Venue Section could go here if relevant, but we focus on Donate as per previous logic */}

        {/* Donate Section */}
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    {donationSettings?.donationTitle || "Donate to Masjid Al Falah"}
                </h3>
                <p className="text-sm text-[#3F3F46] mb-3">
                     {donationSettings?.donationDescription || "Support our community services and initiatives."}
                </p>
                <Separator />
            </div>

            <div className="space-y-3">
                <span className="text-xs font-medium text-[#52525B]">Amount:</span>
                <div className="flex gap-3 flex-wrap xl:flex-nowrap !mt-3">
                    {amounts.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                            donationAmount === amount
                            ? "bg-black text-white"
                            : "bg-[#E4E4E7] text-black hover:bg-gray-300"
                        }`}
                    >
                        £{amount}
                    </button>
                    ))}
                    <button
                    onClick={() => setDonationAmount("Other")}
                    className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                        donationAmount === "Other"
                        ? "bg-black text-white"
                        : "bg-[#E4E4E7] text-black hover:bg-gray-300"
                    }`}
                    >
                    Other
                    </button>
                </div>
            </div>

            {/* Privacy / Profile */}
            <div className="space-y-2">
                <span className="text-xs font-medium text-[#52525B]">Your donation will appear as:</span>
                <div className="flex items-center justify-between px-3 py-2 bg-[#F4F4F5] rounded-lg !mt-3">
                    <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center overflow-hidden">
                        {/* Placeholder Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="gray" className="text-gray-500">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Anonymous kind soul</span>
                        <span className="text-xs text-[#A1A1AA]">£35 GBP, a few moments ago</span>
                    </div>
                    </div>
                    <button className="text-sm font-medium hover:text-black text-gray-600 cursor-pointer">
                    Edit
                    </button>
                </div>
            </div>

            {/* Donate Button */}
            <a 
                href={donationSettings?.donationUrl || "/appeals"} 
                className="block w-fit py-3 px-4 bg-[#006FEE] hover:bg-[#005bc4] text-white text-center font-medium rounded-lg text-sm transition-colors"
            >
                Donate
            </a>

      </div>
    </div>
  );
}
