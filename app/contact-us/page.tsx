import React from 'react'
import PageHero from '../components/common/PageHero'
import ContactInformation from '../components/contact/ContactInformation'

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
    </div>
  )
}

export default contact