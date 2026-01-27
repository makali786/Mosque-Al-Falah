
import { fetchMediaItems, fetchGlobal } from "@lib/fetcher";
import Image from "next/image";
import { notFound } from "next/navigation";
import BreadcrumbSearchSection from "../../components/common/BreadcrumbSearchSection";
import { QuoteSection } from "../../components/common/QuoteSection";
import { MediaItem } from "../../components/media/MediaCard";
import MediaCarousel from "../../components/media/MediaCarousel";
import MediaDonationSidebar from "../../components/media/MediaDonationSidebar";
import GalleryCarousel from "../../components/common/GalleryCarousel";

interface MediaDetailPageProps {
  params: {
    slug: string;
  };
}



export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = await params;

  // Fetch dynamic configuration from Payload global
  const mediaPageConfig: any = await fetchGlobal({
    slug: 'media-page',
    depth: 1,
  });

  // 1. Fetch Request for specific slug
  const mediaItems = await fetchMediaItems({
    where: {
      slug: { equals: decodedSlug(slug) },
    },
    limit: 1,
  });

  if (!mediaItems || mediaItems.length === 0) {
    notFound();
  }

  const mediaItem = mediaItems[0];
  const { title, description, mediaType, mediaContent, thumbnail, publishedDate, donationSettings, category } = mediaItem;

  // Strategy: Prioritize items from the same category, then fallback to recent
  let relatedItemsRaw = [];

  // 1. Try to fetch strictly by category first
  if (category) {
    relatedItemsRaw = await fetchMediaItems({
      where: {
        id: { not_equals: mediaItem.id },
        isActive: { equals: true },
        category: { equals: category }
      },
      sort: "-publishedDate"
    });
  }

  // 2. If we don't have enough items (need 3), backfill with general recent items
  if (relatedItemsRaw.length < 3) {
    const generalRecentItems = await fetchMediaItems({
      where: {
        id: { not_equals: mediaItem.id },
        isActive: { equals: true }
      },
      sort: "-publishedDate"
    });

    // Merge and Deduplicate
    const currentIds = new Set(relatedItemsRaw.map((i: any) => i.id));

    for (const item of generalRecentItems) {
      if (!currentIds.has(item.id)) {
        relatedItemsRaw.push(item);
        currentIds.add(item.id);
      }
    }
  }

  // Map related items to MediaCard props
  const relatedMedia: MediaItem[] = relatedItemsRaw.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.thumbnail?.url || "",
    type: item.mediaType || "",
    date: item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : "",
    slug: item.slug,
  }));


  // Video Source handling
  const videoSrc = mediaContent?.videoUrl;
  const isVideo = mediaType === 'video' || (mediaType === 'audio_podcast');

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

  const embedUrl = getEmbedUrl(videoSrc || "");

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
            {mediaType === 'gallery' || mediaType === 'gallery_slider' ? (
              <div className="mb-8 lg:max-w-[735px]">
                <GalleryCarousel
                  images={mediaContent?.galleryImages?.map((item: any) => item.image?.url).filter(Boolean) || []}
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-black rounded-[14px] overflow-hidden mb-8 group lg:max-w-[735px] lg:max-h-[412px]">
                {embedUrl && isVideo ? (
                  <iframe
                    src={embedUrl}
                    title={title || ""}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  ""
                )}

                {/* Live Badge */}
                {mediaContent?.isLive && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 z-10">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Live</span>
                  </div>
                )}
              </div>
            )}

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
        quote={mediaPageConfig.bottomQuote.quoteText || ""}
        attribution={mediaPageConfig.bottomQuote.author || ""}
        shareButtonText={mediaPageConfig.bottomQuote.shareButtonText || ""}
        donateButtonText={mediaPageConfig.bottomQuote.donateButtonText || ""}
        donateButtonUrl={mediaPageConfig.bottomQuote.donateButtonUrl || ""}
        shareData={{
          title: `${title} - Masjid Al-Falah`,
          text: description || "Check out this media from Masjid Al-Falah",
          url: typeof window !== 'undefined' ? window.location.href : `/media/${slug}`
        }}
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
