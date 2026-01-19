import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="section-padding py-12 lg:py-20">
        <div className="flex flex-col gap-8">
          
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-base leading-relaxed">
              At Masjid Al-Falah, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
            <p className="text-base leading-relaxed">
              We may collect personal information that you voluntarily provide to us, such as your name, email address, phone number, and postal address. This typically occurs when you subscribe to our newsletter, make a donation, register for an event, or contact us. We may also collect non-personal information automatically, such as your IP address and browsing behavior, to improve our website's performance.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">How We Use Your Information</h2>
            <p className="text-base leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-5 text-base leading-relaxed space-y-1">
              <li>To process your donations and issue receipts.</li>
              <li>To communicate with you about our events, services, and appeals.</li>
              <li>To respond to your inquiries and support requests.</li>
              <li>To improve our website functionality and user experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Sharing of Information</h2>
            <p className="text-base leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business (e.g., payment processors, email marketing services), provided that they agree to keep this information confidential and use it only for the purposes we specify.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Data Security</h2>
            <p className="text-base leading-relaxed">
              We implement a variety of security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Cookies</h2>
            <p className="text-base leading-relaxed">
              Our website uses cookies to enhance your browsing experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your web browser (if you allow) that enables the site's systems to recognize your browser and capture and remember certain information. You can choose to disable cookies through your browser settings.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Your Rights</h2>
            <p className="text-base leading-relaxed">
              You have the right to access, correct, or request the deletion of your personal information that we hold. You may also opt-out of receiving marketing communications from us at any time by following the unsubscribe instructions in our emails or by contacting us directly.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Updates to This Policy</h2>
            <p className="text-base leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
            <p className="text-base leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
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
