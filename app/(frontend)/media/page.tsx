import MediaFeed from "../components/media/MediaFeed";
import { QuoteSection } from "../components/common/QuoteSection";
import { MediaItem } from "../components/media/MediaCard";
import { fetchMediaItems } from "@lib/fetcher";

// Hardcoded Config as per User Request
const mediaPageConfig = {
  pageHeader: {
    pageTitle: "Media",
    breadcrumb: "Home > Media",
    showBreadcrumb: true
  },
  filterTabs: {
    showAllTab: true,
    allTabLabel: "All",
    showVideosTab: true,
    videosTabLabel: "Videos",
    showPhotoGalleryTab: true,
    photoGalleryTabLabel: "Photo Gallery",
    showAudioPodcastTab: true,
    audioPodcastTabLabel: "Audio/Podcast"
  },
  viewOptions: {
    showViewToggle: true,
    defaultView: "grid",
    listViewLabel: "List",
    gridViewLabel: "Grid",
    showSearch: true,
    searchPlaceholder: "Search"
  },
  gridSettings: {
    gridColumns: "3",
    itemsPerPage: 6,
    showLoadMore: true,
    loadMoreButtonText: "Load More"
  },
  bottomQuote: {
    enableSection: true,
    quoteText: "Whoever guides someone to goodness will have a reward like the one who did it.",
    author: "Prophet Muhammad ﷺ",
    showShareButton: true,
    shareButtonText: "Share this page",
    showDonateButton: true,
    donateButtonText: "Donate Now",
    donateButtonUrl: "/appeals"
  },
  emptyStates: {
    noMediaMessage: "No media items available at this time.",
    noSearchResults: "No media found. Try adjusting your search or filters."
  }
};

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
          backgroundColor="#f4f4f5"
        />
      )}
    </div>
  );
}
