
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchMediaItems } from "@lib/fetcher";
import MediaCard, { MediaItem } from "../../components/media/MediaCard";
import MediaCarousel from "../../components/media/MediaCarousel";
import { QuoteSection } from "../../components/common/QuoteSection";

interface MediaDetailPageProps {
  params: {
    slug: string;
  };
}

// ------------------------------------------------------------------
// Internal Components (Donation Sidebar)
// ------------------------------------------------------------------

const DonationSidebar = ({ donationSettings }: { donationSettings: any }) => {
  const amounts = [10, 20, 50, 100];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-fit sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {donationSettings?.donationTitle || "Donate to Masjid Al Falah"}
      </h3>
      <p className="text-sm text-gray-500 mb-6 line-clamp-2">
        {donationSettings?.donationDescription || "Support our community services and initiatives."}
      </p>

      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Amount:
        </label>
        <div className="flex flex-wrap gap-2">
            {amounts.map((amount) => (
                <button 
                  key={amount}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-black hover:text-white transition-colors"
                >
                    £{amount}
                </button>
            ))}
            <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-black hover:text-white transition-colors">
                Other
            </button>
        </div>
      </div>

      <div className="mb-6">
         <p className="text-xs text-gray-500 mb-2">Your donation will appear as:</p>
         <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div className="text-sm">
                    <p className="font-medium text-gray-900">Anonymous kind soul</p>
                    <p className="text-xs text-gray-400">£35 GBP, a few moments ago</p>
                </div>
            </div>
            <button className="text-xs font-medium text-gray-500 hover:text-black">Edit</button>
         </div>
      </div>

      <a 
        href={donationSettings?.donationUrl || "/appeals"} 
        className="block w-full py-3 px-4 bg-[#006FEE] hover:bg-[#005bc4] text-white text-center font-medium rounded-lg transition-colors"
      >
        Donate
      </a>

    </div>
  );
};


// ------------------------------------------------------------------
// Main Page Component
// ------------------------------------------------------------------

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
    image: item.thumbnail?.url || "/assets/ayat/background.png", // Fallback
    type: item.mediaType || "video",
    date: item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : "",
    slug: item.slug,
  }));


  // Video Source handling
  const videoSrc = mediaContent?.videoFile?.url;
  const isVideo = mediaType === 'video' || (mediaType === 'audio_podcast'); // Handle different potential types
  
  return (
    <div className="bg-white min-h-screen">
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <Link href="/media" className="hover:text-blue-600">Media</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column: Media Player & Content */}
            <div className="lg:col-span-2">
                
                {/* Title (Mobile/Top) */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h1>

                {/* Media Player Container */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-8 group">
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
            <div className="lg:col-span-1">
                <DonationSidebar donationSettings={donationSettings} />
            </div>

        </div>

        {/* Use divider if needed */}
        <div className="w-full h-px bg-gray-200 my-16"></div>

        {/* Related Media Section */}
        <section className="mb-20">
             <div className="-mx-4 sm:mx-0">
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
