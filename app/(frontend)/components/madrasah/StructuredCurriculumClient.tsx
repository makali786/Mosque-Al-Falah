'use client';

import React, { useState } from 'react';
import './StructuredCurriculumClient.css';

type CurriculumItem = {
    number: string;
    title: string;
    description: string;
    id?: string | null;
};

type CurriculumBlock = {
    blockTitle: string;
    iconType: 'book' | 'head';
    items?: CurriculumItem[] | null;
    id?: string | null;
};

type StructuredCurriculumData = {
    enableSection?: boolean | null;
    title: string;
    description: string;
    infoBoxText?: string | null;
    curriculumBlocks?: CurriculumBlock[] | null;
};

interface StructuredCurriculumClientProps {
    data: StructuredCurriculumData;
}

/* ── SVG Icons ────────────────────────────────────────────────────────────── */

function BookIcon() {
    return (
        <img
            src="/assets/madrasah/icon-quran-studies.svg"
            alt="Qur'an Studies"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
        />
    );
}

function HeadIcon() {
    return (
        <img
            src="/assets/madrasah/icon-islamic-studies.svg"
            alt="Islamic Studies"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
        />
    );
}

function CloseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="13" y1="1" x2="1" y2="13" />
            <line x1="1" y1="1" x2="13" y2="13" />
        </svg>
    );
}

/* ── Icon Badge ───────────────────────────────────────────────────────────── */

function IconBadge({ variant, children }: { variant: 'navy' | 'yellow'; children: React.ReactNode }) {
    return (
        <div className={`sc-icon-badge sc-icon-badge-${variant}`}>
            <div className="sc-icon-badge-shadow" />
            <div className="sc-icon-badge-content">
                {children}
            </div>
        </div>
    );
}

/* ── Curriculum item row (shared) ─────────────────────────────────────────── */

function ItemRow({ item, numClass }: { item: CurriculumItem; numClass: string }) {
    return (
        <div className="sc-item-row">
            <div className={`sc-item-number ${numClass}`}>{item.number}</div>
            <div className="sc-item-content">
                <div className="sc-item-title">{item.title}</div>
                <div className="sc-item-desc">{item.description}</div>
            </div>
        </div>
    );
}

/* ── Qur'an card ──────────────────────────────────────────────────────────── */

function QuranCard({ title, items, onViewAll }: {
    title: string;
    items: CurriculumItem[];
    onViewAll: () => void;
}) {
    const preview = items.slice(0, 3);
    return (
        <div className="sc-card sc-card-quran">
            <div className="sc-card-header">
                <div className="sc-card-title-group">
                    <IconBadge variant="navy"><BookIcon /></IconBadge>
                    <div className="sc-card-title">{title}</div>
                </div>
                <button className="sc-view-btn" onClick={onViewAll}>
                    <span className="sc-view-btn-label">View all</span>
                </button>
            </div>
            <div className="sc-item-list">
                {preview.map((item) => (
                    <ItemRow key={item.id ?? item.number} item={item} numClass="sc-num-blue" />
                ))}
            </div>
        </div>
    );
}

/* ── Islamic Studies card ─────────────────────────────────────────────────── */

function IslamicCard({ title, items, onViewAll }: {
    title: string;
    items: CurriculumItem[];
    onViewAll: () => void;
}) {
    const preview = items.slice(0, 3);
    return (
        <div className="sc-card sc-card-islamic">
            <div className="sc-card-header">
                <div className="sc-card-title-group">
                    <IconBadge variant="yellow"><HeadIcon /></IconBadge>
                    <div className="sc-card-title">{title}</div>
                </div>
                <button className="sc-view-btn" onClick={onViewAll}>
                    <span className="sc-view-btn-label">View all</span>
                </button>
            </div>
            <div className="sc-item-list">
                {preview.map((item) => (
                    <ItemRow key={item.id ?? item.number} item={item} numClass="sc-num-yellow" />
                ))}
            </div>
        </div>
    );
}

/* ── Qur'an popup ─────────────────────────────────────────────────────────── */

