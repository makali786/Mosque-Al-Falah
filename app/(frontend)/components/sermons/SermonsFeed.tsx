"use client";

import { useState } from "react";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import SermonCard, { SermonCardProps } from "../common/SermonCard";

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
  
  const filteredSermons = initialSermons.filter(sermon => 
    sermon.title.toLowerCase().includes(query.toLowerCase()) || 
    sermon.author?.name?.toLowerCase().includes(query.toLowerCase())
  );

  const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Sermons", href: "/sermons" }
  ];

  return (
    <>
      <BreadcrumbSearchSection 
         breadcrumbs={breadcrumbs}
         searchPlaceholder={viewOptions.searchPlaceholder}
         onSearch={setQuery}
         showSearch={viewOptions.showSearch}
         liveSearch={false}
         className="section-padding"
      />
      
      <div className="section-padding py-6 lg:py-10 bg-white min-h-[600px]">
          {/* View Toggle - Top Right */}
          <div className="flex justify-end mb-8">
             <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setView("list")}
                   className={`flex items-center gap-2 transition-colors ${view === "list" ? "text-gray-900" : "text-gray-400"}`}
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <span className="text-sm font-medium">{viewOptions.listViewLabel}</span>
                 </button>
                 <button 
                   onClick={() => setView("grid")}
                   className={`flex items-center gap-2 transition-colors ${view === "grid" ? "text-[#006fee]" : "text-gray-400"}`} 
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span className="text-sm font-medium">{viewOptions.gridViewLabel}</span>
                 </button>
             </div>
          </div>
          
          {filteredSermons.length > 0 ? (
             <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" : "flex flex-col gap-6"}>
                 {filteredSermons.map((s, i) => (
                    <SermonCard key={s.id || i} sermon={s} layout={view} />
                 ))}
             </div>
          ) : (
             <div className="py-20 text-center text-gray-500">
                 {emptyStateMessage}
             </div>
          )}
          
          <div className="mt-12 flex justify-center">
             <button className="px-6 py-3 bg-gray-100 items-center rounded-lg text-sm font-medium text-gray-900">
                {loadMoreText}
             </button>
          </div>
      </div>
    </>
  );
}
