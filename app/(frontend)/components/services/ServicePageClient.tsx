"use client";

import Image from "next/image";
import BreadcrumbSearchSection from "@/components/common/BreadcrumbSearchSection";
import RequestServiceForm from "@/components/common/RequestServiceForm";
import { QuoteSection } from "@/components/common/QuoteSection";

interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
  description: string;
  sections: {
    heading: string;
    content: string;
    image?: string;
    imageAlt?: string;
    layout?: "image-right" | "image-left";
  }[];
  timings?: {
    title: string;
    schedule: {
      day: string;
      time: string;
    }[];
  };
  features?: string[];
  quote?: {
    text: string;
    attribution: string;
  };
}

interface ServicePageClientProps {
  service: ServiceDetail;
}

export default function ServicePageClient({ service }: ServicePageClientProps) {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: service.title,
          text: service.subtitle,
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      alert("Share this page: " + window.location.href);
    }
  };

  const handleDonate = () => {
    window.location.href = "/donate";
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
        <Image
          src={service.heroImage}
          alt={service.heroImageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hn-container text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
              {service.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <BreadcrumbSearchSection
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Services", href: "/our-services" },
          { label: service.title, href: `/our-services/${service.id}` },
        ]}
        searchPlaceholder="Search services"
        onSearch={handleSearch}
      />

      {/* Request Service Form */}
      <div className="hn-container py-12 sm:py-16 lg:py-20">
        <RequestServiceForm
          onSubmit={(data) => {
            console.log("Service request submitted:", data);
          }}
        />
      </div>

      {/* Quote Section */}
      {service.quote && (
        <QuoteSection
          quote={service.quote.text}
          attribution={service.quote.attribution}
          showAttributionSymbol={true}
          onShare={handleShare}
          onDonate={handleDonate}
          shareButtonText="Share this page"
          donateButtonText="Donate Now"
        />
      )}
    </div>
  );
}
