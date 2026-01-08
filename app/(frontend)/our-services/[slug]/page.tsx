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



  // Determine which component to render based on slug or serviceType
  // API has serviceType: "nikaah" | "taraweeh-eid" | etc.

  // Re-map to ServiceDetail
  // Re-map to ServiceDetail
  const serviceDetail: any = {
    ...serviceData, // Spread the rest so specific components can access specific fields
    // Map first testimonial to quote if available
    quote: serviceData.testimonials?.[0] ? {
      text: serviceData.testimonials[0].quote,
      attribution: `${serviceData.testimonials[0].author} ${serviceData.testimonials[0].authorTitle || ''}`.trim(),
      photo: serviceData.testimonials[0].photo
    } : null,
    // Ensure media object is safe
    media: serviceData.media || {},
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
