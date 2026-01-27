"use client";

import { ReactNode } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline" | "clean";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className = "",
}: TabsProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return {
          container: "flex flex-wrap items-center gap-2 p-1 bg-[#F4F4F5] rounded-xl",
          tab: "transition-all cursor-pointer",
          active: "bg-white text-black shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
          inactive: "text-[#71717A]",
        };
      case "underline":
        return {
          container: "flex flex-wrap items-center gap-4 border-b border-[#E4E4E7]",
          tab: "transition-all cursor-pointer border-b-2 -mb-px",
          active: "border-[#006FEE] text-[#006FEE]",
          inactive: "border-transparent text-[#71717A] hover:text-[#18181B]",
        };
      case "clean":
        return {
          container: "flex flex-wrap items-center gap-6",
          tab: "transition-all cursor-pointer",
          active: "text-[#006FEE] font-medium",
          inactive: "text-[#71717A] hover:text-[#18181B]",
        };
      default:
        return {
          container: "flex flex-wrap items-center gap-2",
          tab: "transition-all cursor-pointer border border-[#E4E4E7]",
          active: "bg-black text-white border-black",
          inactive: "bg-white text-[#18181B] hover:bg-[#F4F4F5]",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return variant === "pills"
          ? "px-3 py-1 text-sm rounded-lg"
          : variant === "underline" || variant === "clean"
            ? "px-2 py-2 text-sm"
            : "px-3 py-1.5 text-sm rounded-lg";
      case "lg":
        return variant === "pills"
          ? "px-5 py-2.5 text-base rounded-lg"
          : variant === "underline" || variant === "clean"
            ? "px-4 py-3 text-base"
            : "px-5 py-3 text-base rounded-xl";
      default:
        return variant === "pills"
          ? "px-3 py-1 text-base rounded-lg"
          : variant === "underline" || variant === "clean"
            ? "px-3 py-2.5 text-base"
            : "px-4 py-2 text-base rounded-lg";
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div
      className={`${styles.container} ${fullWidth ? 'w-full' : ''} ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`${sizeStyles} ${styles.tab} ${activeTab === tab.id ? styles.active : styles.inactive
            } ${fullWidth ? 'flex-1' : ''} flex items-center justify-center gap-2`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
