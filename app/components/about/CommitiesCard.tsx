"use client"

import Image from "next/image"


interface TeamMemberCardProps {
  name: string
  title: string
  description: string
  imageUrl: string
  whatsappLink?: string
  emailLink?: string
}

export function TeamMemberCard({ name, title, description, imageUrl, whatsappLink, emailLink }: TeamMemberCardProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6">
      {/* Image Container */}
      <div className="mb-4 overflow-hidden rounded-lg">
        <img src={"assets/about-us/team-card-img.png"} alt={name} className="h-48 w-full object-cover" />
      </div>

      {/* Name and Title */}
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="mb-4 text-sm font-medium text-gray-600">{title}</p>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-gray-600">{description}</p>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
              <Image 
              src={"/assets/common/whatsapp.svg"}
                alt="Email Icon"
                width={16}
                height={16}
                className="object-contain"
              />
              Whatsapp
            </button>
          </a>
        )}
        {emailLink && (
          <a href={emailLink}>
            <button
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <Image 
              src={"/assets/common/email-icon.svg"}
                alt="Email Icon"
                width={16}
                height={16}
                className="object-contain"
              />
              Email
            </button>
          </a>
        )}
      </div>
    </div>
  )
}
