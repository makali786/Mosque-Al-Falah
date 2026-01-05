
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
    id: string; // Using ID for now as per context, but could be slug
  };
}

export default async function SermonDetailPage({ params }: DetailedSermonPageProps) {
    const { id } = params;

    // Fetch data
    // We need to fetch the specific sermon. Since fetchSermons usually filters, we can use it.
    // If fetchSermons supports 'where', we use it.
    const sermonsData = await fetchSermons({ 
        where: { 
            id: { equals: id } 
        },
        limit: 1
    });

    if (!sermonsData || sermonsData.length === 0) {
        notFound();
    }

    const sermon = sermonsData[0];
    
    // Fetch Global Data for Related Sermons logic styling/config if needed, 
    // but we can just fetch random/latest sermons for "Related".
    // Let's fetch related sermons (excluding current one).
    const relatedSermons = await fetchSermons({
        limit: 10,
        sort: "-sermonDate",
        where: {
            id: { not_equals: id }
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
      <div className="section-padding py-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                )}
                <Link 
                    href={crumb.href} 
                    className={`text-sm ${index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "text-blue-600 hover:underline"}`}
                >
                    {crumb.label}
                </Link>
              </div>
            ))}
        </nav>
      </div>

      {/* 2. Main Title Area */}
      <div className="section-padding pb-8 text-center flex flex-col items-center max-w-4xl mx-auto">
         <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 tracking-tight leading-tight mb-6">
            {title}
         </h1>
         {description && (
             <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                {description}
             </p>
         )}
      </div>

      {/* 3. Media Player / Hero Image */}
        <div className="section-padding pb-12">
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
                         <Link href={videoUrl} target="_blank" className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110">
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
      <div className="section-padding pb-20">
          <div className="max-w-3xl mx-auto text-gray-800 leading-relaxed text-lg">
               {sermon.content && <RichTextRenderer content={sermon.content} />}
               
               {/* Extra Info: Note/Warning if any (hardcoded or from content) */}
               {/* As per design: "Note: The person who is praying..." */}
               {/* Since I don't see a specific 'note' field, I'll rely on RichText content containing it, or just render children. */}
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
