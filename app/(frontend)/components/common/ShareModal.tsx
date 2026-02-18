'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IoCheckmarkOutline, IoClose, IoCopyOutline } from 'react-icons/io5';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  quote?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  url,
  title = 'Share this page',
  quote,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-[537px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-6 md:pt-10 pb-1 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-zinc-800 font-['Inter'] leading-7">
              Share this page
            </h2>
            <p className="text-zinc-500 text-sm md:text-lg font-normal font-['Inter'] leading-tight md:leading-7">
              Whoever imparts knowledge will have the reward of whoever acted
              upon it, without detracting from the reward of one who acted
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <IoClose size={24} className="text-zinc-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-8">
          {/* Social Buttons */}

          {/* Copy Link */}
          <div
            onClick={handleCopy}
            className="w-full px-4 py-3.5 bg-zinc-100 rounded-lg flex justify-between items-center cursor-pointer hover:bg-zinc-200 transition-colors group"
          >
            <span className="text-zinc-600 text-sm font-normal font-['Inter'] leading-5 line-clamp-1 break-all">
              {url}
            </span>
            <div className="text-zinc-500 group-hover:text-zinc-700">
              {copied ? (
                <IoCheckmarkOutline size={20} />
              ) : (
                <IoCopyOutline size={20} />
              )}
            </div>
          </div>

          {/* Quote */}
          <div className="text-center px-4 md:px-9">
            <p className="text-zinc-500 text-sm md:text-base font-normal font-['Inter'] leading-snug md:leading-6">
              “Whoever guides someone to goodness will have a reward like the
              one who did it.”
              <br />— Prophet Muhammad ﷺ
            </p>
          </div>
        </div>

        {/* Footer Image */}
        <div className="relative w-full h-44 mt-auto">
          <Image
            src="/assets/common/share-modal-footer.png"
            alt="Islamic Illustration"
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  );
}
