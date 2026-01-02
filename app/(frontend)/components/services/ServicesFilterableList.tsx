"use client";

import { useState } from "react";
import BreadcrumbSearchSection, { Breadcrumb } from "../common/BreadcrumbSearchSection";
import ServicesSection, { Service } from "./ServicesSection";

interface ServicesFilterableListProps {
  services: Service[];
  breadcrumbs: Breadcrumb[];
  searchPlaceholder?: string;
}

export default function ServicesFilterableList({
  services,
  breadcrumbs,
  searchPlaceholder = "Search",
}: ServicesFilterableListProps) {
  const [filteredServices, setFilteredServices] = useState(services);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = services.filter((service) =>
      service.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredServices(filtered);
  };

  return (
    <>
      <BreadcrumbSearchSection
        breadcrumbs={breadcrumbs}
        searchPlaceholder={searchPlaceholder}
        onSearch={handleSearch}
        liveSearch={true}
      />
      <ServicesSection services={filteredServices} />
    </>
  );
}
