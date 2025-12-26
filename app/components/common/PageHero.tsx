"use client";

import Image from "next/image";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  backgroundImage: string;
}

export default function PageHero({
  title,
  breadcrumbs,
  backgroundImage,
}: PageHeroProps) {
  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] xl:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(76.67deg, #000000 7.37%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex items-end pb-10 sm:pb-16 xl:pb-20">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-30">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {/* Title */}
            <h1 className="font-bold text-white text-xl leading-9 sm:text-2xl sm:leading-tight md:text-3xl md:leading-tight lg:text-4xl lg:leading-tight xl:text-5xl">
              {title}
            </h1>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    {index > 0 && (
                      <svg
                        width="8"
                        height="14"
                        viewBox="0 0 8 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-2 h-3.5 sm:w-2 sm:h-3.5 flex-shrink-0"
                      >
                        <path
                          d="M1 1L7 7L1 13"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-white text-xs sm:text-sm lg:text-base">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="font-medium text-[#006fee] hover:text-[#0056cc] text-xs sm:text-sm lg:text-base transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
