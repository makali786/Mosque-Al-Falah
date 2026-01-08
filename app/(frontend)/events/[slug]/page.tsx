
import { notFound } from "next/navigation";
import { fetchGlobal, fetchEvents } from "@lib/fetcher";
import EventDetailClient from "../../components/events/EventDetailClient";

interface EventPageProps {
  params: {
    slug: string;
  };
}

const SAMPLE_EVENT = {
  title: "Quran: A Path to Paradise – an uplifting event for all!",
  slug: "quran-path-to-paradise",
  subtitle: "an uplifting event for all!",
  timing: {
    startDate: "2026-01-26T04:00:00.000Z",
    endDate: "2026-01-26T06:30:00.000Z",
    timezone: "Europe/London"
  },
  platforms: [
    { platform: "zoom", link: "www.zoom.link", id: "6953897030679f79c69de809" },
    { platform: "emasjid-live", link: "eMasjid", id: "6953898030679f79c69de80b" },
    { platform: "youtube-live", link: "youtube.com", id: "6953898830679f79c69de80d" },
    { platform: "facebook-live", link: "facebook.com", id: "6953899130679f79c69de80f" }
  ],
  venue: {
    name: "London Muslim Centre, Ground Floor Hall",
    fullAddress: "Masjid Al-Falah, North Ilford Islamic Centre, 97 Kensington Gardens, Ilford, Essex IG1 3EN",
    coordinates: { latitude: 51.532096943972604, longitude: -0.16351091778825197 },
    googleMapsLink: "https://www.google.com/maps/place/..."
  },
  speakers: [{
    speakerType: "guest",
    guestSpeaker: {
      name: "QARI ADIL YUSUF",
      title: "Islamic speaker",
      photo: { id: "69538a80a9f6515ec7e86436", url: "/api/media/file/span.flex.png" }
    },
    id: "69538a2830679f79c69de813"
  }],
  description: { root: { children: [] } },
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

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch event data
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
    console.error("Error fetching event:", error);
  }

  if (!eventData) {
    // Fallback: fetch by ID
     try {
         const events = await fetchEvents({
             where: {
             id: { equals: decodedSlug }
             },
           limit: 1,
           depth: 2,
         });
         eventData = events[0];
     } catch(e) {}
  }

  // Fallback: Check Mock Data
  if (!eventData && decodedSlug === SAMPLE_EVENT.slug) {
    eventData = SAMPLE_EVENT;
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
