"use client";

import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {

  title: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  className?: string;
}

export default function ServiceCard({
  title,
  imageSrc,
  imageAlt,
  href,
  className = "",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col w-full lg:max-w-[410px] rounded-[24px] overflow-hidden ${className}`}
      style={{ aspectRatio: '410 / 450' }}
    >
      <div className="relative w-full h-full rounded-[24px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 410px"
          priority
        />

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 lg:p-6">
          {/* Title */}
          <h3 className="text-lg font-semibold sm:text-xl lg:text-2xl text-white leading-tight">
            {title}
          </h3>

          {/* Learn More Button */}
          <button className="flex items-center gap-2 bg-[#3F3F4666] text-white w-fit px-3 py-2.5 sm:px-4 sm:py-3 lg:px-[14px] lg:py-[14px] rounded-xl self-end">
            <span className="text-sm sm:text-base lg:text-[18px] leading-6 font-medium">
              Learn More
            </span>
            <svg
              className="w-4 h-4 lg:w-5 lg:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
