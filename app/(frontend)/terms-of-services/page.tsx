import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="section-padding py-12 lg:py-20">
        <div className="flex flex-col gap-8">
          
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-base leading-relaxed">
              Welcome to Masjid Al-Falah! By using our website and services, you agree to the following terms and conditions:
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Overview of Masjid Al-Falah</h2>
            <p className="text-base leading-relaxed">
              Masjid Al-Falah is a religious institution dedicated to serving the community through prayer services, education, and charitable activities. Our website serves as a platform to inform the community about our events, facilitate donations, and provide educational resources.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Eligibility</h2>
            <p className="text-base leading-relaxed">
              Our website and services are open to everyone. However, certain programs or events may have specific age or gender requirements as mandated by religious guidelines or operational necessities. By registering for these, you represent that you meet the specified criteria.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">User Accounts</h2>
            <p className="text-base leading-relaxed">
              You may be required to create an account to access certain features, such as managing donations or enrolling in classes. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Please provide accurate and complete information when registering.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Donations and Payments</h2>
            <p className="text-base leading-relaxed">
              All donations made to Masjid Al-Falah are voluntary. We use secure third-party payment processors to handle transactions. By initiating a donation, you authorize us to charge your selected payment method. Refunds for donations are generally not provided but may be considered in exceptional circumstances at the discretion of the management.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Code of Conduct</h2>
            <p className="text-base leading-relaxed">
              Users of our website and attendees of our physical premises are expected to behave with respect and dignity. Harassment, hate speech, or any form of disruptive behavior will not be tolerated and may result in the termination of your account or access to our services.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Intellectual Property</h2>
            <p className="text-base leading-relaxed">
              All content on this website, including text, graphics, logos, and images, is the property of Masjid Al-Falah or its content suppliers and is protected by copyright laws. You may not use, reproduce, or distribute any content without our prior written permission.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Changes to Terms</h2>
            <p className="text-base leading-relaxed">
              Masjid Al-Falah reserves the right to modify these terms solely at our discretion. Significant changes will be communicated through our website. Your continued use of the site following any changes constitutes your acceptance of the new terms.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
            <p className="text-base leading-relaxed">
              If you have any questions regarding these Terms of Service, please contact us at:
            </p>
            <div className="text-base leading-relaxed mt-2">
              <p><strong>Masjid Al-Falah</strong></p>
              <p>North Ilford Islamic Centre, 97 Kensington Gardens</p>
              <p>Ilford, Essex IG1 3EN</p>
              <p>Email: <a href="mailto:info@masjid-alfalah.org.uk" className="text-[#006fee] hover:underline">info@masjid-alfalah.org.uk</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
