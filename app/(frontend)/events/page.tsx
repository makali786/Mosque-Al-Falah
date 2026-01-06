import EventsFeed from "../components/events/EventsFeed";
import { QuoteSection } from "../components/common/QuoteSection";
import { fetchEvents, fetchGlobal } from "@lib/fetcher";

// Mock Data based on User Request
const EVENTS_PAGE_DATA = {
    pageHeader: {
        pageTitle: "Events/Lectures",
        breadcrumb: "Home > Events/Lectures",
        showBreadcrumb: true
    },
    filterOptions: {
        enableUpcomingTab: true,
        upcomingTabLabel: "Upcoming",
        enableArchivedTab: true,
        archivedTabLabel: "Archived",
        enableSpeakerFilter: true,
        speakerFilterLabel: "All Speakers",
        enableCategoryFilter: true,
        categoryFilterLabel: "Category",
        enableCalendarView: true,
        calendarViewLabel: "Calendar"
    },
    viewOptions: {
        showViewToggle: true,
        defaultView: "grid",
        listViewLabel: "List",
        gridViewLabel: "Grid"
    },
    gridSettings: {
        gridColumns: "3",
        eventsPerPage: 6,
        showLoadMore: true,
        loadMoreButtonText: "Load More"
    },
    cardAppearance: {
        showEventImage: true,
        showEventDate: true,
        showPlatformIcons: true,
        showLiveNowBadge: true,
        cardStyle: "standard",
        hoverEffect: "scale"
    },
    defaultSettings: {
        defaultTab: "upcoming",
        sortBy: "date-asc",
        showFeaturedFirst: true
    },
    requestForm: {
        formFields: {
            fullNameLabel: "Full Name *",
            fullNamePlaceholder: "Yousif Hasan",
            emailLabel: "Email *",
            emailPlaceholder: "Enter your Email",
            phoneLabel: "Phone Number",
            phonePlaceholder: "+440 123 456 789",
            commentLabel: "Comment",
            commentPlaceholder: "Content",
            submitButtonText: "Submit"
        },
        enableSection: true,
        sectionTitle: "Request an Event/Lecture",
        description: "Connect our Masjid for personalized assistance and discover how we can help you.",
        successMessage: "Thank you for your request! We will contact you soon."
    },
    emptyStates: {
        noUpcomingEvents: "No upcoming events at this time. Check back soon!",
        noArchivedEvents: "No archived events available.",
        noSearchResults: "No events found. Try adjusting your filters."
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
    seo: {}
};

const SAMPLE_EVENT = {
    title: "Quran: A Path to Paradise – an uplifting event for all!",
    slug: "quran-path-to-paradise",
    subtitle: "an uplifting event for all!",
    timing: {
        startDate: "2025-01-26T04:00:00.000Z",
        endDate: "2025-01-26T06:30:00.000Z",
        timezone: "Europe/London"
    },
    platforms: [
        {
            platform: "zoom",
            link: "www.zoom.link",
            id: "6953897030679f79c69de809"
        },
        {
            platform: "emasjid-live",
            link: "eMasjid",
            id: "6953898030679f79c69de80b"
        },
        {
            platform: "youtube-live",
            link: "youtube.com",
            id: "6953898830679f79c69de80d"
        },
        {
            platform: "facebook-live",
            link: "facebook.com",
            id: "6953899130679f79c69de80f"
        }
    ],
    venue: {
        name: "London Muslim Centre, Ground Floor Hall",
        fullAddress: "Masjid Al-Falah, North Ilford Islamic Centre, 97 Kensington Gardens, Ilford, Essex IG1 3EN",
        coordinates: {
            latitude: 51.532096943972604,
            longitude: -0.16351091778825197
        },
        googleMapsLink: "https://www.google.com/maps/place/..."
    },
    speakers: [
        {
            speakerType: "guest",
            guestSpeaker: {
                name: "QARI ADIL YUSUF",
                title: "Islamic speaker",
                photo: {
                    id: "69538a80a9f6515ec7e86436",
                    url: "/api/media/file/span.flex.png"
                }
            },
            id: "69538a2830679f79c69de813"
        }
    ],
    description: { root: { children: [] } }, // Simplified for preview
    media: {
        featuredImage: {
            id: "69538b1da9f6515ec7e86466",
            url: "/api/media/file/b8f03ffe8f65cf6c5159bc06d5d985df9f724e72.png",
             alt: "event-banner"
        },
        videoUrl: "https://youtu.be/7-Qf3g-0xEI",
        isLive: true,
        photos: [],
        audioRecordings: []
    },
    category: "lecture",
    id: "69538c18a9f6515ec7e8649b"
};

// Generate some mock events for the grid
const MOCK_EVENTS = [
    SAMPLE_EVENT,
    {
        ...SAMPLE_EVENT,
        id: "2",
        title: "2 Months Till Ramadan",
        timing: { ...SAMPLE_EVENT.timing, startDate: "2025-01-22T10:30:00.000Z", endDate: "2025-01-22T12:30:00.000Z" },
        media: { ...SAMPLE_EVENT.media, isLive: false }
    },
    {
        ...SAMPLE_EVENT,
        id: "3",
        title: "Jumu'ah Khutbah",
        timing: { ...SAMPLE_EVENT.timing, startDate: "2025-01-17T12:30:00.000Z", endDate: "2025-01-17T13:30:00.000Z" },
        media: { ...SAMPLE_EVENT.media, isLive: false }
    },
    {
        ...SAMPLE_EVENT,
        id: "4",
        title: "Faith, Bees & Sustainability in Action",
        timing: { ...SAMPLE_EVENT.timing, startDate: "2025-01-30T18:00:00.000Z", endDate: "2025-01-30T19:30:00.000Z" },
        media: { ...SAMPLE_EVENT.media, isLive: false }
    },
    {
        ...SAMPLE_EVENT,
        id: "5",
        title: "Journaling Through Ramadan",
        timing: { ...SAMPLE_EVENT.timing, startDate: "2025-02-23T11:00:00.000Z", endDate: "2025-02-23T17:00:00.000Z" },
        media: { ...SAMPLE_EVENT.media, isLive: false }
    }
];

export default async function EventsPage() {

    const eventPage = await fetchGlobal({ slug: "events-page" });
    const eventData = await fetchEvents ({ limit: 12, depth: 1, where: { isPublished: { equals: true } }, sort: '-publishedDate' });

    return (
        <div className="bg-white min-h-screen">
            <EventsFeed 
                initialEvents={eventData as any} 
                pageData={{ ...EVENTS_PAGE_DATA, ...eventPage }}
            />
            
            {eventPage.bottomQuote?.enableSection && (
                <QuoteSection 
                    quote={eventPage.bottomQuote.quoteText}
                    attribution={eventPage.bottomQuote.author}
                    shareButtonText={eventPage.bottomQuote.shareButtonText}
                    donateButtonText={eventPage.bottomQuote.donateButtonText}
                    donateButtonUrl={EVENTS_PAGE_DATA.bottomQuote.donateButtonUrl}
                    backgroundColor="#f4f4f5"
                />
            )}
        </div>
    );
}
