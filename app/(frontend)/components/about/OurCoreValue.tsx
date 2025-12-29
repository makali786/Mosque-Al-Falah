"use client";

import Image from "next/image";
import { useState } from "react";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: AccordionItem[] = [
  {
    id: "maf",
    question: "What is the Masjid Al-Falah (MAF)?",
    answer:
      "Our Madrasa welcomes children from ages 5 and above, with tailored classes for different age groups.",
  },
  {
    id: "organised",
    question: "How is MAF Organised?",
    answer:
      "MAF is organized with a structured curriculum designed to meet the needs of all age groups.",
  },
  {
    id: "founded",
    question: "How was MCB Founded?",
    answer:
      "MCB was founded with a mission to serve and support the Muslim community.",
  },
  {
    id: "funded",
    question: "How is the MCB Funded?",
    answer:
      "MCB is funded through community contributions and charitable donations.",
  },
  {
    id: "relate",
    question: "How Do You Relate to ordinary British Muslim Individuals?",
    answer:
      "We maintain strong connections with British Muslim individuals through community engagement and outreach.",
  },
];

export function CoreValuesSection() {
  const [expandedId, setExpandedId] = useState<string>("maf");

  return (
    <section className="relative w-full px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-22.5 xl:px-50 overflow-hidden">
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
      <div className="relative flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-12">
        {/* Header */}
        <div className="flex items-center w-full">
          <div className="flex flex-col gap-4 sm:gap-4 md:gap-5 lg:gap-5 w-full lg:w-162.5">
            <h1 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[44px] md:leading-11 lg:text-[48px] lg:leading-12 text-white">
              Our Core Values
            </h1>
            <p className="text-base leading-6 font-medium sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-white">
              Learn more about our values and our story about MAF&apos;s by visiting
              the about us page.
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] px-6 py-8 sm:px-8 sm:py-9 md:px-12 md:py-10 lg:px-16 lg:py-11 w-full">
          <div className="flex flex-col px-2 lg:px-2">
            {faqItems.map((item, index) => (
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
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6 text-[#11181c]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {index < faqItems.length - 1 && (
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
