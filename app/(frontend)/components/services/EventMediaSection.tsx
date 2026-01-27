"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import GoogleMap from "../common/GoogleMap";
import Separator from "../common/Separator";
import Tabs from "../common/Tabs";
import { DonorProfileCard } from "../donate/shared";
import GalleryCarousel from "../common/GalleryCarousel";

interface EventMediaSectionProps {
  title?: string;
  description?: string;
  videoThumbnail?: string;
  photos?: string[];
  videoUrl?: string; // Added videoUrl
  isLive?: boolean; // Added isLive
  venueName?: string;
  venueAddress?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  venueMapsLink?: string;
  donationTitle?: string;
  donationDescription?: string;
  donationAmounts?: number[];
  enableDonations?: boolean;
  className?: string;
  containerStyle?: string;
  leftColumnStyle?: string;
}

export default function EventMediaSection({
  title = "",
  description = "",
  videoThumbnail = "/assets/placeholder.png",
  photos = [], // Added photos prop
  videoUrl = "",
  isLive = false,
  venueName = "",
  venueAddress = "",
  venueLatitude,
  venueLongitude,
  venueMapsLink = "",
  donationTitle = "Donate",
  donationDescription = "",
  donationAmounts = [],
  enableDonations = false,
  className = "",
  containerStyle,
  leftColumnStyle
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
      <div className={`${containerStyle}`}>
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-11">

          {/* Left Column: Media & Description */}
          <div className={`w-full xl:max-w-[735px] xl:max-h[412px] space-y-6 ${leftColumnStyle}`}>

            {/* Tabs */}
            <Tabs
              tabs={tabs.map((tab) => ({ id: tab, label: tab }))}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as any)}
              variant="pills"
              size="md"
              className="w-fit !mb-9"
            />

            {/* Media Player Container */}
            {activeTab === 'Video' && (
              <div className="relative w-full aspect-video rounded-[14px] overflow-hidden">
                {embedUrl ? (
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
            )}

            {activeTab === 'Photos' && (
              <GalleryCarousel images={photos} />
            )}

            {activeTab === 'Audio' && (
              <div className="relative w-full aspect-video rounded-[14px] overflow-hidden bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Audio not available</p>
              </div>
            )}

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

                {/* Interactive Google Map */}
                <GoogleMap
                  latitude={venueLatitude}
                  longitude={venueLongitude}
                  address={venueName}
                  className="w-full"
                  height="198px"
                  zoom={15}
                />

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
            {enableDonations && (
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

                {/* Privacy / Profile */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-[#52525B]">Your donation will appear as:</span>
                  <div className="mt-3">
                    <DonorProfileCard
                      donationAmount={typeof donationAmount === 'number' ? donationAmount : 35}
                      showAmount={true}
                      variant="compact"
                    />
                  </div>
                </div>
                {/* Donate Button */}
                <Link href="/donate" className="py-3 px-4 bg-[#006FEE] text-white font-medium rounded-lg text-sm cursor-pointer">
                  Donate
                </Link>

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
