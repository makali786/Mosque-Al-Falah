"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbSearchSectionProps {
  breadcrumbs: Breadcrumb[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function BreadcrumbSearchSection({
  breadcrumbs,
  searchPlaceholder = "Search",
  onSearch,
  className = "",
}: BreadcrumbSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section
      className={`w-full py-6 sm:py-7 md:pt-8 lg:pt-10 lg:pb-11 ${className}`}
    >
      <div className="hn-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-[#71717A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-sm sm:text-base leading-6 text-[#18181B] font-normal">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-sm sm:text-base leading-6 text-[#006FEE] font-normal hover:underline"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2.5 bg-[#fafafa] rounded-lg px-3 sm:px-4 py-2 w-full sm:w-auto md:min-w-[342px] md:max-w-[342px] border border-[#E4E4E7]"
          >
            <Image
              src="/assets/common/search-icon.svg"
              alt="Search"
              width={24}
              height={24}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm sm:text-base leading-6 text-[#18181B] placeholder:text-[#11181C] bg-transparent outline-none min-w-0"
            />
          </form>
        </div>
      </div>
    </section>
  );
}

export type { Breadcrumb, BreadcrumbSearchSectionProps };
