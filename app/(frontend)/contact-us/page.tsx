import PageHero from '@/components/common/PageHero';
import ContactInformation from '../../components/contact/ContactInformation';
import EntranceSection from '../../components/contact/EntranceSection';
import { ParkingNoticeSection } from '../../components/contact/ParkingNoticeSection';
import { AskQuestionSection } from '../../components/contact/AskQuestionSection';
import { QuoteSectionWrapper } from '../../components/contact/QuoteSectionWrapper';
import { fetchGlobal } from '../../../lib/fetcher';
import { ContactPageData } from './types';

const ContactUsPage = async () => {
    const contactUs = await fetchGlobal({ slug: "contact-page" }) as ContactPageData;

    if (!contactUs) {
        return null;
    }

    const breadcrumbString = contactUs.hero.breadcrumb || "Home > Contact Us";
    const breadcrumbs = breadcrumbString.split('>').map((item) => {
        const label = item.trim();
        const href = label.toLowerCase() === 'home' ? '/' : `/${label.toLowerCase().replace(/\s+/g, '-')}`;
        return { label, href };
    });

    return (
        <div className="bg-white">
            <PageHero
                title={contactUs.hero.title}
                breadcrumbs={breadcrumbs}
                backgroundImage={contactUs.hero.backgroundImage?.url || ""}
            />

            <ContactInformation
                title={contactUs.contactInfo.sectionTitle}
                description={contactUs.contactInfo.description}
                address={contactUs.contactInfo.mainAddress}
                phone={contactUs.contactInfo.phone}
                email={contactUs.contactInfo.email}
                mapEmbed={contactUs.contactInfo.showMap ? contactUs.contactInfo.mapEmbed : undefined}
            />

            <div className="flex flex-col lg:flex-row lg:justify-center gap-8 md:gap-10 lg:gap-12 hn-container py-12 sm:py-16 md:py-20 lg:py-28">
                {contactUs.brothersEntrance.enableSection && (
                    <EntranceSection
                        title={contactUs.brothersEntrance.title}
                        address={contactUs.brothersEntrance.address}
                        imageSrc={contactUs.brothersEntrance.image?.url || ""}
                        imageAlt={contactUs.brothersEntrance.image?.alt || "Brothers Entrance"}
                        whatsappGroupLabel={contactUs.brothersEntrance.whatsappGroup.buttonText}
                        whatsappUrl="#"
                    />
                )}

                {contactUs.sistersEntrance.enableSection && (
                    <EntranceSection
                        title={contactUs.sistersEntrance.title}
                        address={contactUs.sistersEntrance.address}
                        imageSrc={contactUs.sistersEntrance.image?.url || ""}
                        imageAlt={contactUs.sistersEntrance.image?.alt || "Sisters Entrance"}
                        whatsappGroupLabel={contactUs.sistersEntrance.whatsappGroup.buttonText}
                        whatsappUrl="#"
                    />
                )}
            </div>

            {contactUs.parkingNotice.enableSection && (
                <ParkingNoticeSection
                    title={contactUs.parkingNotice.title}
                    message={contactUs.parkingNotice.message}
                    quote={{
                        quoteText: contactUs.parkingNotice.hadithQuote?.quoteText || "",
                        source: contactUs.parkingNotice.hadithQuote?.source || ""
                    }}
                />
            )}

            {contactUs.contactForm.enableSection && (
                <AskQuestionSection
                    title={contactUs.contactForm.sectionTitle}
                    description={contactUs.contactForm.description}
                    image={contactUs.contactForm.image}
                    formSettings={contactUs.contactForm.formSettings}
                    topicOptions={contactUs.contactForm.topicOptions}
                    successMessage={contactUs.contactForm.successMessage}
                    recipientEmail={contactUs.contactForm.recipientEmail}
                />
            )}

            {contactUs.bottomQuote.enableSection && (
                <QuoteSectionWrapper
                    quote={contactUs.bottomQuote.quoteText}
                    attribution={contactUs.bottomQuote.author}
                    donateButtonUrl={contactUs.bottomQuote.donateButtonUrl}
                    showShareButton={contactUs.bottomQuote.showShareButton}
                    showDonateButton={contactUs.bottomQuote.showDonateButton}
                />
            )}
        </div>
    );
};

export default ContactUsPage;