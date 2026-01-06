"use client";

import { useState } from "react";
import Image from "next/image";
import EventCard, { EventInterface } from "./EventCard";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import RequestServiceForm from "../common/RequestServiceForm";

interface EventsFeedProps {
  initialEvents: EventInterface[];
  pageData: {
    pageHeader: {
      pageTitle: string;
      breadcrumb: string;
      showBreadcrumb: boolean;
    };
    filterOptions: {
      enableUpcomingTab: boolean;
      upcomingTabLabel: string;
      enableArchivedTab: boolean;
      archivedTabLabel: string;
      enableSpeakerFilter: boolean;
      speakerFilterLabel: string;
      enableCategoryFilter: boolean;
      categoryFilterLabel: string;
      enableCalendarView: boolean;
      calendarViewLabel: string;
    };
    viewOptions: {
      showViewToggle: boolean;
      defaultView: string;
      listViewLabel: string;
      gridViewLabel: string;
    };
    gridSettings: {
      loadMoreButtonText: string;
      eventsPerPage: number;
    };
    defaultSettings: {
        defaultTab: string;
        sortBy: string;
        showFeaturedFirst: boolean;
    };
    requestForm: {
        formFields: {
            fullNameLabel: string;
            fullNamePlaceholder: string;
            emailLabel: string;
            emailPlaceholder: string;
            phoneLabel: string;
            phonePlaceholder: string;
            commentLabel: string;
            commentPlaceholder: string;
            submitButtonText: string;
        };
        enableSection: boolean;
        sectionTitle: string;
        description: string;
        successMessage: string;
    };
    emptyStates: {
      noUpcomingEvents: string;
      noArchivedEvents: string;
      noSearchResults: string;
    };
  };
}

