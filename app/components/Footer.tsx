"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TbCompass } from "react-icons/tb";

const SUPPORTERS = [
  { name: "Mahfuzur Rahman", amount: "£50 GBP,", time: "10 seconds ago" },
  { name: "An Anonymous kind soul", amount: "£100 GBP,", time: "10 minutes ago" },
  { name: "An Anonymous kind soul", amount: "£100 GBP,", time: "10 minutes ago" },
  { name: "Mahadi Hasan Abdullah", amount: "£100 GBP,", time: "10 minutes ago" },
] as const;

const SOCIAL_LINKS = [
  { name: "Twitter", icon: "/assets/common/twitter-icon.svg", url: "https://twitter.com" },
  { name: "Facebook", icon: "/assets/common/facebook-icon.svg", url: "https://facebook.com" },
  { name: "YouTube", icon: "/assets/common/youtube-icon.svg", url: "https://youtube.com" },
  { name: "Instagram", icon: "/assets/common/instagram-icon.svg", url: "https://instagram.com" },
] as const;

const FOOTER_LINKS = [
  { label: "Copyright", href: "/copyright" },
  { label: "Terms of use", href: "/terms" },
  { label: "Privacy policy", href: "/privacy" },
] as const;

const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Nikaah Marriage", href: "/services/nikaah" },
      { label: "Food Bank", href: "/services/food-bank" },
      { label: "Prayers", href: "/services/prayers" },
      { label: "Request a service", href: "/services/request" },
      { label: "Request an Event/Lecture", href: "/services/event-lecture" },
    ],
  },
  {
    title: "Educations",
    links: [
      { label: "Adult Classes", href: "/education/adult-classes" },
      { label: "Children's Madrasah", href: "/education/madrasah" },
      { label: "Educational Events", href: "/education/events" },
      { label: "Youth Activities", href: "/education/youth" },
    ],
  },
  {
    title: "Donate",
    links: [
      { label: "Volunteer", href: "/donate/volunteer" },
      { label: "Zakat", href: "/donate/zakat" },
      { label: "Sadaqah", href: "/donate/sadaqah" },
      { label: "Fidya/Kaffarah", href: "/donate/fidya" },
      { label: "Lilah", href: "/donate/lilah" },
    ],
  },
] as const;

const CONTACT_INFO = [
  {
    icon: "/assets/footer/map-icon.svg",
    text: "Masjid Al-Falah, North Ilford Islamic Centre, 97 Kensington Gardens, Ilford, Essex IG1 3EN",
    href: null,
  },
  {
    icon: "/assets/footer/phone-icon.svg",
    text: "020 3538 7266",
    href: "tel:02035387266",
  },
  {
    icon: "/assets/footer/email-icon.svg",
    text: "info@masjid-alfalah.org.uk",
    href: "mailto:info@masjid-alfalah.org.uk",
  },
] as const;

const STATS = [
  { value: "04", label: "Campaigns" },
  { value: "112", label: "Donors" },
  { value: "£5,745", label: "Funds Raised" },
] as const;

interface SupporterCardProps {
  name: string;
  amount: string;
  time: string;
}

const SupporterCard = ({ name, amount, time }: SupporterCardProps) => (
  <div className="flex gap-2 items-center w-full">
    <div className="bg-[#a1a1aa] flex items-center justify-center overflow-hidden rounded-full shrink-0 w-10 h-10">
      <Image src="/assets/footer/supporter-avatar.png" alt={name} width={40} height={40} className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col leading-0">
      <p className="font-normal text-sm leading-5 text-[#ecedee]">{name}</p>
      <p className="font-normal text-xs leading-4 text-[#a1a1aa]">
        <span className="text-[#a1a1aa]">{amount}</span> <span className="text-[#52525b]">{time}</span>
      </p>
    </div>
  </div>
);

const StatsCard = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-1 items-center py-2 text-white">
    <p className="font-bold text-xl leading-7">{value}</p>
    <p className="font-normal text-sm leading-5">{label}</p>
  </div>
);

const SocialIcon = ({ name, icon, url }: { name: string; icon: string; url: string }) => (
  <Link href={url} className="bg-white lg:bg-[#e6f1fe] p-2 rounded-full shrink-0" aria-label={name}>
    <Image src={icon} alt={name} width={16} height={16} />
  </Link>
);

