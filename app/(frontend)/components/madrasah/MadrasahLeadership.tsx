"use client";

import React from 'react';
import { TeamMemberCard, CommitteeMember } from '../about/CommitiesCard';

interface MadrasahLeadershipProps {
    title: string;
    description?: string;
    members: CommitteeMember[];
    className?: string;
}

export default function MadrasahLeadership({
    title,
    description,
    members,
    className = "",
}: MadrasahLeadershipProps) {
    if (!members || members.length === 0) return null;

    return (
        <section className={`w-full py-16 sm:py-20 md:py-24 lg:py-28 ${className}`}>
            <div className="section-padding flex flex-col items-center">
                {/* Centered Header */}
                <div className="self-stretch inline-flex flex-col justify-start items-center mb-12 lg:mb-16">
                    <h2 className="w-full max-w-[800px] text-center justify-center text-[#0b3c5d] text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans leading-tight md:leading-[48px]">
                        {title}
                    </h2>
                    {description && (
                        <div className="w-full max-w-[800px] pt-6 md:pt-8 flex flex-col justify-start items-center">
                            <div className="max-w-[800px] px-4 md:px-11 flex flex-col justify-start items-center">
                                <p className="self-stretch text-center justify-center text-[#3f3f46] text-base md:text-lg font-normal font-sans leading-relaxed md:leading-7">
                                    {description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                    {members.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
