"use client";

import Image from "next/image";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: {
    ring: "w-16 h-16 border-4",
    logo: "w-8 h-8",
  },
  md: {
    ring: "w-24 h-24 border-4",
    logo: "w-12 h-12",
  },
  lg: {
    ring: "w-32 h-32 border-[5px]",
    logo: "w-16 h-16",
  },
  xl: {
    ring: "w-40 h-40 border-[6px]",
    logo: "w-20 h-20",
  },
};

export default function LoadingSpinner({
  size = "lg",
  fullScreen = true,
}: LoadingSpinnerProps) {
  const { ring, logo } = sizeClasses[size];

  const spinnerContent = (
    <div className="relative inline-flex items-center justify-center">
      {/* Spinning Ring */}
      <div
        className={`${ring} rounded-full border-transparent border-t-[#06b7db] border-r-[#06b7db] animate-spin`}
        style={{
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Logo in Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/assets/header/logo.svg"
          alt="Mosque Al-Falah"
          width={80}
          height={80}
          className={`${logo} object-contain`}
          priority
        />
      </div>
    </div>
  );

  if (!fullScreen) {
    return spinnerContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {spinnerContent}
    </div>
  );
}
