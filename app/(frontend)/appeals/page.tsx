"use client";

import AppealCard from "../components/common/AppealCard";
import BreadcrumbSearchSection from "../components/common/BreadcrumbSearchSection";
import { QuoteSection } from "../components/common/QuoteSection";

export default function AppealsPage() {
  const appeals = [
    {
      title: "Give back with grateful heart this Ramadan",
      description: "Providing Water and Homes to Orphans, Widows and the Most Vulnerable.",
      image: "/assets/donation/donation-image-1.png",
      organization: {
        name: "Organization Name",
        logo: "/assets/common/logo-small.svg",
      },
      stats: {
        donors: 105,
        daysLeft: 50,
      },
      funding: {
        raised: 18402,
        goal: 87000,
      },
      links: {
        donate: "/donate/ramadan",
      },
    },
    {
      title: "Gaza Emergency Appeal",
      description: "Providing Water and Homes to Orphans, Widows and the Most Vulnerable.",
      image: "/assets/donation/donation-image-2.png",
      organization: {
        name: "Organization Name",
        logo: "/assets/common/logo-small.svg",
      },
      stats: {
        donors: 105,
        daysLeft: 50,
      },
      funding: {
        raised: 18402,
        goal: 87000,
      },
      links: {
        donate: "/donate/gaza",
      },
      buttonVariant: "secondary" as const,
    },
    {
      title: "Lets improve their quality of life",
      description: "Providing Water and Homes to Orphans, Widows and the Most Vulnerable.",
      image: "/assets/donation/donation-image-1.png", // reusing image 1 as placeholder
      organization: {
        name: "Organization Name",
        logo: "/assets/common/logo-small.svg",
      },
      stats: {
        donors: 105,
        daysLeft: 50,
      },
      funding: {
        raised: 18402,
        goal: 87000,
      },
      links: {
        donate: "/donate/quality-of-life",
      },
    },
  ];

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <BreadcrumbSearchSection
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Appeals", href: "/appeals" },
        ]}
      />

      <section className="pb-16 pt-2 flex-grow">
        <div className="hn-container">
          <div className="flex flex-col gap-6 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#18181b]">
              Appeals
            </h1>
            <p className="text-[#646467] font-medium text-lg leading-relaxed max-w-5xl">
              The Prophet (peace be upon him) said: “Charity does not reduce
              wealth” (Bukhari) Please donate generously to Masjid Al-Falah,
              Ilford. All proceeds go towards the upkeep of the Masjid and
              helping us to serve the wider community. May Allah reward you
              greatly for all your donations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appeals.map((appeal, index) => (
              <AppealCard key={index} {...appeal} />
            ))}
          </div>
        </div>
      </section>

      <QuoteSection
        quote="“Whoever guides someone to goodness will have a reward like the one who did it.”"
        attribution="— Prophet Muhammad ﷺ"
        backgroundColor="#f4f4f5"
        shareButtonText="Share this page"
        donateButtonText="Donate Now"
        onShare={() => {}}
        onDonate={() => {}}
      />
    </main>
  );
}
