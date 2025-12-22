"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about", hasDropdown: true },
    { label: "Our Services", href: "/services" },
    { label: "Appeals", href: "/appeals" },
    { label: "Madrasah", href: "/madrasah" },
    { label: "Sermons", href: "/sermons" },
    { label: "Media", href: "/media" },
    { label: "Prayer Times", href: "/prayer-times" },
    { label: "Blogs", href: "/blogs" },
  ];

  const aboutUsDropdownItems = [
    { label: "About Us", href: "/about" },
    { label: "History", href: "/about/history" },
    { label: "Mission", href: "/about/mission" },
    { label: "Staff", href: "/about/staff" },
    { label: "Contact Us", href: "/about/contact" },
  ];

  return (
    <header className="bg-black flex items-center justify-between px-30 py-0 w-full relative">
      {/* Logo */}
      <div className="relative shrink-0 w-32.25 h-13">
        <Image
          src="/assets/header/logo.svg"
          alt="Masjid Logo"
          width={129}
          height={52}
          className="object-cover"
        />
      </div>

      {/* Navigation & Donate Button */}
      <div className="flex gap-10 items-center relative shrink-0">
        {/* Navigation Menu */}
        <nav className="flex gap-6 items-center relative shrink-0">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center py-7 px-0 relative shrink-0"
            >
              {item.hasDropdown ? (
                <div className="relative">
                  <button
                    onClick={() => setAboutUsOpen(!aboutUsOpen)}
                    className={`flex gap-1 items-center relative shrink-0 ${
                      pathname.startsWith("/about") ? "text-[#06b7db]" : "text-[#fafafa]"
                    }`}
                  >
                    <div className="flex flex-col justify-center leading-0 relative shrink-0">
                      <p className="font-normal text-base leading-6 whitespace-nowrap">
                        {item.label}
                      </p>
                    </div>
                    <div className="relative shrink-0 w-4 h-4">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {aboutUsOpen && (
                    <div className="absolute top-full left-0 mt-6 bg-white rounded-lg shadow-lg py-2 min-w-45 z-50">
                      {aboutUsDropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block px-6 py-3 text-black hover:bg-gray-100 transition-colors"
                          onClick={() => setAboutUsOpen(false)}
                        >
                          <p className="font-normal text-base leading-6 whitespace-nowrap">
                            {dropdownItem.label}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex gap-1 items-center relative shrink-0"
                >
                  <div className="flex flex-col justify-center leading-0 relative shrink-0">
                    <p className={`font-normal text-base leading-6 whitespace-nowrap ${
                      pathname === item.href ? "text-[#06b7db]" : "text-[#fafafa]"
                    }`}>
                      {item.label}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Donate Button */}
        <Link
          href="/donate"
          className="bg-white flex items-center justify-center px-3 py-0 relative rounded-lg shrink-0 h-8"
        >
          <div className="flex gap-2 items-center justify-center relative shrink-0">
            <div className="flex flex-col justify-center leading-0 relative shrink-0">
              <p className="font-normal text-xs leading-4 text-black whitespace-nowrap">
                Donate Now
              </p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
