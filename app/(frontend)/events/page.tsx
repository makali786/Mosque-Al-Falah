import EventsFeed from "../components/events/EventsFeed";
import { QuoteSection } from "../components/common/QuoteSection";
import { fetchEvents, fetchGlobal } from "@lib/fetcher";


export default async function EventsPage() {

    const eventPage = await fetchGlobal({ slug: "events-page" });
    const eventData = await fetchEvents ({ limit: 12, depth: 1, where: { isPublished: { equals: true } }, sort: '-publishedDate' });

    return (
        <div className="bg-white min-h-screen">
            <EventsFeed 
                initialEvents={eventData && eventData.length > 0 ? eventData : []}
                pageData={{ ...eventPage, gridSettings: { ...eventPage.gridSettings, eventsPerPage: 3 } }}
            />
            
            {eventPage.bottomQuote?.enableSection && (
                <QuoteSection 
                    quote={eventPage.bottomQuote.quoteText}
                    attribution={eventPage.bottomQuote.author}
                    shareButtonText={eventPage.bottomQuote.shareButtonText}
                    donateButtonText={eventPage.bottomQuote.donateButtonText}
                    donateButtonUrl={eventPage.bottomQuote.donateButtonUrl}
                    backgroundColor="#f4f4f5"
                />
            )}
        </div>
    );
}
