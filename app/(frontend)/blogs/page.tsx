import { fetchGlobal, fetchBlogPosts } from "../../../lib/fetcher";
import BlogsFeed from "../components/blogs/BlogsFeed";
import { getMediaUrl } from "../../../lib/helper";
import { QuoteSection } from "@/components/common/QuoteSection";

export default async function BlogsPage() {

  const blogPage = await fetchGlobal({ slug: "blogs-page" });
  const postsData = await fetchBlogPosts({
    depth: 1,
    limit: 1000,
    sort: blogPage.defaultSorting?.sortBy || '-publishedDate',
    where: {
      isPublished: { equals: true }
    }
  });

  const initialPosts = postsData.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.excerpt || "",
    date: post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "",
    category: post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : "General",
    imageUrl: getMediaUrl(post.featuredImage) || "",
  }));

  const categories = [
    "Hadith",
    "Quran",
    "Salah",
    "History"
  ];

  const config = {
    pageHeader: {
      pageTitle: blogPage.pageHeader?.pageTitle || "",
      breadcrumb: blogPage.pageHeader?.breadcrumb || "",
      showBreadcrumb: blogPage.pageHeader?.showBreadcrumb ?? true,
    },
    categoryFilter: {
      showCategoryFilter: blogPage.categoryFilter?.showCategoryFilter ?? true,
      allCategoriesLabel: blogPage.categoryFilter?.allCategoriesLabel || "",
    },
    searchBar: {
      showSearch: blogPage.searchBar?.showSearch ?? true,
      searchPlaceholder: blogPage.searchBar?.searchPlaceholder || "Search...",
    },
    gridSettings: {
      gridColumns: blogPage.gridSettings?.gridColumns || "3",
      itemsPerPage: blogPage.gridSettings?.itemsPerPage || 6,
      showLoadMore: blogPage.gridSettings?.showLoadMore ?? true,
      loadMoreButtonText: blogPage.gridSettings?.loadMoreButtonText || "Load More",
    },
    cardAppearance: {
      showFeaturedImage: blogPage.cardAppearance?.showFeaturedImage ?? true,
      showCategoryBadge: blogPage.cardAppearance?.showCategoryBadge ?? true,
      showDate: blogPage.cardAppearance?.showDate ?? true,
      showExcerpt: blogPage.cardAppearance?.showExcerpt ?? true,
      showReadMoreButton: blogPage.cardAppearance?.showReadMoreButton ?? true,
      readMoreButtonText: blogPage.cardAppearance?.readMoreButtonText || "Read More",
      cardStyle: blogPage.cardAppearance?.cardStyle || "",
    },
    bottomQuote: {
      enableSection: blogPage.bottomQuote?.enableSection ?? false,
      quoteText: blogPage.bottomQuote?.quoteText || "",
      author: blogPage.bottomQuote?.author || "",
      showShareButton: blogPage.bottomQuote?.showShareButton ?? false,
      shareButtonText: blogPage.bottomQuote?.shareButtonText || "Share",
      showDonateButton: blogPage.bottomQuote?.showDonateButton ?? false,
      donateButtonText: blogPage.bottomQuote?.donateButtonText || "Donate",
    },
    emptyStates: {
      noPostsMessage: blogPage.emptyStates?.noPostsMessage || "No posts found.",
      noSearchResults: blogPage.emptyStates?.noSearchResults || "No results found.",
    },
  };

  return (
    <main className="bg-white">
      <BlogsFeed
        initialPosts={initialPosts}
        categories={categories}
        config={config}
      />
      {/* Quote Section */}
      {config.bottomQuote.enableSection && (
        <QuoteSection
          quote={config.bottomQuote.quoteText}
          attribution={config.bottomQuote.author}
          donateButtonUrl="/donate"
          backgroundColor="#F4F4F5"
          shareButtonText={config.bottomQuote.shareButtonText}
          donateButtonText={config.bottomQuote.donateButtonText}
          showShareButton={config.bottomQuote.showShareButton}
          showDonateButton={config.bottomQuote.showDonateButton}
        />
      )}
    </main>
  );
}
