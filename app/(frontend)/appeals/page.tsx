import { fetchDonationAppeals, fetchGlobal } from "@lib/fetcher";
import AppealCard from "../components/common/AppealCard";
import BreadcrumbSearchSection from "../components/common/BreadcrumbSearchSection";
import { QuoteSection } from "../components/common/QuoteSection";
import { RichTextRenderer } from "../components/common/RichTextRenderer";

// Helper to calculate days left
const getDaysLeft = (dateString?: string) => {
  if (!dateString) return 0;
  const end = new Date(dateString);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default async function AppealsPage() {
  const appealsPage = await fetchGlobal({ slug: "donation-appeals-page" });

  const appealsData = await fetchDonationAppeals(
    { limit: appealsPage?.gridSettings?.itemsPerPage || 12, depth: 1, where: { isActive: { equals: true, }, }, }
  );

  // Safe access to page data
  const { pageHeader, bottomQuote, emptyStates, filterOptions, gridSettings } = appealsPage || {};

  // Map grid columns safely for Tailwind
  const gridColsMap: Record<string, string> = {
    "2": "lg:grid-cols-2",
    "3": "lg:grid-cols-3",
    "4": "lg:grid-cols-4",
  };
  const gridClass = gridColsMap[gridSettings?.gridColumns || "3"] || "lg:grid-cols-3";

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <BreadcrumbSearchSection
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Appeals", href: "/appeals" },
        ]}
        showSearch={false}
      />

      <section className="pb-16 pt-2 flex-grow">
        <div className="section-padding">
          <div className="flex flex-col gap-6 mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#27272A]">
              {pageHeader?.pageTitle || "Appeals"}
            </h1>
            <div className="text-[#52525B] font-semibold text-xl">
              {pageHeader?.pageDescription && (
                <RichTextRenderer content={pageHeader.pageDescription} />
              ) || "The Prophet (peace be upon him) said: “Charity does not reduce wealth” (Bukhari) Please donate generously to Masjid Al-Falah, Ilford. All proceeds go towards the upkeep of the Masjid and helping us to serve the wider community. May Allah reward you greatly for all your donations"}
            </div>
          </div>

          {appealsData && appealsData.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gridClass} gap-6`}>
              {appealsData.map((appeal: any, index: number) => (
                <AppealCard
                  key={appeal.id || index}
                  title={appeal?.title}
                  description={appeal?.shortDescription}
                  image={appeal?.heroMedia?.heroImage}
                  organization={{
                    name: "Masjid Al-Falah",
                    logo: "/assets/common/logo-small.svg",
                  }}
                  stats={{
                    donors: appeal?.funding?.totalDonors || 0,
                    daysLeft: getDaysLeft(appeal?.timeline?.endDate),
                  }}
                  funding={{
                    raised: appeal?.funding?.currentAmount || 0,
                    goal: appeal?.funding?.targetAmount || 0,
                  }}
                  links={{
                    donate: `/donate/${appeal.slug}`,
                    details: `/appeals/${appeal.slug}`,
                  }}
                  buttonVariant="primary"
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              {emptyStates?.noAppealsMessage || "No donation appeals available at this time."}
            </div>
          )}
        </div>
      </section>

      {bottomQuote?.enableSection && (
        <QuoteSection
          quote={bottomQuote.quoteText}
          attribution={bottomQuote.author}
          backgroundColor="#f4f4f5"
          shareButtonText={bottomQuote.shareButtonText}
          donateButtonText={bottomQuote.donateButtonText}
          shareData={{
            title: pageHeader?.pageTitle || "Appeals",
            text: "Please donate to Masjid Al-Falah",
            url: "https://masjidalfalah.org/appeals"
          }}
          donateButtonUrl="/donate"
        />
      )}
    </main>
  );
}
