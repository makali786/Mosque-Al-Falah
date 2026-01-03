"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface ServiceDetailHeroProps {
  /**
   * The main heading for the service
   */
  heading: string;

  /**
   * Subtitle or tagline
   */
  subtitle?: string;

  /**
   * The content paragraphs - can be plain text or JSX
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

  /**
   * Custom image dimensions
   */
  imageWidth?: number;
  imageHeight?: number;

  /**
   * Primary button configuration
   */
  primaryButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };

  /**
   * Secondary button configuration
   */
  secondaryButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function ServiceDetailHero({
  heading,
  subtitle,
  content,
  imageSrc,
  imageAlt,
  layout = "image-left",
  backgroundColor = "#ffffff",
  className = "",
  imageStyle = "rounded",
  imageWidth = 420,
  imageHeight = 424,
  primaryButton,
  secondaryButton,
}: ServiceDetailHeroProps) {
  return (
    <section
      className={`w-full py-12 sm:py-16 md:py-20 lg:py-21.5 ${className}`}
      style={{ backgroundColor }}
    >
      {/* Container with max-width */}
      <div className="w-full section-padding">
        <div
          className={`flex flex-col ${
            layout === "image-left" ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-6 sm:gap-7 md:gap-8 lg:gap-9 items-start`}
        >
          {/* Image - Responsive width */}
          <div className="w-full lg:max-w-[420px] lg:max-h-[424px]"
            style={{
              // @ts-expect-error CSS custom properties
              "--img-width": `${imageWidth}px`,
              "--img-width-sm": `${Math.round(imageWidth * 0.75)}px`,
            }}
          >
            <div
              className={`relative w-full ${
                imageStyle === "rounded"
                  ? "rounded-lg sm:rounded-xl lg:rounded-[14px] overflow-hidden"
                  : ""
              }`}
              style={{
                aspectRatio: `${imageWidth} / ${imageHeight}`,
              }}
            >
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
            </div>
          </div>

          {/* Text Content - Takes remaining space */}
          <div className="w-full flex flex-col gap-3 md:gap-3 lg:max-w-[680px]">
            <div>
              <h1 className="text-3xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl text-black">
                {heading}
              </h1>
            </div>

            <div className="text-base sm:text-base md:text-base lg:text-lg text-[#27272A]">
              {content}
            </div>

            {/* Buttons */}
            {(primaryButton || secondaryButton) && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-9 mt-6">
                {primaryButton && (
                  <>
                    {primaryButton.href ? (
                      <Link
                        href={primaryButton.href}
                        className="px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base"
                      >
                        {primaryButton.text}
                      </Link>
                    ) : (
                      <button
                        onClick={primaryButton.onClick}
                          className="px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base"
                      >
                        {primaryButton.text}
                      </button>
                    )}
                  </>
                )}
                {secondaryButton && (
                  <>
                    {secondaryButton.href ? (
                      <Link
                        href={secondaryButton.href}
                        className="px-6 py-3 bg-[#D4D4D866] text-sm sm:text-base"
                      >
                        {secondaryButton.text}
                      </Link>
                    ) : (
                      <button
                        onClick={secondaryButton.onClick}
                          className="px-6 py-3 bg-[#D4D4D866] text-sm sm:text-base"
                      >
                        {secondaryButton.text}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
