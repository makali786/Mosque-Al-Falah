"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiImage, FiMic, FiUser, FiVideo } from "react-icons/fi";
import { MdOutlineOndemandVideo } from "react-icons/md";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import { QuoteSection } from "../common/QuoteSection";
import { RichTextRenderer } from "../common/RichTextRenderer";
import Separator from "../common/Separator";
import EventCard from "./EventCard";
import Tabs from "../common/Tabs";
import DonorProfileCard from "../donate/shared/DonorProfileCard";

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



export default function EventDetailClient({ event, config, relatedEvents }: any) {
    const [activeTab, setActiveTab] = useState<"video" | "photos" | "audio">("video");
    const [donationAmount, setDonationAmount] = useState<number | string | null>(null);
    const [guestCount, setGuestCount] = useState<number>(1);

    // Get donation amounts from event.donation.suggestedAmounts
    const amounts = event?.donation?.suggestedAmounts?.map((item: any) => item.amount) || config?.donationAmounts || [];
    const maxGuests = event?.registration?.maxAttendees || config?.maxGuests || 0;

    // Get donation settings
    const donationTitle = event?.donation?.donationTitle || `Donate to ${event?.venue?.name || "Masjid Al-Falah"}`;
    const donationDescription = event?.donation?.donationDescription || "Support our community services and events. Your contribution makes a difference.";

    // Carousel Logic
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScroll);
            window.addEventListener("resize", checkScroll);
            return () => {
                scrollContainer.removeEventListener("scroll", checkScroll);
                window.removeEventListener("resize", checkScroll);
            };
        }
    }, [relatedEvents]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

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

    // Helper function to convert YouTube and Vimeo URLs to embed format
    const getEmbedUrl = (url: string) => {
        if (!url) return "";

        // If already an embed URL, return as is
        if (url.includes("/embed/")) return url;

        // Convert youtube.com/watch?v= or youtu.be/ to embed format
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        const youtubeMatch = url.match(youtubeRegex);

        if (youtubeMatch && youtubeMatch[1]) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Convert vimeo.com/video/ID to player.vimeo.com/video/ID format
        const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
        const vimeoMatch = url.match(vimeoRegex);

        if (vimeoMatch && vimeoMatch[1]) {
            const videoId = vimeoMatch[1];
            const hash = vimeoMatch[2];
            return hash
                ? `https://player.vimeo.com/video/${videoId}?h=${hash}`
                : `https://player.vimeo.com/video/${videoId}`;
        }

        // Return original URL for other platforms
        return url;
    };

    const embedUrl = getEmbedUrl(videoUrl);

    // Format Helpers for Display
    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;

    const dateFormatted = sDate?.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
    // Use unique formatting for time to match EventCard exactly
    const formatTimeHelper = (d: Date) => d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const timeRange = sDate && eDate ? `${formatTimeHelper(sDate)} - ${formatTimeHelper(eDate)}` : "";

    // Breadcrumbs
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Events/Lectures", href: "/events" },
        { label: title, href: "#" }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Breadcrumbs */}
            <BreadcrumbSearchSection
                breadcrumbs={breadcrumbs}
                className="section-padding py-12"
                showSearch={false}
                breadcrumbsItemsStyle={"flex-wrap"}
            />

            <div className="section-padding pb-12 sm:pb-20">

                {/* 2. Header Hero */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Left: Featured Image */}
                    <div className="w-full lg:max-w-100 xl:max-w-100 shrink-0">
                        <div className="relative aspect-4/5 w-full overflow-hidden lg:max-w-100 lg:max-h-100">
                            <Image
                                src={featuredImage}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1 flex flex-col justify-start pt-2">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            {title}
                        </h1>
                        {/* {subtitle && <p className="text-lg text-gray-600 mb-4">{subtitle}</p>} */}

                        <div className="flex items-center gap-1.5 text-sm text-[#71717A] mb-3">
                            <span>{dateFormatted}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]"></span>
                            <span>{timeRange}</span>
                        </div>

                        {/* Platforms */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[#A1A1AA] text-xs">Platform:</span>
                            <div className="flex flex-wrap items-center gap-3">
                                {event?.platforms?.map((p: any, i: number) => {
                                    let iconSrc = "";
                                    let label = p.platform;

                                    if (p.platform.includes('zoom')) {
                                        iconSrc = "/assets/common/zoom-logo.svg";
                                        label = "Zoom";
                                    } else if (p.platform.includes('youtube')) {
                                        iconSrc = "/assets/common/youtube-icon.svg";
                                        label = "Youtube Live";
                                    } else if (p.platform.includes('facebook')) {
                                        iconSrc = "/assets/common/facebook-icon.svg";
                                        label = "Facebook Live";
                                    } else if (p.platform.includes('emasjid')) {
                                        iconSrc = "/assets/common/qibla.svg";
                                        label = "Emasjid Live";
                                    } else if (p.platform.includes('person')) {
                                        iconSrc = "/assets/common/people-icon.svg";
                                        label = "In-person";
                                    }

                                    return (
                                        <div key={i} className="flex items-center gap-1.5">
                                            {iconSrc ? (
                                                <Image src={iconSrc} alt={label} width={18} height={18} />
                                            ) : (
                                                p.platform.includes('live') && <MdOutlineOndemandVideo className="text-red-500 w-4.5 h-4.5" />
                                            )}
                                            <span className="text-[#52525B] text-sm capitalize hidden sm:block">{label.replace('-', ' ')}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator />

                        {/* Speaker */}
                        {speaker?.name && (
                            <div className="mb-4 mt-4">
                                <span className="text-xs text-[#A1A1AA] block mb-4">Speaker</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                        {speaker.photo?.url ? (
                                            <Image src={speaker.photo.url} alt={speaker.name} fill className="object-cover" />
                                        ) : (
                                            <FiUser className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-[#11181C] uppercase">{speaker.name}</h3>
                                        <p className="text-xs text-[#A1A1AA]">{speaker.title || ""}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Venue */}
                        <div className="mb-8">
                            <div className="flex items-center gap-1 text-sm text-[#A1A1AA] mb-1">
                                <Image src="/assets/common/map-pin-fill.svg" alt="Venue" width={16} height={16} /> <span className="text-sm">Venue</span>
                            </div>
                            <p className="text-base">{venue}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-auto">
                            <button className="px-6 py-3 bg-[#3F3F46] text-white rounded-lg text-base cursor-pointer">
                                Add to calendar
                            </button>
                            <button className="px-6 py-3 bg-[#006FEE] text-white rounded-lg text-base cursor-pointer">
                                Register your interest
                            </button>
                        </div>
                    </div>
                </div>
                <Separator className="my-12" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 space-y-12">
                    {/* Left Column: 2/3 */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Media Tabs & Player */}
                        <div className="space-y-6">
                            {/* Tabs */}
                            <Tabs
                                tabs={[
                                    { id: "video", label: "Video" },
                                    { id: "photos", label: "Photos" },
                                    { id: "audio", label: "Audio" }
                                ]}
                                activeTab={activeTab}
                                onChange={(tabId) => setActiveTab(tabId as any)}
                                variant="pills"
                                size="md"
                                className="w-full sm:w-fit overflow-x-auto scrollbar-hide"
                            />

                            {/* Content */}
                            <div className="relative aspect-video w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                {activeTab === "video" && (
                                    embedUrl ? (
                                        <div className="w-full h-full flex items-center justify-center relative bg-black group">
                                            <iframe
                                                src={embedUrl}
                                                title={title || "Video player"}
                                                className="w-full h-full lg:max-w-183.75 lg:h-103"
                                                frameBorder="0"
                                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            />
                                            {event?.media?.isLive && (
                                                <div className="absolute top-4 right-4 bg-[#FAFAFA] backdrop-blur px-2.5 py-1 rounded-md flex items-center gap-1.5 text-sm text-[#11181C] z-10 pointer-events-none">
                                                    <span className="w-2 h-2 rounded-full bg-[#F31260]" />
                                                    Live
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                            <div className="text-center">
                                                <FiVideo className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No video available</p>
                                                </div>
                                            </div>
                                        )
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
                                <p className="text-gray-500 italic">No description available for this event.</p>
                            )}
                        </div>

                        {/* Booking Form */}
                        <div>
                            <h3 className="text-[24px] font-semibold mb-8">Book a place</h3>
                            <form className="lg:max-w-183.75 space-y-4 border border-[#E6F1FE] rounded-xl px-3 py-6 sm:px-6 sm:py-8">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
                                        <label className="text-xs font-normal text-[#52525B]">Full Name <span className="text-[#EF4444]">*</span></label>
                                        <input type="text" placeholder="Enter your full name" className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none bg-transparent" />
                                    </div>
                                    <div className="w-full sm:w-45 bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit flex items-center justify-between cursor-pointer relative">
                                        <select
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(Number(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
                                        >
                                            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                                                <option key={num} value={num}>
                                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                                </option>
                                            ))}
                                        </select>
                                        <div>
                                            <span className="text-xs font-normal text-[#52525B] block">Guests</span>
                                            <span className="text-sm text-[#11181C]">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
                                        </div>
                                        <svg className="w-4 h-4 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>

                                <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
                                    <label className="text-xs font-normal text-[#52525B]">Email <span className="text-[#EF4444]">*</span></label>
                                    <input type="email" placeholder="Enter your Email" className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none bg-transparent" />
                                </div>

                                <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
                                    <label className="text-xs font-normal text-[#52525B]">Phone Number</label>
                                    <input type="tel" placeholder="Enter your phone number" className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none bg-transparent" />
                                </div>

                                <button className="px-6 py-3 bg-[#D4D4D8] text-sm rounded-xl cursor-pointer">
                                    Book Now
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: 1/3 sidebar */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold pb-3">Event details</h3>
                            <Separator />

                            <div className="space-y-8">
                                {/* Where */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-[#27272A] mt-4">Where</h4>
                                    <p className="text-base text-[#3F3F46]">
                                        {address || ""}
                                    </p>

                                    {/* Map Placeholder */}
                                    <div className="w-full h-49.5 bg-[#E4E4E7] mb-4 relative overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
                                            style={{
                                                backgroundImage: address ? `url('https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=14&size=600x300&sensor=false')` : undefined
                                            }}
                                        />
                                        {!address && <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Map unavailable</div>}
                                    </div>

                                    <div className="flex gap-3">
                                        <a
                                            href={address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-3 px-4 bg-[#3F3F46] text-white text-sm rounded-lg cursor-pointer text-center"
                                        >
                                            View on Map
                                        </a>
                                        <a
                                            href={address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-3 px-4 bg-[#006FEE] text-white text-sm rounded-lg cursor-pointer text-center"
                                        >
                                            Get Directions
                                        </a>
                                    </div>
                                </div>

                                {/* When */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-[#27272A]">When</h4>
                                    <div className="space-y-4 text-sm text-[#3F3F46]">
                                        <p><span className="font-semibold">Start:</span> {formatDate(startDate)} at {formatTime(startDate)}</p>
                                        <p><span className="font-semibold">End:</span> {formatDate(endDate)} at {formatTime(endDate)}</p>
                                    </div>
                                    <button className="w-fit py-3 px-4 bg-[#006FEE] text-white text-sm font-medium rounded-lg cursor-pointer">
                                        Add to calendar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Donate Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{donationTitle}</h3>
                                <p className="text-sm text-[#3F3F46] mb-3">{donationDescription}</p>
                                <Separator />
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs font-medium text-[#52525B]">Amount:</span>
                                <div className="flex gap-3 flex-wrap mt-3">
                                    {amounts.map((amount: number) => (
                                        <button
                                            key={amount}
                                            onClick={() => setDonationAmount(amount)}
                                            className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                                                donationAmount === amount
                                                ? "bg-black text-white"
                                                : "bg-[#E4E4E7] text-black hover:bg-gray-300"
                                            }`}
                                        >
                                            £{amount}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setDonationAmount("Other")}
                                        className={`w-auto px-3.5 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                                            donationAmount === "Other"
                                            ? "bg-black text-white"
                                            : "bg-[#E4E4E7] text-black hover:bg-gray-300"
                                        }`}
                                    >
                                        Other
                                    </button>
                                </div>
                            </div>

                            {/* Privacy / Profile */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-[#52525B]">Your donation will appear as:</span>
                                <div className="mt-3">
                                    <DonorProfileCard
                                        donationAmount={typeof donationAmount === 'number' ? donationAmount : 35}
                                        showAmount={true}
                                        variant="default"
                                    />
                                </div>
                            </div>

                            {/* Donate Button */}
                            <Link
                                href={`/donate${typeof donationAmount === 'number' ? `?amount=${donationAmount}` : ''}`}
                                className="block w-fit py-3 px-4 bg-[#006FEE] hover:bg-[#005bc4] text-white text-center font-medium rounded-lg text-sm transition-colors"
                            >
                                Donate
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                {relatedEvents && relatedEvents.length > 0 && (
                    <div className="mt-12">
                        <div className="flex justify-between mb-8 flex-wrap gap-3 lg:gap-0 lg:flex-nowrap lg:min-h-23">
                            <h2 className="text-2xl sm:text-4xl font-bold text-[#27272A]">Upcoming events</h2>
                            <div className="flex gap-12 self-end">
                                <button
                                    onClick={() => scroll("left")}
                                    disabled={!canScrollLeft}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${canScrollLeft ? "bg-[#E4E4E7] hover:bg-gray-300 cursor-pointer" : "bg-[#F4F4F5] opacity-50 cursor-not-allowed"}`}
                                >
                                    <Image src="/assets/sermons/arrow-left.svg" alt="Previous" width={20} height={20} />
                                </button>
                                <button
                                    onClick={() => scroll("right")}
                                    disabled={!canScrollRight}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${canScrollRight ? "bg-[#006FEE] hover:bg-blue-700 cursor-pointer" : "bg-[#006FEE] opacity-50 cursor-not-allowed"}`}
                                >
                                    <Image src="/assets/sermons/arrow-right.svg" alt="Next" width={20} height={20} className="brightness-0 invert" />
                                </button>
                            </div>
                        </div>
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto gap-8 scrollbar-hide pb-4"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {relatedEvents.map((event: any) => (
                                <div key={event.id} className="min-w-75 md:min-w-87.5 lg:min-w-89.25 shrink-0">
                                    <EventCard event={event} layout="grid" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

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
    );
}
