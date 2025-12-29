"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us", hasDropdown: true },
  { label: "Our Services", href: "/services" },
  { label: "Appeals", href: "/appeals" },
  { label: "Madrasah", href: "/madrasah" },
  { label: "Sermons", href: "/sermons" },
  { label: "Media", href: "/media" },
  { label: "Prayer Times", href: "/prayer-times" },
  { label: "Blogs", href: "/blogs" },
];

const ABOUT_DROPDOWN = [
  { label: "About Us", href: "/about-us" },
  { label: "History", href: "/about-us/history" },
  { label: "Mission", href: "/about-us/mission" },
  { label: "Staff", href: "/about-us/staff" },
  { label: "Contact Us", href: "/contact-us" },
] as const;

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface NavItemProps {
  item: NavItem;
  pathname: string;
  dropdownOpen: boolean;
  onDropdownToggle: () => void;
  onCloseMenu?: () => void;
  isMobile?: boolean;
}

const NavItem = ({ item, pathname, dropdownOpen, onDropdownToggle, onCloseMenu, isMobile = false }: NavItemProps) => {
  const isActive = item.hasDropdown ? pathname.startsWith("/about") : pathname === item.href;
  const activeClass = isActive ? "text-[#06b7db]" : isMobile ? "text-white" : "text-[#fafafa]";

  if (item.hasDropdown) {
    return (
      <div className={isMobile ? "" : "relative"}>
        <button
          onClick={onDropdownToggle}
          className={`flex gap-1 items-center ${isMobile ? "justify-between w-full" : "shrink-0"} ${activeClass}`}
        >
          <span className={`font-normal ${isMobile ? "text-base" : "text-sm xl:text-base leading-6"} whitespace-nowrap`}>
            {item.label}
          </span>
          <ChevronIcon className={isMobile ? `transform transition-transform ${dropdownOpen ? "rotate-180" : ""}` : "shrink-0 w-4 h-4"} />
        </button>

        {dropdownOpen && (
          <div className={isMobile ? "mt-2 ml-4 flex flex-col gap-2" : "absolute top-full left-0 mt-6 bg-white rounded-lg shadow-lg py-2 min-w-45 z-50"}>
            {ABOUT_DROPDOWN.map((dropdownItem) => (
              <Link
                key={dropdownItem.label}
                href={dropdownItem.href}
                className={isMobile ? "text-gray-400 hover:text-white py-2" : "block px-6 py-3 text-black hover:bg-gray-100 transition-colors"}
                onClick={() => {
                  onDropdownToggle();
                  onCloseMenu?.();
                }}
              >
                {isMobile ? dropdownItem.label : <p className="font-normal text-base leading-6 whitespace-nowrap">{dropdownItem.label}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href} className={isMobile ? "" : "flex gap-1 items-center shrink-0"} onClick={onCloseMenu}>
      <p className={`font-normal ${isMobile ? "text-base" : "text-sm xl:text-base leading-6"} whitespace-nowrap ${activeClass}`}>
        {item.label}
      </p>
    </Link>
  );
};

const HamburgerIcon = () => (
  <Image src="/assets/common/hamburger-icon.svg" alt="Menu" width={24} height={24} />
);

export default function MainHeader() {
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-black w-full sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-4 xl:px-30 2xl:px-30 py-3 lg:py-0 w-full">
        {/* Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1 w-6 h-5 justify-center"
          aria-label="Menu"
        >
          <HamburgerIcon />
        </button>

        {/* Logo */}
        <div className="relative shrink-0 w-24 h-10 lg:w-28 xl:w-32.25 lg:h-11 xl:h-13">
          <Image src="/assets/header/logo.svg" alt="Masjid Logo" fill className="object-contain" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-3 xl:gap-6 2xl:gap-10 items-center shrink-0">
          <nav className="flex gap-2 xl:gap-4 2xl:gap-6 items-center shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = item.hasDropdown ? pathname.startsWith("/about") : pathname === item.href;
              return (
                <div
                  key={item.label}
                  className="flex flex-col gap-6 items-start pt-7 px-0 shrink-0"
                >
                  <NavItem
                    item={item}
                    pathname={pathname}
                    dropdownOpen={aboutUsOpen}
                    onDropdownToggle={() => setAboutUsOpen(!aboutUsOpen)}
                  />
                  <div className={`h-1 w-full ${isActive ? 'bg-[#06b7db]' : 'bg-transparent'}`} />
                </div>
              );
            })}
          </nav>

          <Link href="/donate" className="bg-white flex items-center justify-center px-3 rounded-lg shrink-0 h-8">
            <span className="font-normal text-xs leading-4 text-black whitespace-nowrap">Donate Now</span>
          </Link>
        </div>

        {/* Mobile Donate Button */}
        <Link href="/donate" className="lg:hidden bg-white flex items-center justify-center px-3 py-1.5 rounded-md shrink-0">
          <span className="font-medium text-xs text-black whitespace-nowrap">Donate</span>
        </Link>
      </div>

      {/* Mobile Menu */}
      <>
        <div
          className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 z-9998 ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-full bg-black z-9999 overflow-y-auto transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white" aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>

          <nav className="flex flex-col px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="py-3 border-b border-gray-800">
                <NavItem
                  item={item}
                  pathname={pathname}
                  dropdownOpen={aboutUsOpen}
                  onDropdownToggle={() => setAboutUsOpen(!aboutUsOpen)}
                  onCloseMenu={() => setMobileMenuOpen(false)}
                  isMobile
                />
              </div>
            ))}
          </nav>
        </div>
      </>
    </header>
  );
}
