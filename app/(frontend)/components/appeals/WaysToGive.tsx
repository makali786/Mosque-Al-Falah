"use client";

import Image from "next/image";
import Link from "next/link";
import { Media } from "../../../../payload-types";
import { getMediaUrl, getMediaAlt } from "../../../../lib/helper";

interface GivingMethod {
  methodName: string;
  description?: string;
  icon?: string; 
  link?: string;
  id?: string;
}

interface WaysToGiveProps {
  title?: string;
  description?: string;
  methods: GivingMethod[];
  image?: Media | string | any;
}

export function WaysToGive({ 
  title = "", 
  description = "", 
  methods, 
  image 
}: WaysToGiveProps) {


  return (
    <section className="relative w-full overflow-hidden bg-[#0c478a]">
       {/* Background Pattern - same as AppealHero/CoreValues */}
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

      <div className="relative section-padding py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
             
          {/* Left Side: Image (Mosque Arch) - Hidden on mobile if needed, or shown top */}
          <div className="relative h-[300px] sm:h-[400px] w-full lg:h-[600px] lg:max-w-[528px] lg:block rounded-[14px] overflow-hidden">
             {image ? (
                <Image
                  src={image || ""}
                  alt={title}
                  fill
                  className="object-cover"
                />
             ) : (
                // Placeholder if no image provided
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/50">
                    Mosque Image
                </div>
             )}
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-white sm:text-5xl">
                {title}
              </h2>
              <p className="text-lg text-white">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {methods.map((method, index) => (
                <div 
                    key={index}
                    className="flex items-center gap-[9px] bg-white rounded-[14px] px-4 py-3 sm:px-[22px] sm:py-[18px]  cursor-pointer lg:max-w-[528px]"
                >
                  {/* Icon */}
                  <div className="w-[57px] h-[57px] rounded-lg bg-black text-white flex items-center justify-center">
                    {method.icon || "🤲"}
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base sm:text-lg font-semibold">
                        {method.methodName}
                    </h3>
                    {method.description && (
                        <p className="text-base text-[#52525B]">
                            {method.description}
                        </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
