"use client";

import Image from "next/image";



interface ClassItem {
  id: string;
  title: string;
  shortDescription: string;
  ageRange: string;
  image: {
    url: string;
    alt: string;
  };
  applicationButtonText?: string;
}

interface MadrasahClassesProps {
  classes: ClassItem[];
  sectionTitle?: string;
}

export default function MadrasahClasses({
  classes,
  sectionTitle = "Classes"
}: MadrasahClassesProps) {
  return (
    <section className="w-full bg-white py-8 sm:py-10 md:py-12">
      <div className="section-padding flex flex-col gap-8 md:gap-13">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-semibold text-[#27272a]">{sectionTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {classes.map((item, index) => (
            <div
              key={item.id || index}
              className="flex flex-col bg-white overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3] lg:max-h-[357px]">
                {/* Placeholder image if real one missing */}
                <div className="absolute inset-0 animate-pulse bg-gray-100" />
                {item.image?.url && (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col p-4 gap-6 bg-[#FAFAFA]">
                <h3 className="text-lg font-semibold text-[#18181B] mb-6">{item.title}</h3>
                <p className="text-[#27272A] text-base line-clamp-4">
                  {item.shortDescription}
                </p>

                <button className="w-fit bg-[#D4D4D8] px-6 py-3 cursor-pointer">
                  {item.applicationButtonText || "Apply Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
