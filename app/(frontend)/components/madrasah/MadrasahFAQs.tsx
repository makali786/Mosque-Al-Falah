"use client";

import Image from "next/image";
import { useState } from "react";

import { RichTextRenderer } from "../common/RichTextRenderer";

interface FAQItem {
  id: string;
  question: string;
  answer: any;
}

interface MadrasahFAQsProps {
  faqs?: FAQItem[];
  title?: string;
  description?: string;
}

export default function MadrasahFAQs({
  faqs = [],
  title = "Frequently Asked Questions (FAQs)",
  description = "Find answers to common questions about our Madrasa programs."
}: MadrasahFAQsProps) {
  const [expandedId, setExpandedId] = useState<string>("");


  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 overflow-hidden bg-[#004E93]">
      {/* Background with pattern - reused from CoreValues */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
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

      <div className="relative section-padding flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-12">
        {/* Header */}
        <div className="flex items-center w-full">
          <div className="flex flex-col gap-4 w-full">
            <h1 className="text-3xl font-semibold sm:text-4xl text-white">
              {title}
            </h1>
            <p className="text-base font-medium text-white/90">
              {description}
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] px-6 py-8 sm:px-8 sm:py-9 md:px-12 md:py-10 lg:px-16 lg:py-11 w-full">
          <div className="flex flex-col px-2 lg:px-2">
            {faqs.map((item, index) => (
              <div key={item.id || index} className="flex flex-col gap-2 lg:gap-2">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? "" : item.id)
                  }
                  className="flex items-center justify-between w-full py-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-left text-lg font-bold text-[#11181c] flex-1">
                    {item.question}
                  </h3>
                  <div className="w-6 h-6 relative transition-transform duration-300 ml-4 flex-shrink-0">
                    <Image
                      src={
                        expandedId === item.id
                          ? "/assets/common/arrow-down.svg"
                          : "/assets/common/arrow-left.svg"
                      }
                      alt="Arrow"
                      fill
                      className="object-contain"
                    />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedId === item.id
                    ? "max-h-[500px] opacity-100" // Increased max-height for rich text potential content
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-4 text-[#52525b] text-base leading-relaxed">
                    {typeof item.answer === 'string' ? (
                      item.answer
                    ) : (
                      <RichTextRenderer content={item.answer} />
                    )}
                  </div>
                </div>

                {index < faqs.length - 1 && (
                  <div className="h-px w-full bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
