import React from 'react'
import ServiceEventBanner from '../ServiceEventBanner';
import BreadcrumbSearchSection from '@/components/common/BreadcrumbSearchSection';
import ServiceDetailHero from '../ServiceDetailHero';
import PrayerReminder from '../PrayerReminder';
import LiveStreaming from '../LiveStreaming';
import EidSalahSchedule from '../EidSalahSchedule';
import ServiceQuote from '../ServiceQuote';
import OtherServices from '../OtherServices';
import AboutQuoteSection from '@/components/about/AboutQuoteSection';
import { ServiceDetail } from '@/our-services/[id]/page';

const TaraweehEidPrayers = ({service,params}: {service: ServiceDetail,params: {id: string}}) => {
  return (
    <div><ServiceEventBanner
            title="Taraweeh & Eid Prayers at Masjid Al-Falah"
            description="Join us for spiritually uplifting Taraweeh prayers during Ramadan and joyous Eid celebrations."
            updateLabel="Update"
            updateDate="8 February 2025"
            countdownLabel="Next Taraweeh Prayer in"
            targetDate={(() => {
              const today = new Date();
              today.setHours(20, 0, 0, 0); // 8:00 PM today
              return today;
            })()}
          />
    
          <BreadcrumbSearchSection
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Our Services", href: "/services" },
              { label: service.title, href: `/our-services/${params.id}` },
            ]}
            className="!pb-0 !pt-6 sm:!pt-8 bg-white section-padding"
            showSearch={false}
          />
    
          <ServiceDetailHero
            heading="Taraweeh & Eid Prayers"
            imageSrc="/assets/sermons/taraweeh-sermons.png"
            imageAlt="Taraweeh Prayer at Masjid Al-Falah"
            layout="image-left"
            content={
              <>
                <p>
                  Experience the Spiritual Essence of Ramadan & Eid 🌙 at Masjid Al-Falah
                  Ramadan is a time of deep reflection, devotion, and community, and we
                  welcome you to join us in observing this sacred month. Engage in the tranquility
                  of Taraweeh prayers, where the recitation of the Qur'an fills the air with peace
                  and spiritual enlightenment. Feel the power of collective supplication, drawing
                  closer to Allah through heartfelt du'as each night.
                  As Ramadan concludes, celebrate Eid with joy and gratitude, embracing the
                  blessings of this special day with the community. From the serene nights of
                  worship to the festive Eid gatherings, Masjid Al-Falah is your home for faith,
                  unity, and devotion. Let's strengthen our connection with Allah and one another.
                </p>
              </>
            }
            primaryButton={{
              text: "View Taraweeh Timings",
              href: "#timings",
            }}
            secondaryButton={{
              text: "Check Eid Salah Schedule",
              href: "#schedule",
            }}
          />
          <PrayerReminder
            title="Prayer Reminders & Notifications"
            description="Sign up for daily alerts on Taraweeh timings, special supplications, and community updates."
            cardMessage="The time for Taraweeh begins after the Isha prayer"
            countdownLabel="TARAWEEH 01 is in"
            targetDate={(() => {
              const today = new Date();
              today.setHours(20, 0, 0, 0); // 8:00 PM today
              return today;
            })()}
          />
    
          <LiveStreaming
            thumbnailUrl="/assets/about-us/about-us.jpg"
          />
          <EidSalahSchedule
            title="Eid Salah Schedule at Masjid Al-Falah"
            description="Eid is a time of joy, gratitude, and unity. Join us for a spiritually uplifting Eid Salah as we come together to celebrate this blessed day with prayers and community spirit."
          />
    
          <ServiceQuote
            quote={service.quote || {
              text: "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.",
              attribution: "Quran 29:45"
            }}
            images={[
              service.heroImage,
              "/assets/about-us/our-history.png",
              "/assets/about-us/our-mission.png"
            ]}
          />
    
          <OtherServices />
          {/* <QuoteSection  */}
    
    
          <AboutQuoteSection
            quote={"“Whoever guides someone to goodness will have a reward like the one who did it.”"}
            attribution={"— Prophet Muhammad ﷺ"}
            donateButtonUrl={"/donate"}
          />
    </div>
  )
}

export default TaraweehEidPrayers