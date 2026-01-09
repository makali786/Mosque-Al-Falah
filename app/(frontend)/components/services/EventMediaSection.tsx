"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import Separator from "../common/Separator";

interface EventMediaSectionProps {
  title?: string;
  description?: string;
  videoThumbnail?: string;
  videoUrl?: string; // Added videoUrl
  isLive?: boolean; // Added isLive
  venueName?: string;
  venueAddress?: string;
  venueMapsLink?: string;
  donationTitle?: string;
  donationDescription?: string;
  donationAmounts?: number[];
  className?: string;
}

export default function EventMediaSection({
  title = "",
  description = "",
  videoThumbnail = "/assets/placeholder.png",
  videoUrl = "",
  isLive = false,
  venueName = "",
  venueAddress = "",
  venueMapsLink = "",
  donationTitle = "Donate",
  donationDescription = "",
  donationAmounts = [],
  className = "",
}: EventMediaSectionProps) {
  const [activeTab, setActiveTab] = useState<"Video" | "Photos" | "Audio">("Video");
  const [donationAmount, setDonationAmount] = useState<number | "Other">(10);

  const tabs = ["Video", "Photos", "Audio"] as const;

  // Use passed amounts or default
  const amounts = donationAmounts.length > 0 ? donationAmounts : [10, 20, 50, 100];

  return (
    <section className={`w-full py-12 lg:py-16 bg-white ${className}`}>
      <div className="section-padding">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-11">

          {/* Left Column: Media & Description */}
          <div className="w-full xl:max-w-[735px] xl:max-h[412px] space-y-6">

            {/* Tabs */}
            <div className="flex items-center gap-2">
              <div className="inline-flex bg-[#F4F4F5] p-1 rounded-[14px]">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-all duration-200 ${activeTab === tab
                        ? "bg-white text-black shadow-sm"
                        : "text-[#71717A] hover:text-black"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Player Container */}
            <div className="relative w-full aspect-video rounded-[14px] overflow-hidden">
              {videoUrl && activeTab === 'Video' ? (
                <iframe
                  src={videoUrl}
                  title={title || "YouTube video player"}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <>
                    <Image
                      src={videoThumbnail}
                      alt={title}
                      fill
                      className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Live Badge */}
                    {isLive && (
                      <div className="absolute top-4 right-4 bg-white backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm z-10">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-lg bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F31260]"></span>
                        </span>
                        <span className="text-sm font-semibold text-[#18181B]">Live</span>
                      </div>
                    )}
                </>
              )}
            </div>

            {/* Description Text */}
            <div>
              <p className="text-base">
                {description}
              </p>
            </div>
          </div>

          {/* Right Column: Sidebar (Venue & Donate) */}
          <div className="w-full xl:max-w-[357px] space-y-10">

            {/* Venue Section */}
            <div>
              <h3 className="text-lg font-semibold pb-3">Venue</h3>
              <Separator
                className="mb-4" />
              <div className="space-y-4">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#27272A]">{"Where"}</h4>
                  <p className="text-[#3F3F46] text-base">
                    {venueName}
                  </p>
                </div>

                {/* Map Placeholder or Link */}
                <a href={venueMapsLink} target="_blank" rel="noopener noreferrer" className="block w-full h-[198px] xl:max-h-[198px] xl:max-w-[357px] bg-[#E4E4E7] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Ilford,Essex&zoom=14&size=600x300&sensor=false')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white px-3 py-1 rounded shadow text-sm font-medium">Open Map</span>
                  </div>
                </a>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <a href={venueMapsLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-4 py-3 bg-[#3F3F46] text-white text-sm font-medium rounded-[8px] text-center">
                    View on Map
                  </a>
                  <a href={venueMapsLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-4 py-3 bg-[#006FEE] text-white text-sm font-medium rounded-[8px] text-center">
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            {/* <div className="h-px w-full bg-[#E4E4E7]" /> */}

            {/* Donate Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{donationTitle}</h3>
                <p className="text-sm text-[#3F3F46] mb-3">{donationDescription}</p>
                <Separator />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-[#52525B] ">Amount:</span>
                <div className="flex gap-3 flex-wrap xl:flex-nowrap !mt-3">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium ${donationAmount === amount ? 'bg-black text-white' : 'bg-[#E4E4E7] text-black'}`}
                    >
                      £{amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setDonationAmount("Other")}
                    className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium ${donationAmount === 'Other' ? 'bg-black text-white' : 'bg-[#E4E4E7] text-black'}`}
                  >
                    Other
                  </button>
                </div>
              </div>

              {/* Privacy / Profile - Keep static for now or hide if not needed, simpler to keep for UI completeness */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#52525B]">Your donation will appear as:</span>
                <div className="flex items-center justify-between px-3 py-2 bg-[#F4F4F5] rounded-lg mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-200">
                      <Image src="/assets/sermons/taraweeh-sermons.png" alt="Avatar" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#18181B]">Anonymous kind soul</span>
                      <span className="text-[10px] text-[#A1A1AA]">£35 GBP, a few moments ago</span>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-[#18181B] hover:underline">
                    Edit
                  </button>
                </div>
              </div>
              {/* Donate Button */}
              <button className="py-3 px-4 bg-[#006FEE] text-white font-medium rounded-lg text-sm">
                Donate
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
