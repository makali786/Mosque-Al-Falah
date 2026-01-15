"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "../../../../lib/helper";

interface RelatedPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    publishedDate: string;
    formattedDate: string;
    category: string;
    featuredImage: any;
}

interface RelatedPostsCarouselProps {
    posts: RelatedPost[];
    title: string;
}

export default function RelatedPostsCarousel({
    posts,
    title,
}: RelatedPostsCarouselProps) {
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
    }, [posts]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft +
                (direction === "right" ? scrollAmount : -scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white py-12 md:py-16 lg:py-20">
            <div className="w-full section-padding">
                <div className="max-w-283.5 mx-auto">
                    <div className="flex flex-col gap-6 md:gap-7 lg:gap-9">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-1 md:items-end md:justify-between">
                            <div className="flex flex-col gap-0">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#27272a] text-left">
                                    {title}
                                </h2>
                            </div>
                            <div className="flex items-center justify-end w-full md:w-auto">
                                <div className="flex gap-4 md:gap-6 lg:gap-8 items-center">
                                    <button
                                        onClick={() => scroll("left")}
                                        disabled={!canScrollLeft}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                            canScrollLeft
                                                ? "bg-[#d4d4d8] hover:bg-[#a1a1aa] cursor-pointer"
                                                : "bg-[#d4d4d8] opacity-50 cursor-not-allowed"
                                        }`}
                                        aria-label="Previous posts"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.5 16.6L6.16667 10.2667C5.425 9.525 5.425 8.325 6.16667 7.58333L12.5 1.25" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => scroll("right")}
                                        disabled={!canScrollRight}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                            canScrollRight
                                                ? "bg-[rgba(0,111,238,0.2)] hover:bg-[rgba(0,111,238,0.3)] cursor-pointer"
                                                : "bg-[rgba(0,111,238,0.2)] opacity-50 cursor-not-allowed"
                                        }`}
                                        aria-label="Next posts"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.5 16.6L13.8333 10.2667C14.575 9.525 14.575 8.325 13.8333 7.58333L7.5 1.25" stroke="#006FEE" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Carousel Container */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {posts.map((related) => {
                                const relatedImageUrl = getMediaUrl(related.featuredImage);
                                return (
                                    <Link
                                        key={related.id}
                                        href={`/blogs/${related.slug}`}
                                        className="flex flex-col gap-6 hover:opacity-90 transition-opacity shrink-0 w-full md:w-87.5 lg:w-[calc((100%-64px)/3)]"
                                    >
                                        {/* Image */}
                                        <div className="relative w-full aspect-406/241 rounded-[14px] overflow-hidden">
                                            {relatedImageUrl && (
                                                <Image
                                                    src={relatedImageUrl}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                            {/* Category Badge */}
                                            <div className="absolute left-4 top-5 bg-[#002e62] px-4 py-1 rounded-full">
                                                <p className="text-[14px] font-semibold leading-5 text-white uppercase">
                                                    {related.category || "GENERAL"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col gap-5 w-full">
                                            <div className="flex flex-col gap-3 w-full">
                                                {/* Date */}
                                                <div className="flex gap-2 items-center">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.33333 1.33334V3.33334" stroke="#71717A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M10.6667 1.33334V3.33334" stroke="#71717A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M2.33333 6.06H13.6667" stroke="#71717A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M14 5.66667V11.3333C14 13.3333 13 14.6667 10.6667 14.6667H5.33333C3 14.6667 2 13.3333 2 11.3333V5.66667C2 3.66667 3 2.33334 5.33333 2.33334H10.6667C13 2.33334 14 3.66667 14 5.66667Z" stroke="#71717A" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M10.4637 9.13333H10.4697" fill="#71717A"/>
                                                        <path d="M10.4637 11.1333H10.4697" fill="#71717A"/>
                                                        <path d="M7.9973 9.13333H8.0033" fill="#71717A"/>
                                                        <path d="M7.9973 11.1333H8.0033" fill="#71717A"/>
                                                        <path d="M5.52966 9.13333H5.53565" fill="#71717A"/>
                                                        <path d="M5.52966 11.1333H5.53565" fill="#71717A"/>
                                                    </svg>
                                                    <p className="text-[14px] font-normal leading-5 text-[#27272a]">
                                                        {related.formattedDate}
                                                    </p>
                                                </div>

                                                {/* Title */}
                                                <div className="flex flex-col w-full">
                                                    <h3 className="text-[24px] font-semibold leading-8 text-black h-16 line-clamp-2 w-full">
                                                        {related.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Excerpt */}
                                            <p className="text-[16px] font-normal leading-6 text-black h-12 line-clamp-2 w-full">
                                                {related.excerpt || ""}
                                            </p>

                                            {/* Read More Button */}
                                            <div className="bg-[#fafafa] h-[42px] flex items-center justify-center px-4 rounded-lg w-fit">
                                                <p className="text-[14px] font-normal leading-5 text-black">
                                                    Read More
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
