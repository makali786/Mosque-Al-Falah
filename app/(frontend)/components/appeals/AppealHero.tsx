'use client';

import Image from 'next/image';
import { getMediaAlt, getMediaUrl } from '../../../../lib/helper';
import { Media } from '../../../../payload-types';

interface AppealHeroProps {
  title: string;
  description: string;
  heroImage: Media | string | null;
  stats: {
    raised: number;
    donors: number;
    goal: number;
    daysLeft: number;
  };
}

export function AppealHero({
  title,
  description,
  heroImage,
  stats,
}: AppealHeroProps) {
  const imageUrl = getMediaUrl(heroImage);
  const imageAlt = getMediaAlt(heroImage) || title;
  const progress =
    stats.goal > 0 ? Math.min((stats.raised / stats.goal) * 100, 100) : 0;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:max-h-[756px]">
        {/* Left Side - Image */}
        <div className="relative w-full h-[400px] lg:h-full">
          {imageUrl ? (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-30 bg-repeat"
                  style={{
                    backgroundImage: "url('/assets/services/bg-pattern.png')",
                    backgroundSize: '154px 154px',
                  }}
                />
              </div>
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className=" z-0 object-contain"
                priority
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image Available
            </div>
          )}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <Image
              src="/assets/common/zakat-tag.svg"
              alt="Zakat"
              width={28}
              height={28}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            />
            <Image
              src="/assets/common/heart-icon.svg"
              alt="Favorite"
              width={28}
              height={28}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>
        </div>

        {/* Right Side - Content with Blue Background */}
        <div className="relative flex flex-col justify-center px-6 py-12 sm:py-16 lg:py-20 lg:px-8 overflow-hidden">
          {/* Background Strategy from OurCoreValues */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-30 bg-repeat"
              style={{
                backgroundImage: "url('/assets/services/bg-pattern.png')",
                backgroundSize: '154px 154px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-12 text-white">
            <div className="flex flex-col gap-8">
              <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="text-base font-medium sm:text-lg text-[#E4E4E7]">
                {description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-[22px] px-4 sm:px-8 bg-[#001731] rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center text-center gap-1">
                <span className="text-lg sm:text-2xl md:text-[30px] font-bold">
                  £{stats.raised.toLocaleString()}
                </span>
                <span className="text-sm sm:text-lg font-medium uppercase">
                  Raised
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-1">
                <span className="text-lg sm:text-2xl md:text-[30px] font-bold">
                  {stats.donors}
                </span>
                <span className="text-sm sm:text-lg font-medium uppercase">
                  Donations
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-1">
                <span className="text-lg sm:text-2xl md:text-[30px] font-bold">
                  £{stats.goal.toLocaleString()}
                </span>
                <span className="text-sm sm:text-lg font-medium uppercase">
                  Goal
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-1">
                <span className="text-lg sm:text-2xl md:text-[30px] font-bold">
                  {stats.daysLeft}
                </span>
                <span className="text-sm sm:text-lg font-medium uppercase">
                  Days To Go
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-3">
              <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006FEE] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Optional: Add "Asset Verified Fundraiser" or similar text if needed as per image */}
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5">
                  <Image
                    src="/assets/common/zakat-tag.svg"
                    alt="Verified"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-xm">Asset Verified Fundraiser</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
