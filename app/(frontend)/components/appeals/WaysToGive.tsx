"use client";

import Image from "next/image";
import Link from "next/link";
import { Media } from "../../../../payload-types";
import { getMediaUrl, getMediaAlt } from "../../../../lib/helper";
import React from "react";
import {
  FaHeart, FaDonate, FaHandHoldingHeart, FaRegCreditCard,
  FaMoneyBillWave, FaBuilding, FaMosque, FaCalendarAlt,
  FaPaypal, FaMobileAlt, FaUniversity, FaRegHandshake
} from "react-icons/fa";
import {
  MdOutlineVolunteerActivism, MdEmergency, MdFavorite, MdPayment, MdAccountBalance
} from "react-icons/md";
import {
  BsBank, BsCashCoin, BsGift
} from "react-icons/bs";
import { BiDonateHeart } from "react-icons/bi";

// Define a map of available icons. We map them explicitly to avoid importing entire icon libraries.
const ICON_MAP: Record<string, React.ElementType> = {
  FaHeart, FaDonate, FaHandHoldingHeart, FaRegCreditCard,
  FaMoneyBillWave, FaBuilding, FaMosque, FaCalendarAlt,
  FaPaypal, FaMobileAlt, FaUniversity, FaRegHandshake,
  MdOutlineVolunteerActivism, MdEmergency, MdFavorite, MdPayment, MdAccountBalance,
  BsBank, BsCashCoin, BsGift,
  BiDonateHeart
};

// Helper to render icon or string
const renderIcon = (iconStr: string | undefined) => {
  if (!iconStr) return <FaHandHoldingHeart size={28} />;

  // If it matches exactly our mapped react-icons
  const IconComponent = ICON_MAP[iconStr];
  if (IconComponent) {
    return <IconComponent size={28} />;
  }

  // Common keywords mapping fallback
  const lowerStr = iconStr.toLowerCase();
  if (lowerStr.includes('paypal')) return <FaPaypal size={28} />;
  if (lowerStr.includes('bank') || lowerStr.includes('transfer')) return <BsBank size={28} />;
  if (lowerStr.includes('card') || lowerStr.includes('credit')) return <FaRegCreditCard size={28} />;
  if (lowerStr.includes('mobile') || lowerStr.includes('phone')) return <FaMobileAlt size={28} />;
  if (lowerStr.includes('heart')) return <FaHeart size={28} />;
  if (lowerStr.includes('mosque') || lowerStr.includes('masjid')) return <FaMosque size={28} />;
  if (lowerStr.includes('cash') || lowerStr.includes('money')) return <FaMoneyBillWave size={28} />;
  if (lowerStr.includes('monthly') || lowerStr.includes('calendar')) return <FaCalendarAlt size={28} />;

  // It's likely an emoji or string, render it as text
  return <span className="text-3xl">{iconStr}</span>;
};

interface GivingMethod {
  methodName: string;
  description?: string;
  icon?: string;
  link?: string;
  id?: string;
}

interface WaysToGiveProps {
  title?: string;
  description?: string;
  methods: GivingMethod[];
  image?: Media | string | any;
  appealId?: string;
}

export function WaysToGive({
  title = "",
  description = "",
  methods,
  image,
  appealId
}: WaysToGiveProps) {


  return (
    <section className="relative w-full overflow-hidden bg-[#0c478a]">
      {/* Background Pattern - same as AppealHero/CoreValues */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 bg-repeat"
          style={{
            backgroundImage: "url('/assets/services/bg-pattern.png')",
            backgroundSize: "154px 154px",
          }}
        />
      </div>

      <div className="relative section-padding py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">

          {/* Left Side: Image (Mosque Arch) - Hidden on mobile if needed, or shown top */}
          <div className="relative h-[300px] sm:h-[400px] w-full lg:h-[600px] lg:max-w-[528px] lg:block rounded-[14px] overflow-hidden">
            {image ? (
              <Image
                src={image || ""}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              // Placeholder if no image provided
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/50">
                Mosque Image
              </div>
            )}
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-white sm:text-5xl">
                {title}
              </h2>
              <p className="text-lg text-white">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {methods.map((method, index) => {
                let href = method.link || '/donate';

                // Override incorrect CMS links (e.g., "/donation") or append appealId to internal links
                if (href === '/donation' || href === '/donate' || (!href.startsWith('http') && appealId)) {
                  href = appealId ? `/donate?appealId=${appealId}` : '/donate';
                }

                return (
                  <Link
                    key={index}
                    href={href}
                    className="flex items-center gap-[9px] bg-white rounded-[14px] px-4 py-3 sm:px-[22px] sm:py-[18px] cursor-pointer lg:max-w-[528px] hover:bg-gray-50 transition-colors w-full"
                  >
                    {/* Icon */}
                    <div className="w-[57px] h-[57px] shrink-0 rounded-lg bg-black text-white flex items-center justify-center">
                      {renderIcon(method.icon)}
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base sm:text-lg font-semibold text-black">
                        {method.methodName}
                      </h3>
                      {method.description && (
                        <p className="text-base text-[#52525B]">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
