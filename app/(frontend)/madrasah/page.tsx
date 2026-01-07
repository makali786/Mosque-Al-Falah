import { CommitteeMember, CommitteesSection } from "@/components/about/CommitiesCard";
import PageHero from "@/components/common/PageHero";
import RequestServiceForm from "@/components/common/RequestServiceForm";
import { QuoteSectionWrapper } from "../../components/contact/QuoteSectionWrapper";
import MadrasahClasses from "../components/madrasah/MadrasahClasses";
import MadrasahFAQs from "../components/madrasah/MadrasahFAQs";
import MadrasahGallery from "../components/madrasah/MadrasahGallery";
import ParentReviews from "../components/madrasah/ParentReviews";

import { Metadata } from 'next';
import { fetchCommittees, fetchGlobal, findFromPayload } from "@lib/fetcher";

// Define Interfaces based on API response

interface MadrasahPageGlobal {
    hero: {
        title: string;
        showBreadcrumb: boolean;
        breadcrumbText: string;
        backgroundImage?: { url: string } | null;
    };
    classesSection: {
        enableSection: boolean;
        sectionTitle: string;
        displayMode: string;
        gridColumns: string;
    };
    committeeSection: {
        enableSection: boolean;
        sectionTitle: string;
        description: string;
        gridColumns: string;
        committeeType?: string;
    };
    gallerySection: {
        enableSection: boolean;
        sectionLabel: string;
        sectionTitle: string;
        description: string;
        galleryImages: any[];
        contactButtonText: string;
        contactButtonUrl: string;
        enrollButtonText: string;
        enrollButtonUrl: string;
    };
    testimonialsSection: {
        enableSection: boolean;
        sectionLabel: string;
        sectionTitle: string;
    };
    faqsSection: {
        enableSection: boolean;
        sectionTitle: string;
        sectionDescription: string;
        faqs: Array<{
            id: string;
            question: string;
            answer: any;
        }>;
    };
    contactSection: {
        enableSection: boolean;
        sectionTitle: string;
        description: string;
    };
    bottomQuote: {
        enableSection: boolean;
        quoteText: string;
        author: string;
        donateButtonUrl: string;
        showShareButton: boolean;
        showDonateButton: boolean;
    };
    seo: {
        metaTitle: string;
        metaDescription: string;
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await fetchGlobal<MadrasahPageGlobal>({ slug: 'madrasah-page' });
    return {
        title: data?.seo?.metaTitle || 'Madrasah - Masjid Al-Falah',
        description: data?.seo?.metaDescription || 'Explore our Madrasah programs.',
    };
}

export default async function MadrasahPage() {
    // 1. Fetch Global Data
    const pageData = await fetchGlobal<MadrasahPageGlobal>({ slug: "madrasah-page" });

    // 2. Fetch Collections
    const classesData = await findFromPayload({ collection: "madrasah-classes" });
    const testimonialsData = await findFromPayload({ collection: "madrasah-testimonials" });

    // Default to 'madrasah' or 'education' if not set, preventing empty results if possible
    const committeeFilter = pageData?.committeeSection?.committeeType || 'madrasah';

    const committeeMembers = await fetchCommittees<CommitteeMember>({ sort: 'order', where: { isActive: { equals: true } } });

    if (!pageData) {
        return <div>Loading...</div>; // Or notFound()
    }

    return (
        <div className="bg-white">
            {/* 1. Hero Section */}
            <PageHero
                title={pageData.hero?.title || "Madrasah"}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: pageData.hero?.title || "Madrasah", href: "/madrasah" },
                ]}
                backgroundImage={pageData.hero?.backgroundImage?.url || "/assets/madrasah/hero-bg.jpg"}
            />

            {/* 2. Classes Section */}
            {pageData.classesSection?.enableSection && (
                <MadrasahClasses
                    classes={classesData}
                    sectionTitle={pageData.classesSection.sectionTitle}
                />
            )}

            {/* 3. Committee Section */}
            {pageData.committeeSection?.enableSection && (
                <CommitteesSection
                    title={pageData.committeeSection.sectionTitle}
                    description={pageData.committeeSection.description}
                    members={committeeMembers as any}
                    className="!bg-[#E6F1FE]"
                    headerStyle="!lg:max-w-full lg:min-w-full"
                    committesStyle={"section-padding"}
                />
            )}

            {/* 4. Gallery Section */}
            {pageData.gallerySection?.enableSection && (
                <MadrasahGallery
                    galleryImages={pageData.gallerySection.galleryImages}
                    sectionLabel={pageData.gallerySection.sectionLabel}
                    sectionTitle={pageData.gallerySection.sectionTitle}
                    description={pageData.gallerySection.description}
                    contactButtonText={pageData.gallerySection.contactButtonText}
                    contactButtonUrl={pageData.gallerySection.contactButtonUrl}
                    enrollButtonText={pageData.gallerySection.enrollButtonText}
                    enrollButtonUrl={pageData.gallerySection.enrollButtonUrl}
                />
            )}

            {/* 5. What Parents Say Section */}
            {pageData.testimonialsSection?.enableSection && (
                <ParentReviews
                    testimonials={testimonialsData}
                    sectionLabel={pageData.testimonialsSection.sectionLabel}
                    sectionTitle={pageData.testimonialsSection.sectionTitle}
                />
            )}

            {/* 6. FAQs Section */}
            {pageData.faqsSection?.enableSection && (
                <MadrasahFAQs
                    faqs={pageData.faqsSection.faqs}
                    title={pageData.faqsSection.sectionTitle}
                    description={pageData.faqsSection.sectionDescription}
                />
            )}

            {/* 7. Contact Section */}
            {pageData.contactSection?.enableSection && (
                <div className="section-padding">
                    <RequestServiceForm
                        sectionTitle={pageData.contactSection.sectionTitle}
                        description={pageData.contactSection.description}
                        className="my-8 lg:my-[72px]"
                    />
                </div>
            )}

            {/* 8. Quote Section */}
            {pageData.bottomQuote?.enableSection && (
                <QuoteSectionWrapper
                    quote={pageData.bottomQuote.quoteText}
                    attribution={pageData.bottomQuote.author}
                    donateButtonUrl={pageData.bottomQuote.donateButtonUrl}
                    showShareButton={pageData.bottomQuote.showShareButton}
                    showDonateButton={pageData.bottomQuote.showDonateButton}
                />
            )}
        </div>
    );
}
