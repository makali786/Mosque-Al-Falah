"use client";

import Image from "next/image";
import Link from "next/link";

interface Imam {
  id: number;
  image: string | null;
  name: string;
  title: string;
  imageStyle?: string;
  email?: string | null;
}

// Remove hardcoded IMAMS constant


interface RawImam {
  id: number;
  image?: string | { url: string } | null;
  name?: string;
  title?: string;
  role?: string;
  imageStyle?: string;
  email?: string | null;
}

export default function MeetOurImams({ imams = [] }: { imams: RawImam[] }) {

  const mappedImams: Imam[] = imams.map((imam) => ({
    id: imam?.id,
    name: imam?.name || "",
    title: imam?.title || imam?.role || "", // Fallback if tagline missing
    image: typeof imam?.image === "string" ? imam?.image : imam?.image?.url || null,
    imageStyle: imam?.imageStyle,
    email: imam?.email,
  }));

  const hasImams = mappedImams.length > 0;

  if (!hasImams) return null;

  return (
    <section className="bg-white w-full pb-16 sm:py-20 md:py-24 lg:py-28 xl:py-33">
      <div className="section-padding flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-12">
        {/* Title */}
        <h2 className="text-2xl leading-8 font-bold sm:text-3xl sm:leading-9 md:text-[32px] md:leading-9 lg:text-[36px] lg:leading-10 text-[#27272a] sm:pt-0 pt-12">
          Meet Our Imams
        </h2>

        {/* Imam Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full">
          {mappedImams.map((imam) => (
            <div key={imam?.id} className="flex flex-col gap-3 sm:gap-3.5 md:gap-4 lg:gap-4 bg-white border border-[#e4e4e7] rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-4.5 md:p-5 lg:p-5 shadow-sm overflow-hidden h-full">
              {/* Image */}
              <div
                className="relative w-full rounded-md sm:rounded-lg lg:rounded-lg overflow-hidden shrink-0"
                style={{ aspectRatio: "226 / 162" }}
              >
                <Image
                  src={imam?.image || "/placeholder-image.png"}
                  alt={imam?.name}
                  fill
                  className={`object-cover ${imam.imageStyle || ""}`}
                />
              </div>

              {/* Name and Role */}
              <div className="flex flex-col gap-1 lg:gap-1">
                <h3 className="text-lg leading-6 font-semibold sm:text-[19px] sm:leading-7 md:text-xl md:leading-7 lg:text-[20px] lg:leading-7 text-[#18181b]">
                  {imam?.name}
                </h3>
                <p className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6 text-[#71717a] truncate">
                  {imam?.title}
                </p>
              </div>

              {/* Ask Imam Button */}
              {imam.email && (
                <>
                  {/* Divider */}
                  <div
                    className="h-px w-full mt-auto"
                    style={{ backgroundColor: "rgba(17, 17, 17, 0.15)" }}
                  />
                  <div className="flex gap-3 sm:gap-3.5 md:gap-4 lg:gap-4">
                    <a
                      href={`mailto:${imam.email}`}
                      className="flex items-center justify-center gap-2 h-10 sm:h-11 md:h-12 lg:h-12 px-4 sm:px-5 md:px-6 lg:px-6 bg-[#006fee] hover:bg-[#0056cc] rounded-md sm:rounded-lg lg:rounded-lg transition-colors cursor-pointer w-full text-center"
                    >
                      <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 relative shrink-0">
                        <Image
                          src="/assets/imams/messages-icon.svg"
                          alt="Email"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6 text-white font-medium">
                        Ask Imam
                      </span>
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
