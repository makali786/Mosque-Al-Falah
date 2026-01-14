import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchGlobal, fetchBlogPosts } from "../../../../lib/fetcher";
import { getMediaUrl } from "../../../../lib/helper";
import { RichTextRenderer } from "../../components/common/RichTextRenderer";
import { QuoteSection } from "../../components/common/QuoteSection";
import PageHero from "../../components/common/PageHero";
import RelatedPostsCarousel from "../../components/blogs/RelatedPostsCarousel";
import CommentForm from "../../components/blogs/CommentForm";
import CommentsSection from "../../components/blogs/CommentsSection";

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
            <div className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-50">
                <div className="flex flex-col gap-8 md:gap-12 lg:gap-15 max-w-283.5 mx-auto">

                    {/* Main Content from CMS - Figma Perfect Styling */}
                    <article className="prose prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-black
                        prose-h1:text-3xl md:prose-h1:text-5xl lg:prose-h1:text-[64px] prose-h1:leading-tight md:prose-h1:leading-tight lg:prose-h1:leading-[70px]
                        prose-h2:text-2xl md:prose-h2:text-4xl lg:prose-h2:text-[48px] prose-h2:leading-tight md:prose-h2:leading-tight lg:prose-h2:leading-[48px] prose-h2:mb-0 prose-h2:mt-0
                        prose-h3:text-xl md:prose-h3:text-3xl lg:prose-h3:text-[32px] prose-h3:leading-tight md:prose-h3:leading-tight lg:prose-h3:leading-[40px]
                        prose-p:text-sm md:prose-p:text-base lg:prose-p:text-lg prose-p:leading-relaxed prose-p:text-[#27272a] prose-p:mb-0 prose-p:mt-0
                        prose-a:text-[#006fee] prose-a:underline hover:prose-a:text-[#005bc4]
                        prose-strong:font-bold prose-strong:text-black
                        prose-ul:list-none prose-ul:p-[10px] prose-ul:my-0
                        prose-ol:list-none prose-ol:p-[10px] prose-ol:my-0
                        prose-li:text-sm md:prose-li:text-base lg:prose-li:text-lg prose-li:leading-relaxed prose-li:text-[#27272a] prose-li:my-0 prose-li:pl-0
                        prose-img:rounded-[14px]
                        *:mb-6 md:*:mb-10 lg:*:mb-15 [&>*:last-child]:mb-0
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
                            <p className="text-sm md:text-base font-semibold text-black">TAGS:</p>
                            <div className="flex gap-2.5 flex-wrap">
                                {post.tags.map((tagItem: any, index: number) => (
                                    <div key={index} className="bg-[#002e62] px-4 py-1 rounded-full overflow-hidden">
                                        <p className="text-xs md:text-sm font-semibold text-white uppercase">
                                            {typeof tagItem === 'string' ? tagItem : tagItem.tag}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Previous/Next Post Navigation */}
                    {(prevPost || nextPost) && (
                        <div className="mt-12 md:mt-16 lg:mt-20 border border-[#e4e4e7] rounded-[14px] flex flex-col lg:flex-row items-center justify-center overflow-hidden">
                            {/* Previous Post */}
                            {prevPost ? (
                                <Link
                                    href={`/blogs/${prevPost.slug}`}
                                    className="flex flex-1 gap-4 lg:gap-5 items-center p-5 lg:p-7.5 hover:bg-gray-50 transition-colors w-full"
                                >
                                    <div className="relative w-20 h-20 lg:w-35 lg:h-35 rounded-[14px] overflow-hidden bg-[#cce3fd] shrink-0">
                                        {getMediaUrl(prevPost.featuredImage) && (
                                            <Image
                                                src={getMediaUrl(prevPost.featuredImage)!}
                                                alt={prevPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 lg:gap-2.5 flex-1 min-w-0">
                                        <p className="text-xs lg:text-sm font-normal text-[#71717a]">
                                            Previous Post
                                        </p>
                                        <p className="text-sm lg:text-base font-semibold text-[#27272a] line-clamp-2">
                                            {prevPost.title}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-1 gap-4 lg:gap-5 items-center p-5 lg:p-7.5 opacity-50 w-full">
                                    <div className="w-20 h-20 lg:w-35 lg:h-35 rounded-[14px] bg-[#cce3fd] shrink-0" />
                                    <div className="flex flex-col gap-2 lg:gap-2.5 flex-1 min-w-0">
                                        <p className="text-xs lg:text-sm font-normal text-[#71717a]">
                                            Previous Post
                                        </p>
                                        <p className="text-sm lg:text-base font-semibold text-[#27272a]">
                                            No previous post
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="hidden lg:block w-px h-50 bg-[#e4e4e7]" />
                            <div className="lg:hidden w-full h-px bg-[#e4e4e7]" />

                            {/* Next Post */}
                            {nextPost ? (
                                <Link
                                    href={`/blogs/${nextPost.slug}`}
                                    className="flex flex-1 gap-4 lg:gap-5 items-center p-5 lg:p-7.5 hover:bg-gray-50 transition-colors w-full"
                                >
                                    <div className="relative w-20 h-20 lg:w-35 lg:h-35 rounded-[14px] overflow-hidden bg-[#cce3fd] shrink-0 lg:order-2">
                                        {getMediaUrl(nextPost.featuredImage) && (
                                            <Image
                                                src={getMediaUrl(nextPost.featuredImage)!}
                                                alt={nextPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 lg:gap-2.5 flex-1 min-w-0 lg:items-end lg:text-right lg:order-1">
                                        <p className="text-xs lg:text-sm font-normal text-[#71717a]">
                                            Next Post
                                        </p>
                                        <p className="text-sm lg:text-base font-semibold text-[#006fee] line-clamp-2">
                                            {nextPost.title}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-1 gap-4 lg:gap-5 items-center p-5 lg:p-7.5 opacity-50 w-full">
                                    <div className="w-20 h-20 lg:w-35 lg:h-35 rounded-[14px] bg-[#cce3fd] shrink-0 lg:order-2" />
                                    <div className="flex flex-col gap-2 lg:gap-2.5 flex-1 min-w-0 lg:items-end lg:text-right lg:order-1">
                                        <p className="text-xs lg:text-sm font-normal text-[#71717a]">
                                            Next Post
                                        </p>
                                        <p className="text-sm lg:text-base font-semibold text-[#006fee]">
                                            No next post
                                        </p>
                                    </div>
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
                <CommentsSection
                    postId={post.id}
                    comments={(post.comments || []).map((comment: any) => ({
                        ...comment,
                        userAvatarUrl: comment.userAvatar ? getMediaUrl(comment.userAvatar) : null,
                    }))}
                />
            )}

            {/* Leave a Reply Section */}
            {post.enableComments === true && (
                <CommentForm postId={post.id} existingComments={post.comments || []} />
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
