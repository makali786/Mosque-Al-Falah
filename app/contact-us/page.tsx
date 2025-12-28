import PageHero from '../components/common/PageHero'
import ContactInformation from '../components/contact/ContactInformation'
import EntranceSection from '../components/contact/EntranceSection'
import { ParkingNoticeSection } from '../components/contact/ParkingNoticeSection'

const contact = () => {
    return (
        <div className="bg-white dark:bg-gray-950">
            <PageHero
                title="Contact Us"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Contact Us", href: "/contact-us" },
                ]}
                backgroundImage="/assets/about-us/about-us.jpg"
            />
            <ContactInformation />
            <div className="flex flex-col md:flex-row md:justify-center gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 xl:px-30 py-8 md:py-12 lg:py-28">
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
        </div>
    )
}

export default contact