import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchGlobal, fetchBlogPosts } from "../../../../lib/fetcher";
import { getMediaUrl } from "../../../../lib/helper";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";
import { QuoteSection } from "../../components/common/QuoteSection";
import BlogCard from "../../components/blogs/BlogCard";
import PageHero from "../../components/common/PageHero";

// Helper to format date
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// Helper to decode slug if necessary
function decodedSlug(slug: string) {
    try {
        return decodeURIComponent(slug);
    } catch {
        return slug;
    }
}

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    // 1. Fetch Global Config
    let pageConfig: any;
    try {
        pageConfig = await fetchGlobal({ slug: "blogs-page" });
    } catch (error) {
        console.error("Error fetching blogs-page config:", error);
    }

    // Set defaults
    const detailConfig = pageConfig?.detailPage || {
        showHeroSection: true,
        showBreadcrumbOnDetail: true,
        showPublishedDate: true,
        showAuthorInfo: true,
        showTags: true,
        showRelatedPosts: true,
        relatedPostsTitle: "Related Post",
    };

    // 2. Fetch Current Blog Post
    const posts = await fetchBlogPosts({
        where: {
            slug: { equals: decodedSlug(slug) },
            isPublished: { equals: true },
        },
        depth: 2,
    });

    if (!posts || posts.length === 0) {
        notFound();
    }

    const post = posts[0];

    // 3. Fetch Previous & Next Posts
    let prevPost = null;
    let nextPost = null;

    try {
        const [prev, next] = await Promise.all([
            fetchBlogPosts({
                where: {
                    publishedDate: { less_than: post.publishedDate },
                    isPublished: { equals: true },
                },
                sort: "-publishedDate",
                limit: 1,
            }),
            fetchBlogPosts({
                where: {
                    publishedDate: { greater_than: post.publishedDate },
                    isPublished: { equals: true },
                },
                sort: "publishedDate",
                limit: 1,
            }),
        ]);
        prevPost = prev[0] || null;
        nextPost = next[0] || null;
    } catch (error) {
        console.error("Error fetching prev/next posts:", error);
    }

    const featuredImageUrl = getMediaUrl(post.featuredImage);
    const authorAvatarUrl = post.author?.avatar ? getMediaUrl(post.author.avatar) : null;

    return (
        <main className="bg-white min-h-screen">

            {/* Hero Section */}
            <PageHero
                title={post.title}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Blogs", href: "/blogs" },
                    { label: post.title, href: "#" },
                ]}
                backgroundImage={featuredImageUrl || ""}
                backgroundPosition="center"
                pageheroTitleStyle={"max-w-[710px]"}
            />

            {/* Content Wrapper */}
            <div className="max-w-250 mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="flex flex-col gap-15 w-full">

                    {/* Author & Meta Info */}
                    {detailConfig.showAuthorInfo && post.author && (
                        <div className="flex items-center gap-4 pb-8 border-b border-[#e4e4e7]">
                            {authorAvatarUrl && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={authorAvatarUrl}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-[#18181B]">{post.author.name}</p>
                                <div className="flex items-center gap-4 text-sm text-[#52525B]">
                                    {detailConfig.showPublishedDate && post.publishedDate && (
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/assets/topbar/calendar-icon.svg"
                                                alt="Calendar"
                                                width={14}
                                                height={14}
                                            />
                                            <span>{formatDate(post.publishedDate)}</span>
                                        </div>
                                    )}
                                    {detailConfig.showReadingTime && post.readingTime && (
                                        <span>• {post.readingTime} min read</span>
                                    )}
                                </div>
                            </div>
                            <div className="ml-auto">
                                <span className="bg-[#002E62] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Main Content from CMS */}
                    <article className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-bold prose-headings:text-black
                        prose-h2:text-5xl prose-h2:leading-12 prose-h2:mb-15
                        prose-p:text-lg prose-p:leading-7 prose-p:text-[#27272a] prose-p:mb-15
                        prose-img:rounded-[14px] prose-img:w-full prose-img:h-auto prose-img:object-cover prose-img:mb-15
                        prose-a:text-[#006fee] prose-a:underline hover:prose-a:text-[#005bc4]
                        prose-blockquote:bg-white prose-blockquote:border prose-blockquote:border-[#e4e4e7] prose-blockquote:rounded-[40px] prose-blockquote:p-15 prose-blockquote:mb-15
                        prose-blockquote:text-2xl prose-blockquote:font-medium prose-blockquote:leading-8 prose-blockquote:text-black prose-blockquote:not-italic
                        prose-ul:flex prose-ul:flex-col prose-ul:gap-6 prose-ul:p-2.5 prose-ul:mb-15 prose-ul:list-none
                        prose-ol:flex prose-ol:flex-col prose-ol:gap-6 prose-ol:p-2.5 prose-ol:mb-15 prose-ol:list-none
                        prose-li:flex prose-li:gap-3.75 prose-li:items-start prose-li:text-lg prose-li:leading-7 prose-li:text-[#27272a]
                        prose-li:before:content-[''] prose-li:before:w-4 prose-li:before:h-4 prose-li:before:shrink-0 prose-li:before:mt-1.5
                        prose-li:before:bg-[url('/assets/blogs/checkmark.svg')] prose-li:before:bg-no-repeat prose-li:before:bg-contain
                        prose-li:marker:hidden">
                        <RichTextRenderer content={post.content} />
                    </article>

                    {/* Tags Section */}
                    {detailConfig.showTags && post.tags && post.tags.length > 0 && (
                        <div className="flex gap-3.75 items-center flex-wrap">
                            <p className="text-base font-semibold leading-6 text-black uppercase">TAGS:</p>
                            <div className="flex gap-2.5 flex-wrap">
                                {post.tags.map((tagItem: any, index: number) => (
                                    <div key={index} className="bg-[#002e62] px-4 py-1 rounded-full">
                                        <p className="text-sm font-semibold leading-5 text-white uppercase">
                                            {typeof tagItem === 'string' ? tagItem : tagItem.tag}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Posts */}
            {
                detailConfig.showRelatedPosts && (
                    <div className="bg-white py-16 border-t border-gray-100">
                        <div className="section-padding max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-[#18181B]">{detailConfig.relatedPostsTitle}</h3>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><span className="text-gray-400 text-xl">‹</span></button>
                                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0000FF10] text-[#006FEE] bg-[#0000FF10]"><span className="text-xl">›</span></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(post.relatedPosts && post.relatedPosts.length > 0
                                    ? post.relatedPosts
                                    : (posts.length > 0 ? posts.slice(0, 3) : []) // Fallback if no specific related posts
                                ).map((related: any) => (
                                    // @ts-expect-error - Related post typing
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
                                            showCategoryBadge: true,
                                            showDate: true,
                                            showExcerpt: true,
                                            showReadMoreButton: true,
                                            readMoreButtonText: "Read More",
                                            cardStyle: "shadow"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Comments Section */}
            <div className="bg-white py-12 md:py-16">
                <div className="max-w-225 mx-auto px-4 md:px-8">
                    <h3 className="text-2xl font-bold text-[#18181B] mb-12 text-center">Comments</h3>

                    {/* Comment List */}
                    {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-8 mb-16">
                            {/* @ts-expect-error - Comment type */}
                            {post.comments.map((comment: any) => (
                                <div key={comment.id} className="bg-white border text-[#52525B] border-gray-100 p-6 rounded-2xl shadow-sm">
                                    <div className="flex gap-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                            {comment.userAvatar ? (
                                                <Image src={getMediaUrl(comment.userAvatar)!} alt={comment.userName} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-100">
                                                    {comment.userName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-[#18181B] text-sm">{comment.userName}</h4>
                                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(comment.commentDate).toLocaleDateString()}</p>
                                                </div>
                                                <button className="text-[#006FEE] text-sm font-semibold hover:underline">Reply</button>
                                            </div>
                                            <p className="text-sm leading-relaxed text-[#52525B] mt-3">
                                                {comment.comment}
                                            </p>

                                            {/* Replies */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="mt-6 space-y-4 pl-4 border-l-2 border-gray-100">
                                                    {comment.replies.map((reply: any) => (
                                                        <div key={reply.id} className="flex gap-4">
                                                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                                                    {reply.userName.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-bold text-[#18181B] text-xs">{reply.userName}</h4>
                                                                    <span className="text-[10px] text-gray-400">Edit</span>
                                                                </div>
                                                                <p className="text-xs leading-relaxed text-[#52525B]">
                                                                    {reply.replyText}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mb-12">No comments yet. Be the first to share your thoughts!</p>
                    )}

                    {/* Leave a Reply Form */}
                    <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-[#18181B] mb-8 text-center">Leave a Reply</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        className="w-full px-4 py-3 rounded-xl bg-[#F4F4F5] border-none text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:ring-1 focus:ring-[#006FEE] outline-none"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 ml-1">Type full name</p>
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email *"
                                        className="w-full px-4 py-3 rounded-xl bg-[#F4F4F5] border-none text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:ring-1 focus:ring-[#006FEE] outline-none"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 ml-1">Enter your Email</p>
                                </div>
                            </div>
                            <div>
                                <textarea
                                    rows={5}
                                    placeholder="Message me"
                                    className="w-full px-4 py-3 rounded-xl bg-[#F4F4F5] border-none text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:ring-1 focus:ring-[#006FEE] outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-start gap-3">
                                <input type="checkbox" id="save-info" className="mt-1 w-4 h-4 text-[#006FEE] rounded border-gray-300 focus:ring-[#006FEE]" />
                                <label htmlFor="save-info" className="text-sm text-[#71717A]">Save my name, email, and website in this browser for the next time I comment.</label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-[#006FEE] text-white font-medium rounded-xl text-sm hover:bg-[#005bc4] transition-colors"
                                >
                                    Post comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Quote Section Footer */}
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
