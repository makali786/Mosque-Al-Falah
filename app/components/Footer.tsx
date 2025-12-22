"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TbCompass } from "react-icons/tb";

// Supporter Card Component
function SupporterCard({
  name,
  amount,
  time,
}: {
  name: string;
  amount: string;
  time: string;
}) {
  return (
    <div className="flex gap-2 items-center w-full">
      <div className="bg-[#a1a1aa] flex items-center justify-center overflow-hidden rounded-full shrink-0 w-10 h-10">
        <Image
          src="/assets/footer/supporter-avatar.png"
          alt={name}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col leading-[0]">
        <p className="font-normal text-sm leading-5 text-[#ecedee]">{name}</p>
        <p className="font-normal text-xs leading-4 text-[#a1a1aa]">
          <span className="text-[#a1a1aa]">{amount}</span>{" "}
          <span className="text-[#52525b]">{time}</span>
        </p>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 items-center py-2 text-white">
      <p className="font-bold text-xl leading-7">{value}</p>
      <p className="font-normal text-sm leading-5">{label}</p>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  const supporters = [
    { name: "Mahfuzur Rahman", amount: "£50 GBP,", time: "10 seconds ago" },
    {
      name: "An Anonymous kind soul",
      amount: "£100 GBP,",
      time: "10 minutes ago",
    },
    {
      name: "An Anonymous kind soul",
      amount: "£100 GBP,",
      time: "10 minutes ago",
    },
    {
      name: "Mahadi Hasan Abdullah",
      amount: "£100 GBP,",
      time: "10 minutes ago",
    },
  ];

  return (
    <>
      <footer className="bg-[#27272a] flex flex-col w-full">
        {/* Top Section - Newsletter, Supporters, Donations */}
        <div className="bg-[#18181b] flex flex-col lg:flex-row gap-6 lg:gap-[60px] items-start lg:items-center justify-center p-8 lg:px-[68px] lg:py-[68px] w-full">
          {/* Newsletter Section */}
          <div className="flex flex-col gap-6 w-full lg:w-[439px]">
            <h3 className="font-bold text-base leading-6 text-white">
              Stay Connected, Join our newsletter
            </h3>
            <div className="flex flex-col gap-6 w-full">
              {/* Email Input & Subscribe Button */}
              <div className="flex items-center w-full">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#27272a] flex-1 text-base leading-6 text-[#d4d4d8] placeholder:text-[#d4d4d8] px-3 py-2 min-h-[42px] shadow-sm outline-none"
                />
                <button className="bg-[#3f3f46] text-white font-normal text-sm leading-5 px-4 h-[42px] shrink-0 hover:bg-[#52525b] transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 lg:gap-4 items-center flex-wrap">
                <Link
                  href="https://twitter.com"
                  className="bg-white lg:bg-[#e6f1fe] p-2 rounded-full shrink-0"
                  aria-label="Twitter"
                >
                  <Image
                    src="/assets/common/twitter-icon.svg"
                    alt="Twitter"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link
                  href="https://facebook.com"
                  className="bg-white lg:bg-[#e6f1fe] p-2 rounded-full shrink-0"
                  aria-label="Facebook"
                >
                  <Image
                    src="/assets/common/facebook-icon.svg"
                    alt="Facebook"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link
                  href="https://youtube.com"
                  className="bg-white lg:bg-[#e6f1fe] p-2 rounded-full shrink-0"
                  aria-label="YouTube"
                >
                  <Image
                    src="/assets/common/youtube-icon.svg"
                    alt="YouTube"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="bg-white lg:bg-[#e6f1fe] p-2 rounded-full shrink-0"
                  aria-label="Instagram"
                >
                  <Image
                    src="/assets/common/instagram-icon.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link
                  href="https://whatsapp.com"
                  className="hidden lg:flex shrink-0 pt-3.5"
                  aria-label="WhatsApp"
                >
                  <Image
                    src="/assets/common/whatsapp-icon.svg"
                    alt="WhatsApp"
                    width={48}
                    height={48}
                  />
                </Link>
                <div className="bg-[#7c3aed] flex items-center justify-center relative rounded-md shrink-0 w-8 h-8">
                  <TbCompass className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Supporters Section */}
          <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-[506px]">
            <h3 className="font-bold text-base leading-6 text-white">
              Recent supporters
            </h3>
            <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
              <div className="flex flex-col gap-3 lg:gap-4 flex-1">
                <SupporterCard {...supporters[0]} />
                <SupporterCard {...supporters[1]} />
              </div>
              <div className="hidden lg:flex flex-col gap-4 flex-1">
                <SupporterCard {...supporters[2]} />
                <SupporterCard {...supporters[3]} />
              </div>
            </div>
          </div>

          {/* Donations & Campaigns Section */}
          <div className="flex flex-col gap-6 w-full lg:w-[328px]">
            <h3 className="font-bold text-base leading-6 text-white">
              Donations & Campaigns
            </h3>

            {/* Stats */}
            <div className="flex items-center justify-between w-full">
              <StatsCard value="04" label="Campaigns" />
              <StatsCard value="112" label="Donors" />
              <StatsCard value="£5,745" label="Funds Raised" />
            </div>

            {/* Buttons */}
            <div className="flex gap-5 w-full">
              <Link
                href="/discover"
                className="flex-1 bg-[#3f3f46] text-white font-normal text-base leading-6 px-6 h-12 flex items-center justify-center rounded-lg hover:bg-[#52525b] transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/donate"
                className="flex-1 bg-[#006fee] text-white font-normal text-base leading-6 px-6 h-12 flex items-center justify-center rounded-xl hover:bg-[#0056cc] transition-colors"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col lg:flex-row items-start px-6 lg:px-[68px] py-0 w-full">
          {/* Mobile: Logo */}
          <div className="flex flex-col items-center gap-6 py-8 lg:hidden w-full">
            <div className="w-24 h-24">
              <Image
                src="/assets/footer/footer-logo.png"
                alt="Masjid Al-Falah"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          {/* Desktop: Logo & Copyright Section */}
          <div className="hidden lg:flex flex-col gap-9 items-center px-6 py-9 flex-1">
            <div className="w-32 h-32">
              <Image
                src="/assets/footer/footer-logo.png"
                alt="Masjid Al-Falah"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 items-center justify-center flex-wrap">
              <Link
                href="/copyright"
                className="text-white font-light text-sm leading-5 py-1"
              >
                Copyright
              </Link>
              <Image
                src="/assets/footer/dot-icon.svg"
                alt=""
                width={8}
                height={8}
              />
              <Link
                href="/terms"
                className="text-white font-light text-sm leading-5 py-1"
              >
                Terms of use
              </Link>
              <Image
                src="/assets/footer/dot-icon.svg"
                alt=""
                width={8}
                height={8}
              />
              <Link
                href="/privacy"
                className="text-white font-light text-sm leading-5 py-1"
              >
                Privacy policy
              </Link>
            </div>
          </div>

          {/* Services Column */}
          <div className="flex flex-col h-full px-0 lg:px-6 py-0 lg:py-9 w-full lg:w-[231px]">
            <div className="flex items-center justify-between lg:block py-4 lg:py-0 border-b lg:border-0 border-gray-700">
              <h4 className="font-bold text-base lg:text-lg leading-7 text-white">
                Services
              </h4>
              <svg
                className="lg:hidden w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="hidden lg:flex flex-col gap-6 w-full mt-0 lg:mt-6">
              <div className="flex flex-col gap-2 w-full">
                <Link
                  href="/services/nikaah"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Nikaah Marriage
                </Link>
                <Link
                  href="/services/food-bank"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Food Bank
                </Link>
                <Link
                  href="/services/prayers"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Prayers
                </Link>
                <Link
                  href="/services/request"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Request a service
                </Link>
                <Link
                  href="/services/event-lecture"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Request an Event/Lecture
                </Link>
              </div>
            </div>
          </div>

          {/* Educations Column */}
          <div className="flex flex-col h-full px-0 lg:px-6 py-0 lg:py-9 w-full lg:w-[232px]">
            <div className="flex items-center justify-between lg:block py-4 lg:py-0 border-b lg:border-0 border-gray-700">
              <h4 className="font-bold text-base lg:text-lg leading-7 text-white">
                Educations
              </h4>
              <svg
                className="lg:hidden w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="hidden lg:flex flex-col gap-6 w-full mt-0 lg:mt-6">
              <div className="flex flex-col gap-2 w-full">
                <Link
                  href="/education/adult-classes"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Adult Classes
                </Link>
                <Link
                  href="/education/madrasah"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Children's Madrasah
                </Link>
                <Link
                  href="/education/events"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Educational Events
                </Link>
                <Link
                  href="/education/youth"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Youth Activities
                </Link>
              </div>
            </div>
          </div>

          {/* Donate Column */}
          <div className="flex flex-col h-full px-0 lg:px-6 py-0 lg:py-9 w-full lg:w-[232px]">
            <div className="flex items-center justify-between lg:block py-4 lg:py-0 border-b lg:border-0 border-gray-700">
              <h4 className="font-bold text-base lg:text-lg leading-7 text-white">
                Donate
              </h4>
              <svg
                className="lg:hidden w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="hidden lg:flex flex-col gap-6 w-full mt-0 lg:mt-6">
              <div className="flex flex-col gap-2 w-full">
                <Link
                  href="/donate/volunteer"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Volunteer
                </Link>
                <Link
                  href="/donate/zakat"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Zakat
                </Link>
                <Link
                  href="/donate/sadaqah"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Sadaqah
                </Link>
                <Link
                  href="/donate/fidya"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Fidya/Kaffarah
                </Link>
                <Link
                  href="/donate/lilah"
                  className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
                >
                  Lilah
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Information Column */}
          <div className="flex flex-col h-full px-0 lg:px-6 py-4 lg:py-9 w-full lg:flex-1">
            <h4 className="font-bold text-base lg:text-lg leading-7 text-white mb-3 lg:mb-4">
              Contact information
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4 w-full">
              {/* Address */}
              <div className="flex gap-2 lg:gap-[10px] items-start py-0 lg:py-1 w-full">
                <div className="shrink-0 pt-0 lg:pt-[2px]">
                  <Image
                    src="/assets/footer/map-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="lg:w-6 lg:h-6"
                  />
                </div>
                <p className="flex-1 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white">
                  Masjid Al-Falah, North Ilford Islamic Centre, 97 Kensington
                  Gardens, Ilford, Essex IG1 3EN
                </p>
              </div>

              {/* Phone */}
              <div className="flex gap-2 lg:gap-[10px] items-start py-0 lg:py-1 w-full">
                <Image
                  src="/assets/footer/phone-icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="lg:w-6 lg:h-6"
                />
                <a
                  href="tel:02035387266"
                  className="flex-1 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white hover:text-[#006fee]"
                >
                  020 3538 7266
                </a>
              </div>

              {/* Email */}
              <div className="flex gap-2 lg:gap-[10px] items-start py-0 lg:py-1 w-full">
                <Image
                  src="/assets/footer/email-icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="lg:w-6 lg:h-6"
                />
                <a
                  href="mailto:info@masjid-alfalah.org.uk"
                  className="flex-1 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white hover:text-[#006fee]"
                >
                  info@masjid-alfalah.org.uk
                </a>
              </div>
            </div>
          </div>

          {/* Mobile: Footer Links */}
          <div className="flex lg:hidden gap-2 items-center justify-center flex-wrap py-8 w-full">
            <Link
              href="/copyright"
              className="text-white font-light text-xs leading-5"
            >
              Copyright
            </Link>
            <span className="text-white">•</span>
            <Link
              href="/terms"
              className="text-white font-light text-xs leading-5"
            >
              Terms of use
            </Link>
            <span className="text-white">•</span>
            <Link
              href="/privacy"
              className="text-white font-light text-xs leading-5"
            >
              Privacy policy
            </Link>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="bg-[#18181b] flex items-center justify-center px-6 lg:px-8 py-6 lg:py-0 lg:h-[101px] w-full">
          <p className="font-normal text-xs lg:text-sm leading-5 text-white text-center">
            COPYRIGHT © 2020{" "}
            <Link
              href="https://www.masjid-alfalah.org.uk/"
              className="hover:text-[#006fee]"
            >
              Masjid Al Falah
            </Link>
            <span className="text-[#006fee]">.</span> All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/02035387266"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-0 right-0 z-50 hidden"
      >
        <Image
          src="/assets/common/whatsapp-icon.svg"
          alt="WhatsApp"
          width={70}
          height={70}
          className="hover:scale-110 transition-transform cursor-pointer"
        />
      </a>
    </>
  );
}
