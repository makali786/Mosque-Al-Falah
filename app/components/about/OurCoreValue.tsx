"use client";

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
    <section
      className="w-full px-6 py-16 md:px-12 lg:px-20 lg:py-24"
      style={{
        background:
          "linear-gradient(162.05deg, #0C478A 46.63%, #004797 71.1%)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Our Core Values
          </h1>
          <p className="text-lg text-blue-100">
            Learn more about our values and our story about MAF's by visiting
            the about us page.
          </p>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="space-y-0">
            {faqItems.map((item, index) => (
              <div key={item.id}>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? "" : item.id)
                  }
                  className="flex w-full items-center justify-between py-5 text-left transition-all hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </h3>
                  <FaChevronDown
                    size={24}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                      expandedId === item.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedId === item.id && (
                  <div className="overflow-hidden">
                    <p className="pb-5 text-gray-700">{item.answer}</p>
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
