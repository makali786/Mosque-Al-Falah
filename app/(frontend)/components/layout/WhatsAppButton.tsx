'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-24 right-6 lg:bottom-28 lg:right-8 z-50 flex flex-col gap-3 items-center">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`group relative bg-[#18181B] hover:bg-[#27272A] w-10 h-10 lg:w-12 lg:h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5 lg:w-6 lg:h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Scroll to Top
        </span>
      </button>

      {/* WhatsApp Button Wrapper */}
      <div className="relative">
        {/* Main button */}
        <a
          href="https://chat.whatsapp.com/Gyc3WxXRHG6IqoL3FFDraP"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="group relative bg-[#25D366] hover:bg-[#20BA5A] w-10 h-10 lg:w-12 lg:h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        >
          <div className="relative w-6 h-6 lg:w-7 lg:h-7">
            <Image
              src="/assets/common/whatsapp.png"
              alt="WhatsApp"
              fill
              className="object-contain"
            />
          </div>

          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with Imam
          </span>
        </a>
      </div>
    </div>
  );
}
