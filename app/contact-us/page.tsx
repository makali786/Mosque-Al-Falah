import React from 'react'
import PageHero from '../components/common/PageHero'
import ContactInformation from '../components/contact/ContactInformation'
import BrothersEntrance from '../components/contact/BrothersEntrance'
import SistersEntrance from '../components/contact/SistersEntrance'

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
          <div className="flex flex-col md:flex-row md:justify-center gap-12 xl:px-30">
              <BrothersEntrance />
              <SistersEntrance />
          </div>
    </div>
  )
}

export default contact