import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchGlobal, fetchBlogPosts } from "../../../../lib/fetcher";
import { getMediaUrl } from "../../../../lib/helper";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";
import { QuoteSection } from "../../components/common/QuoteSection";
import BlogCard from "../../components/blogs/BlogCard";
import PageHero from "../../components/common/PageHero";
import RelatedPostsCarousel from "../../components/blogs/RelatedPostsCarousel";

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

// Generate SEO metadata from blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;

    const posts = await fetchBlogPosts({
        where: {
            slug: { equals: decodedSlug(slug) },
            isPublished: { equals: true },
        },
        depth: 1,
    });

    if (!posts || posts.length === 0) {
        return {
            title: "Blog Post Not Found",
        };
    }

    const post = posts[0];
    const featuredImageUrl = getMediaUrl(post.featuredImage);

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            type: "article",
            publishedTime: post.publishedDate,
            authors: post.author?.name ? [post.author.name] : undefined,
            images: featuredImageUrl ? [{ url: featuredImageUrl }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: featuredImageUrl ? [featuredImageUrl] : undefined,
        },
    };
}

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

    // 2. Fetch Current Blog Post by slug
    let posts = await fetchBlogPosts({
        where: {
            slug: { equals: decodedSlug(slug) },
            isPublished: { equals: true },
        },
        depth: 2,
    });

    // Fallback: Try fetching by ID if slug lookup fails
    if (!posts || posts.length === 0) {
        try {
            posts = await fetchBlogPosts({
                where: {
                    id: { equals: decodedSlug(slug) },
                    isPublished: { equals: true },
                },
                depth: 2,
            });
        } catch (error) {
            console.error("Error fetching blog post by ID:", error);
        }
    }

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

            {/* Content Wrapper - Figma: 1134px content with 200px side padding */}
            <div className="w-full py-20 px-4 md:px-8 lg:px-50">
                <div className="flex flex-col gap-15 max-w-283.5 mx-auto">

                    {/* Main Content from CMS - Figma Perfect Styling */}
                    <article className="prose prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-black
                        prose-h1:text-[64px] prose-h1:leading-[70px]
                        prose-h2:text-[48px] prose-h2:leading-[48px] prose-h2:mb-0 prose-h2:mt-0
                        prose-h3:text-[32px] prose-h3:leading-[40px]
                        prose-p:text-[18px] prose-p:leading-[28px] prose-p:text-[#27272a] prose-p:mb-0 prose-p:mt-0
                        prose-a:text-[#006fee] prose-a:underline hover:prose-a:text-[#005bc4]
                        prose-strong:font-bold prose-strong:text-black
                        prose-ul:list-none prose-ul:p-[10px] prose-ul:my-0
                        prose-ol:list-none prose-ol:p-[10px] prose-ol:my-0
                        prose-li:text-[18px] prose-li:leading-[28px] prose-li:text-[#27272a] prose-li:my-0 prose-li:pl-0
                        prose-img:rounded-[14px]
                        *:mb-15 [&>*:last-child]:mb-0
                        [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-6
                        [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-6
                        [&_li]:flex [&_li]:gap-3.75 [&_li]:items-start
                        [&_li]:before:content-[''] [&_li]:before:inline-block [&_li]:before:w-4 [&_li]:before:h-4 [&_li]:before:min-w-4 [&_li]:before:mt-1.5
                        [&_li]:before:bg-[url('/assets/blogs/checkmark.svg')] [&_li]:before:bg-no-repeat [&_li]:before:bg-contain
                        [&_li_strong]:font-bold [&_li_strong]:text-black">
                        <RichTextRenderer content={post.content} />
                    </article>

                    {/* Tags Section - Figma specs */}
                    {detailConfig.showTags && post.tags && post.tags.length > 0 && (
                        <div className="flex gap-3.75 items-center flex-wrap">
                            <p className="text-[16px] font-semibold leading-6 text-black">TAGS:</p>
                            <div className="flex gap-2.5 flex-wrap">
                                {post.tags.map((tagItem: any, index: number) => (
                                    <div key={index} className="bg-[#002e62] px-4 py-1 rounded-full overflow-hidden">
                                        <p className="text-[14px] font-semibold leading-5 text-white uppercase">
                                            {typeof tagItem === 'string' ? tagItem : tagItem.tag}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Previous/Next Post Navigation */}
                    {(prevPost || nextPost) && (
                        <div className="mt-20 border border-[#e4e4e7] rounded-[14px] flex items-center justify-center overflow-hidden">
                            {/* Previous Post */}
                            {prevPost ? (
                                <Link
                                    href={`/blogs/${prevPost.slug}`}
                                    className="flex flex-1 gap-5 items-center p-[30px] hover:bg-gray-50 transition-colors"
                                >
                                    <div className="relative w-[140px] h-[140px] rounded-[14px] overflow-hidden bg-[#cce3fd] shrink-0">
                                        {getMediaUrl(prevPost.featuredImage) && (
                                            <Image
                                                src={getMediaUrl(prevPost.featuredImage)!}
                                                alt={prevPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                                        <p className="text-[14px] font-normal leading-5 text-[#71717a]">
                                            Previous Post
                                        </p>
                                        <p className="text-[16px] font-semibold leading-6 text-[#27272a]">
                                            {prevPost.title}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-1 gap-5 items-center p-[30px] opacity-50">
                                    <div className="w-[140px] h-[140px] rounded-[14px] bg-[#cce3fd] shrink-0" />
                                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                                        <p className="text-[14px] font-normal leading-5 text-[#71717a]">
                                            Previous Post
                                        </p>
                                        <p className="text-[16px] font-semibold leading-6 text-[#27272a]">
                                            No previous post
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="w-px h-[200px] bg-[#e4e4e7]" />

                            {/* Next Post */}
                            {nextPost ? (
                                <Link
                                    href={`/blogs/${nextPost.slug}`}
                                    className="flex flex-1 gap-5 items-center justify-center p-[30px] hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col gap-2.5 flex-1 min-w-0 items-end text-right">
                                        <p className="text-[14px] font-normal leading-5 text-[#71717a]">
                                            Next Post
                                        </p>
                                        <p className="text-[16px] font-semibold leading-6 text-[#006fee]">
                                            {nextPost.title}
                                        </p>
                                    </div>
                                    <div className="relative w-[140px] h-[140px] rounded-[14px] overflow-hidden bg-[#cce3fd] shrink-0">
                                        {getMediaUrl(nextPost.featuredImage) && (
                                            <Image
                                                src={getMediaUrl(nextPost.featuredImage)!}
                                                alt={nextPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-1 gap-5 items-center justify-center p-[30px] opacity-50">
                                    <div className="flex flex-col gap-2.5 flex-1 min-w-0 items-end text-right">
                                        <p className="text-[14px] font-normal leading-5 text-[#71717a]">
                                            Next Post
                                        </p>
                                        <p className="text-[16px] font-semibold leading-6 text-[#006fee]">
                                            No next post
                                        </p>
                                    </div>
                                    <div className="w-[140px] h-[140px] rounded-[14px] bg-[#cce3fd] shrink-0" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Posts */}
            {detailConfig.showRelatedPosts && (
                <RelatedPostsCarousel
                    posts={(post.relatedPosts && post.relatedPosts.length > 0 ? post.relatedPosts : posts).map((p: any) => ({
                        ...p,
                        formattedDate: formatDate(p.publishedDate)
                    }))}
                    title={detailConfig.relatedPostsTitle}
                />
            )}

            {/* Comments Section - Only show if comments are enabled */}
            {post.enableComments === true && (
                <div className="bg-white pt-12 pb-0 mb-6">
                    <div className="w-full px-4 md:px-8 lg:px-50">
                        <div className="max-w-283.5 mx-auto">
                            <div className="flex flex-col gap-13 items-center">
                                {/* Comments Title */}
                                <h2 className="text-[36px] font-bold leading-10 text-[#27272a] text-center">
                                    Comments
                                </h2>

                                {/* Comment List */}
                                {post.comments && post.comments.length > 0 ? (
                                    <div className="flex flex-col gap-13 items-start w-full">
                                        {post.comments.map((comment: any) => (
                                            <div key={comment.id} className="flex flex-col gap-9 items-end w-full">
                                                {/* Main Comment */}
                                                <div className="border border-[#c5c5c5] flex flex-col gap-5 items-start justify-center px-10 py-12.5 rounded-[30px] w-full">
                                                    {/* Header: User Info + Edit Button */}
                                                    <div className="flex items-start justify-between w-full">
                                                        {/* User Info */}
                                                        <div className="flex gap-2 items-center">
                                                            {/* Avatar */}
                                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa] shrink-0">
                                                                {comment.userAvatar ? (
                                                                    <Image
                                                                        src={getMediaUrl(comment.userAvatar)!}
                                                                        alt={comment.userName}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                                                        {comment.userName.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Name & Date */}
                                                            <div className="flex flex-col">
                                                                <p className="text-[14px] font-normal leading-5 text-[#11181c]">
                                                                    {comment.userName}
                                                                </p>
                                                                <p className="text-[12px] font-normal leading-4 text-[#a1a1aa]">
                                                                    {new Date(comment.commentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Edit Button */}
                                                        <button className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                                                            <p className="text-[14px] font-normal leading-5 text-[#006fee]">
                                                                Edit
                                                            </p>
                                                        </button>
                                                    </div>

                                                    {/* Comment Text */}
                                                    <p className="text-[18px] font-normal leading-7 text-[#3f3f46] w-full">
                                                        {comment.comment}
                                                    </p>

                                                    {/* Reply Button */}
                                                    <button className="bg-[#006fee] h-[42px] flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors">
                                                        <p className="text-[14px] font-normal leading-5 text-white">
                                                            Reply
                                                        </p>
                                                    </button>
                                                </div>

                                                {/* Replies */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <>
                                                        {comment.replies.map((reply: any) => (
                                                            <div key={reply.id} className="border border-[#c5c5c5] flex flex-col gap-5 items-start justify-center px-10 py-[50px] rounded-[30px] w-[calc(100%-123px)]">
                                                                {/* Header: User Info + Edit Button */}
                                                                <div className="flex items-start justify-between w-full">
                                                                    {/* User Info */}
                                                                    <div className="flex gap-2 items-center">
                                                                        {/* Avatar */}
                                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa] shrink-0">
                                                                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                                                                {reply.userName.charAt(0)}
                                                                            </div>
                                                                        </div>
                                                                        {/* Name & Date */}
                                                                        <div className="flex flex-col">
                                                                            <p className="text-[14px] font-normal leading-5 text-[#11181c]">
                                                                                {reply.userName}
                                                                            </p>
                                                                            <p className="text-[12px] font-normal leading-4 text-[#a1a1aa]">
                                                                                {new Date(reply.replyDate || comment.commentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Edit Button */}
                                                                    <button className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                                                                        <p className="text-[14px] font-normal leading-5 text-[#006fee]">
                                                                            Edit
                                                                        </p>
                                                                    </button>
                                                                </div>

                                                                {/* Reply Text */}
                                                                <p className="text-[18px] font-normal leading-7 text-[#3f3f46] w-full">
                                                                    {reply.replyText}
                                                                </p>

                                                                {/* Reply Button */}
                                                                <button className="bg-[#006fee] h-[42px] flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors">
                                                                    <p className="text-[14px] font-normal leading-5 text-white">
                                                                        Reply
                                                                    </p>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-[#3f3f46] text-lg">No comments yet. Be the first to share your thoughts!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave a Reply Section */}
            {post.enableComments === true && (
                <div className="bg-white pb-20 pt-10">
                    <div className="w-full px-4 md:px-8 lg:px-50">
                        <div className="max-w-283.5 mx-auto">
                            <div className="border border-[#e4e4e7] flex flex-col gap-13 items-center p-8 rounded-[14px]">
                                {/* Leave a Reply Title */}
                                <h2 className="text-[36px] font-bold leading-10 text-[#27272a] text-center">
                                    Leave a Reply
                                </h2>

                                {/* Form */}
                                <form className="flex flex-col gap-6 w-full">
                                    {/* Name and Email Row */}
                                    <div className="flex gap-4 w-full">
                                        {/* Full Name Input */}
                                        <div className="flex-1 min-w-29">
                                            <div className="bg-[#f4f4f5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                                                <div className="flex-1 flex flex-col items-start justify-center px-1.5 pb-0.5">
                                                    {/* Label */}
                                                    <div className="flex items-center pr-2 w-full">
                                                        <p className="text-[12px] font-normal leading-4 text-[#52525b]">
                                                            Full Name
                                                        </p>
                                                        <p className="text-[14px] font-normal leading-5 text-[#f31260] pl-0.5">
                                                            *
                                                        </p>
                                                    </div>
                                                    {/* Input */}
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your Full Name"
                                                        className="text-[14px] font-normal leading-5 text-[#11181c] w-full bg-transparent border-none outline-none placeholder:text-[#71717a]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Input */}
                                        <div className="flex-1 min-w-[116px]">
                                            <div className="bg-[#f4f4f5] flex items-center min-h-[32px] px-[6px] py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                                                <div className="flex-1 flex flex-col items-start justify-center px-[6px] pb-[2px]">
                                                    {/* Label */}
                                                    <div className="flex items-center pr-2 w-full">
                                                        <p className="text-[12px] font-normal leading-4 text-[#52525b]">
                                                            Email
                                                        </p>
                                                        <p className="text-[14px] font-normal leading-5 text-[#f31260] pl-[2px]">
                                                            *
                                                        </p>
                                                    </div>
                                                    {/* Input */}
                                                    <input
                                                        type="email"
                                                        placeholder="Enter your Email"
                                                        className="text-[14px] font-normal leading-5 text-[#11181c] w-full bg-transparent border-none outline-none placeholder:text-[#71717a]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments Textarea */}
                                    <div className="flex flex-col h-[121px] min-w-[116px] w-full">
                                        <div className="bg-[#f4f4f5] flex-1 flex items-start min-h-[32px] px-[6px] py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                                            <div className="flex-1 flex flex-col h-full items-start px-[6px] pb-[2px]">
                                                {/* Label */}
                                                <div className="flex items-center pr-2 w-full">
                                                    <p className="text-[12px] font-normal leading-4 text-[#52525b]">
                                                        Comments
                                                    </p>
                                                </div>
                                                {/* Textarea */}
                                                <textarea
                                                    placeholder="content"
                                                    className="text-[14px] font-normal leading-5 text-[#11181c] w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-[#71717a]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkbox */}
                                    <label className="flex gap-2 items-center p-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 rounded-md border-none bg-[#d4d4d8] cursor-pointer accent-[#d4d4d8]"
                                        />
                                        <p className="text-[18px] font-normal leading-7 text-[#11181c]">
                                            Save my name, email, and website in this browser for the next time I comment.
                                        </p>
                                    </label>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="bg-[#006fee] h-[42px] flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors w-fit"
                                    >
                                        <p className="text-[14px] font-normal leading-5 text-white">
                                            Post comment
                                        </p>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