function QuranPopup({ title, items, onClose }: {
    title: string;
    items: CurriculumItem[];
    onClose: () => void;
}) {
    return (
        <div className="sc-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="sc-popup-quran">
                {/* Header */}
                <div className="sc-popup-header">
                    <div className="sc-card-title-group">
                        <IconBadge variant="navy"><BookIcon /></IconBadge>
                        <div className="sc-card-title">{title}</div>
                    </div>
                    <button className="sc-close-btn sc-close-btn-quran" onClick={onClose}>
                        <div className="sc-close-icon-wrap"><CloseIcon /></div>
                    </button>
                </div>
                {/* Items — two vertical columns */}
                <div className="sc-popup-body">
                    <div className="sc-popup-col">
                        {items.slice(0, Math.ceil(items.length / 2)).map((item) => (
                            <ItemRow key={item.id ?? item.number} item={item} numClass="sc-num-blue" />
                        ))}
                    </div>
                    <div className="sc-popup-divider" />
                    <div className="sc-popup-col">
                        {items.slice(Math.ceil(items.length / 2)).map((item) => (
                            <ItemRow key={item.id ?? item.number} item={item} numClass="sc-num-blue" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Islamic Studies popup ────────────────────────────────────────────────── */

function IslamicPopup({ title, items, onClose }: {
    title: string;
    items: CurriculumItem[];
    onClose: () => void;
}) {
    const mid = Math.ceil(items.length / 2);
    const left = items.slice(0, mid);
    const right = items.slice(mid);

    return (
        <div className="sc-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="sc-popup-islamic">
                {/* Header */}
                <div className="sc-popup-header">
                    <div className="sc-card-title-group">
                        <IconBadge variant="yellow"><HeadIcon /></IconBadge>
                        <div className="sc-card-title">{title}</div>
                    </div>
                    <button className="sc-close-btn sc-close-btn-islamic" onClick={onClose}>
                        <div className="sc-close-icon-wrap"><CloseIcon /></div>
                    </button>
                </div>
                {/* Two-column body */}
                <div className="sc-popup-body">
                    <div className="sc-popup-col">
                        {left.map((item) => (
                            <ItemRow key={item.id ?? item.number} item={item} numClass="sc-num-yellow" />
                        ))}
                    </div>
                    <div className="sc-popup-divider" />
                    <div className="sc-popup-col">
                        {right.map((item) => (
                            <ItemRow key={item.id ?? item.number} item={item} numClass="sc-num-yellow" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main component ───────────────────────────────────────────────────────── */

export default function StructuredCurriculumClient({ data }: StructuredCurriculumClientProps) {
    const [activePopup, setActivePopup] = useState<'quran' | 'islamic' | null>(null);

    if (!data.enableSection) return null;

    const blocks = data.curriculumBlocks ?? [];
    const quranBlock = blocks.find((b) => b.iconType === 'book');
    const islamicBlock = blocks.find((b) => b.iconType === 'head');
    const quranItems = quranBlock?.items ?? [];
    const islamicItems = islamicBlock?.items ?? [];

    return (
        <>
            <div id="curriculum" className="sc-section">
                <div className="section-padding sc-section-inner">
                    {/* ── Section header ── */}
                    <div className="sc-header">
                        <div className="sc-title-group">
                            <div className="sc-title">{data.title}</div>
                            <div className="sc-underline-wrap">
                                <div className="sc-underline" />
                            </div>
                            <div className="sc-desc-wrap">
                                <div className="sc-desc-inner">
                                    <div className="sc-desc-text">{data.description}</div>
                                </div>
                            </div>
                        </div>

                        {data.infoBoxText && (
                            <div className="sc-infobox">
                                <img src="/assets/madrasah/question.svg" alt="" width={28} height={28} className="object-contain" />
                                <div className="sc-infobox-text">{data.infoBoxText}</div>
                            </div>
                        )}
                    </div>

                    {/* ── Cards ── */}
                    <div className="sc-cards-row">
                        {quranBlock && (
                            <QuranCard
                                title={quranBlock.blockTitle}
                                items={quranItems}
                                onViewAll={() => setActivePopup('quran')}
                            />
                        )}
                        {islamicBlock && (
                            <IslamicCard
                                title={islamicBlock.blockTitle}
                                items={islamicItems}
                                onViewAll={() => setActivePopup('islamic')}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ── Popups ── */}
            {activePopup === 'quran' && quranBlock && (
                <QuranPopup
                    title={quranBlock.blockTitle}
                    items={quranItems}
                    onClose={() => setActivePopup(null)}
                />
            )}
            {activePopup === 'islamic' && islamicBlock && (
                <IslamicPopup
                    title={islamicBlock.blockTitle}
                    items={islamicItems}
                    onClose={() => setActivePopup(null)}
                />
            )}
        </>
    );
}
