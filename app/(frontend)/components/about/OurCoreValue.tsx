"use client";

import Image from "next/image";
import { useState } from "react";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";

interface CoreValueItem {
  id: string;
  question: string;
  answer: any; 
}

interface CoreValuesSectionProps {
  title: string;
  description?: string;
  items: CoreValueItem[];
}

export function CoreValuesSection({ title, description, items }: CoreValuesSectionProps) {
  const [expandedId, setExpandedId] = useState<string>(items[0]?.id || "");

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background with gradient and pattern */}
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
      <div className="relative hn-container !px-6 sm:!px-20 flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-12">
        {/* Header */}
        <div className="flex items-center w-full">
          <div className="flex flex-col gap-4 sm:gap-4 md:gap-5 lg:gap-5 w-full lg:w-162.5">
            <h1 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[44px] md:leading-11 lg:text-[48px] lg:leading-12 text-white">
              {title}
            </h1>
            {description && (
              <p className="text-base leading-6 font-medium sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-white">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] px-6 py-8 sm:px-8 sm:py-9 md:px-12 md:py-10 lg:px-16 lg:py-11 w-full">
          <div className="flex flex-col px-2 lg:px-2">
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-2 lg:gap-2">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? "" : item.id)
                  }
                  className="flex items-center justify-between w-full py-3 sm:py-4 lg:py-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex-1 flex flex-col items-start justify-center">
                    <h3 className="text-left text-base leading-6 font-bold sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-[#11181c]">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center pl-3 lg:pl-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6 relative transition-transform duration-300">
                      <Image
                        src={
                          expandedId === item.id
                            ? "/assets/common/arrow-down.svg"
                            : "/assets/common/arrow-left.svg"
                        }
                        alt="Arrow Icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedId === item.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex items-center w-full pb-2">
                    <div className="flex-1 flex flex-col justify-center text-[#11181c]">
                      <RichTextRenderer content={item?.answer} className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6" />
                    </div>
                  </div>
                </div>

                {index < items?.length - 1 && (
                  <div
                    className="h-px w-full"
                    style={{
                      backgroundColor: "rgba(17, 17, 17, 0.15)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
