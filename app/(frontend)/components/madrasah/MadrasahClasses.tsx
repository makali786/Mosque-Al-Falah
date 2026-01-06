"use client";

import Image from "next/image";

interface ClassItem {
  image: string;
  title: string;
  description: string;
  age: string;
}

const classesData: ClassItem[] = [
  {
    image: "/assets/madrasah/class-boys.jpg",
    title: "Maktab for Boys",
    description: "Masjid Al-Falah is delighted to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.",
    age: "Boys 6-17 Years",
  },
  {
    image: "/assets/madrasah/class-hifz.jpg",
    title: "Hifz for Children",
    description: "Masjid Al-Falah is delighted to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.",
    age: "Children 6-17 Years",
  },
  {
    image: "/assets/myth/class-teens.jpg",
    title: "Further Education - Classes for Teenagers",
    description: "Masjid Al-Falah is designed to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.",
    age: "Teenagers",
  },
];

export default function MadrasahClasses() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="section-padding flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-[#27272a]">Classes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {classesData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-white overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3] lg:max-h-[357px]">
                {/* Placeholder image if real one missing */}
                <div className="absolute inset-0 animate-pulse" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex flex-col p-6 gap-4 bg-[#FAFAFA]">
                <h3 className="text-lg font-semibold text-[#18181B] mb-6">{item.title}</h3>
                <p className="text-[#27272A] text-base line-clamp-4">
                    {item.description}
                </p>
                
                <button className="w-fit bg-[#D4D4D8] px-6 py-3 mt-6">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
