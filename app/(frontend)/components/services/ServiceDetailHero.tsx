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
      <div className="w-full hn-container">
        <div
          className={`flex flex-col ${
            layout === "image-left" ? "lg:flex-row" : "lg:flex-row-reverse"
          } gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start`}
        >
          {/* Image - Responsive width */}
          <div
            className="w-full lg:shrink-0 lg:w-[45%] lg:max-w-[420px] lg:max-h-[424px]"
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
          <div className="w-full lg:flex-1 flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[44px] md:leading-11 lg:text-[48px] lg:leading-12 text-black">
                {heading}
              </h1>
              {subtitle && (
                <p className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-[#52525B]">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-black [&>p]:mb-0 [&>p+p]:mt-4 sm:[&>p+p]:mt-5 md:[&>p+p]:mt-6">
              {content}
            </div>

            {/* Buttons */}
            {(primaryButton || secondaryButton) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {primaryButton && (
                  <>
                    {primaryButton.href ? (
                      <Link
                        href={primaryButton.href}
                        className="px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#0062D1] active:bg-[#0056B8] transition-colors duration-200 text-center"
                      >
                        {primaryButton.text}
                      </Link>
                    ) : (
                      <button
                        onClick={primaryButton.onClick}
                        className="px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#0062D1] active:bg-[#0056B8] transition-colors duration-200"
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
                        className="px-6 py-3 bg-white text-[#006FEE] text-sm sm:text-base font-medium rounded-lg border border-[#006FEE] hover:bg-[#F0F7FF] active:bg-[#E6F2FF] transition-colors duration-200 text-center"
                      >
                        {secondaryButton.text}
                      </Link>
                    ) : (
                      <button
                        onClick={secondaryButton.onClick}
                        className="px-6 py-3 bg-white text-[#006FEE] text-sm sm:text-base font-medium rounded-lg border border-[#006FEE] hover:bg-[#F0F7FF] active:bg-[#E6F2FF] transition-colors duration-200"
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
