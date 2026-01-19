"use client";

import { useState } from "react";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import SermonCard, { SermonCardProps } from "../common/SermonCard";

import Image from "next/image";

interface SermonsFeedProps {
  initialSermons: SermonCardProps["sermon"][];
  viewOptions: {
    defaultView: string;
    listViewLabel: string;
    gridViewLabel: string;
    showSearch: boolean;
    searchPlaceholder: string;
  };
  loadMoreText?: string;
  emptyStateMessage?: string;
}

export default function SermonsFeed({
  initialSermons,
  viewOptions,
  loadMoreText = "Load More",
  emptyStateMessage = "No sermons found."
}: SermonsFeedProps) {
  const [view, setView] = useState<"grid" | "list">((viewOptions.defaultView as "grid" | "list") || "grid");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredSermons = initialSermons.filter(sermon =>
    sermon.title.toLowerCase().includes(query.toLowerCase()) ||
    sermon.author?.name?.toLowerCase().includes(query.toLowerCase())
  );

  const displayedSermons = filteredSermons.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Sermons", href: "/sermons" }
  ];

  return (
    <>
      <BreadcrumbSearchSection
        breadcrumbs={breadcrumbs}
        searchPlaceholder={viewOptions.searchPlaceholder}
        onSearch={(val) => { setQuery(val); setVisibleCount(3); }}
        showSearch={false}
        liveSearch={false}
        className="section-padding"
      />

      <div className="section-padding py-6 lg:py-10 bg-white min-h-[600px]">
        {/* Search and View Toggle Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

          {/* Search Bar - Responsive: Full width on mobile, auto on desktop */}
          {viewOptions.showSearch && (
            <div className="w-full md:w-auto relative">
              <div className="flex items-center gap-2.5 bg-[#FAFAFA] rounded-lg px-3 sm:px-4 py-2 w-full md:min-w-[342px] md:max-w-[342px] border border-[#E4E4E7]">
                <Image
                  src="/assets/common/search-icon.svg"
                  alt="Search"
                  width={24}
                  height={24}
                />
                <input
                  type="text"
                  placeholder={viewOptions.searchPlaceholder}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setVisibleCount(3); }}
                  className="flex-1 text-sm sm:text-base leading-6 text-[#18181B] placeholder:text-[#11181C] bg-transparent outline-none min-w-0"
                />
              </div>
            </div>
          )}

          {/* View Toggles */}
          <div className="flex items-center gap-8 self-end md:self-auto">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${view === "list" ? "text-[#006fee]" : "text-[#27272A]"}`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M16.6665 5.83333L3.33317 5.83333"/>
                <path d="M16.6665 10L3.33317 10"/>
                <path d="M11.6665 14.1667L3.33317 14.1667"/>
              </svg>
              <span className="text-base font-medium">{viewOptions.listViewLabel}</span>
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${view === "grid" ? "text-[#006fee]" : "text-[#27272A]"}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="text-base font-medium">{viewOptions.gridViewLabel}</span>
            </button>
          </div>
        </div>

        {displayedSermons.length > 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" : "flex flex-col gap-6"}>
            {displayedSermons.map((s, i) => (
              <SermonCard key={s.id || i} sermon={s} layout={view} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            {emptyStateMessage}
          </div>
        )}

        {visibleCount < filteredSermons.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-gray-100 items-center rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {loadMoreText}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
