"use client";

import { ReactNode } from "react";

interface ContentImageSectionProps {
  /**
   * The main heading for the section
   */
  heading: string;

  /**
   * The content to display - can be plain text or JSX with custom formatting
   * For text with bold highlights, pass JSX like:
   * <p>In <strong>1996</strong>, a building at <strong>97 Empress Avenue, Ilford</strong>...</p>
   */
  content: ReactNode;

  /**
   * Path to the image
   */
  imageSrc: string;

  /**
   * Alt text for the image
   */
  imageAlt: string;

  /**
   * Layout direction - 'image-right' (default) or 'image-left'
   */
  layout?: "image-right" | "image-left";
}

export default function ContentImageSection({
  heading,
  content,
  imageSrc,
  imageAlt,
  layout = "image-right",
}: ContentImageSectionProps) {
  return (
    <section className="bg-white w-full px-4 lg:px-8 xl:px-50 py-12 sm:py-14 md:py-16 lg:py-20 xl:py-[86px]">
      <div
        className={`flex flex-col ${
          layout === "image-right" ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 sm:gap-10 md:gap-12 xl:gap-[48px] items-start w-full`}
      >
        {/* Text Content */}
        <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 xl:gap-[32px] w-full lg:w-1/2">
          {/* Heading */}
          <h2 className="font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-[48px]">
            {heading}
          </h2>

          {/* Content */}
          <div className="font-normal text-black text-base sm:text-lg xl:text-[18px] leading-relaxed sm:leading-relaxed xl:leading-[28px] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
            {content}
          </div>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto lg:h-[498px] rounded-xl xl:rounded-[14px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
