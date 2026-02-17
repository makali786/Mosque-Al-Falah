"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaPlayer } from "@/components/common/MediaPlayerContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { FaPlay, FaPause } from "react-icons/fa";

interface MediaDetailPlayerProps {
    title: string;
    videoUrl: string;
    thumbnail?: string;
    isLive?: boolean;
    type: "video" | "audio" | "podcast"; // Handling non-gallery types
    description?: string;
}

export default function MediaDetailPlayer({
    title,
    videoUrl,
    thumbnail,
    isLive,
    type,
    description,
}: MediaDetailPlayerProps) {
    const { play, stop, isPlaying, mediaData, setShowMiniPlayer } = useMediaPlayer();
    const [localIsPlaying, setLocalIsPlaying] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer to detect when player is out of view
    const isInView = useIntersectionObserver(containerRef as React.RefObject<Element>, { threshold: 0.3 });

    // Sync local playing state with global context
    useEffect(() => {
        if (mediaData?.url === videoUrl) {
            setLocalIsPlaying(isPlaying);
        } else {
            setLocalIsPlaying(false);
        }
    }, [isPlaying, mediaData, videoUrl]);

    // Handle MiniPlayer visibility
    useEffect(() => {
        // Only toggle MiniPlayer if THIS specific media is currently active
        if (mediaData?.url === videoUrl) {
            if (!isInView && isPlaying) {
                setShowMiniPlayer(true);
            } else if (isInView) {
                setShowMiniPlayer(false);
            }
        }
    }, [isInView, isPlaying, setShowMiniPlayer, mediaData, videoUrl]);

    // Helper to get embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        if (url.includes("/embed/")) return url;

        // YouTube
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
        }

        // Vimeo
        const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch && vimeoMatch[1]) {
            const videoId = vimeoMatch[1];
            const hash = vimeoMatch[2];
            return hash
                ? `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1`
                : `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        }

        return url;
    };

    const handlePlay = () => {
        play({
            type: type === "video" ? "video" : "audio",
            url: videoUrl,
            title: title,
            thumbnail: thumbnail,
            citation: description,
        });
        setLocalIsPlaying(true);
    };

    const embedUrl = getEmbedUrl(videoUrl);

    // If localIsPlaying is true, show the iframe/player
    // Otherwise show the thumbnail with play button
    // Note: AyatOfTheMonth switches "Mode", here we just switch view.

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-[14px] overflow-hidden mb-8 group lg:max-w-[735px] lg:max-h-[412px]"
        >
            {localIsPlaying && embedUrl && (!mediaData || mediaData.url !== videoUrl || !useMediaPlayer().showMiniPlayer) ? (
                <iframe
                    src={embedUrl}
                    title={title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            ) : (
                /* Thumbnail View */
                <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={title || "Video thumbnail"}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gray-900" />
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center">
                                <FaPlay className="text-black ml-1 text-xl sm:text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Live Badge */}
                    {isLive && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 z-10">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Live</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
