import { notFound } from "next/navigation";
// import { fetchDonationAppeals, fetchGlobal } from "@/lib/fetcher";
import { AppealHero } from "../../components/appeals/AppealHero";
import { ImpactGallery } from "../../components/appeals/ImpactGallery";
import { WaysToGive } from "../../components/appeals/WaysToGive";
import { QuoteSection } from "../../components/common/QuoteSection";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";
import Image from "next/image";
// import { getMediaUrl, getMediaAlt } from "@/lib/helper";
import { fetchDonationAppeals, fetchGlobal } from "@lib/fetcher";

// Generate static params for SSG if needed, or just rely on dynamic rendering
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const appeals = await fetchDonationAppeals({
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const appeal = appeals[0];

  if (!appeal) return {};

  return {
    title: appeal.seo?.metaTitle || appeal.title,
    description: appeal.seo?.metaDescription || appeal.shortDescription,
  };
}

export default async function AppealDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  

  // Fetch Appeal Data
  const appeals = await fetchDonationAppeals({
    where: { slug: { equals: slug } },
    limit: 1,
  });

  
  const appeal = appeals[0];

  if (!appeal) {
    notFound();
  }

  // Fetch Global Page Data for generic sections (like Quote) if needed
  const appealsPageGlobal = await fetchGlobal({ slug: "donation-appeals-page" });
  const bottomQuote = appealsPageGlobal?.bottomQuote;


  // Calculate Days Left
  const getDaysLeft = (dateString?: string) => {
    if (!dateString) return 0;
    const end = new Date(dateString);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
   
  // Prepare Stats
  const stats = {
      raised: appeal.funding?.currentAmount || 0,
      donors: appeal.funding?.totalDonors || 0,
      goal: appeal.funding?.targetAmount || 0,
      daysLeft: getDaysLeft(appeal.timeline?.endDate),
  };

  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <AppealHero 
        title={appeal.title}
        description={appeal.shortDescription}
        heroImage={appeal.heroMedia?.heroImage}
        stats={stats}
      />

      {/* Why Your Support Matters */}
      {appeal.whyMatters?.enableSection && (
        <section className="section-padding pt-12 sm:pt-16 lg:pt-24">
          <div className="flex flex-col gap-10 sm:gap-12">
            <h2 className="text-3xl font-bold sm:text-5xl">
               {appeal.whyMatters.sectionTitle}
            </h2>
            
            {/* Split content if image exists, or centered text */}
            <div className="flex flex-col gap-8 sm:gap-12">
               <div className="prose max-w-none text-lg text-[#52525b] leading-relaxed">
                  <RichTextRenderer content={appeal.whyMatters.content} />
               </div>

              {appeal.whyMatters?.featuredImage && (
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[565px] rounded-[14px] overflow-hidden">
                      <Image 
                        src={appeal?.whyMatters?.featuredImage?.url || ""}
                        alt={appeal?.whyMatters?.featuredImage?.alt || "Featured Impact Image"}
                        fill
                    className="object-cover"
                      />
                  </div>
               )}
            </div>
          </div>
        </section>
      )}

      {/* Donation Impact Gallery */}
      {appeal.impactGallery?.enableGallery && (
        <ImpactGallery 
            title={appeal.impactGallery.galleryTitle}
            description={appeal.impactGallery.galleryDescription || ""} 
            images={appeal.impactGallery.images || []}
        />
      )}

      {/* Ways to Give */}
      {appeal.waysToGive?.enableSection && (
         <WaysToGive 
            title={appeal?.waysToGive?.sectionTitle}
            description={appeal?.waysToGive?.sectionDescription}
            methods={appeal?.waysToGive?.givingMethods || []}
            image={appeal?.waysToGive?.sectionImage?.url || ""} 
         />
      )}

      {/* Quote Section (Global or Appeal specific? JSON has testimonials array in appeal) */}
      {/* Using Global Bottom Quote as fallback or consistent footer */}
      {bottomQuote?.enableSection && (
        <QuoteSection
          quote={bottomQuote.quoteText}
          attribution={bottomQuote.author}
          backgroundColor="#f4f4f5"
          shareButtonText={bottomQuote.shareButtonText}
          donateButtonText={bottomQuote.donateButtonText}
          shareData={{ 
            title: appeal.title, 
            text: appeal.shortDescription, 
            url: `https://masjidalfalah.org/appeals/${slug}` 
          }}
          donateButtonUrl="/donate"
        />
      )}
    </main>
  );
}
