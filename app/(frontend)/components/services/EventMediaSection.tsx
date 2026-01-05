"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import Separator from "../common/Separator";

interface EventMediaSectionProps {
  title?: string;
  description?: string;
  videoThumbnail?: string;
  venueAddress?: string;
  className?: string;
}

export default function EventMediaSection({
  title = "Taraweeh & Eid Prayers", // Context aware default
  description = "Join us for an unforgettable evening of soulful Qur’anic recitations by renowned guest reciters and motivational talks to prepare your heart for the blessed month of Ramadan. Immerse yourself in an atmosphere of reflection and purpose while enjoying a delicious three-course meal.",
  videoThumbnail = "/assets/sermons/taraweeh-sermons.png", // Fallback
  venueAddress = "Masjid Al-Falah, North Ilford Islamic Centre, 97 Kensington Gardens, Ilford, Essex IG1 3EN",
  className = "",
}: EventMediaSectionProps) {
  const [activeTab, setActiveTab] = useState<"Video" | "Photos" | "Audio">("Video");
  const [donationAmount, setDonationAmount] = useState<number | "Other">(10);

  const tabs = ["Video", "Photos", "Audio"] as const;
  const amounts = [10, 20, 50, 100];

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
              <Image
                src={videoThumbnail}
                alt="Event details"
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Live Badge */}
              <div className="absolute top-4 right-4 bg-white backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm z-10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-lg bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F31260]"></span>
                </span>
                <span className="text-sm font-semibold text-[#18181B]">Live</span>
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  aria-label="Play Video"
                >
                  <FaPlay className="ml-1 text-2xl text-black" />
                </button>
              </div>
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
                  <h4 className="text-lg font-medium text-[#27272A]">Where</h4>
                  <p className="text-[#3F3F46] text-base">
                    {venueAddress}
                  </p>
                </div>

                {/* Map Placeholder */}
                <div className="w-full h-[198px] xl:max-h-[198px] xl:max-w-[357px] bg-[#E4E4E7] relative overflow-hidden">
                  {/* Placeholder generic map appearance */}
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Ilford,Essex&zoom=14&size=600x300&sensor=false')] bg-cover bg-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button className="w-full sm:w-auto px-4 py-3 bg-[#3F3F46] text-white text-sm font-medium rounded-[8px] ">
                    View on Map
                  </button>
                  <button className="w-full sm:w-auto px-4 py-3 bg-[#006FEE] text-white text-sm font-medium rounded-[8px]">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[#E4E4E7]" />

            {/* Donate Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Donate to Masjid Al Falah</h3>
                <p className="text-sm text-[#3F3F46] mb-3">description from backend here in 40 words</p>
                <Separator />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-[#52525B] ">Amount:</span>
                <div className="flex gap-3 flex-wrap !mt-3">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium bg-[#E4E4E7] text-black`}
                    >
                      £{amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setDonationAmount("Other")}
                    className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium bg-[#E4E4E7] text-black`}
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
                      <Image src="/assets/sermons/taraweeh-sermons.png" width={40} height={40} alt="Avatar" className="object-cover rounded-full h-10 w-10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Anonymous kind soul</span>
                      <span className="text-xs text-[#A1A1AA]">£35 GBP, a few moments ago</span>
                    </div>
                  </div>
                  <button className="text-sm font-medium">
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
