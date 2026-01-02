import { fetchGlobal, fetchServices } from "../../../lib/fetcher";
import ServicesFilterableList from "../components/services/ServicesFilterableList";
import RequestServiceForm from "@/components/common/RequestServiceForm";
import { QuoteSection } from "@/components/common/QuoteSection";

// Define types based on Payload response structure
interface ServicesPageData {
    hero?: {
        greeting?: string;
        visionStatement?: string;
        backgroundColor?: string;
    };
    breadcrumb?: {
        showBreadcrumb?: boolean;
        breadcrumbText?: string;
    };
    servicesGrid?: {
        displayMode?: string;
        gridColumns?: string;
        sortBy?: string;
        showSearch?: boolean;
    };
    requestForm?: {
        sectionTitle?: string;
        description?: string;
        formFields?: any;
    };
    bottomQuote?: {
        quoteText?: string;
        author?: string;
        showShareButton?: boolean;
        shareButtonText?: string;
        showDonateButton?: boolean;
        donateButtonText?: string;
        donateButtonUrl?: string;
    };
    seo?: any;
}

export default async function OurServicesPage() {
    const servicesPage = await fetchGlobal({
        slug: "services-page",
    }) as ServicesPageData;

    const servicesDocs = await fetchServices({
        sort: "order",
    }) as any[];

    // Map Services Data
    const transformedServices = servicesDocs?.map((doc: any) => {
        const cardImage = doc?.media?.cardImage;
        return {
            id: doc?.id,
            title: doc?.title,
            imageSrc: (typeof cardImage === 'object' ? cardImage?.url : cardImage) || "/assets/placeholder.png",
            imageAlt: (typeof cardImage === 'object' ? cardImage?.alt : doc?.title) || "Service Image",
            href: `/our-services/${doc?.slug}`,
        };
    }) || [];

    // Extract Hero Data
    const greeting = servicesPage?.hero?.greeting || "";
    const vision = servicesPage?.hero?.visionStatement || "";

    // Extract Request Form Data
    const requestFormFields = servicesPage?.requestForm?.formFields;
    const requestFormTitle = servicesPage?.requestForm?.sectionTitle;
    const requestFormDesc = servicesPage?.requestForm?.description;

    // Extract Quote Data
    const quoteText = servicesPage?.bottomQuote?.quoteText || "";
    const quoteAuthor = servicesPage?.bottomQuote?.author || "";
    const donateUrl = servicesPage?.bottomQuote?.donateButtonUrl;
    const shareButtonText = servicesPage?.bottomQuote?.shareButtonText;
    const donateButtonText = servicesPage?.bottomQuote?.donateButtonText;

    const shareData = {
        title: "Our Services | Mosque Al-Falah",
        text: quoteText,
        url: "", // Client will handle URL
    };

    // Server Action for form submission
    async function handleFormSubmit(data: any) {
        "use server";
        console.log("Form submitted:", data);
    }

    return (
        <div className="bg-white">
            {/* Vision Section */}
            <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-18 overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-30 bg-repeat"
                        style={{
                            backgroundImage: "url('/assets/services/bg-pattern.png')",
                            backgroundSize: "154px 154px",
                        }}
                    />
                </div>

                {/* Content Container */}
                <div className="relative hn-container flex flex-col gap-3 sm:items-center justify-center sm:text-center">
                    <p className="text-sm sm:text-base md:text-lg font-medium sm:text-center text-[#CCE3FD] uppercase tracking-wide">
                        {greeting}
                    </p>
                    <h2 className="text-2xl leading-8 font-semibold sm:text-3xl md:text-4xl lg:text-2xl xl:text-3xl text-white max-w-[712px]">
                        {vision}
                    </h2>
                </div>
            </section>

            {/* Filterable Services List */}
            <ServicesFilterableList
                services={transformedServices}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Our Services", href: "/our-services" },
                ]}
                searchPlaceholder="Search"
            />

            <div className="hn-container py-17">
                <RequestServiceForm
                    sectionTitle={requestFormTitle}
                    description={requestFormDesc}
                    formFields={requestFormFields}
                    onSubmit={handleFormSubmit}
                />
            </div>

            <QuoteSection
                quote={quoteText}
                attribution={quoteAuthor}
                showAttributionSymbol={true}
                shareButtonText={shareButtonText}
                donateButtonText={donateButtonText}
                donateButtonUrl={donateUrl}
                shareData={shareData}
            />
        </div>
    );
}