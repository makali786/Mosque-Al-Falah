"use client";

import { useState } from "react";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import MediaCard, { MediaItem } from "./MediaCard";
import Image from "next/image";
import Tabs from "../common/Tabs";

interface MediaFeedProps {
  initialMedia: MediaItem[];
  viewOptions: {
    defaultView: string;
    listViewLabel: string;
    gridViewLabel: string;
    showSearch: boolean;
    searchPlaceholder: string;
    showViewToggle?: boolean;
  };
  filterTabs: {
    showAllTab: boolean;
    allTabLabel: string;
    showVideosTab: boolean;
    videosTabLabel: string;
    showPhotoGalleryTab: boolean;
    photoGalleryTabLabel: string;
    showAudioPodcastTab: boolean;
    audioPodcastTabLabel: string;
  };
  loadMoreText?: string;
  emptyStateMessage?: string;
  showBreadcrumbs?: boolean;
}

export default function MediaFeed({
  initialMedia,
  viewOptions,
  filterTabs,
  loadMoreText = "Load More",
  emptyStateMessage = "No media items available.",
  showBreadcrumbs = true
}: MediaFeedProps) {
  const [view, setView] = useState<"grid" | "list">((viewOptions.defaultView as "grid" | "list") || "grid");
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "video" | "audio" | "gallery" | "podcast">("all");
  const [visibleCount, setVisibleCount] = useState(3); // Default 3 as per user request

  // Filter Logic
  const filteredMedia = initialMedia.filter(item => {
    // Search Filter
    const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()));

    // Tab Filter
    let matchesTab = true;
    if (selectedTab !== "all") {
      if (selectedTab === 'audio' || selectedTab === 'podcast') {
        matchesTab = item.type === 'audio' || item.type === 'podcast';
      } else {
        matchesTab = item.type === selectedTab;
      }
    }

    return matchesSearch && matchesTab;
  });

  const displayedMedia = filteredMedia.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Media", href: "/media" }
  ];

  // Tabs Configuration
  const tabs = [
    filterTabs.showAllTab && { id: 'all', label: filterTabs.allTabLabel },
    filterTabs.showVideosTab && { id: 'video', label: filterTabs.videosTabLabel },
    filterTabs.showPhotoGalleryTab && { id: 'gallery', label: filterTabs.photoGalleryTabLabel },
    filterTabs.showAudioPodcastTab && { id: 'audio', label: filterTabs.audioPodcastTabLabel },
  ].filter(Boolean) as { id: string; label: string }[];


  return (
    <>
      {showBreadcrumbs && (
        <BreadcrumbSearchSection
          breadcrumbs={breadcrumbs}
          showSearch={false}
          className="section-padding pb-0"
        />
      )}

      <div className="section-padding pb-6 lg:pb-10 bg-white min-h-150">
        {/* Controls Header: Tabs + Search + View */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 mt-4 sm:mt-0 sm:mb-12">

          {/* Filter Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={selectedTab === 'podcast' ? 'audio' : selectedTab}
            onChange={(tabId) => {
              setSelectedTab(tabId as any);
              setVisibleCount(6);
            }}
            variant="pills"
            size="md"
          />

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            {viewOptions.showSearch && (
              <div className="relative w-full sm:w-auto">
                <div className="flex items-center gap-2.5 bg-[#FAFAFA] rounded-lg px-3 sm:px-4 py-2 w-full sm:min-w-[300px] border border-[#E4E4E7]">
                  <Image
                    src="/assets/common/search-icon.svg"
                    alt="Search"
                    width={20}
                    height={20}
                  />
                  <input
                    type="text"
                    placeholder={viewOptions.searchPlaceholder}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setVisibleCount(6); }}
                    className="flex-1 text-sm leading-6 text-[#18181B] placeholder:text-[#11181C] bg-transparent outline-none min-w-0"
                  />
                </div>
              </div>
            )}

            {/* View Toggles */}
            {viewOptions.showViewToggle && (
              <Tabs
                tabs={[
                  {
                    id: "list",
                    label: <span className="hidden sm:block">{viewOptions.listViewLabel}</span>,
                    icon: <Image
                      src="/assets/common/list-icon.svg"
                      alt="List"
                      width={20}
                      height={20}
                      className={view === "list" ? "brightness-0 saturate-100 invert-[0.4] sepia-[1] saturate-[5] hue-rotate-[180deg]" : "opacity-60"}
                      style={view === "list" ? { filter: 'invert(38%) sepia(96%) saturate(3207%) hue-rotate(194deg) brightness(101%) contrast(101%)' } : {}}
                    />
                  },
                  {
                    id: "grid",
                    label: <span className="hidden sm:block">{viewOptions.gridViewLabel}</span>,
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={view === "grid" ? "opacity-100" : "opacity-60"}>
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  }
                ]}
                activeTab={view}
                onChange={(tabId) => setView(tabId as any)}
                variant="underline"
                size="sm"
                className="shrink-0 self-end sm:self-center"
              />
            )}
          </div>
        </div>

        {/* Media Grid/List */}
        {displayedMedia.length > 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" : "flex flex-col gap-6"}>
            {displayedMedia.map((item, i) => (
              <MediaCard key={item.id || i} media={item} layout={view} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            {emptyStateMessage}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredMedia.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-[#F4F4F5] rounded-lg text-sm font-medium text-[#18181B] hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {loadMoreText}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
