// @ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Media } from '@/payload-types';
import { RichTextRenderer } from './RichTextRenderer';

// Loose type definition until generation works
interface Popup {
    id: string;
    title: string;
    isActive?: boolean;
    priority?: number;
    type: 'general' | 'daily_reminder' | 'ramadan';
    frequency: 'always' | 'once_per_day' | 'once_ever';
    scheduling?: {
        startDate?: string;
        endDate?: string;
        daysOfWeek?: string[];
    };
    content?: {
        message?: any;
        backgroundImage?: Media | string;
        contentMedia?: Media | string;
        videoUrl?: string;
    };
    actions?: {
        label: string;
        link: string;
        style?: 'primary' | 'secondary';
    }[];
}

export default function PopupManager() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [activePopup, setActivePopup] = useState<Popup | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPopups = async () => {
            try {
                const res = await fetch('/api/popups?where[isActive][equals]=true&depth=1&limit=100');
                const data = await res.json();
                if (data.docs) {
                    setPopups(data.docs);
                }
            } catch (error) {
                console.error('Failed to fetch popups:', error);
            }
        };

        fetchPopups();
    }, []);

    useEffect(() => {
        const syncAndFilter = async () => {
            // 1. Fetch Hijri info from prayer times
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');

            let hijriInfo = { isRamadan: false, day: 0 };
            try {
                const pRes = await fetch(`/api/prayer-times?where[date][equals]=${yyyy}-${mm}-${dd}&limit=1`);
                const pData = await pRes.json();
                const hijriDate = pData.docs?.[0]?.hijriDate || '';
                if (hijriDate) {
                    const detectedDay = parseInt(hijriDate.split(' ')[0], 10);
                    // Adjust as per user request (showing one day previous if it seems ahead)
                    hijriInfo.day = detectedDay - 1;
                    hijriInfo.isRamadan = hijriDate.toLowerCase().includes('ramadan') || hijriDate.toLowerCase().includes('ramadhan');
                }
            } catch (e) {
                console.error('Failed to sync Hijri date for popups', e);
            }

            // 2. Filter active popups based on date
            const validPopups = popups.filter(popup => {
                if (!popup.isActive) return false;

                // If it's a specific Ramadan Day popup, we handle it via Smart Selection below
                // But we still check if it's within its broad scheduled range if needed
                if (popup.scheduling?.startDate && new Date(popup.scheduling.startDate) > now) return false;
                if (popup.scheduling?.endDate && new Date(popup.scheduling.endDate) < now) return false;

                if (popup.scheduling?.daysOfWeek && popup.scheduling.daysOfWeek.length > 0) {
                    const currentDayIndex = now.getDay().toString();
                    if (!popup.scheduling.daysOfWeek.includes(currentDayIndex)) return false;
                }
                return true;
            });

            // 3. Smart Selection for Ramadan
            let selectedPopup = null;
            if (hijriInfo.isRamadan && hijriInfo.day > 0) {
                // Look for "Ramadan Day X" in title
                selectedPopup = validPopups.find(p =>
                    p.title.toLowerCase().includes(`ramadan day ${hijriInfo.day}`) ||
                    p.title.toLowerCase().includes(`ramadhan day ${hijriInfo.day}`)
                );
            }

            // 4. Fallback to priority sorting if no specific Hijri match
            if (!selectedPopup && validPopups.length > 0) {
                validPopups.sort((a, b) => (b.priority || 0) - (a.priority || 0));

                selectedPopup = validPopups.find(popup => {
                    const storageKey = `popup-shown-${popup.id}`;
                    const lastShown = localStorage.getItem(storageKey);

                    if (popup.frequency === 'once_ever' && lastShown) return false;
                    if (popup.frequency === 'once_per_day' && lastShown) {
                        const lastShownDate = new Date(lastShown).toDateString();
                        const today = new Date().toDateString();
                        if (lastShownDate === today) return false;
                    }
                    return true;
                });
            }

            if (selectedPopup) {
                // Small delay to let page render
                const timer = setTimeout(() => {
                    setActivePopup(selectedPopup);
                    setIsOpen(true);

                    // Mark as shown
                    const storageKey = `popup-shown-${selectedPopup.id}`;
                    localStorage.setItem(storageKey, new Date().toISOString());
                }, 1000);
                return () => clearTimeout(timer);
            }
        };

        if (popups.length > 0) {
            syncAndFilter();
        }
    }, [popups]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    if (!activePopup || !isOpen) return null;

    const { content, actions } = activePopup;
    const bgImage = content?.backgroundImage as Media | undefined;
    const contentMedia = content?.contentMedia as Media | undefined;

    return (
        <div
            className="rc-modal-overlay"
            onClick={e => {
                if (e.target === e.currentTarget) handleClose();
            }}
            style={{ zIndex: 9999 }} // Ensure it's on top
        >
            <div className="rc-modal">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="rc-close-btn"
                    aria-label="Close"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Background image */}
                {bgImage?.url && (
                    <div
                        className="rc-bg-image"
                        style={{
                            backgroundImage: `url(${bgImage.url})`,
                            opacity: 0.6
                        }}
                    />
                )}
                <div className="rc-bg-overlay" />

                {/* Content */}
                <div className="rc-content relative z-10 p-8 flex flex-col items-center text-center h-full justify-center overflow-y-auto">



                    {/* Title */}
                    <h2 className="rc-title !text-3xl md:!text-4xl mb-4">
                        {activePopup.title}
                    </h2>

                    <div className="rc-subtitle-wrap mb-6">
                        <span className="rc-line-accent" />
                        <span className="rc-line-accent" />
                    </div>

                    {/* Message */}
                    {content?.message && (
                        <div className="rc-description !text-lg !text-gray-200 mb-8 max-w-2xl">
                            <RichTextRenderer content={content.message} />
                        </div>
                    )}
                    {/* Featured Media (Image/Video) */}
                    {contentMedia?.url && (
                        <div className="mb-6 w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            {contentMedia.mimeType?.startsWith('video/') ? (
                                <video
                                    src={contentMedia.url}
                                    controls
                                    className="w-full h-auto"
                                />
                            ) : (
                                <img
                                    src={contentMedia.url}
                                    alt={contentMedia.alt || activePopup.title}
                                    className="w-full h-auto object-cover"
                                />
                            )}
                        </div>
                    )}

                    {/* Video URL (YouTube/Vimeo) */}
                    {content?.videoUrl && (
                        <div className="mb-6 w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            <iframe
                                width="100%"
                                height="100%"
                                src={content.videoUrl.replace('watch?v=', 'embed/')}
                                title="Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* Actions / Buttons */}
                    {actions && actions.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center mt-auto">
                            {actions.map((action, i) => (
                                <a
                                    key={i}
                                    href={action.link}
                                    className={
                                        action.style === 'secondary'
                                            ? 'px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors'
                                            : 'rc-donate-btn !mb-0'
                                    }
                                >
                                    {action.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
