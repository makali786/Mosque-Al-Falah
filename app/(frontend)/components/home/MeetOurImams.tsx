"use client";

import Image from "next/image";
import Link from "next/link";

interface Imam {
  id: number;
  image: string | null;
  name: string;
  tagline: string;
  imageStyle?: string;
}

// Remove hardcoded IMAMS constant


interface RawImam {
  id: number;
  image?: string | { url: string } | null;
  name?: string;
  tagline?: string;
  role?: string;
  imageStyle?: string;
}

export default function MeetOurImams({ imams = [] }: { imams: RawImam[] }) {

  const mappedImams: Imam[] = imams.map((imam) => ({
    id: imam?.id,
    name: imam?.name || "",
    tagline: imam?.tagline || imam?.role || "", // Fallback if tagline missing
    image: typeof imam?.image === "string" ? imam?.image : imam?.image?.url || null,
    imageStyle: imam?.imageStyle,
  }));

  const hasImams = mappedImams.length > 0;

  if (!hasImams) return null;

  return (
    <section className="bg-white w-full pb-8 sm:py-22.5">
      <div className="hn-container px-4 sm:!px-18">
        {/* Title */}
        <h2 className="text-xl leading-7 font-bold sm:text-3xl sm:leading-9 md:text-4xl md:leading-10 lg:text-5xl lg:leading-none sm:font-semibold text-[#18181b] sm:text-black sm:pt-0 pt-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          Meet Our Imams
        </h2>

        {/* Imam Cards */}
        <div className="flex flex-col items-center lg:justify-center xl:justify-start lg:flex-row lg:flex-wrap gap-10 sm:gap-10 md:gap-11 lg:gap-12 items-center pb-8 sm:pb-0">
          {mappedImams.map((imam) => (
            <div key={imam?.id} className="relative w-full aspect-square lg:w-136 lg:h-136 lg:aspect-auto">
              {/* Card Container */}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {/* Background Image */}
                {imam?.image && (
                  <Image
                    src={imam.image}
                    alt={imam.name}
                    fill
                    className={`object-cover ${imam.imageStyle || ""}`}
                  />
                )}

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
                    {imam?.name}
                  </h3>
                  <p className="text-base font-normal text-[#e4e4e7] leading-6 overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    {imam?.tagline}
                  </p>
                </div>
              </div>

              {/* Ask Imam Button - Bottom Right (extends below card) */}
              <Link
                href={`/ask-imam/${imam?.id}`}
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
