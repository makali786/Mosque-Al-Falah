import Image from "next/image";
import Link from "next/link";
import { getMediaUrl, getMediaAlt } from "../../../../lib/helper";
import { Media } from "../../../../payload-types";

interface AppealCardProps {
  title: string;
  description?: string;
  image: string | Media | null;
  organization?: {
    name: string;
    logo?: string;
  };
  stats?: {
    donors?: number;
    daysLeft?: number;
    endDate?: string;
  };
  funding?: {
    raised?: number;
    goal?: number;
  };
  links?: {
    donate?: string;
    details?: string;
  };
  className?: string; // For adding custom classes like width
  buttonVariant?: 'primary' | 'secondary';
}

export default function AppealCard({
  title,
  description = "",
  image,
  organization = { name: "Masjid Al Falah" },
  stats = { donors: 0, daysLeft: 0 },
  funding = { raised: 0, goal: 0 },
  links = { donate: "/donate", details: "/appeals" },
  className = "",
  buttonVariant = 'primary',
}: AppealCardProps) {
  
  const imageUrl = getMediaUrl(image);
  const imageAlt = getMediaAlt(image) || title;

  const raised = funding.raised || 0;
  const target = funding.goal || 0; // Avoid division by zero
  const progressPercentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  
  // Calculate days left if endDate is provided and daysLeft isn't manually set?
  // Use props as dominant.
  const daysLeft = stats.daysLeft ?? 0;
  const donorsCount = stats.donors ?? 0;

  return (
    <div className={`bg-white rounded-[15px] border border-[#e4e4e7] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Image Section */}
      <div className="relative w-full h-[240px] shrink-0 overflow-hidden group">
        {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-6 p-5 sm:p-6">
        {/* Header: Organization & Title */}
        <div className="flex flex-col gap-2">
            {/* Organization */}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center overflow-hidden shrink-0">
                    <Image
                        src={organization.logo || "/assets/common/logo-small.svg"}
                        alt={organization.name}
                        width={24}
                        height={24}
                        className="object-cover"
                    />
                </div>
                <p className="text-sm font-normal text-[#71717a] leading-5">
                    {organization.name}
                </p>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-[#27272a] leading-7 line-clamp-2">
                {title}
            </h3>
        </div>

        {/* Stats & Progress */}
        <div className="flex flex-col gap-3">
            {/* Stats: Donors & Days */}
            <div className="flex items-center gap-4 text-[#71717a]">
                {/* Donors */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative shrink-0">
                         <Image
                            src="/assets/donation/users-icon.svg"
                            alt="Donors"
                            fill
                            className="object-contain"
                         />
                    </div>
                    <span className="text-base font-normal leading-6">{donorsCount}</span>
                </div>

                {/* Days Left */}
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 relative shrink-0">
                         <Image
                            src="/assets/donation/clock-icon.svg"
                            alt="Time Left"
                            fill
                            className="object-contain"
                         />
                    </div>
                    <span className="text-base font-normal leading-6">{daysLeft} days left</span>
                </div>
            </div>

            {/* Progress Bar */}
             <div className="w-full h-1 bg-[#e4e4e7] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#006fee] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>

        {/* Description (Optional) */}
        {description && (
             <p className="text-base text-[#71717a] leading-6 line-clamp-3">
                {description}
            </p>
        )}

        {/* Footer: Amount & Donate Button */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-2">
            {/* Raised Amount */}
            <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-semibold text-[#18181b] leading-8">£{raised.toLocaleString()}</span>
                </div>
                <p className="text-sm font-normal text-[#71717a] leading-5">
                    funded of £{target >= 1000 ? (target / 1000).toLocaleString() + 'K' : target.toLocaleString()}
                </p>
            </div>

             {/* Donate Button */}
             <Link
                href={links.donate || "/donate"}
                className={`px-6 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors shrink-0 ${
                  buttonVariant === 'secondary' 
                    ? 'bg-[#a1a1aa] hover:bg-[#71717a] text-white' 
                    : 'bg-[#006fee] hover:bg-[#0056cc] text-white'
                }`}
             >
                Donate Now
             </Link>
        </div>
      </div>
    </div>
  );
}
