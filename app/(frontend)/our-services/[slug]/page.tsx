import { notFound } from "next/navigation";
import { fetchGlobal, fetchServices } from "../../../../lib/fetcher"
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

  const servicesPage = await fetchGlobal({
    slug: "services-page",
  });




  const serviceData = services[0];

  if (!serviceData) {
    notFound();
  }




  const serviceDetail: any = {
    ...serviceData, 
    quote: serviceData.testimonials?.[0] ? {
      text: serviceData.testimonials[0].quote,
      attribution: `${serviceData.testimonials[0].author} ${serviceData.testimonials[0].authorTitle || ''}`.trim(),
      photo: serviceData.testimonials[0].photo
    } : null,
    media: serviceData.media || {},
  };

  const componentParams = { id: params.slug };

  return (
    <div className="bg-white">
      {serviceData.slug === "nikkah-marriage" ? (
        <NikaahMarriage service={serviceDetail} params={componentParams} servicesPage={servicesPage} />
      ) : serviceData.slug === "taraweeh-eid-prayers" ? (
          <TaraweehEidPrayers service={serviceDetail} params={componentParams} servicesPage={servicesPage} />
      ) : (
            <TaraweehEidPrayers service={serviceDetail} params={componentParams} servicesPage={servicesPage} />
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
