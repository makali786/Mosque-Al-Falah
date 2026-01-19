"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Separator from "../common/Separator";

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
   * Date of last update
   */
  updatedAt?: string | Date;

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
  },
  primaryButtonClassName?: string;
  Separator?: boolean;
  sectionImageStyle?: string;
}

export default function ServiceDetailHero({
  heading,
  subtitle,
  updatedAt,
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
  primaryButtonClassName,
  Separator: showSeparator,
  sectionImageStyle,
}: ServiceDetailHeroProps) {
  return (
    <section
      className={`w-full pt-12 sm:pt-16 md:pt-20 lg:pt-21.5 ${className}`}
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
          <div className="w-full lg:max-w-108 lg:max-h-[396px]"
            style={{
              // @ts-expect-error CSS custom properties
              "--img-width": `${imageWidth}px`,
              "--img-width-sm": `${Math.round(imageWidth * 0.75)}px`,
            }}
          >
            <div
              className={`relative w-full ${
                imageStyle === "rounded"
                ? `rounded-lg sm:rounded-xl lg:rounded-[14px] overflow-hidden lg:max-w-[420px] lg:max-h-[424px] ${sectionImageStyle}`
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
          <div className="w-full flex flex-col gap-3 justify-between md:gap-3 lg:max-w-170 lg:h-[396px] lg:max-h-[396px]">
            <div>
              <div>
              <h1 className="text-3xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl text-black">
                {heading}
              </h1>
            </div>

              <div className="text-base sm:text-base md:text-base lg:text-lg text-[#27272A] mt-3">
              {content}
            </div>
            </div>

            {/* Buttons */}
            {(primaryButton || secondaryButton) && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-9">
                {primaryButton && (
                  <>
                    {primaryButton.href ? (
                      <Link
                        href={primaryButton.href}
                        className={`w-full sm:w-auto px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base text-center ${primaryButtonClassName}`}
                      >
                        {primaryButton.text}
                      </Link>
                    ) : (
                      <button
                        onClick={primaryButton.onClick}
                          className={`w-full sm:w-auto px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base cursor-pointer ${primaryButtonClassName}`}
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
                        className="w-full sm:w-auto px-6 py-3 bg-[#D4D4D866] text-sm sm:text-base text-center"
                      >
                        {secondaryButton.text}
                      </Link>
                    ) : (
                      <button
                        onClick={secondaryButton.onClick}
                          className="w-full sm:w-auto px-6 py-3 bg-[#D4D4D866] text-sm sm:text-base cursor-pointer"
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
        {showSeparator && <Separator className="mt-16" />}
      </div>
    </section>
  );
}
