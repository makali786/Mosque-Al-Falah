import { CommitteesSection } from "@/components/about/CommitiesCard";
import PageHero from "@/components/common/PageHero";
import RequestServiceForm from "@/components/common/RequestServiceForm";
import { QuoteSectionWrapper } from "../../components/contact/QuoteSectionWrapper";
import MadrasahClasses from "../components/madrasah/MadrasahClasses";
import MadrasahFAQs from "../components/madrasah/MadrasahFAQs";
import MadrasahGallery from "../components/madrasah/MadrasahGallery";
import ParentReviews from "../components/madrasah/ParentReviews";

// Hardcoded Committee Members
const committeeMembers = [
    {
        id: "1",
        name: "Mr. Sharafat Khan",
        role: "Head of Committee",
        committeeType: "Madrasah",
        photo: {
            url: "/assets/madrasah/committee-1.jpg",
            alt: "Mr. Sharafat Khan",
            id: "1",
            filename: "c1.jpg",
            mimeType: "image/jpeg",
            filesize: 1000,
            width: 300,
            height: 300
        },
        bio: "Responsible for the strategic direction and overall management of the mosque.",
        contact: {
            enableWhatsApp: true,
            whatsappNumber: "1234567890",
            enableEmail: false,
        },
        order: 1,
        isFeatured: true,
        isActive: true
    },
    {
        id: "2",
        name: "Mr. Sharafat Khan",
        role: "Head of Committee",
        committeeType: "Madrasah",
        photo: {
            url: "/assets/madrasah/committee-2.jpg",
            alt: "Mr. Sharafat Khan",
            id: "2",
            filename: "c2.jpg",
            mimeType: "image/jpeg",
            filesize: 1000,
            width: 300,
            height: 300
        },
        bio: "Responsible for the strategic direction and overall management of the mosque.",
        contact: {
            enableWhatsApp: true,
            whatsappNumber: "1234567890",
            enableEmail: false,
        },
        order: 2,
        isFeatured: true,
        isActive: true
    },
    {
        id: "3",
        name: "Mr. Sharafat Khan",
        role: "Head of Committee",
        committeeType: "Madrasah",
        photo: {
            url: "/assets/madrasah/committee-3.jpg",
            alt: "Mr. Sharafat Khan",
            id: "3",
            filename: "c3.jpg",
            mimeType: "image/jpeg",
            filesize: 1000,
            width: 300,
            height: 300
        },
        bio: "Responsible for the strategic direction and overall management of the mosque.",
        contact: {
            enableWhatsApp: true,
            whatsappNumber: "1234567890",
            enableEmail: false,
        },
        order: 3,
        isFeatured: true,
        isActive: true
    },
    {
        id: "4",
        name: "Mr. Sharafat Khan",
        role: "Head of Committee",
        committeeType: "Madrasah",
        photo: {
            url: "/assets/madrasah/committee-4.jpg",
            alt: "Mr. Sharafat Khan",
            id: "4",
            filename: "c4.jpg",
            mimeType: "image/jpeg",
            filesize: 1000,
            width: 300,
            height: 300
        },
        bio: "Responsible for the strategic direction and overall management of the mosque.",
        contact: {
            enableWhatsApp: true,
            whatsappNumber: "1234567890",
            enableEmail: false,
        },
        order: 4,
        isFeatured: true,
        isActive: true
    }
];

export default function MadrasahPage() {
    return (
        <div className="bg-white">
            {/* 1. Hero Section */}
            <PageHero
                title="Madrasah"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Madrasah", href: "/madrasah" },
                ]}
                backgroundImage="/assets/madrasah/hero-bg.jpg"
            />

            {/* 2. Classes Section */}
            <MadrasahClasses />

            {/* 3. Committee Section */}
            <CommitteesSection
                title="Madrasah Commitee"
                description="Masjid Al Falah is run under the management of Masjid Al Falah under which there is a group of people who gives their valuable time to look after the needs of our Madrasah n a daily basis, these people are working as Madrasah Commitee and they are as follow;"
                members={committeeMembers as any}
                className="!bg-[#E6F1FE] section-padding"
                headerStyle="!lg:max-w-full lg:min-w-full"

            />

            {/* 4. Gallery Section */}
            <MadrasahGallery />

            {/* 5. What Parents Say Section */}
            <ParentReviews />

            {/* 6. FAQs Section */}
            <MadrasahFAQs />

            {/* 7. Contact Section */}
            <div className="section-padding">
            <RequestServiceForm
                sectionTitle="Contact Us"
                description="Connect our Masjid for personalized assistance and discover how we can help you."
                className="my-8 lg:my-[72px] "
            />
            </div>
            {/* 8. Quote Section */}
            <QuoteSectionWrapper
                quote="Whoever guides someone to goodness will have a reward like the one who did it."
                attribution="Prophet Muhammad ﷺ"
                donateButtonUrl="/donate"
                showShareButton={true}
                showDonateButton={true}
            />
        </div>
    );
}
