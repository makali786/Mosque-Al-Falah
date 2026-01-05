"use client";

import Image from "next/image";
import ViewToggleButtons from "./ViewToggleButtons";
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
    };
    author?: {
      name: string;
      role?: string;
      avatar?: string;
      initials?: string;
    };
    videoUrl?: string;
    description?: string; // Sometimes needed for list view
  };
  layout?: "grid" | "list";
}

export default function SermonCard({ sermon, layout = "grid" }: SermonCardProps) {
  // Normalize data if necessary (handling raw sermon vs simplified)
  // The 'Sermons.tsx' mapped it before rendering, so we should probably accept the Mapped format or handle mapping inside.
  // To correspond with existing Sermons.tsx usage, let's keep the logic close.
  
  const imageUrl = typeof sermon.image === 'string' 
    ? sermon.image 
    : getMediaUrl(sermon.image as unknown as Media);

  const date = sermon.sermonDate ? new Date(sermon.sermonDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : (sermon as any).date || "No Date"; // Fallback if pre-formatted

  const title = sermon.title;
  
  // Author handling
  const authorName = sermon.author?.name || sermon.guestSpeaker?.name || "Unknown";
  const authorRole = sermon.author?.role || sermon.guestSpeaker?.title || "";
  const authorInitials = sermon.author?.initials || (authorName ? authorName.substring(0, 2).toUpperCase() : "NA");
  const authorAvatar = sermon.author?.avatar; 

  const videoUrl = sermon.videoUrl || "";

  if (layout === "list") {
    return (
      <div className="flex flex-col md:flex-row w-full gap-6 bg-white rounded-[14px] overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        {/* Image Section */}
        <div className="relative w-full md:w-[300px] lg:w-[350px] aspect-[16/9] md:h-auto shrink-0">
             {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-t-[14px] md:rounded-l-[14px] md:rounded-tr-none"
                />
              )}
             {/* Audio/Video Buttons for List View could be overlaid or separate. 
                 Design usually puts them on image or bottom. Let's keep consistency with grid. */}
              <ViewToggleButtons
                onAudioClick={() => console.log("Audio clicked:", sermon.id)}
                videoUrl={videoUrl}
                className="absolute bottom-3 right-3"
              />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4 md:py-6 md:pr-6 justify-center gap-4">
             {/* Date */}
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

               {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                  {title}
              </h3>
              
              {/* Description (if available) - only for list view usually */}
               {sermon.description && (
                   <p className="text-sm text-gray-600 line-clamp-2">
                       {sermon.description}
                   </p>
               )}

              {/* Author */}
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
      </div>
    );
  }

  // Grid Layout (Original)
  return (
    <div className="flex flex-col gap-6.25 w-full group">
       {/* Image with overlay buttons */}
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
          </div>

          <ViewToggleButtons
             onAudioClick={() => console.log("Audio clicked:", sermon.id)}
             videoUrl={videoUrl}
             className="absolute -bottom-6 right-4 lg:-bottom-6 lg:right-3.75"
          />
       </div>

       {/* Content */}
       <div className="flex flex-col gap-4">
          {/* Date */}
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

          {/* Title and Author */}
          <div className="flex flex-col gap-3 lg:gap-4">
             <h3 className="text-xl lg:text-2xl font-medium lg:font-semibold text-black leading-7 lg:leading-8 group-hover:text-blue-600 transition-colors">
                {title}
             </h3>

             {/* Author */}
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
    </div>
  );
}
