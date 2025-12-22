"use client";

import { IoLogoWhatsapp } from "react-icons/io5";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
      {/* Pulse ring effect */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20"></div>

      {/* Main button */}
      <a
        href="https://wa.me/02035387266"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="group relative bg-[#25D366] hover:bg-[#20BA5A] w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
      >
        <IoLogoWhatsapp className="text-white text-2xl lg:text-3xl" />

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with Imam
        </span>
      </a>
    </div>
  );
}
