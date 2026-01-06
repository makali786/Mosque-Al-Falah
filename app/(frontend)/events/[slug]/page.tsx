
import { notFound } from "next/navigation";
import { fetchGlobal, fetchEvents } from "@lib/fetcher";
import EventDetailClient from "../../components/events/EventDetailClient";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  // Fetch event data
  let eventData = null;
  try {
    const events = await fetchEvents({
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    });
    eventData = events[0];
  } catch (error) {
    console.error("Error fetching event:", error);
  }

  if (!eventData) {
    // Fallback: fetch by ID
     try {
         const events = await fetchEvents({
             where: {
                 id: { equals: slug }
             },
             limit: 1
         });
         eventData = events[0];
     } catch(e) {}
  }

  if (!eventData) {
    notFound();
  }

  // Fetch Global Config
  const eventPageConfig = await fetchGlobal({ slug: "events-page" });

  // Fetch Related/Upcoming Events (exclude current)
  const relatedEvents = await fetchEvents({
      limit: 3,
      sort: "timing.startDate",
      where: {
          id: { not_equals: eventData.id },
          "timing.startDate": { greater_than: new Date().toISOString() }
      }
  });


  return (
    <EventDetailClient 
        event={eventData} 
        config={eventPageConfig} 
        relatedEvents={relatedEvents}
    />
  );
}
