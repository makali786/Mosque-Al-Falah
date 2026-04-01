/**
 * Custom Cloudinary Image Loader with caching optimization
 * Use this in your next.config.ts to reduce Cloudinary credit usage
 */

interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderParams): string {
  // If it's already a Cloudinary URL, add optimization params
  if (src.includes('cloudinary.com')) {
    const params = [
      'f_auto',        // Auto format (WebP/AVIF)
      'q_auto:good',   // Auto quality
      'dpr_auto',      // Auto device pixel ratio
      `w_${width}`,    // Requested width
    ];
    
    // Add quality param if specified
    if (quality) {
      params.push(`q_${quality}`);
    }
    
    // Check if URL already has transformations
    if (src.includes('/upload/')) {
      // Insert optimization params before the version/folder path
      return src.replace('/upload/', `/upload/${params.join(',')}/`);
    }
    
    return src;
  }
  
  // Return as-is for non-Cloudinary URLs
  return src;
}

/**
 * Cache configuration for Next.js images
 * This reduces repeated requests to Cloudinary
 */
export const imageCacheConfig = {
  // Cache images for 1 year (immutable assets)
  minimumCacheTTL: 31536000,
  // Device sizes to generate
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  // Image sizes to generate
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
};
