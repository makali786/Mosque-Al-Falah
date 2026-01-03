"use client";

import Image from "next/image";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";

interface ParkingNoticeProps {
  title: string;
  message: any;
  quote: {
    quoteText: string;
    source: string;
  };
}

export function ParkingNoticeSection({ title, message, quote }: ParkingNoticeProps) {
  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:pt-32 lg:pb-42 overflow-hidden">
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

      {/* Content Container */}
      <div className="relative w-full hn-container">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-12 items-start lg:items-center">
          {/* Left Side - Text Content */}
          <div className="w-full lg:flex-1">
            <h2 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[42px] md:leading-11 xl:text-5xl lg:leading-12 text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8">
              {title}
            </h2>
            <div className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 xl:text-lg lg:leading-7 text-white font-[500]">
              <RichTextRenderer content={message} />
            </div>
          </div>

          {/* Right Side - Quote Card */}
          <div className="w-full lg:w-auto lg:shrink-0 lg:max-w-[420px] xl:max-w-[640px]">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-10 xl:px-10 xl:py-14 relative">
              {/* Opening Quote Icon */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-10 lg:left-10">
                <Image
                  src="/assets/common/double-quote-left.svg"
                  alt="Quote Icon"
                  width={24}
                  height={24}
                />
              </div>

              {/* Quote Content */}
              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 pt-4 sm:pt-4">
                <div className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-base xl:text-lg lg:leading-7 text-black">
                  <p className="mb-2">
                    <strong className="font-bold">
                      &quot;{quote.quoteText}&quot;
                    </strong>
                  </p>
                  <p className="text-sm sm:text-[14px] md:text-[15px] font-medium">
                    {quote.source}
                  </p>
                </div>
              </div>

              {/* Closing Quote Icon */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10">
                <Image
                  src="/assets/common/double-quote-right.svg"
                  alt="Quote Icon"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
