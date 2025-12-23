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
    tagline: "Tagline here",
    imageStyle: "object-[50%_-14%] scale-150",
  },
  {
    id: 2,
    image: "/assets/imams/imam-2.png",
    name: "Adil Yousuf",
    tagline: "Tagline here",
  },
];

export default function MeetOurImams() {
  return (
    <section className="bg-white w-full py-22.5 px-4 lg:px-8 xl:px-50">
      {/* Title */}
      <h2 className="text-5xl font-semibold leading-none text-black mb-12">
        Meet Our Imams
      </h2>

      {/* Imam Cards */}
      <div className="flex justify-center flex-col lg:flex-row gap-12 items-center">
        {IMAMS.map((imam) => (
          <div key={imam.id} className="relative w-full lg:w-136 h-136">
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
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(206.565deg, rgba(12, 11, 29, 0) 16.667%, rgb(10, 29, 38) 100%)",
                }}
              />

              {/* Name and Tagline - Bottom Left */}
              <div className="absolute bottom-10.25 left-7.5 flex flex-col gap-2 max-w-81.25">
                <h3 className="text-xl font-bold text-white leading-7">
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
              className="absolute -bottom-6 right-7 bg-[#006fee] h-12 px-4 rounded-full flex items-center gap-2 hover:bg-[#0056cc] transition-colors shadow-lg z-10"
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
    </section>
  );
}
