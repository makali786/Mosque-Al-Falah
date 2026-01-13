import React from 'react';
import Image from 'next/image';

interface ContentBlockProps {
    title: string;
    description: string | React.ReactNode;
    image?: {
        src: string;
        alt: string;
    };
    className?: string;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
    title,
    description,
    image,
    className = ""
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#18181B] leading-tight mb-6">
                {title}
            </h2>

            <div className="text-base text-[#52525B] leading-relaxed mb-10">
                {description}
            </div>

            {image && (
                <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
            )}
        </div>
    );
};
