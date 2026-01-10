import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchGlobal, fetchBlogPosts } from "../../../../lib/fetcher";
import { getMediaUrl } from "../../../../lib/helper";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";
import { QuoteSection } from "../../components/common/QuoteSection";
import BlogCard from "../../components/blogs/BlogCard";

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch Global Config
  let pageConfig: any;
  try {
    pageConfig = await fetchGlobal({ slug: "blogs-page" });
  } catch (error) {
    console.error("Error fetching blogs-page config:", error);
  }

  // Set defaults for detail page
  const detailConfig = pageConfig?.detailPage || {
    showHeroSection: true,
    showBreadcrumbOnDetail: true,
    showPublishedDate: true,
    showReadingTime: true,
    showAuthorInfo: true,
    showTags: true,
    showSocialShare: true,
    showRelatedPosts: true,
    relatedPostsTitle: "Related Posts",
    relatedPostsCount: 3
  };

  // 2. Fetch Blog Post
  let posts = [];
  try {
    posts = await fetchBlogPosts({
      where: {
        slug: { equals: slug },
        isPublished: { equals: true }
      },
      depth: 2 // Need depth for related posts and author image
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  const post = posts[0];

  if (!post) {
    notFound();
  }

  const featuredImageUrl = getMediaUrl(post.featuredImage);
  const authorImageUrl = getMediaUrl(post.author?.avatar);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      {detailConfig.showBreadcrumbOnDetail && (
        <div className="section-padding py-6">
           <nav className="flex items-center gap-2 text-sm text-[#52525B]">
            <Link href="/" className="text-[#006FEE] hover:underline">Home</Link>
            <span className="text-[#71717A]">&gt;</span>
            <Link href="/blogs" className="text-[#006FEE] hover:underline">Blogs</Link>
            <span className="text-[#71717A]">&gt;</span>
            <span className="text-[#18181B] line-clamp-1">{post.title}</span>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      {detailConfig.showHeroSection && featuredImageUrl && (
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative">
            <Image 
                src={featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                 <div className="section-padding">
                    {post.category && (
                        <span className="bg-[#006FEE] text-white px-3 py-1 rounded-md text-sm font-medium mb-4 inline-block">
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                    )}
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm md:text-base">
                        {detailConfig.showAuthorInfo && (
                            <div className="flex items-center gap-2">
                                {authorImageUrl && (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/50">
                                         <Image src={authorImageUrl} alt={post.author?.name || "Author"} fill className="object-cover" />
                                    </div>
                                )}
                                <span>{post.author?.name || "Masjid Al-Falah"}</span>
                            </div>
                        )}
                        {detailConfig.showPublishedDate && (
                            <>
                                <span>•</span>
                                <span>{formatDate(post.publishedDate)}</span>
                            </>
                        )}
                        {detailConfig.showReadingTime && post.readingTime && (
                           <>
                                <span>•</span>
                                <span>{post.readingTime} min read</span>
                           </>
                        )}
                    </div>
                 </div>
            </div>
        </div>
      )}

      {/* Content Section */}
      <article className="section-padding py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Main Content */}
           <div className="lg:col-span-8">
                {/* If hero is hidden, show title here */}
                {(!detailConfig.showHeroSection || !featuredImageUrl) && (
                    <div className="mb-8">
                         <h1 className="text-3xl md:text-4xl font-bold text-[#18181B] mb-4">
                            {post.title}
                         </h1>
                         <div className="flex flex-wrap items-center gap-4 text-sm text-[#52525B]">
                             {detailConfig.showPublishedDate && (
                                 <div className="flex items-center gap-1.5">
                                      <Image src="/assets/topbar/calendar-icon.svg" width={16} height={16} alt="Calendar" />
                                      <span>{formatDate(post.publishedDate)}</span>
                                 </div>
                             )}
                              {detailConfig.showAuthorInfo && (
                                 <span>By {post.author?.name || "Masjid Al-Falah"}</span>
                             )}
                         </div>
                    </div>
                )}

                <div className="prose prose-lg prose-slate max-w-none">
                    <RichTextRenderer content={post.content} />
                </div>

                {/* Tags */}
                {detailConfig.showTags && post.tags && post.tags.length > 0 && (
                    <div className="mt-12 flex flex-wrap gap-2">
                        {post.tags.map((tagItem: any, index: number) => (
                            <span key={index} className="bg-[#F4F4F5] text-[#52525B] px-3 py-1.5 rounded-lg text-sm">
                                #{tagItem.tag}
                            </span>
                        ))}
                    </div>
                )}
                
                {/* Social Share (Placeholder) */}
                {detailConfig.showSocialShare && (
                    <div className="mt-8 pt-8 border-t border-[#E4E4E7] flex flex-wrap items-center gap-4">
                        <span className="font-medium text-[#18181B]">Share this post:</span>
                        <div className="flex items-center gap-2">
                             {/* Add actual share buttons here if needed */}
                             <button className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors">
                                 <svg className="w-5 h-5 text-[#52525B]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                             </button>
                             <button className="p-2 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors">
                                 <svg className="w-5 h-5 text-[#52525B]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                             </button>
                        </div>
                    </div>
                )}
                {/* Comments Section */}
                {detailConfig.enableComments && post.comments && post.comments.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-[#E4E4E7]">
                        <h3 className="text-2xl font-bold text-[#18181B] mb-8">
                            {pageConfig?.commentsSettings?.commentsSectionTitle || "Comments"} ({post.comments.length})
                        </h3>
                        <div className="space-y-8">
                             {/* @ts-expect-error - Comment type loose */}
                             {post.comments.map((comment: any) => (
                                 <div key={comment.id} className="flex gap-4">
                                     {comment.userAvatar || pageConfig?.commentsSettings?.showUserAvatars ? (
                                         <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                             {comment.userAvatar ? (
                                                 <Image src={getMediaUrl(comment.userAvatar) || ""} alt={comment.userName} fill className="object-cover" />
                                             ) : (
                                                 <div className="w-full h-full flex items-center justify-center text-[#71717A] text-lg font-bold">
                                                     {comment.userName.charAt(0)}
                                                 </div>
                                             )}
                                         </div>
                                     ) : null}
                                     <div className="flex-1">
                                         <div className="bg-[#FAFAFA] rounded-2xl p-4 sm:p-6">
                                             <div className="flex items-center justify-between mb-2">
                                                 <h4 className="font-bold text-[#18181B]">{comment.userName}</h4>
                                                 <span className="text-xs text-[#71717A]">{new Date(comment.commentDate).toLocaleDateString()}</span>
                                             </div>
                                             <p className="text-[#52525B] text-sm leading-relaxed">{comment.comment}</p>
                                         </div>
                                         
                                         {/* Replies */}
                                         {comment.replies && comment.replies.length > 0 && (
                                             <div className="mt-4 pl-4 sm:pl-12 space-y-4">
                                                 {comment.replies.map((reply: any) => (
                                                     <div key={reply.id} className="flex gap-4">
                                                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                              {/* Placeholder for reply avatar */}
                                                              <div className="w-full h-full flex items-center justify-center text-[#71717A] text-xs font-bold">
                                                                 {reply.userName.charAt(0)}
                                                              </div>
                                                          </div>
                                                          <div className="bg-[#FAFAFA] rounded-2xl p-4 flex-1">
                                                              <div className="flex items-center justify-between mb-2">
                                                                 <h4 className="font-semibold text-[#18181B] text-sm">{reply.userName}</h4>
                                                                 <span className="text-xs text-[#71717A]">{new Date(reply.replyDate).toLocaleDateString()}</span>
                                                              </div>
                                                              <p className="text-[#52525B] text-sm leading-relaxed">{reply.replyText}</p>
                                                          </div>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
           </div>

           {/* Sidebar / Related Posts */}
           <div className="lg:col-span-4 space-y-8">
               {detailConfig.showRelatedPosts && (
                 <div className="bg-[#FAFAFA] md:bg-transparent rounded-2xl md:rounded-none p-6 md:p-0">
                    <h3 className="text-xl font-bold text-[#18181B] mb-6">{detailConfig.relatedPostsTitle}</h3>
                    <div className="flex flex-col gap-6">
                        {post.relatedPosts && post.relatedPosts.length > 0 ? (
                            // @ts-expect-error - Related post type might be loose
                            post.relatedPosts.map((related: any) => (
                                <BlogCard 
                                    key={related.id} 
                                    {...{
                                        id: related.id,
                                        slug: related.slug,
                                        title: related.title,
                                        description: related.excerpt || "",
                                        date: formatDate(related.publishedDate),
                                        category: related.category ? related.category.charAt(0).toUpperCase() + related.category.slice(1) : "General",
                                        imageUrl: getMediaUrl(related.featuredImage) || "",
                                    }}
                                    appearance={{
                                        showFeaturedImage: true,
                                        showCategoryBadge: false,
                                        showDate: true,
                                        showExcerpt: false,
                                        showReadMoreButton: false,
                                        cardStyle: "transparent"
                                    }}
                                />
                            ))
                        ) : (
                             <p className="text-sm text-[#71717A]">No related posts found.</p>
                        )}
                    </div>
                 </div>
               )}
           </div>
      </article>

      {/* Quote Section */}
      {pageConfig?.bottomQuote?.enableSection && (
         <QuoteSection 
           quote={pageConfig.bottomQuote.quoteText}
           attribution={pageConfig.bottomQuote.author}
           donateButtonUrl="/donate"
           backgroundColor="#F4F4F5"
           shareButtonText={pageConfig.bottomQuote.shareButtonText}
           donateButtonText={pageConfig.bottomQuote.donateButtonText}
         />
      )}
    </main>
  );
}
