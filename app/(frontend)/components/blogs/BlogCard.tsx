"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl: string;
  appearance?: {
    showFeaturedImage?: boolean;
    showCategoryBadge?: boolean;
    showDate?: boolean;
    showExcerpt?: boolean;
    showReadMoreButton?: boolean;
    readMoreButtonText?: string;
    cardStyle?: string;
  };
}

export default function BlogCard({
  slug,
  title,
  description,
  date,
  category,
  imageUrl,
  appearance = {
    showFeaturedImage: true,
    showCategoryBadge: true,
    showDate: true,
    showExcerpt: true,
    showReadMoreButton: true,
    readMoreButtonText: "Read More",
    cardStyle: "shadow"
  }
}: BlogCardProps) {
  const { 
    showFeaturedImage = true, 
    showCategoryBadge = true, 
    showDate = true, 
    showExcerpt = true, 
    showReadMoreButton = true, 
    readMoreButtonText = "Read More",
  } = appearance;


  return (
    <div className={`flex flex-col gap-6 w-full h-full p-0 overflow-hidden`}>
      {/* Image Container */}
      {showFeaturedImage && (
        <div className="relative w-full aspect-[357/212.11] rounded-[14px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          {/* Category Tag */}
          {showCategoryBadge && (
            <div className="absolute top-5 left-4 bg-[#002E62] px-4 py-1 rounded-full z-10">
              <span className="text-white text-sm font-semibold uppercase">
                {category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {/* Date */}
        {showDate && (
          <div className="flex items-center gap-2">
            <Image
              src="/assets/topbar/calendar-icon.svg"
              alt="Calendar"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <span className="text-[#27272A] text-sm">{date}</span>
          </div>
        )}

        {/* Title */}
        <Link href={`/blogs/${slug}`} className="group">
          <h3 className="text-[24px] font-semibold group-hover:text-[#006fee] transition-colors line-clamp-2 mt-3">
            {title}
          </h3>
        </Link>

        {/* Description */}
        {showExcerpt && (
          <p className="text-sm sm:text-base line-clamp-2 my-5">
            {description}
          </p>
        )}

        {/* Read More Button */}
        {showReadMoreButton && (
            <Link
            href={`/blogs/${slug}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#FAFAFA] cursor-pointer text-base rounded-[12px] w-fit mt-auto"
            >
            {readMoreButtonText}
            </Link>
        )}
      </div>
    </div>
  );
}
