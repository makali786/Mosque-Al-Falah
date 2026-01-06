"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface MediaItem {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  type: "video" | "audio" | "gallery" | "podcast";
  date?: string;
  duration?: string;
  slug?: string;
  videoUrl?: string;
}

interface MediaCardProps {
  media: MediaItem;
  layout?: "grid" | "list";
}

export default function MediaCard({ media, layout = "grid" }: MediaCardProps) {
  const { title, description, image, type, slug } = media;

  // Determine icon and label based on type
  const getTypeStyle = () => {
    switch (type) {
      case "video":
        return {
          icon: "/assets/common/video-icon-show.svg", // Using play-small for the label icon
          label: "Videos",
        };
      case "podcast":
      case "audio":
        return {
          icon: "/assets/common/podcast-icon.svg",
          label: "Podcast",
        };
      case "gallery":
        return {
          icon: "/assets/common/list-icon.svg",
          label: "Photo Gallery",
        };
      default:
        return {
          icon: "/assets/ayat/play-small.svg",
          label: "Media",
        };
    }
  };

  const { icon, label } = getTypeStyle();

  const Wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (slug) {
      return (
        <Link href={`/media/${slug}`} className={className}>
          {children}
        </Link>
      );
    }
    return <div className={className}>{children}</div>;
  };

  if (layout === "list") {
     return (
       <Wrapper className="flex flex-col md:flex-row w-full gap-6 bg-white rounded-[14px] overflow-hidden cursor-pointer group">
           {/* Image Section */}
         <div className="relative w-full md:w-75 lg:w-87.5 aspect-video md:h-auto shrink-0">
              {image && (
                 <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover rounded-t-[14px] md:rounded-l-[14px] md:rounded-tr-none"
                 />
              )}
               {/* Centered Play Button Overlay */}
              {(type === "video" || type === "audio" || type === "podcast") && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                   <div className="w-14 h-14 rounded-full flex items-center justify-center transition-colors">
                      <Image
                         src="/assets/common/play-icon.svg"
                         alt="Play"
                         width={28}
                         height={28}
                      />
                   </div>
                </div>
              )}
           </div>

           {/* Content Section */}
           <div className="flex flex-col flex-1 p-4 md:py-6 md:pr-6 justify-center gap-4">
              {/* Type Badge */}
              <div className="flex items-center gap-2">
                 <div className="flex items-center justify-center w-5 h-5 bg-[#E6F1FE] rounded-full shrink-0">
                    <Image src={icon} alt={label} width={14} height={14} className="object-contain" />
                 </div>
                 <span className="text-sm font-medium text-[#3F3F46]">{label}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight group-hover:text-[#006FEE] transition-colors">
                 {title}
              </h3>

              {/* Description */}
              {description && (
                 <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {description}
                 </p>
              )}
           </div>
        </Wrapper>
     );
  }

  // Grid Layout
  return (
    <Wrapper className="flex flex-col gap-4 w-full group cursor-pointer shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
                      className="object-cover"
          />
        )}
        
        {/* Centered Play Button Overlay for Video/Podcast */}
        {(type === "video" || type === "audio" || type === "podcast") && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center">
                    <Image
                        src="/assets/common/play-icon.svg" 
                        alt="Play"
                        width={40}
                        height={40}
                        className="text-black"
                    />
                </div>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 sm:p-4">
        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 bg-[#E6F1FE] rounded-full shrink-0">
            <Image src={icon} alt={label} width={18} height={18} />
          </div>
          <span className="text-sm font-medium text-[#3F3F46]">{label}</span>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-base line-clamp-3 text-[#27272A]">
            {description}
          </p>
        )}
      </div>
    </Wrapper>
  );
}