export default function EventsFeed({ initialEvents, pageData }: EventsFeedProps) {
  const { filterOptions, viewOptions, gridSettings, emptyStates, defaultSettings, requestForm } = pageData;
  console.log("pageData", pageData)
  
  const [view, setView] = useState<"grid" | "list">((viewOptions.defaultView as "grid" | "list") || "grid");
  const [activeTab, setActiveTab] = useState<"upcoming" | "archived">(
    (defaultSettings?.defaultTab as "upcoming" | "archived") || 
    (filterOptions.enableUpcomingTab ? "upcoming" : "archived")
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(parseInt(gridSettings.eventsPerPage.toString()) || 6);

  // Extract unique speakers and categories for filters
  const speakers = Array.from(new Set(initialEvents?.flatMap(e => e.speakers?.map(s => s.guestSpeaker?.name || "") || []))).filter(Boolean) as string[];
  const categories = Array.from(new Set(initialEvents?.map(e => e.category).filter(Boolean))) as string[];

  // Filter Logic
  const filteredEvents = initialEvents.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.timing.startDate);
    
    // Tab Filter
    if (activeTab === "upcoming" && eventDate < now) return false;
    if (activeTab === "archived" && eventDate >= now) return false;

    // Speaker Filter
    if (selectedSpeaker && !event.speakers?.some(s => s.guestSpeaker?.name === selectedSpeaker)) return false;

    // Category Filter
    if (selectedCategory && event.category !== selectedCategory) return false;

    return true;
  });

  // Sort: Upcoming (Ascending), Archived (Descending)
  filteredEvents.sort((a, b) => {
    const dateA = new Date(a.timing.startDate).getTime();
    const dateB = new Date(b.timing.startDate).getTime();
    return activeTab === "upcoming" ? dateA - dateB : dateB - dateA;
  });

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + parseInt(gridSettings.eventsPerPage.toString()) || 6);
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: pageData.pageHeader.pageTitle, href: "/events" }
  ];

  return (
    <>
      {pageData.pageHeader.showBreadcrumb && (
        <BreadcrumbSearchSection
          breadcrumbs={breadcrumbs}
          showSearch={false}
          className="section-padding"
        />
      )}

      <div className="section-padding py-8 bg-[#fff] min-h-screen">
        {/* Filters and View Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
          
          {/* Left: Tabs & Dropdowns */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full xl:w-auto">
            
            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-lg border border-[#E4E4E7] shadow-sm">
                {filterOptions.enableUpcomingTab && (
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "upcoming" 
                            ? "bg-[#F4F4F5] text-[#18181B]" 
                            : "text-[#71717A] hover:text-[#18181B]"
                        }`}
                    >
                        {filterOptions.upcomingTabLabel}
                    </button>
                )}
                {filterOptions.enableArchivedTab && (
                    <button
                        onClick={() => setActiveTab("archived")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "archived" 
                            ? "bg-[#F4F4F5] text-[#18181B]" 
                            : "text-[#71717A] hover:text-[#18181B]"
                        }`}
                    >
                        {filterOptions.archivedTabLabel}
                    </button>
                )}
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap gap-4">
                {filterOptions.enableSpeakerFilter && (
                    <div className="relative">
                        <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            className="appearance-none bg-white border border-[#E4E4E7] text-[#18181B] text-sm font-medium rounded-lg pl-4 pr-10 py-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[160px]"
                        >
                            <option value="">{filterOptions.speakerFilterLabel}</option>
                            {speakers.map((s: string, i: number) => <option key={i} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <Image src="/assets/common/down-arrow.svg" alt="arrow" width={10} height={10} className="opacity-50" />
                        </div>
                    </div>
                )}

                {filterOptions.enableCategoryFilter && (
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none bg-white border border-[#E4E4E7] text-[#18181B] text-sm font-medium rounded-lg pl-4 pr-10 py-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[140px]"
                        >
                            <option value="">{filterOptions.categoryFilterLabel}</option>
                            {categories.map((c: string, i: number) => <option key={i} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                             <Image src="/assets/common/down-arrow.svg" alt="arrow" width={10} height={10} className="opacity-50" />
                        </div>
                    </div>
                )}
                 
                 {filterOptions.enableCalendarView && (
                    <div className="relative">
                        <button className="flex items-center justify-between bg-white border border-[#E4E4E7] text-[#18181B] text-sm font-medium rounded-lg px-4 py-2.5 shadow-sm hover:bg-gray-50 min-w-[140px]">
                            <span>{filterOptions.calendarViewLabel}</span>
                             <Image src="/assets/common/down-arrow.svg" alt="arrow" width={10} height={10} className="opacity-50 ml-2" />
                        </button>
                    </div>
                )}
            </div>
          </div>

          {/* Right: View Toggles */}
          {viewOptions.showViewToggle && (
            <div className="flex items-center gap-6 ml-auto">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 transition-colors ${view === "list" ? "text-[#006FEE]" : "text-[#71717A] hover:text-[#18181B]"}`}
              >
                <Image
                    src="/assets/common/list-icon.svg"
                    alt="List"
                    width={20}
                    height={20}
                    className={view === "list" ? "filter-blue" : "opacity-60"} 
                    style={view === "list" ? { filter: "invert(30%) sepia(85%) saturate(2329%) hue-rotate(202deg) brightness(98%) contrast(106%)" } : {}}
                />
                <span className="text-sm font-medium">{viewOptions.listViewLabel}</span>
              </button>
              
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-2 transition-colors ${view === "grid" ? "text-[#006FEE]" : "text-[#71717A] hover:text-[#18181B]"}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={view === "grid" ? "text-[#006FEE]" : "text-[#71717A]"}>
                    <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span className="text-sm font-medium">{viewOptions.gridViewLabel}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {displayedEvents.length > 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} layout={view} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            {activeTab === "upcoming" ? emptyStates.noUpcomingEvents : emptyStates.noArchivedEvents}
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredEvents.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-white border border-[#E4E4E7] rounded-lg text-sm font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors shadow-sm"
            >
              {gridSettings.loadMoreButtonText}
            </button>
          </div>
        )}

        {/* Request Form */}
        {requestForm?.enableSection && (
          <div className="mt-16">
            <RequestServiceForm 
                sectionTitle={requestForm.sectionTitle}
                description={requestForm.description}
                formFields={requestForm.formFields}
                onSubmit={(data) => console.log("Form submitted:", data)}
            />
          </div>
        )}
      </div>
    </>
  );
}
