"use client"
import PageHero from '@/components/common/PageHero'
import ContactInformation from '../../components/contact/ContactInformation'
import EntranceSection from '../../components/contact/EntranceSection'
import { ParkingNoticeSection } from '../../components/contact/ParkingNoticeSection'
import { AskQuestionSection } from '../../components/contact/AskQuestionSection'
import { QuoteSection } from '@/components/common/QuoteSection'

const contact = () => {
    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: "Islamic Guidance",
                    text: "Whoever guides someone to goodness will have a reward like the one who did it.",
                    url: window.location.href,
                })
                .catch((err) => console.log("Share failed:", err))
        } else {
            alert("Share this page: " + window.location.href)
        }
    }

    const handleDonate = () => {
        window.location.href = "/donate"
    }
    return (
        <div className="bg-white">
            <PageHero
                title="Contact Us"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Contact Us", href: "/contact-us" },
                ]}
                backgroundImage="/assets/about-us/about-us.jpg"
            />
            <ContactInformation />
            <div className="flex flex-col lg:flex-row lg:justify-center gap-8 md:gap-10 lg:gap-12 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-30 py-12 sm:py-16 md:py-20 lg:py-28">
                <EntranceSection
                    title="Brothers Entrance"
                    description={"North Ilford Islamic Centre \n97 Kensington Gardens, Ilford, Essex, IG1 3EN"}
                    imageSrc="/assets/contact-us/brother-enterence.png"
                    imageAlt="Brothers Entrance - Masjid Al-Falah"
                    whatsappGroupLabel="Join Al-Falah Sisters Group"
                    directionsUrl="https://maps.google.com/?q=97+Kensington+Gardens,+Ilford,+Essex,+IG1+3EN"
                    whatsappUrl="https://chat.whatsapp.com/your-brothers-group-link"
                />
                <EntranceSection
                    title="Sisters Entrance"
                    description={"North Ilford Islamic Centre\n97 Kensington Gardens, Ilford, Essex, IG1 3EN"}
                    imageSrc="/assets/contact-us/sister-entrance.png"
                    imageAlt="Sisters Entrance - Masjid Al-Falah"
                    whatsappGroupLabel="Join Al-Falah Sisters Group"
                    directionsUrl="https://maps.google.com/..."
                    whatsappUrl="https://chat.whatsapp.com/..."
                />
            </div>
            <ParkingNoticeSection />
            <AskQuestionSection />
            <QuoteSection
                quote="Whoever guides someone to goodness will have a reward like the one who did it."
                attribution="Prophet Muhammad"
                showAttributionSymbol={true}
                onShare={handleShare}
                onDonate={handleDonate}
                shareButtonText="Share this page"
                donateButtonText="Donate Now"
                backgroundColor="#F4F4F5"
            />
        </div>
    )
}

export default contact