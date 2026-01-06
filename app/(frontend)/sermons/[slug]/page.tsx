
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
    
    // Fetch Global Data for Related Sermons logic styling/config if needed, 
    // but we can just fetch random/latest sermons for "Related".
    // Let's fetch related sermons (excluding current one by ID).
    const relatedSermons = await fetchSermons({
        limit: 10,
        sort: "-sermonDate",
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
                {/* Background Image */}
                {mediaUrl && (
                    <Image 
                        src={mediaUrl} 
                        alt={title} 
                        fill 
                        className="object-cover opacity-90 transition-opacity"
                    />
                )}
                
                {/* Play Button Overlay - If Video URL exists */}
                {videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                         <Link href={videoUrl} target="_blank" className="relative z-10 w-[36px] h-[36px] md:w-[56px] md:h-[56px] bg-white rounded-full flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900 ml-1">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                         </Link>
                         {/* Ripple effect/Backdrop */}
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    </div>
                )}
                 
                 {/* Fallback for no video: Just Image covers it */}
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
             backgroundColor="#fafafa" 
          />
       )}

    </div>
  );
}
