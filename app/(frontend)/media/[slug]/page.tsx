
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchMediaItems } from "@lib/fetcher";
import MediaCard, { MediaItem } from "../../components/media/MediaCard";
import MediaCarousel from "../../components/media/MediaCarousel";
import { QuoteSection } from "../../components/common/QuoteSection";
import MediaDonationSidebar from "../../components/media/MediaDonationSidebar";
import BreadcrumbSearchSection from "../../components/common/BreadcrumbSearchSection";

interface MediaDetailPageProps {
  params: {
    slug: string;
  };
}



export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = await params;

  // 1. Fetch Request for specific slug
  const mediaItems = await fetchMediaItems({
    where: {
      slug: { equals: decodedSlug(slug) }, // Helper to decode URL encoded slug if needed
    },
    limit: 1,
  });

  if (!mediaItems || mediaItems.length === 0) {
    notFound();
  }

  const mediaItem = mediaItems[0];
  const { title, description, mediaType, mediaContent, thumbnail, publishedDate, donationSettings } = mediaItem;

  // 2. Fetch Related Media (random or latest excluding current)
  const relatedItemsRaw = await fetchMediaItems({
    limit: 4, // 3 items for the grid + buffer
    where: {
      id: { not_equals: mediaItem.id },
      isActive: { equals: true }
    },
    sort: "-publishedDate" 
  });

  // Map related items to MediaCard props
  const relatedMedia: MediaItem[] = relatedItemsRaw.slice(0, 3).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.thumbnail?.url || "/assets/ayat/background.png",
    type: item.mediaType || "",
    date: item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : "",
    slug: item.slug,
  }));


  // Video Source handling
  const videoSrc = mediaContent?.videoFile?.url;
  const isVideo = mediaType === 'video' || (mediaType === 'audio_podcast');
  
  return (
    <div className="bg-white min-h-screen">
      
      <div>
        
        {/* Breadcrumb */}

        <BreadcrumbSearchSection
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Media", href: "/media" },
            { label: title, href: "#" }
          ]}
          showSearch={false}
          className="my-8 section-padding"
          breadcrumbsItemsStyle="flex-wrap"
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-11 section-padding">
            
            {/* Left Column: Media Player & Content */}
          <div className="xl:col-span-2">
                
                {/* Title (Mobile/Top) */}
            <h1 className="text-2xl md:text-3xl font-semibold mb-6">{title}</h1>

                {/* Media Player Container */}
            <div className="relative w-full aspect-video bg-black rounded-[14px] overflow-hidden mb-8 group  lg:max-w-[735px] lg:max-h-[412px]">
                    {isVideo && videoSrc ? (
                         <video 
                            controls 
                            className="w-full h-full object-contain"
                            poster={thumbnail?.url}
                            preload="metadata"
                         >
                            <source src={videoSrc} type={mediaContent?.videoFile?.mimeType || "video/mp4"} />
                            Your browser does not support the video tag.
                         </video>
                    ) : (
                        /* Fallback or other media types like Gallery placeholder */
                        <div className="relative w-full h-full">
                           {thumbnail?.url && (
                               <Image 
                                src={thumbnail.url} 
                                alt={title} 
                                fill 
                                className="object-cover"
                               />
                           )}
                           <div className="absolute inset-0 flex items-center justify-center">
                                {/* If audio/podcast but no video */}
                                {mediaType === 'podcast' || mediaType === 'audio' ? (
                                     <div className="bg-white/90 px-6 py-4 rounded-full flex items-center gap-3">
                                         <Image src="/assets/common/podcast-icon.svg" width={24} height={24} alt="Audio" />
                                         <span className="font-medium">Listen to Audio</span>
                                     </div>
                                ) : null}
                           </div>
                        </div>
                    )}

                    {/* Live Badge */}
                    {mediaContent?.isLive && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 z-10">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Live</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="prose prose-lg text-gray-600 max-w-none">
                    <p>{description}</p>
                </div>

            </div>

            {/* Right Column: Donation Sidebar */}
          <div className="xl:col-span-1">
            <MediaDonationSidebar donationSettings={donationSettings} />
            </div>

        </div>

        {/* Related Media Section */}
        <section className="my-12 section-padding">
          <div>
               <MediaCarousel 
                  items={relatedMedia}
                  title="Related Media"
               />
             </div>
        </section>

      </div>

      {/* Quote Section */}
      <QuoteSection 
          quote="Whoever guides someone to goodness will have a reward like the one who did it."
          attribution="Prophet Muhammad ﷺ"
          shareButtonText="Share this page"
          donateButtonText="Donate Now"
          donateButtonUrl="/appeals"
          backgroundColor="#F4F4F5"
      />

    </div>
  );
}

// Simple Helper for decoding slug if necessary
function decodedSlug(slug: string) {
    try {
        return decodeURIComponent(slug);
    } catch {
        return slug;
    }
}
