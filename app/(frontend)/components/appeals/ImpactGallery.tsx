"use client";

import Image from "next/image";
import { Media } from "../../../../payload-types";
import { getMediaUrl, getMediaAlt } from "../../../../lib/helper";

interface ImpactGalleryProps {
  title?: string;
  description?: string;
  images: {
    image: Media | string | null;
    caption?: string;
    altText?: string;
  }[];
}

export function ImpactGallery({ 
  title = "Donation Impact Gallery", 
  description = "See how your generosity transforms our Masjid and community—one contribution at a time.", 
  images 
}: ImpactGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="section-padding py-16 sm:py-20 bg-white">
      <div className="flex flex-col lg:gap-[60px]">
        {/* Header */}
        <div className="flex flex-col gap-6 max-w-[594px]">
          <h2 className="text-3xl font-bold sm:text-5xl">
            {title}
          </h2>
          {description && (
             <p className="text-lg text-[#27272A]">
               {description}
             </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] sm:auto-rows-[300px]">
          {images.map((item, index) => {
            const imageUrl = getMediaUrl(item.image);
            const imageAlt = getMediaAlt(item.image) || item.altText || `Impact image ${index + 1}`;
            
            let gridClass = "col-span-1";
            const total = images.length;

            if (total === 1) {
              gridClass = "md:col-span-2 lg:col-span-3";
            } else if (total === 2) {
              if (index === 0) gridClass = "md:col-span-1 lg:col-span-2";
            } else if (total === 3) {
              if (index === 0) gridClass = "md:col-span-2 lg:col-span-1";
            } else if (total === 4) {
              if (index === 0 || index === 3) gridClass = "md:col-span-1 lg:col-span-2";
            } else if (total === 5) {
              if (index === 0) gridClass = "md:col-span-2 lg:col-span-2";
            } else {
              if (index === 0) gridClass = "md:col-span-1 lg:col-span-2";
              if (index === 5) gridClass = "md:col-span-2 lg:col-span-3";
            }

            // Simplest robust masonry-like feel:
            return (
              <div 
                key={index} 
                className={`relative overflow-hidden group ${gridClass}`}
              >
                 {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                    />
                 ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Image</div>
                 )}
                 {item.caption && (
                     <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <p className="text-sm font-medium">{item.caption}</p>
                     </div>
                 )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
