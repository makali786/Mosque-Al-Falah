"use client";

import Image from "next/image";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

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
    <section className="relative w-full px-6 py-16 md:px-12 lg:px-50 lg:py-22.5 overflow-hidden">
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

      <div className="relative">
        {/* Header */}
        <div className="mb-10 md:mb-12 max-w-full md:max-w-[650px]">
          <h1 className="mb-5 text-4xl font-semibold text-white md:text-5xl leading-tight md:leading-[48px]">
            Our Core Values
          </h1>
          <p className="text-lg text-white font-medium leading-7">
            Learn more about our values and our story about MAF's by visiting
            the about us page.
          </p>
        </div>

        {/* Accordion */}
        <div className="rounded-[14px] bg-white px-8 md:px-16 py-8 md:py-11 shadow-lg">
          <div className="space-y-0">
            {faqItems.map((item, index) => (
              <div key={item.id}>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? "" : item.id)
                  }
                  className="flex w-full items-center justify-between py-5 text-left transition-all hover:bg-gray-50"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.question}
                  </h3>
                  {/* <FaChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      expandedId === item.id ? "rotate-90" : ""
                    }`}
                    color="#A1A1AA"
                  /> */}
                  <Image
                    src="/assets/common/arrow-left.svg"
                    width={24}
                    height={24}
                    alt="Arrow Icon"
                    className={`object-contain transition-transform duration-300 ${
                      expandedId === item.id ? "-rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedId === item.id && (
                  <div className="overflow-hidden">
                    <p className="pb-2.5 text-[#11181C]">{item.answer}</p>
                  </div>
                )}

                {index < faqItems.length - 1 && (
                  <div className="border-b border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
