"use client";

import React from "react";
import Image from "next/image";
import ViewToggleButtons from "./ViewToggleButtons";
import Link from "next/link";
import { Media } from "../../../../payload-types";
import { getMediaUrl } from "../../../../lib/helper";

export interface SermonCardProps {
  sermon: {
    id: number | string;
    image?: string | { url: string } | null;
    sermonDate?: string;
    title: string;
    guestSpeaker?: {
      name?: string;
      title?: string;
       avatar?: string | { url: string } | null;
    };
    author?: {
      name: string;
      role?: string;
      avatar?: string;
      initials?: string;
    };
    videoUrl?: string;
    description?: string; // Sometimes needed for list view
     slug?: string;
  };
  layout?: "grid" | "list";
}

export default function SermonCard({ sermon, layout = "grid" }: SermonCardProps) {
  const imageUrl = typeof sermon.image === 'string' 
    ? sermon.image 
    : getMediaUrl(sermon.image as unknown as Media);

  const date = sermon.sermonDate ? new Date(sermon.sermonDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : (sermon as any).date || "No Date"; 

  const title = sermon.title;

   const guestSpeaker = sermon.guestSpeaker;
   const useGuest = !!(guestSpeaker?.name);

   const authorName = (useGuest ? guestSpeaker!.name : sermon.author?.name) || "Unknown";
   const authorRole = (useGuest ? guestSpeaker!.title : sermon.author?.role) || "";

   const rawAvatar = useGuest ? guestSpeaker!.avatar : sermon.author?.avatar;
   const authorAvatar = (typeof rawAvatar === 'object' && rawAvatar !== null && 'url' in rawAvatar)
      ? rawAvatar.url
      : (typeof rawAvatar === 'string' ? rawAvatar : null);

   const authorInitials = (!useGuest && sermon.author?.initials) || (authorName.substring(0, 2).toUpperCase()); 

   const videoUrl = sermon.videoUrl || "";
   const slug = sermon.slug || sermon.id;

   const CardWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
      const finalClassName = `${className || ""} ${slug ? "cursor-pointer" : ""}`;

      if (slug) {
         return (
            <Link href={`/sermons/${slug}`} className={finalClassName}>
               {children}
            </Link>
         );
      }

      return <div className={finalClassName}>{children}</div>
   }

  if (layout === "list") {
    return (
       <CardWrapper className="flex flex-col md:flex-row w-full gap-6 bg-white rounded-[14px] overflow-hidden relative group">
        <div className="relative w-full md:w-[300px] lg:w-[350px] aspect-[16/9] md:h-auto shrink-0">
             {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-t-[14px] md:rounded-l-[14px] md:rounded-tr-none"
                />
              )}
             {/* Hover overlay */}
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors rounded-t-[14px] md:rounded-l-[14px] md:rounded-tr-none" />
             <div onClick={(e) => e.stopPropagation()}>
                <ViewToggleButtons
                   onAudioClick={(e) => { e?.preventDefault(); console.log("Audio clicked:", sermon.id) }}
                   videoUrl={videoUrl}
                   className="absolute bottom-3 right-3"
                />
             </div>
          </div>

          <div className="flex flex-col flex-1 p-4 md:py-6 md:pr-6 justify-center gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src={"/assets/topbar/calendar-icon.svg"}
                  alt={"calendar"}
                  width={16}
                  height={16}
                  className="w-4 h-4 text-gray-500"
                />
                <p className="text-sm text-gray-500 leading-5">
                  {date}
                </p>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight group-hover:text-[#006FEE] transition-colors">
                  {title}
              </h3>

               {sermon.description && (
                   <p className="text-sm text-gray-600 line-clamp-2">
                       {sermon.description}
                   </p>
               )}

              <div className="flex items-center gap-3 mt-auto">
                  {authorAvatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={authorAvatar}
                        alt={authorName}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-medium">
                      {authorInitials}
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {authorName}
                    </p>
                     {authorRole && (
                        <p className="text-xs text-gray-500">
                           {authorRole}
                        </p>
                     )}
                  </div>
              </div>
        </div>
       </CardWrapper>
    );
  }

  return (
     <CardWrapper className="flex flex-col gap-6.25 w-full group relative">
       <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-visible">
          <div className="relative w-full h-full rounded-[14px] overflow-hidden">
             {imageUrl && (
                <Image
                   src={imageUrl}
                   alt={title}
                   fill
                   className="object-cover"
                />
             )}
             {/* Hover overlay */}
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
          </div>

           <div onClick={(e) => e.stopPropagation()}>
              <ViewToggleButtons
                 onAudioClick={(e) => { e?.preventDefault(); console.log("Audio clicked:", sermon.id) }}
                 videoUrl={videoUrl}
                 className="absolute -bottom-6 right-4 lg:-bottom-6 lg:right-3.75"
              />
           </div>
       </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
             <Image
                src={"/assets/topbar/calendar-icon.svg"}
                alt={"calendar"}
                width={16}
                height={16}
                className="object-cover"
             />
             <p className="text-sm font-normal text-[#27272a] leading-5">
                {date}
             </p>
          </div>

          <div className="flex flex-col gap-3 lg:gap-4">
             <h3 className="text-xl lg:text-2xl font-medium lg:font-semibold text-black leading-7 lg:leading-8 group-hover:text-[#006FEE] transition-colors">
                {title}
             </h3>

             <div className="flex items-center gap-2">
                {authorAvatar ? (
                   <div className="w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa]">
                      <Image
                         src={authorAvatar}
                         alt={authorName}
                         width={40}
                         height={40}
                         className="object-contain"
                      />
                   </div>
                ) : (
                   <div className="w-10 h-10 rounded-full bg-[#d4d4d8] flex items-center justify-center">
                      <span className="text-xs font-normal text-[#11181c]">
                         {authorInitials}
                      </span>
                   </div>
                )}

                <div className="flex flex-col">
                   <p className="text-sm font-normal text-[#11181c] leading-5">
                      {authorName}
                   </p>
                   {authorRole && (
                      <p className="text-xs font-normal text-[#a1a1aa] leading-4">
                         {authorRole}
                      </p>
                   )}
                </div>
             </div>
          </div>
       </div>
     </CardWrapper>
  );
}
