
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
  const decodedSlug = decodeURIComponent(slug);

  // Fetch event data by slug
  let eventData = null;
  try {
    const events = await fetchEvents({
      where: {
        slug: { equals: decodedSlug },
      },
      limit: 1,
      depth: 2,
    });
    eventData = events[0];
  } catch (error) {
    console.error("Error fetching event by slug:", error);
  }

  // Fallback: Try fetching by ID if slug lookup fails
  if (!eventData) {
    try {
      const events = await fetchEvents({
        where: {
          id: { equals: decodedSlug }
        },
        limit: 1,
        depth: 2,
      });
      eventData = events[0];
    } catch (error) {
      console.error("Error fetching event by ID:", error);
    }
  }

  if (!eventData) {
    notFound();
  }

  // Fetch Global Config
  const eventPageConfig = await fetchGlobal({ slug: "events-page" });

  // Fetch Related/Upcoming Events (exclude current)
  const relatedEvents = await fetchEvents({
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
