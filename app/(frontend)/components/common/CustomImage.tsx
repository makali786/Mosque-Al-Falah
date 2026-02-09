'use client';

import { cn } from '@lib/cn';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * CustomImage component that wraps next/image and adds a skeleton loading state.
 * It fades in the image once loaded.
 */
export default function CustomImage({ className, onLoad, ...props }: ImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            className={cn(
                'relative overflow-hidden',
                props.fill ? 'h-full w-full block' : 'inline-block',
                isLoading ? 'bg-zinc-200 dark:bg-zinc-800 animate-pulse' : '',
                className
            )}
        >
            <Image
                className={cn(
                    'duration-700 ease-in-out',
                    isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
                    className
                )}
                onLoad={(e) => {
                    setIsLoading(false);
                    if (onLoad) onLoad(e);
                }}
                {...props}
            />
        </div>
    );
}
