"use client";

import React, { useState } from "react";
import Image from "next/image";
import Separator from "../common/Separator";
import { DonorProfileCard } from "../donate/shared";
import { quickAmounts } from "../donate/types";

interface MediaDonationSidebarProps {
  donationSettings: any;
  className?: string;
}

export default function MediaDonationSidebar({
  donationSettings,
  className = "",
}: MediaDonationSidebarProps) {
  const [donationAmount, setDonationAmount] = useState<number | "Other">(quickAmounts[0]);

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
                <div className="flex gap-3 flex-wrap xl:flex-nowrap mt-3">
                    {quickAmounts.map((amount) => (
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
                <div className="mt-3">
                    <DonorProfileCard
                        donationAmount={typeof donationAmount === 'number' ? donationAmount : 35}
                        showAmount={true}
                        variant="default"
                    />
                </div>
            </div>

            {/* Donate Button */}
            <a
                href={`${donationSettings?.donationUrl || "/donate"}${typeof donationAmount === 'number' ? `?amount=${donationAmount}` : ''}`}
                className="block w-fit py-3 px-4 bg-[#006FEE] hover:bg-[#005bc4] text-white text-center font-medium rounded-lg text-sm transition-colors"
            >
                Donate
            </a>

      </div>
    </div>
  );
}
