"use client";

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
    <section className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[550px] 2xl:h-[650px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt={title}
          className="absolute left-0 w-full max-w-none object-cover"
          style={{
            height: '177.78%',
            top: '-68.57%',
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(58.7957deg, rgb(0, 0, 0) 7.3664%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[120px] py-6 sm:py-10 md:py-12 lg:py-16 xl:py-[80px]">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 xl:gap-[24px]">
            {/* Title */}
            <h1 className="font-extrabold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-[48px]">
              {title}
            </h1>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-0">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center gap-0">
                    {index > 0 && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                      >
                        <path
                          d="M9 5L15 12L9 19"
                          stroke="#71717A"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-normal text-[#ecedee] text-xs sm:text-sm lg:text-base xl:text-[16px] leading-relaxed xl:leading-[24px] px-0.5 sm:px-1">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="font-normal text-[#006fee] hover:text-[#0056cc] text-xs sm:text-sm lg:text-base xl:text-[16px] leading-relaxed xl:leading-[24px] transition-colors px-0.5 sm:px-1"
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
