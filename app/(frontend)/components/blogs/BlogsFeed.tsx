"use client";

import Image from "next/image";
import { useState } from "react";
import BreadcrumbSearchSection from "../common/BreadcrumbSearchSection";
import BlogCard, { BlogCardProps } from "./BlogCard";

interface BlogsFeedProps {
  initialPosts: BlogCardProps[];
  categories: string[];
  config: {
    pageHeader: {
      pageTitle: string;
      breadcrumb: string;
      showBreadcrumb: boolean;
    };
    categoryFilter: {
      showCategoryFilter: boolean;
      allCategoriesLabel: string;
    };
    searchBar: {
      showSearch: boolean;
      searchPlaceholder: string;
    };
    gridSettings: {
      gridColumns: string;
      itemsPerPage: number;
      showLoadMore: boolean;
      loadMoreButtonText: string;
    };
    cardAppearance: {
      showFeaturedImage: boolean;
      showCategoryBadge: boolean;
      showDate: boolean;
      showExcerpt: boolean;
      showReadMoreButton: boolean;
      readMoreButtonText: string;
      cardStyle: string;
    };
    bottomQuote: {
      enableSection: boolean;
      quoteText: string;
      author: string;
      showShareButton: boolean;
      shareButtonText: string;
      showDonateButton: boolean;
      donateButtonText: string;
    };
    emptyStates: {
      noPostsMessage: string;
      noSearchResults: string;
    };
  };
}

export default function BlogsFeed({ initialPosts, categories, config }: BlogsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState(config.categoryFilter.allCategoriesLabel);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(config.gridSettings.itemsPerPage);

  const filteredPosts = initialPosts.filter(post => {
    const matchesCategory = selectedCategory === config.categoryFilter.allCategoriesLabel || 
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + config.gridSettings.itemsPerPage);
  };

  return (
    <>
      {/* Breadcrumbs */}
      {config.pageHeader.showBreadcrumb && (
        <BreadcrumbSearchSection
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: config.pageHeader.pageTitle, href: "#" },
          ]}
          showSearch={false}
          className="section-padding sm:!pt-12"
        />
      )}

      <div className="section-padding pb-8 sm:pb-12 flex flex-col gap-8">

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Categories */}
        {config.categoryFilter.showCategoryFilter && (
          <div className="flex flex-wrap items-center gap-1 lg:gap-2 p-1 bg-[#F4F4F5] rounded-xl">
            {[config.categoryFilter.allCategoriesLabel, ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(config.gridSettings.itemsPerPage);
                }}
                className={`px-3 lg:px-4 py-1.5 text-sm sm:text-base rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-white text-black shadow-sm"
                    : "text-[#71717A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        {config.searchBar.showSearch && (
          <div className="relative w-full md:w-[320px]">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Image src="/assets/common/search-icon.svg" width={20} height={20} alt="Search" />
            </div>
            <input 
              type="text" 
              placeholder={config.searchBar.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E4E4E7] text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#006FEE] focus:ring-1 focus:ring-[#006FEE] transition-all bg-[#FAFAFA]"
            />
          </div>
        )}
      </div>

      {/* Blog Grid */}
      {visiblePosts.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${config.gridSettings.gridColumns || '3'} gap-x-8 gap-y-12 mt-4`}>
            {visiblePosts.map(post => (
                <BlogCard key={post.id} {...post} appearance={config.cardAppearance} />
            ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-[#71717A] text-lg">
            {searchQuery || selectedCategory !== config.categoryFilter.allCategoriesLabel 
              ? config.emptyStates.noSearchResults 
              : config.emptyStates.noPostsMessage}
          </p>
        </div>
      )}

      {/* Load More */}
      {config.gridSettings.showLoadMore && visiblePosts.length < filteredPosts.length && (
        <div className="flex justify-center mt-8">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181B] font-medium rounded-xl transition-colors"
            >
                {config.gridSettings.loadMoreButtonText}
            </button>
        </div>
      )}

    </div>
    </>
  );
}
