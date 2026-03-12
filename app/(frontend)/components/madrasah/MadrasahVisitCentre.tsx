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
                                    <img src="/assets/madrasah/address-icon.svg" alt="Address" className="visit-icon" />
                                </div>
                                <div className="visit-text-col">
                                    <div className="visit-label">{data.addressLabel}</div>
                                    <div className="visit-value" dangerouslySetInnerHTML={{ __html: data.addressValue.replace(/\n/g, '<br/>') }} />
                                </div>
                            </div>

                            {/* Email Row */}
                            <div className="visit-item">
                                <div className="visit-icon-box">
                                    <img src="/assets/madrasah/email-icon.svg" alt="Email" className="visit-icon" />
                                </div>
                                <div className="visit-text-col">
                                    <div className="visit-label">{data.emailLabel}</div>
                                    <div className="visit-value">{data.emailValue}</div>
                                </div>
                            </div>

                            {/* Phone Row */}
                            <div className="visit-item">
                                <div className="visit-icon-box">
                                    <img src="/assets/madrasah/phone-icon.svg" alt="Phone" className="visit-icon" />
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
