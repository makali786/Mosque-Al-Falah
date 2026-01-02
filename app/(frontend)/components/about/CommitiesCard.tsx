"use client";

import Image from "next/image";

export interface Media {
  id: string;
  url: string;
  alt: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
}

export interface Contact {
  enableWhatsApp: boolean;
  whatsappNumber?: string;
  enableEmail: boolean;
  email?: string;
  phone?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  committeeType: string;
  photo: Media;
  bio: string;
  contact: Contact;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
}

export function TeamMemberCard({ member }: { member: CommitteeMember }) {
  // Helper to format WhatsApp URL
  const getWhatsAppUrl = (number: string) => {
    const cleanNumber = number.replace(/[^\d+]/g, "");
    return `https://wa.me/${cleanNumber}`;
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-4 lg:gap-4 bg-white border border-[#e4e4e7] rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-4.5 md:p-5 lg:p-5 shadow-sm overflow-hidden">
      {/* Image */}
      <div
        className="relative w-full rounded-md sm:rounded-lg lg:rounded-lg overflow-hidden"
        style={{ aspectRatio: "226 / 162" }}
      >
        <Image
          src={member?.photo?.url || "/placeholder-image.png"} 
          alt={member?.photo?.alt || member.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Name and Role */}
      <div className="flex flex-col gap-1 lg:gap-1">
        <h3 className="text-lg leading-6 font-semibold sm:text-[19px] sm:leading-7 md:text-xl md:leading-7 lg:text-[20px] lg:leading-7 text-[#18181b]">
          {member?.name}
        </h3>
        <p className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6 text-[#71717a] truncate">
          {member?.role}
        </p>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ backgroundColor: "rgba(17, 17, 17, 0.15)" }}
      />

      {/* Description - 3 lines max */}
      <p
        className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6 text-[#71717a] overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          height: "72px", // 3 lines * 24px line height
        }}
      >
        {member?.bio}
      </p>

      {/* Buttons */}
      <div className="flex gap-3 sm:gap-3.5 md:gap-4 lg:gap-4">
        {member?.contact?.enableWhatsApp && member?.contact?.whatsappNumber && (
          <a
            href={getWhatsAppUrl(member?.contact?.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-10 sm:h-11 md:h-12 lg:h-12 px-4 sm:px-5 md:px-6 lg:px-6 border-2 border-[#d4d4d8] rounded-md sm:rounded-lg lg:rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 relative">
              <Image
                src="/assets/common/mini-whatsapp-icon.svg"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6 text-black">
              Whatsapp
            </span>
          </a>
        )}
        {member?.contact?.enableEmail && member?.contact?.email && (
          <a
            href={`mailto:${member?.contact?.email}`}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-12 lg:h-12 border-2 border-[#d4d4d8] rounded-md sm:rounded-lg lg:rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 relative">
              <Image
                src="/assets/common/message.svg"
                alt="Email"
                fill
                className="object-contain"
              />
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

interface CommitteesSectionProps {
  title: string;
  description?: string;
  members: CommitteeMember[];
}

export function CommitteesSection({ title, description, members }: CommitteesSectionProps) {
  if (!members || members.length === 0) return null;
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-28 xl:py-33">
      <div className="w-full hn-container flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-6 max-w-full lg:max-w-139">
          <h2 className="text-2xl leading-8 font-bold sm:text-3xl sm:leading-9 md:text-[32px] md:leading-9 lg:text-[36px] lg:leading-10 text-[#27272a]">
            {title}
          </h2>
          {description && (
            <p className="text-base leading-6 font-medium sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-[#52525b]">
              {description}
            </p>
          )}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full">
          {members.map((member) => (
            <TeamMemberCard key={member?.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
