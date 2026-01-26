"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import EventCard, { EventInterface } from "./EventCard";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import RequestServiceForm from "../common/RequestServiceForm";
import Tabs from "../common/Tabs";

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

  const dateInputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<"grid" | "list">((viewOptions.defaultView as "grid" | "list") || "grid");
  const [activeTab, setActiveTab] = useState<"upcoming" | "archived">(
    (defaultSettings?.defaultTab as "upcoming" | "archived") ||
    (filterOptions.enableUpcomingTab ? "upcoming" : "archived")
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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

    // Date Filter
    if (selectedDate) {
      const filterDateStr = new Date(selectedDate).toDateString();
      const eventDateStr = new Date(event.timing.startDate).toDateString();
      if (filterDateStr !== eventDateStr) return false;
    }

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
    setVisibleCount(prev => prev + (Number(gridSettings.eventsPerPage) || 6));
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
          className="section-padding lg:!pt-12"
        />
      )}

      <div className="section-padding pb-8 sm:pb-12 bg-white min-h-screen flex flex-col gap-8 sm:gap-11">
        {/* Filters and View Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">

          {/* Left: Tabs & Dropdowns */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 w-full xl:w-auto">

            {/* Tabs */}
            <Tabs
              tabs={[
                ...(filterOptions.enableUpcomingTab ? [{ id: "upcoming", label: filterOptions.upcomingTabLabel }] : []),
                ...(filterOptions.enableArchivedTab ? [{ id: "archived", label: filterOptions.archivedTabLabel }] : [])
              ]}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as any)}
              variant="pills"
              size="md"
            />

            {/* Dropdowns */}
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              {filterOptions.enableSpeakerFilter && (
                <div className="relative w-full sm:w-62.5">
                  <select
                    value={selectedSpeaker}
                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                    className="appearance-none bg-[#F4F4F5] w-full px-3 py-2 text-[#11181C] text-sm rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                  >
                    <option value="">{filterOptions.speakerFilterLabel}</option>
                    {speakers.map((s: string, i: number) => <option key={i} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Image src="/assets/common/down-arrow.svg" alt="arrow" width={16} height={16} className="opacity-70" />
                  </div>
                </div>
              )}

              {filterOptions.enableCategoryFilter && (
                <div className="relative w-full sm:w-41.75">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-[#F4F4F5] w-full px-3 py-2 text-[#11181C] text-sm rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                  >
                    <option value="">{filterOptions.categoryFilterLabel}</option>
                    {categories.map((c: string, i: number) => <option key={i} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Image src="/assets/common/down-arrow.svg" alt="arrow" width={16} height={16} className="opacity-70" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: View Toggles */}
          {viewOptions.showViewToggle && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto xl:ml-auto">

              {filterOptions.enableCalendarView && (
                <div className="relative w-full sm:w-auto">
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    value={selectedDate}
                  />
                  <button
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="flex items-center justify-between bg-[#F4F4F5] text-[#11181C] text-sm rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] px-3 py-2 cursor-pointer w-full sm:min-w-44"
                  >
                    <span>{selectedDate ? new Date(selectedDate).toLocaleDateString() : filterOptions.calendarViewLabel}</span>
                    {selectedDate ? (
                      <div
                        onClick={(e) => { e.stopPropagation(); setSelectedDate(""); }}
                        className="ml-2 p-0.5 hover:bg-gray-200 rounded-full cursor-pointer flex items-center justify-center h-4 w-4"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </div>
                    ) : (
                      <Image src="/assets/common/down-arrow.svg" alt="arrow" width={16} height={16} className="opacity-70 ml-2" />
                    )}
                  </button>
                </div>
              )}

              <Tabs
                tabs={[
                  {
                    id: "list",
                    label: viewOptions.listViewLabel,
                    icon: <Image
                      src="/assets/common/list-icon.svg"
                      alt="List"
                      width={20}
                      height={20}
                      className={view === "list" ? "" : "opacity-60"}
                      style={view === "list" ? { filter: "invert(30%) sepia(85%) saturate(2329%) hue-rotate(202deg) brightness(98%) contrast(106%)" } : {}}
                    />
                  },
                  {
                    id: "grid",
                    label: viewOptions.gridViewLabel,
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={view === "grid" ? "text-[#006FEE]" : "text-black"}>
                      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                  }
                ]}
                activeTab={view}
                onChange={(tabId) => setView(tabId as any)}
                variant="clean"
                size="sm"
                className="shrink-0 self-end sm:self-center"
              />
            </div>
          )}
        </div>

        {/* Content */}
        {displayedEvents.length > 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center" : "flex flex-col gap-6"}>
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
          <div className="flex justify-center mt-4 sm:mt-8">
            <button
              onClick={handleLoadMore}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FAFAFA] rounded-xl text-sm sm:text-base font-normal text-black hover:bg-[#F4F4F5] transition-colors cursor-pointer h-12"
            >
              <span>{gridSettings.loadMoreButtonText}</span>
            </button>
          </div>
        )}

        {/* Request Form */}
        {requestForm?.enableSection && (
          <div className="mt-6 mb-12">
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
