import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "../../../../lib/helper";

import { Media } from "../../../../payload-types";

interface DonationAppealData {
  title?: string;
  shortDescription?: string;
  funding?: {
    targetAmount?: number;
    currentAmount?: number;
    totalDonors?: number;
  };
  timeline?: {
    endDate?: string;
  };
  heroMedia?: {
    heroImage?: string | Media;
  };
}

export default function DonationAppeal({ donationAppeal = [] }: { donationAppeal: DonationAppealData[] }) {
  if (!donationAppeal || donationAppeal.length === 0) return null;
  const appeal = donationAppeal[0];

  const title = appeal.title || "";
  const shortDescription = appeal.shortDescription || "";
  const description = appeal.shortDescription || "";

  const target = appeal.funding?.targetAmount || 0;
  const funded = appeal.funding?.currentAmount || 0;
  const progressPercentage = target > 0 ? Math.min((funded / target) * 100, 100) : 0;
  const donorsCount = appeal.funding?.totalDonors || 0;

  // Calculate days left
  const endDate = appeal.timeline?.endDate ? new Date(appeal.timeline.endDate) : null;
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0; 

  const image1 = getMediaUrl(appeal.heroMedia?.heroImage);
  console.log("image1", image1)
  return (
    <section className="relative w-full py-8 lg:py-22.5 bg-linear-to-br from-[#165273] to-[#153595]">
      <div className="hn-container px-4 sm:!px-18">
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/donation/pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "154px 154px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 lg:gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          {/* Left side - Title */}
          <div className="flex flex-col gap-4 lg:gap-5 max-w-full lg:max-w-192.75 text-white">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-medium lg:font-semibold leading-8 sm:leading-12 lg:leading-14">
                {title}
              </h2> 
            <p className="sm:text-base text-sm lg:text-lg font-medium leading-5 lg:leading-7">
                {shortDescription}
            </p>
          </div>

          {/* Right side - View All Appeals Button */}
          <div className="relative sm:ml-0 ml-auto">
            <div className="w-31.5 h-31.5 lg:w-50 lg:h-50 relative">
              <Image
                src="/assets/services/circle-bg.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <Link
              href="/appeals"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base lg:text-lg font-medium text-white text-center leading-6 lg:leading-7 max-w-18 lg:max-w-none lg:whitespace-nowrap"
            >
              View All Appeals
            </Link>
          </div>
        </div>

        {/* Donation Card */}
        <div className="bg-white rounded-[15px] w-full lg:w-auto shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row gap-0 overflow-hidden">
          {/* Left side - Image */}
          <div className="relative w-full lg:w-110.5 h-58.5 lg:h-110.5 shrink-0">
            <div className="absolute inset-0 overflow-hidden">
              {/* Desktop Image with specific positioning */}
                {image1 && (
                  <div
                    className="hidden lg:block absolute w-full max-w-none"
                    style={{
                      height: "178.24%",
                      left: "-0.63%",
                      top: "-70.34%",
                    }}
                  >
                    <Image
                      src={image1}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

              {/* Mobile Image - Standard Cover */}
                {image1 && (
                  <div className="lg:hidden absolute inset-0 w-full h-full">
                    <Image
                      src={image1}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
            </div>
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                backgroundImage:
                  "linear-gradient(180.093deg, rgba(255, 255, 255, 0) 26.41%, rgb(232, 232, 232) 73.008%)",
              }}
            />
            <div className="absolute inset-0 mix-blend-multiply overflow-hidden hidden lg:block">
              <div
                className="absolute max-w-none"
                style={{
                  height: "127.16%",
                  left: "-16.04%",
                  top: "41.98%",
                  width: "177.58%",
                }}
              >
                <Image
                  src="/assets/donation/donation-image-2.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col gap-4 lg:gap-16.5 px-5 pt-4 pb-9">
            {/* Top section */}
            <div className="flex flex-col gap-4 lg:gap-5 w-full">
              {/* Organization and Title */}
              <div className="flex flex-col gap-2 w-full">
                {/* Organization */}
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-black flex items-center overflow-hidden">
                    <Image
                      src="/assets/common/logo-small.svg"
                      alt="Masjid Al Falah"
                      width={22}
                      height={22}
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm lg:text-sm font-normal text-[#71717a] leading-5">
                    Masjid Al Falah
                  </p>
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-[#27272a] leading-7 lg:leading-8 overflow-hidden text-ellipsis whitespace-normal lg:whitespace-nowrap w-full">
                    {title}
                </h3>
              </div>

              {/* Stats and Progress */}
              <div className="flex flex-col gap-3 w-full">
                {/* Donors and Days Left */}
                <div className="flex items-start gap-4">
                  {/* Total Donors */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative overflow-hidden shrink-0">
                      <Image
                        src="/assets/donation/users-icon.svg"
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-base font-normal text-[#71717a] leading-6">
                        {donorsCount}
                    </p>
                  </div>

                  {/* Days Left */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative overflow-hidden shrink-0">
                      <Image
                        src="/assets/donation/clock-icon.svg"
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-base font-normal text-[#71717a] leading-6">
                        {daysLeft} days left
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="w-full h-1 bg-[#e4e4e7] rounded-full flex items-start overflow-hidden">
                      <div
                        className="h-1 bg-[#006fee] rounded-full shrink-0"
                        style={{ width: `${progressPercentage}%` }}
                      />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-base font-normal text-[#11181c] leading-6 h-12 overflow-hidden w-full">
                  {description}
              </p>
            </div>

            {/* Bottom section - Amount and Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 w-full">
              {/* Fund Raised */}
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-semibold text-black leading-8">
                    £{funded.toLocaleString()}
                </p>
                  <p className="text-base font-normal text-[#71717a] leading-6 text-left">
                    funded of £{(target / 1000).toFixed(0)}K
                </p>
              </div>

              {/* Buttons */}
                <div className="flex items-start gap-4 w-full lg:w-auto appeal-buttons">
                {/* Learn More */}
                <Link
                  href="/appeal/details"
                  className="flex-1 lg:flex-none h-12 px-6 bg-[#3f3f46] text-white rounded-xl flex items-center justify-center hover:bg-[#2f2f36] transition-colors"
                >
                  <span className="text-sm sm:text-base font-normal text-white leading-6 whitespace-nowrap">
                    Learn More
                  </span>
                </Link>

                {/* Donate Now */}
                <Link
                  href="/donate"
                  className="flex-1 lg:flex-none h-12 px-6 bg-[#006fee] text-white rounded-xl flex items-center justify-center hover:bg-[#0060d8] transition-colors"
                >
                  <span className="text-sm sm:text-base font-normal text-white leading-6 whitespace-nowrap">
                    Donate Now
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
