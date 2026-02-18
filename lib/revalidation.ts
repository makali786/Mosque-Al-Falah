import { revalidatePath } from 'next/cache';

/**
 * Maps Payload CMS collection/global slugs to the frontend paths they affect.
 * When content is saved in the admin panel, we revalidate only the affected pages.
 */
const SLUG_TO_PATHS: Record<string, string[]> = {
  // ── Globals ──────────────────────────────────────────
  'home-page': ['/'],
  'about-page': ['/about'],
  'contact-page': ['/contact-us'],
  'services-page': ['/our-services'],
  'sermons-page': ['/sermons'],
  'events-page': ['/events'],
  'media-page': ['/media'],
  'blogs-page': ['/blogs'],
  'donation-appeals-page': ['/appeals'],
  'madrasah-page': ['/madrasah'],
  'prayer-times-page': ['/prayer-time'],
  'prayer-time-settings': ['/prayer-time'],

  // ── Collections ──────────────────────────────────────
  banners: ['/'],
  notices: ['/'],
  events: ['/', '/events'],
  services: ['/', '/our-services'],
  sermons: ['/', '/sermons'],
  'blog-posts': ['/blogs'], // individual posts handled separately
  'donation-appeals': ['/appeals', '/donate', '/'],
  'media-items': ['/media'],
  'prayer-times': ['/prayer-time'],
  imams: ['/', '/about'],
  'core-values': ['/about'],
  committees: ['/about'],
  'madrasah-classes': ['/madrasah'],
  'madrasah-testimonials': ['/madrasah'],
  'ayat-of-the-month': ['/'],
  donations: ['/appeals'], // updates appeal progress bars
  popups: ['/'],
};

/**
 * Revalidate all frontend pages affected by a given Payload slug.
 * Call this from afterChange hooks.
 */
export function revalidateBySlug(slug: string) {
  const paths = SLUG_TO_PATHS[slug];
  if (!paths) return;

  for (const path of paths) {
    try {
      revalidatePath(path);
      console.log(
        `[Revalidation] ✅ Revalidated ${path} (triggered by ${slug})`
      );
    } catch (err) {
      console.error(`[Revalidation] ❌ Failed to revalidate ${path}:`, err);
    }
  }
}

/**
 * Revalidate a specific blog post page by its slug.
 */
export function revalidateBlogPost(postSlug: string) {
  try {
    revalidatePath(`/blogs/${postSlug}`);
    console.log(`[Revalidation] ✅ Revalidated /blogs/${postSlug}`);
  } catch (err) {
    console.error(
      `[Revalidation] ❌ Failed to revalidate /blogs/${postSlug}:`,
      err
    );
  }
}

/**
 * Creates a Payload afterChange hook that triggers revalidation.
 * Usage in a collection: hooks: { afterChange: [createRevalidateHook('events')] }
 * Usage in a global:     hooks: { afterChange: [createRevalidateHook('home-page')] }
 */
export function createRevalidateHook(slug: string) {
  return ({ doc }: { doc: any }) => {
    revalidateBySlug(slug);

    // Special case: blog posts also revalidate their individual page
    if (slug === 'blog-posts' && doc?.slug) {
      revalidateBlogPost(doc.slug);
    }

    return doc;
  };
}
