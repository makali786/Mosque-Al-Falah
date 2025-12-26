"use client";

import Image from "next/image";
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

  /**
   * Background color - defaults to white
   */
  backgroundColor?: string;

  /**
   * Custom class name for the section container
   */
  className?: string;

  /**
   * Image styling - 'rounded' (default) or 'square'
   */
  imageStyle?: "rounded" | "square";
}

export default function ContentImageSection({
  heading,
  content,
  imageSrc,
  imageAlt,
  layout = "image-right",
  backgroundColor = "#ffffff",
  className = "",
  imageStyle = "rounded",
}: ContentImageSectionProps) {
  return (
    <section
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-30 ${className}`}
      style={{ backgroundColor }}
    >
      <div>
        <div
          className={`flex flex-col ${
            layout === "image-left" ? "lg:flex-row-reverse" : "lg:flex-row"
            } gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center`}
        >
          {/* Text Content */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl leading-8 font-bold sm:text-3xl sm:leading-9 md:text-4xl md:leading-10 lg:text-5xl lg:leading-none text-[#18181b] mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              {heading}
            </h2>
            <div className="text-sm leading-6 sm:text-base sm:leading-7 md:text-base md:leading-7 lg:text-lg lg:leading-8 text-[#3f3f46] space-y-4 sm:space-y-5 md:space-y-6">
              {content}
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full">
            <div
              className={`relative w-full aspect-[16/9] sm:aspect-[4/3] ${imageStyle === "rounded" ? "rounded-xl overflow-hidden" : ""
                }`}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover xl:w-[664px] xl:h-[448px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
