import { fetchDonationAppeals, fetchGlobal } from '@lib/fetcher';
import BreadcrumbSearchSection from '../components/common/BreadcrumbSearchSection';
import { QuoteSection } from '../components/common/QuoteSection';
import { RichTextRenderer } from '../components/common/RichTextRenderer';
import AppealsList from './AppealsList';

export const revalidate = 60;

export default async function AppealsPage() {
  // Use simple fallback data to debug 500 error
  let appealsPage = {
    pageHeader: {
      pageTitle: 'Appeals',
      pageDescription: null,
    },
    filterOptions: { showSearch: false },
    gridSettings: { gridColumns: '3', itemsPerPage: 6 },
    bottomQuote: {
      enableSection: false,
      quoteText: 'Default quote',
      author: 'Default author',
      shareButtonText: 'Share',
      donateButtonText: 'Donate',
      donateButtonUrl: '/donate',
    },
    emptyStates: { noAppealsMessage: 'No appeals found.' },
  };

  let appealsData: any[] = [];

  /* 
  // FETCH RESTORED WITH TRY/CATCH
  */
  try {
    const fetchedPage = await fetchGlobal({ slug: 'donation-appeals-page' });
    if (fetchedPage) {
      // Merge fetched page with defaults to safeguard against missing nested props
      appealsPage = { ...appealsPage, ...fetchedPage };
    }

    // Fetch all active appeals — AppealsList handles the client-side "Load More" display
    appealsData = await fetchDonationAppeals({
      limit: 1000,
      depth: 1,
      where: { isActive: { equals: true } },
    });
  } catch (error) {
    console.error('Error fetching appeals data:', error);
  }

  // Safe access to page data
  const { pageHeader, bottomQuote, emptyStates, filterOptions, gridSettings } =
    appealsPage || {};

  // Map grid columns safely for Tailwind
  const gridColsMap: Record<string, string> = {
    '2': 'lg:grid-cols-2',
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
  };
  const gridClass =
    gridColsMap[gridSettings?.gridColumns || '3'] || 'lg:grid-cols-3';

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <BreadcrumbSearchSection
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Appeals', href: '/appeals' },
        ]}
        showSearch={false}
        className="section-padding lg:!pt-12 lg:!pb-16"
      />

      <section className="pb-16 grow section-padding">
        <div>
          <div className="flex flex-col gap-6 mb-16">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#27272A]">
              {pageHeader?.pageTitle || 'Appeals'}
            </h1>
            <div className="text-[#52525B] font-semibold text-xl">
              {(pageHeader?.pageDescription && (
                <RichTextRenderer content={pageHeader.pageDescription} />
              )) ||
                ''}
            </div>
          </div>

          {appealsData && appealsData.length > 0 ? (
            <AppealsList appealsData={appealsData} gridClass={gridClass} />
          ) : (
            <div className="py-12 text-center text-gray-500">
              {emptyStates?.noAppealsMessage ||
                'No donation appeals available at this time.'}
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
            title: pageHeader?.pageTitle || 'Appeals',
            text: 'Please donate to Masjid Al-Falah',
            url: 'https://masjidalfalah.org/appeals',
          }}
          donateButtonUrl="/donate"
        />
      )}
    </main>
  );
}
