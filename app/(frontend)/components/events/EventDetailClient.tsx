"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RichTextRenderer } from "../common/RichTextRenderer";
import { QuoteSection } from "../common/QuoteSection";
import MediaDonationSidebar from "../media/MediaDonationSidebar";
import EventCard from "./EventCard";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import { FaRegCalendarAlt } from "react-icons/fa"; // Fallbacks
import { FiMapPin, FiClock, FiCalendar, FiUser, FiVideo, FiMic, FiImage } from "react-icons/fi";
import { MdOutlineOndemandVideo, MdPerson } from "react-icons/md";
import { BsZoomIn } from "react-icons/bs";

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const getEventFullDate = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const dateStr = s.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const startTime = s.toLocaleTimeString("en-GB", { hour: "numeric", minute: "numeric", hour12: true });
    const endTime = e.toLocaleTimeString("en-GB", { hour: "numeric", minute: "numeric", hour12: true });
    return `${dateStr} • ${startTime} - ${endTime}`;
};

export default function EventDetailClient({ event, config, relatedEvents }: any) {
  const [activeTab, setActiveTab] = useState<"video" | "photos" | "audio">("video");
  
  // Safe accessors
  const title = event?.title || "";
  const subtitle = event?.subtitle || "";
  const startDate = event?.timing?.startDate;
  const endDate = event?.timing?.endDate;
  const venue = event?.venue?.name || "Masjid Al-Falah";
  const address = event?.venue?.fullAddress || "";
  const description = event?.description;
  const speaker = event?.speakers?.[0]?.guestSpeaker || event?.speakers?.[0]?.imamAccount || {};
  const featuredImage = event?.media?.featuredImage?.url || "/assets/placeholders/event-placeholder.png";
  const videoUrl = event?.media?.videoUrl;
  
  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Events/Lectures", href: "/events" },
    { label: title, href: "#" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Breadcrumbs */}
      <div className="section-padding py-6">
        <nav className="flex items-center text-sm text-gray-500 gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>&gt;</span>
            <Link href="/events" className="hover:text-blue-600 transition-colors">Events/Lectures</Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{title}</span>
        </nav>
      </div>

      <div className="section-padding pb-12 sm:pb-20">
        
        {/* 2. Header Hero */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Left: Featured Image */}
            <div className="w-full lg:w-[400px] xl:w-[400px] flex-shrink-0">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                    <Image 
                        src={featuredImage} 
                        alt={title} 
                        fill 
                        className="object-cover"
                    />
                    {/* Date Badge Overlay */}
                     <div className="absolute bottom-6 left-6 text-white">
                        <div className="font-bold text-lg">{new Date(startDate).toLocaleDateString("en-GB", { weekday: 'short' })}</div>
                        <div className="font-bold text-3xl">{new Date(startDate).getDate()} {new Date(startDate).toLocaleDateString("en-GB", { month: 'short' })}</div>
                        <div className="text-sm font-medium opacity-90">{new Date(startDate).toLocaleTimeString("en-GB", { hour:'numeric', minute:'numeric', hour12:true })}</div>
                    </div>
                </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 flex flex-col justify-start pt-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#18181B] mb-2 leading-tight">
                    {title}
                </h1>
                {subtitle && <p className="text-lg text-gray-600 mb-4">{subtitle}</p>}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#71717A] mb-6">
                    <span>{getEventFullDate(startDate, endDate)}</span>
                </div>

                {/* Platforms */}
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-[#52525B]">
                    <span className="font-medium mr-1">Platform:</span>
                    {event?.platforms?.map((p: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                             {/* Icon placeholder logic */}
                            {p.platform.includes('zoom') && <BsZoomIn className="text-blue-500" />}
                            {p.platform.includes('person') && <MdPerson className="text-gray-700" />}
                            {p.platform.includes('live') && <MdOutlineOndemandVideo className="text-red-500" />}
                            <span className="capitalize">{p.platform.replace('-', ' ')}</span>
                        </div>
                    ))}
                </div>

                {/* Speaker */}
                {speaker?.name && (
                    <div className="mb-6">
                        <span className="text-xs text-[#71717A] block mb-2">Speaker</span>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                {speaker.photo?.url ? (
                                    <Image src={speaker.photo.url} alt={speaker.name} fill className="object-cover" />
                                ) : (
                                    <FiUser className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#18181B] uppercase">{speaker.name}</h3>
                                <p className="text-xs text-[#71717A]">{speaker.title || "Islamic Speaker"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Venue */}
                <div className="mb-8">
                     <div className="flex items-center gap-2 text-xs text-[#71717A] mb-1">
                        <FiMapPin /> <span>Venue</span>
                     </div>
                     <p className="text-[#18181B] font-medium">{venue}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-auto">
                    <button className="px-6 py-2.5 bg-[#52525B] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Add to calendar
                    </button>
                    <button className="px-6 py-2.5 bg-[#006FEE] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        Register your interest
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: 2/3 */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Media Tabs & Player */}
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2">
                        {[
                            { id: "video", label: "Video", icon: FiVideo },
                            { id: "photos", label: "Photos", icon: FiImage },
                            { id: "audio", label: "Audio", icon: FiMic }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeTab === tab.id 
                                    ? "bg-[#F4F4F5] text-[#18181B] shadow-sm" 
                                    : "bg-transparent text-[#71717A] hover:bg-gray-50"
                                }`}
                            >
                                {/* <tab.icon className="w-4 h-4" /> */}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="relative aspect-video w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        {activeTab === "video" && (
                            <div className="w-full h-full flex items-center justify-center relative group cursor-pointer bg-neutral-800">
                                {featuredImage && (
                                    <Image 
                                        src={featuredImage} 
                                        alt="Video thumbnail" 
                                        fill 
                                        className="object-cover opacity-60 group-hover:opacity-50 transition-opacity"
                                    />
                                )}
                                {event?.media?.isLive && (
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold text-red-500 shadow-sm z-10">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        Live
                                    </div>
                                )}
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                                   <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900 ml-1"><path d="M8 5v14l11-7z" /></svg>
                                   </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "photos" && (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                <div className="text-center">
                                    <FiImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No photos available</p>
                                </div>
                            </div>
                        )}
                        {activeTab === "audio" && (
                             <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                <div className="text-center">
                                    <FiMic className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No audio recordings available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="prose prose-blue max-w-none text-[#52525B]">
                    {description ? <RichTextRenderer content={description} /> : (
                        <p>Join us for an unforgettable evening of soulful Qur'anic recitations...</p>
                    )}
                </div>

                {/* Booking Form */}
                <div className="pt-8">
                    <h3 className="text-xl font-bold text-[#18181B] mb-8">Book a place</h3>
                    <form className="max-w-[600px] space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                                 <label className="text-xs text-gray-500 block mb-1">Full Name <span className="text-red-500">*</span></label>
                                 <input type="text" defaultValue="Toufik Hasan" className="w-full bg-transparent outline-none text-sm font-medium text-gray-900" />
                            </div>
                            <div className="w-[180px] bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer">
                                 <span className="text-sm font-medium text-gray-900">Number of Guest</span>
                                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                             <label className="text-xs text-gray-500 block mb-1">Email <span className="text-red-500">*</span></label>
                             <input type="email" placeholder="Enter your Email" className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400" />
                        </div>

                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                             <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                             <input type="tel" defaultValue="+440 123 456 789" className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400" />
                        </div>

                        <button className="px-8 py-3 bg-[#E4E4E7] text-[#71717A] font-medium text-sm rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors mt-4">
                            Book Now
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Column: 1/3 sidebar */}
            <div className="space-y-8">
                 <h3 className="text-lg font-bold text-[#18181B] pb-4 border-b border-gray-100">Event details</h3>
                 
                 {/* Where */}
                 <div className="space-y-4">
                     <h4 className="text-base font-medium text-[#18181B]">Where</h4>
                     <p className="text-sm text-[#52525B] leading-relaxed">
                        {address || "North Ilford Islamic Centre, 97 Kensington Gardens, Ilford, Essex IG1 3EN"}
                     </p>
                     
                     {/* Map Placeholder */}
                     <div className="w-full h-[180px] bg-[#E4E4E7] rounded-xl mb-4"></div>

                     <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-[#3F3F46] text-white text-xs font-medium rounded-lg hover:bg-black transition-colors">
                            View on Map
                        </button>
                         <button className="flex-1 py-2.5 bg-[#006FEE] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            Get Directions
                        </button>
                     </div>
                 </div>

                 {/* When */}
                 <div className="space-y-4">
                     <h4 className="text-base font-medium text-[#18181B]">When</h4>
                     <div className="space-y-2 text-sm text-[#52525B]">
                        <p><span className="font-semibold text-[#18181B]">Start:</span> {formatDate(startDate)} at {formatTime(startDate)}</p>
                        <p><span className="font-semibold text-[#18181B]">End:</span> {formatDate(endDate)} at {formatTime(endDate)}</p>
                     </div>
                     <button className="w-full py-2.5 bg-[#006FEE] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Add to calendar
                     </button>
                 </div>

                 {/* Donation */}
                 <div className="pt-4">
                     <MediaDonationSidebar 
                        donationSettings={config?.requestForm /* Reuse random config for now or empty */} 
                        className="!p-0 !shadow-none ring-0 border-none"
                     />
                 </div>
            </div>
        </div>

        {/* Upcoming Events */}
        {relatedEvents && relatedEvents.length > 0 && (
            <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#18181B]">Upcoming events</h2>
                    <div className="flex gap-2">
                         <button className="w-10 h-10 rounded-full bg-[#E4E4E7] flex items-center justify-center hover:bg-gray-300 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                         <button className="w-10 h-10 rounded-full bg-[#006FEE] flex items-center justify-center hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} layout="grid" />
                    ))}
                </div>
            </div>
        )}

        {/* Quote */}
        {config?.bottomQuote?.enableSection && (
             <div className="mt-24">
                <QuoteSection 
                    quote={config.bottomQuote.quoteText}
                    attribution={config.bottomQuote.author}
                    shareButtonText={config.bottomQuote.shareButtonText}
                    donateButtonText={config.bottomQuote.donateButtonText}
                    donateButtonUrl={config.bottomQuote.donateButtonUrl}
                    backgroundColor="#F4F4F5"
                />
            </div>
        )}

      </div>
    </div>
  );
}
