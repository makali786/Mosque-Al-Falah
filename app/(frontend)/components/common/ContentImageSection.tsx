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

  /**
   * Custom image dimensions for desktop
   */
  imageWidth?: number;
  imageHeight?: number;
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
  imageWidth = 664,
  imageHeight = 498,
}: ContentImageSectionProps) {
  return (
    <section
      className={`w-full py-12 sm:py-16 md:py-20 lg:py-21.5 ${className}`}
      style={{ backgroundColor }}
    >
      {/* Container with max-width */}
      <div className="w-full hn-container">
        <div
          className={`flex flex-col ${
            layout === "image-left" ? "lg:flex-row-reverse" : "lg:flex-row"
          } gap-8 sm:gap-10 md:gap-12 lg:gap-12 items-start`}
        >
          {/* Text Content - Takes remaining space */}
          <div className="w-full lg:flex-1 flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-8">
            <h2 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[44px] md:leading-11 lg:text-[48px] lg:leading-12 text-black">
              {heading}
            </h2>
            <div className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-black [&>p]:mb-0 [&>p+p]:mt-4 sm:[&>p+p]:mt-5 md:[&>p+p]:mt-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul>li]:leading-7">
              {content}
            </div>
          </div>

          {/* Image - Responsive width */}
          <div
            className="w-full lg:shrink-0 lg:w-[45%] lg:max-w-124.5 2xl:max-w-166"
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
        </div>
      </div>
    </section>
  );
}
