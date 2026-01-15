"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import Separator from "../common/Separator";
import Tabs from "../common/Tabs";

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

  // Helper function to convert YouTube and Vimeo URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // If already an embed URL, return as is
    if (url.includes("/embed/")) return url;

    // Convert youtube.com/watch?v= or youtu.be/ to embed format
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Convert vimeo.com/video/ID to player.vimeo.com/video/ID format
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
    const vimeoMatch = url.match(vimeoRegex);

    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      const hash = vimeoMatch[2];
      return hash
        ? `https://player.vimeo.com/video/${videoId}?h=${hash}`
        : `https://player.vimeo.com/video/${videoId}`;
    }

    // Return original URL for other platforms
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section className={`w-full py-12 lg:py-16 bg-white ${className}`}>
      <div className="section-padding">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-11">

          {/* Left Column: Media & Description */}
          <div className="w-full xl:max-w-[735px] xl:max-h[412px] space-y-6">

            {/* Tabs */}
            <Tabs
              tabs={tabs.map((tab) => ({ id: tab, label: tab }))}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as any)}
              variant="pills"
              size="md"
            />

            {/* Media Player Container */}
            <div className="relative w-full aspect-video rounded-[14px] overflow-hidden">
              {embedUrl && activeTab === 'Video' ? (
                <iframe
                  src={embedUrl}
                  title={title || "Video player"}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
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
                <Tabs
                  tabs={[
                    ...amounts.map((amount) => ({
                      id: String(amount),
                      label: `£${amount}`
                    })),
                    { id: "Other", label: "Other" }
                  ]}
                  activeTab={String(donationAmount)}
                  onChange={(tabId) => setDonationAmount(tabId === "Other" ? "Other" : Number(tabId))}
                  variant="default"
                  size="sm"
                  className="!mt-3"
                />
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
                  <button className="text-xs font-medium text-[#18181B] hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>
              </div>
              {/* Donate Button */}
              <button className="py-3 px-4 bg-[#006FEE] text-white font-medium rounded-lg text-sm cursor-pointer">
                Donate
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
