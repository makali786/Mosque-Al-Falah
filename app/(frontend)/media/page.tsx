import MediaFeed from "../components/media/MediaFeed";
import { QuoteSection } from "../components/common/QuoteSection";
import { MediaItem } from "../components/media/MediaCard";
import { fetchMediaItems, fetchGlobal } from "@lib/fetcher";

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "2-digit",
  }).toUpperCase();
};

export default async function MediaPage() {
  // Fetch dynamic configuration from Payload global
  const mediaPageConfig: any = await fetchGlobal({
    slug: 'media-page',
    depth: 1,
  });

  const fetchedMedia = await fetchMediaItems({
    limit: mediaPageConfig.gridSettings?.itemsPerPage || 12,
    depth: 1,
    where: { isActive: { equals: true } },
    sort: '-publishedDate' 
  });

  const mediaData: MediaItem[] = fetchedMedia.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.thumbnail?.url,
    type: item.mediaType || "video", // Default to video if missing, adjust as needed
    date: formatDate(item.publishedDate),
    slug: item.slug,
    duration: item.mediaContent?.videoDuration,
    videoUrl: item.mediaContent?.videoFile?.url
  }));

  return (
    <div className="bg-white min-h-screen">
      <MediaFeed 
        initialMedia={mediaData}
        viewOptions={mediaPageConfig.viewOptions}
        filterTabs={mediaPageConfig.filterTabs}
        loadMoreText={mediaPageConfig.gridSettings.loadMoreButtonText}
        emptyStateMessage={mediaPageConfig.emptyStates.noMediaMessage}
      />
      
      {mediaPageConfig.bottomQuote.enableSection && (
        <QuoteSection 
          quote={mediaPageConfig.bottomQuote.quoteText}
          attribution={mediaPageConfig.bottomQuote.author}
          shareButtonText={mediaPageConfig.bottomQuote.shareButtonText}
          donateButtonText={mediaPageConfig.bottomQuote.donateButtonText}
          donateButtonUrl={mediaPageConfig.bottomQuote.donateButtonUrl}
          shareData={{
            title: "Media - Masjid Al-Falah",
            text: mediaPageConfig.bottomQuote.quoteText,
            url: typeof window !== 'undefined' ? window.location.href : '/media'
          }}
          backgroundColor="#f4f4f5"
        />
      )}
    </div>
  );
}
