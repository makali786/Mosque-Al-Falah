import EventsFeed from "../components/events/EventsFeed";
import { QuoteSection } from "../components/common/QuoteSection";
import { fetchEvents, fetchGlobal } from "@lib/fetcher";
import { getPayload } from "payload";
import configPromise from "@payload-config";


export default async function EventsPage() {

    const eventPage = await fetchGlobal({ slug: "events-page" });
    const eventData = await fetchEvents({ limit: 12, depth: 1, where: { isPublished: { equals: true } }, sort: '-publishedDate' });

    async function handleEventRequestSubmit(data: any) {
        "use server";
        try {
            const payload = await getPayload({ config: configPromise });

            await payload.create({
                collection: 'event-requests' as any,
                data: {
                    fullName: data.fullName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    comments: data.comments,
                    status: 'pending',
                },
            });
            console.log("Event request submitted successfully");
        } catch (error) {
            console.error("Error submitting event request:", error);
            throw new Error("Failed to submit event request.");
        }
    }

    return (
        <div className="bg-white min-h-screen">
            <EventsFeed
                initialEvents={eventData && eventData.length > 0 ? eventData : []}
                pageData={{ ...eventPage, gridSettings: { ...eventPage.gridSettings, eventsPerPage: 3 } }}
                onSubmit={handleEventRequestSubmit}
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
