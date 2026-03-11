'use client';

import React from 'react';
import './MadrasahVisitCentre.css';
import GoogleMap from '../common/GoogleMap';

type VisitCentreData = {
    enableSection?: boolean | null;
    title: string;
    addressLabel: string;
    addressValue: string;
    emailLabel: string;
    emailValue: string;
    phoneLabel: string;
    phoneValue: string;
    latitude: number;
    longitude: number;
};

interface MadrasahVisitCentreProps {
    data: VisitCentreData;
}

export default function MadrasahVisitCentre({ data }: MadrasahVisitCentreProps) {
    if (!data.enableSection) return null;

    return (
        <div id="contact" className="visit-section relative">
            <div id="inquire" className="absolute -top-24" />
            <div id="enquiry" className="absolute -top-24" />
            <div className="visit-container">
                <div className="visit-card">
                    {/* ── Left Column: Contact Info ── */}
                    <div className="visit-content">
                        <div className="visit-title">{data.title}</div>

                        <div className="visit-items">
                            {/* Address Row */}
                            <div className="visit-item">
                                <div className="visit-icon-box">
                                    <svg className="visit-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 21.365C12 21.365 20 15 20 9.5C20 5.35786 16.4183 2 12 2C7.58172 2 4 5.35786 4 9.5C4 15 12 21.365 12 21.365ZM12 4C15.3137 4 18 6.46243 18 9.5C18 13.5658 12.8722 18.281 12 19.1678C11.1278 18.281 6 13.5658 6 9.5C6 6.46243 8.68629 4 12 4ZM12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13ZM12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10C13 10.5523 12.5523 11 12 11Z" />
                                    </svg>
                                </div>
                                <div className="visit-text-col">
                                    <div className="visit-label">{data.addressLabel}</div>
                                    <div className="visit-value" dangerouslySetInnerHTML={{ __html: data.addressValue.replace(/\n/g, '<br/>') }} />
                                </div>
                            </div>

                            {/* Email Row */}
                            <div className="visit-item">
                                <div className="visit-icon-box">
                                    <svg className="visit-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 5.75C3 4.7835 3.7835 4 4.75 4H19.25C20.2165 4 21 4.7835 21 5.75V18.25C21 19.2165 20.2165 20 19.25 20H4.75C3.7835 20 3 19.2165 3 18.25V5.75ZM4.5 7.426L12 12.068L19.5 7.426V5.75C19.5 5.61193 19.3881 5.5 19.25 5.5H4.75C4.61193 5.5 4.5 5.61193 4.5 5.75V7.426ZM19.5 9.176L12.449 13.535C12.174 13.705 11.826 13.705 11.551 13.535L4.5 9.176V18.25C4.5 18.3881 4.61193 18.5 4.75 18.5H19.25C19.3881 18.5 19.5 18.3881 19.5 18.25V9.176Z" />
                                    </svg>
                                </div>
                                <div className="visit-text-col">
                                    <div className="visit-label">{data.emailLabel}</div>
                                    <div className="visit-value">{data.emailValue}</div>
                                </div>
                            </div>

                            {/* Phone Row */}
                            <div className="visit-item">
                                <div className="visit-icon-box">
                                    <svg className="visit-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.643 3L8.68307 2.05284C8.97193 1.7899 9.42197 1.78018 9.72085 2.03058L13.7938 5.44197C14.0725 5.67537 14.1205 6.09503 13.9026 6.39343L11.536 9.636C12.5937 11.5178 13.8824 12.8797 15.698 13.868L18.8475 11.2386C19.1246 11.0073 19.5375 11.0494 19.7644 11.3323L23.364 15.8201C23.6306 16.1524 23.6067 16.6359 23.3087 16.9403L21.724 18.558C19.8643 20.456 16.671 21.6881 13.5042 21.056Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </div>
                                <div className="visit-text-col">
                                    <div className="visit-label">{data.phoneLabel}</div>
                                    <div className="visit-value">{data.phoneValue}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Map ── */}
                    <div className="visit-map-col">
                        <div className="visit-map-wrapper">
                            <GoogleMap
                                latitude={data.latitude || 51.5623063}
                                longitude={data.longitude || 0.0747472}
                                address={data.addressValue.replace(/\n/g, ', ')}
                                height="100%"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
