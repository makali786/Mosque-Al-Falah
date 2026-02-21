
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGlobal, fetchSermons } from "@lib/fetcher";
import { getMediaUrl } from "@lib/helper";
import { QuoteSection } from "../../components/common/QuoteSection";
import Sermons from "../../components/home/Sermons";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";

interface DetailedSermonPageProps {
  params: {
    slug: string;
  };
}

export default async function SermonDetailPage({ params }: DetailedSermonPageProps) {
  const { slug } = await params;

  // Fetch data
  let sermonsData = null;

  try {
    sermonsData = await fetchSermons({
      where: {
        slug: { equals: slug }
      },
      limit: 1
    });
  } catch (error) {
    console.warn("Error fetching sermon by slug, attempting fallback to ID:", error);
  }

  if (!sermonsData || sermonsData.length === 0) {
    // Fallback: Try fetching by ID
    try {
      sermonsData = await fetchSermons({
        where: {
          id: { equals: slug }
        },
        limit: 1
      });
    } catch (error) {
      console.error("Error fetching sermon by ID:", error);
    }

    if (!sermonsData || sermonsData.length === 0) {
      notFound();
    }
  }

  const sermon = sermonsData[0];

  const relatedSermons = await fetchSermons({
    limit: 10,
    sort: "_order",
    where: {
      id: { not_equals: sermon.id }
    }
  });

  const sermonsPageData = await fetchGlobal({ slug: "sermons-page" });

  // Extract Data
  const title = sermon.title;
  const description = sermon.description;
  const videoUrl = sermon.videoUrl;
  // Main media: video or image
  const mediaUrl = typeof sermon.image === 'string'
    ? sermon.image
    : getMediaUrl(sermon.image);

  // Helper to convert URLs to Embed URLs
  const getEmbedUrl = (url: string | null | undefined) => {
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

  const embedUrl = getEmbedUrl(videoUrl);

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Sermons", href: "/sermons" },
    { label: title, href: "#" } // Current page
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* 1. Header & Breadcrumbs */}
      <div className="section-padding pt-6 sm:pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              )}
              <Link
                href={crumb.href}
                className={`text-sm ${index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "text-blue-600 hover:underline"} whitespace-normal`}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* 2. Main Title Area */}
      <div className="section-padding pt-6 md:pt-[44px]">
        <div className="w-full max-w-[940px] mx-auto text-start sm:text-center flex flex-col items-center pb-6 md:pb-8">
          <h1 className="text-2xl md:text-5xl font-semibold mb-4 lg:mb-9 text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base md:max-w-full">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* 3. Media Player / Hero Image */}
      <div className="section-padding pb-12 lg:max-h-[527px]">
        <div className="relative w-full max-w-[1000px] mx-auto aspect-video bg-gray-900 rounded-[20px] overflow-hidden shadow-2xl group">
          {/* Video Player or Hero Image */}
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <>
              {/* Background Image */}
              {mediaUrl && (
                <Image
                  src={mediaUrl}
                  alt={title}
                  fill
                  className="object-cover opacity-90 transition-opacity"
                />
              )}

            </>
          )}

        </div>
      </div>

      {/* 4. Content Body */}
      <div className="section-padding my-4 sm:my-12">
        <div className="w-full text-lg text-[#27272A] sm:pt-12">
          {sermon.content && <RichTextRenderer content={sermon.content} />}
        </div>
      </div>

      {/* 5. Related Sermons */}
      <div className="pb-20">
        <Sermons
          sermons={relatedSermons}
          title="Related Sermons"
          subtitle=""
          showDiscoverMore={false}
        />
      </div>

      {/* 6. Quote Section */}
      {sermonsPageData?.bottomQuote?.enableSection && (
        <QuoteSection
          quote={sermonsPageData.bottomQuote.quoteText}
          attribution={sermonsPageData.bottomQuote.author}
          shareButtonText={sermonsPageData.bottomQuote.shareButtonText}
          donateButtonText={sermonsPageData.bottomQuote.donateButtonText}
          donateButtonUrl={sermonsPageData.bottomQuote.donateButtonUrl}
          shareData={{
            title: `${title} - Masjid Al-Falah`,
            text: description || "Check out this sermon from Masjid Al-Falah",
            url: typeof window !== 'undefined' ? window.location.href : `/sermons/${slug}`
          }}
          backgroundColor="#fafafa"
        />
      )}

    </div>
  );
}
