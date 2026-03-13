import React from "react";

export default function CopyrightPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="section-padding py-12 lg:py-20">
        <div className="flex flex-col gap-8">
          
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-6">Copyright Notice</h1>
            <p className="text-base leading-relaxed">
              © {new Date().getFullYear()} Masjid Al-Falah (North Ilford Islamic Centre). All rights reserved.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Ownership of Content</h2>
            <p className="text-base leading-relaxed">
              The content on this website, including but not limited to text, graphics, logos, images, audio clips, video clips, digital downloads, data compilations, and software, is the property of Masjid Al-Falah or its content suppliers and is protected by United Kingdom and international copyright laws.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Limited License</h2>
            <p className="text-base leading-relaxed">
              Masjid Al-Falah grants you a limited, non-exclusive, non-transferable license to access and use this website for personal, non-commercial purposes. You may download or print a single copy of the materials on this website for your own personal, non-commercial use, provided that you do not modify the materials and that you retain all copyright and other proprietary notices contained in the materials.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Prohibited Uses</h2>
            <p className="text-base leading-relaxed">
              Except as expressly permitted above, you may not:
            </p>
            <ul className="list-disc pl-5 text-base leading-relaxed space-y-1">
              <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information or content obtained from this website.</li>
              <li>Use any data mining, robots, or similar data gathering and extraction tools on this website.</li>
              <li>Frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information of Masjid Al-Falah without express written consent.</li>
              <li>Use any meta tags or any other "hidden text" utilizing Masjid Al-Falah's name or trademarks without express written consent.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Trademarks</h2>
            <p className="text-base leading-relaxed">
              The Masjid Al-Falah name and logo are trademarks of Masjid Al-Falah. Other trademarks, service marks, and logos used on this website are the trademarks, service marks, or logos of their respective owners.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            <p className="text-base leading-relaxed">
              If you have any questions about this Copyright Notice or wish to request permission to use any content from this website, please contact us at:
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