const ChevronIcon = () => (
  <svg className="lg:hidden w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface FooterColumnProps {
  title: string;
  links: readonly { label: string; href: string }[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div className="flex flex-col h-full px-0 lg:px-2 xl:px-6 py-0 lg:py-9 w-full lg:w-auto xl:w-57.75">
    <div className="flex items-center justify-between lg:block py-4 lg:py-0 border-b lg:border-0 border-gray-700">
      <h4 className="font-bold text-base lg:text-lg leading-7 text-white">{title}</h4>
      <ChevronIcon />
    </div>
    <div className="hidden lg:flex flex-col gap-6 w-full mt-0 lg:mt-6">
      <div className="flex flex-col gap-2 w-full">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const ContactItem = ({ icon, text, href }: { icon: string; text: string; href: string | null }) => (
  <div className="flex gap-2 lg:gap-2.5 py-0 lg:py-1 w-full min-w-0">
    <div className="shrink-0 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center">
      <img src={icon} alt="" className="w-full h-full object-contain" />
    </div>
    {href ? (
      <a href={href} className="flex-1 min-w-0 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white hover:text-[#006FEE] wrap-break-word overflow-wrap-anywhere">
        {text}
      </a>
    ) : (
      <p className="flex-1 min-w-0 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white">{text}</p>
    )}
  </div>
);

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <>
      <footer className="bg-[#27272a] flex flex-col w-full">
        {/* Top Section - Newsletter, Supporters, Donations */}
        <div className="bg-[#18181b] flex flex-col lg:flex-row gap-6 lg:gap-15 items-start lg:items-center justify-center p-4 sm:p-8 lg:px-17 lg:py-17 w-full">
          {/* Newsletter Section */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-109.75">
            <h3 className="font-bold text-sm sm:text-base leading-6 text-white">Stay Connected, Join our newsletter</h3>
            <div className="flex flex-col gap-4 sm:gap-6 w-full">
              <div className="flex items-center w-full min-w-0">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#27272a] flex-1 min-w-0 text-sm sm:text-base leading-6 text-[#d4d4d8] placeholder:text-[#d4d4d8] px-2 sm:px-3 py-2 min-h-10.5 shadow-sm outline-none"
                />
                <button className="bg-[#3f3f46] text-white font-normal text-xs sm:text-sm leading-5 h-10.5 w-25 shrink-0 hover:bg-[#52525b] transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>

              <div className="flex gap-3 lg:gap-4 items-center flex-wrap">
                {SOCIAL_LINKS.map((social) => (
                  <SocialIcon key={social.name} {...social} />
                ))}
                <div className="bg-[#7c3aed] flex items-center justify-center rounded-md shrink-0 w-8 h-8">
                  <TbCompass className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Supporters Section */}
          <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-126.5">
            <h3 className="font-bold text-base leading-6 text-white">Recent supporters</h3>
            <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
              <div className="flex flex-col gap-3 lg:gap-4 flex-1">
                {SUPPORTERS.slice(0, 2).map((supporter, idx) => (
                  <SupporterCard key={idx} {...supporter} />
                ))}
              </div>
              <div className="hidden lg:flex flex-col gap-4 flex-1">
                {SUPPORTERS.slice(2).map((supporter, idx) => (
                  <SupporterCard key={idx} {...supporter} />
                ))}
              </div>
            </div>
          </div>

          {/* Donations & Campaigns Section */}
          <div className="flex flex-col gap-6 w-full lg:w-82">
            <h3 className="font-bold text-base leading-6 text-white">Donations & Campaigns</h3>
            <div className="flex items-center justify-between w-full">
              {STATS.map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </div>
            <div className="flex gap-5 w-full">
              <Link href="/discover" className="flex-1 bg-[#3f3f46] text-white font-normal text-base leading-6 px-6 h-12 flex items-center justify-center rounded-lg hover:bg-[#52525b] transition-colors">
                Discover
              </Link>
              <Link href="/donate" className="flex-1 bg-[#006fee] text-white font-normal text-base leading-6 px-6 h-12 flex items-center justify-center rounded-xl hover:bg-[#0056cc] transition-colors">
                Donate Now
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col lg:flex-row items-start px-6 lg:px-4 xl:px-17 py-0 w-full">
          {/* Mobile: Logo */}
          <div className="flex flex-col items-center gap-6 py-8 lg:hidden w-full">
            <div className="w-24 h-24">
              <Image src="/assets/footer/footer-logo.png" alt="Masjid Al-Falah" width={96} height={96} className="object-cover" />
            </div>
          </div>

          {/* Desktop: Logo & Copyright Section */}
          <div className="hidden lg:flex flex-col gap-9 items-center px-2 xl:px-6 py-9 flex-1">
            <div className="w-32 h-32">
              <Image src="/assets/footer/footer-logo.png" alt="Masjid Al-Falah" width={128} height={128} className="object-cover" />
            </div>
            <div className="flex gap-2 items-center justify-center flex-wrap">
              {FOOTER_LINKS.map((link, idx) => (
                <React.Fragment key={link.href}>
                  <Link href={link.href} className="text-white font-light text-sm leading-5 py-1">
                    {link.label}
                  </Link>
                  {idx < FOOTER_LINKS.length - 1 && <Image src="/assets/footer/dot-icon.svg" alt="" width={8} height={8} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}

          {/* Contact Information Column */}
          <div className="flex flex-col h-full px-0 lg:px-2 xl:px-6 py-4 lg:py-9 w-full lg:flex-1 lg:min-w-0">
            <h4 className="font-bold text-base lg:text-lg leading-7 text-white mb-3 lg:mb-4">Contact information</h4>
            <div className="flex flex-col gap-3 lg:gap-4 w-full">
              {CONTACT_INFO.map((contact, idx) => (
                <ContactItem key={idx} {...contact} />
              ))}
            </div>
          </div>

          {/* Mobile: Footer Links */}
          <div className="flex lg:hidden gap-2 items-center justify-center flex-wrap py-8 w-full">
            {FOOTER_LINKS.map((link, idx) => (
              <React.Fragment key={link.href}>
                <Link href={link.href} className="text-white font-light text-xs leading-5">
                  {link.label}
                </Link>
                {idx < FOOTER_LINKS.length - 1 && <span className="text-white">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="bg-[#18181b] flex items-center justify-center px-6 lg:px-8 py-6 lg:py-0 lg:h-25.25 w-full">
          <p className="font-normal text-xs lg:text-sm leading-5 text-white text-center">
            COPYRIGHT © 2020{" "}
            <Link href="https://www.masjid-alfalah.org.uk/" className="hover:text-[#006fee]">
              Masjid Al Falah
            </Link>
            <span className="text-[#006fee]">.</span> All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
