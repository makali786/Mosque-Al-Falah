import { notFound } from "next/navigation";
import { fetchServices } from "../../../../lib/fetcher"
import NikaahMarriage from "@/components/services/serviceDetail/NikaahMarriage";
import TaraweehEidPrayers from "@/components/services/serviceDetail/TaraweehEidPrayers";

export default async function ServiceDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const services = await fetchServices({
    where: {
      slug: {
        equals: params.slug,
      },
    },
  });

  const serviceData = services[0];

  if (!serviceData) {
    notFound();
  }

  // Transform API data to Component Props format
  // Note: Adjust the mapping based on actual API response structure if needed
  // Using 'any' here as we don't have the generated types for the API response yet
  const transformedService: any = {
    id: serviceData.id,
    title: serviceData.title,
    subtitle: serviceData.shortDescription || "", 
    heroImage: (serviceData.media?.heroImage as any)?.url || "",
    heroImageAlt: (serviceData.media?.heroImage as any)?.alt || serviceData.title,
    description: "", // Extracted from fullDescription if needed, or mapped elsewhere
    // We might need to parse rich text 'fullDescription' if the components expect simple string or structured content
    // For now, passing placeholders or mapping as best as possible
    sections: [], // Populate if available in API
    quote: {
        text: serviceData.quote?.text || "",
        attribution: serviceData.quote?.attribution || ""
    }
  };

  // Determine which component to render based on slug or serviceType
  // API has serviceType: "nikaah" | "taraweeh-eid" | etc.

  // Re-map to ServiceDetail
  const serviceDetail: any = {
      id: serviceData.slug,
      title: serviceData.title,
      subtitle: serviceData.shortDescription || "",
      heroImage: (serviceData.media?.heroImage as any)?.url || "/assets/placeholder.png",
      heroImageAlt: (serviceData.media?.heroImage as any)?.alt || serviceData.title,
      description: "", 
      sections: [], // Map from blocks if applicable
      quote: {
          text: (serviceData as any).quote?.text || "",
          attribution: (serviceData as any).quote?.attribution || ""
      },
      // Pass other specific data bags if the component needs them (e.g. nikaah object)
      ...serviceData // Spread the rest so specific components can access specific fields like 'nikaah', 'taraweehEid'
  };

  const componentParams = { id: params.slug };

  return (
    <div className="bg-white">
      {serviceData.slug === "nikkah-marriage" ? (
        <NikaahMarriage service={serviceDetail} params={componentParams} />
      ) : serviceData.slug === "taraweeh-eid-prayers" ? (
        <TaraweehEidPrayers service={serviceDetail} params={componentParams} />
      ) : (
        <TaraweehEidPrayers service={serviceDetail} params={componentParams} />
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((service: any) => ({
    slug: service.slug,
  }));
}
