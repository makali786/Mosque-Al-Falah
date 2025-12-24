"use client";

import Image from "next/image";
import Link from "next/link";

interface Imam {
  id: number;
  image: string;
  name: string;
  tagline: string;
  imageStyle?: string;
}

const IMAMS: Imam[] = [
  {
    id: 1,
    image: "/assets/imams/imam-1.png",
    name: "Adil Yousuf",
    tagline: "Imam & Quarry",
    imageStyle: "object-[50%_-14%] scale-150",
  },
  {
    id: 2,
    image: "/assets/imams/imam-2.png",
    name: "Adil Yousuf",
    tagline: "Imam & Quarry",
  },
];

export default function MeetOurImams() {
  return (
    <section className="bg-white w-full pb-8 sm:py-22.5 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50">
      <div className="container mx-auto">
        {/* Title */}
        <h2 className="text-xl leading-7 font-bold sm:text-3xl sm:leading-9 md:text-4xl md:leading-10 lg:text-5xl lg:leading-none sm:font-semibold text-[#18181b] sm:text-black mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          Meet Our Imams
        </h2>

        {/* Imam Cards */}
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-10 md:gap-11 lg:gap-12 items-center pb-8 sm:pb-0">
          {IMAMS.map((imam) => (
            <div key={imam.id} className="relative w-full aspect-square lg:w-136 lg:h-136 lg:aspect-auto">
              {/* Card Container */}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {/* Background Image */}
                <Image
                  src={imam.image}
                  alt={imam.name}
                  fill
                  className={`object-cover ${imam.imageStyle || ""}`}
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 rounded-3.5 md:rounded-xl"
                  style={{
                    background:
                      "linear-gradient(206.565deg, rgba(12, 11, 29, 0) 16.667%, rgb(10, 29, 38) 100%)",
                  }}
                />

                {/* Name and Tagline - Bottom Left */}
                <div className="absolute bottom-10.25 left-4 sm:left-5 md:left-6 lg:left-7.5 flex flex-col gap-1 sm:gap-1.5 lg:gap-2 w-80.75 sm:max-w-none lg:max-w-81.25">
                  <h3 className="text-lg leading-7 font-bold md:text-xl lg:text-xl text-white">
                    {imam.name}
                  </h3>
                  <p className="text-base font-normal text-[#e4e4e7] leading-6 overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    {imam.tagline}
                  </p>
                </div>
              </div>

              {/* Ask Imam Button - Bottom Right (extends below card) */}
              <Link
                href={`/ask-imam/${imam.id}`}
                className="absolute -bottom-6 right-7.75 sm:right-7 bg-[#006fee] h-12 px-6 sm:px-5 lg:px-4 rounded-full flex items-center gap-2 hover:bg-[#0056cc] transition-colors shadow-lg z-10"
              >
                <div className="w-5 h-5 relative shrink-0">
                  <Image
                    src="/assets/imams/messages-icon.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-normal text-white leading-6">
                  Ask Imam
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
