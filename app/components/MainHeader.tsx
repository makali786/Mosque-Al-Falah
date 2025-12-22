"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="bg-black w-full sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-30 py-3 lg:py-0 w-full">
        {/* Mobile: Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1 w-6 h-5 justify-center"
          aria-label="Menu"
        >
          <span className="w-full h-0.5 bg-white rounded"></span>
          <span className="w-full h-0.5 bg-white rounded"></span>
          <span className="w-full h-0.5 bg-white rounded"></span>
        </button>

        {/* Logo */}
        <div className="relative shrink-0 w-24 h-10 lg:w-32.25 lg:h-13">
          <Image
            src="/assets/header/logo.svg"
            alt="Masjid Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Desktop: Navigation & Donate Button */}
        <div className="hidden lg:flex gap-10 items-center relative shrink-0">
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

      {/* Mobile: Donate Button */}
      <Link
        href="/donate"
        className="lg:hidden bg-white flex items-center justify-center px-3 py-1.5 relative rounded-md shrink-0"
      >
        <span className="font-medium text-xs text-black whitespace-nowrap">Donate</span>
      </Link>
    </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 h-full w-64 bg-black z-50 overflow-y-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-6 py-4">
              {navItems.map((item) => (
                <div key={item.label} className="py-3 border-b border-gray-800">
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setAboutUsOpen(!aboutUsOpen)}
                        className="flex items-center justify-between w-full text-white"
                      >
                        <span className="font-normal text-base">{item.label}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transform transition-transform ${aboutUsOpen ? 'rotate-180' : ''}`}>
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {aboutUsOpen && (
                        <div className="mt-2 ml-4 flex flex-col gap-2">
                          {aboutUsDropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="text-gray-400 hover:text-white py-2"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white font-normal text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
