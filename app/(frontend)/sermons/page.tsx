
import SermonsFeed from "../components/sermons/SermonsFeed";
import { QuoteSection } from "../components/common/QuoteSection";
import { fetchGlobal, fetchSermons } from "@lib/fetcher";
import { getMediaUrl } from "@lib/helper";

export const revalidate = 60;


// Helper to define loosely what we expect from the unchecked global/collection fetch
interface SermonsPageData {
  viewOptions: {
    defaultView: string;
    listViewLabel: string;
    gridViewLabel: string;
    showSearch: boolean;
    searchPlaceholder: string;
  };
  gridSettings: {
    itemsPerPage: number;
    loadMoreButtonText: string;
  };
  bottomQuote: {
    enableSection: boolean;
    quoteText: string;
    author: string;
    shareButtonText: string;
    donateButtonText: string;
    donateButtonUrl: string;
  };
  emptyStates: {
    noSermonsMessage: string;
  };
}

export default async function SermonsPage() {
  const sermonsPageData = (await fetchGlobal({ slug: "sermons-page" })) as SermonsPageData;
  const sermonsData = await fetchSermons({ sort: "_order", limit: 1000 });

  // Map sermons to SermonCard format
  const mappedSermons = sermonsData.map((sermon: any) => {
    // Determine author details (Speaker > Guest Speaker)
    const speakerName = sermon.speaker?.name || sermon.guestSpeaker?.name || "Unknown Author";
    const speakerRole = sermon.speaker?.title || sermon.guestSpeaker?.title || "";
    // speaker.image might be a Media object or ID. getMediaUrl handles Media object.
    let speakerAvatar = undefined;
    if (sermon.speaker?.image) {
      speakerAvatar = getMediaUrl(sermon.speaker.image) || undefined;
    } else if (sermon.guestSpeaker?.avatar) {
      const gsAvatar = sermon.guestSpeaker.avatar;
      speakerAvatar = typeof gsAvatar === 'string'
        ? gsAvatar
        : getMediaUrl(gsAvatar) || undefined;
    }

    return {
      id: sermon.id,
      image: getMediaUrl(sermon.image),
      sermonDate: sermon.sermonDate,
      title: sermon.title,
      author: {
        name: speakerName,
        role: speakerRole,
        avatar: speakerAvatar,
        initials: speakerName.substring(0, 2).toUpperCase()
      },
      videoUrl: sermon.videoUrl,
      description: sermon.description,
      slug: sermon.slug
    };
  });

  return (
    <div className="bg-white min-h-screen">
      <SermonsFeed
        initialSermons={mappedSermons}
        viewOptions={sermonsPageData.viewOptions}
        loadMoreText={sermonsPageData.gridSettings?.loadMoreButtonText}
        emptyStateMessage={sermonsPageData.emptyStates?.noSermonsMessage}
      />

      {sermonsPageData.bottomQuote?.enableSection && (
        <QuoteSection
          quote={sermonsPageData.bottomQuote.quoteText}
          attribution={sermonsPageData.bottomQuote.author}
          shareButtonText={sermonsPageData.bottomQuote.shareButtonText}
          donateButtonText={sermonsPageData.bottomQuote.donateButtonText}
          donateButtonUrl={sermonsPageData.bottomQuote.donateButtonUrl}
          backgroundColor="#f4f4f5"
        />
      )}
    </div>
  );
}
