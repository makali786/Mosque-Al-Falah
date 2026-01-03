import { notFound } from "next/navigation";

import NikaahMarriage from "@/components/services/serviceDetail/NikaahMarriage";

// Service data type
export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
  description: string;
  sections: {
    heading: string;
    content: string;
    image?: string;
    imageAlt?: string;
    layout?: "image-right" | "image-left";
  }[];
  timings?: {
    title: string;
    schedule: {
      day: string;
      time: string;
    }[];
  };
  features?: string[];
  quote?: {
    text: string;
    attribution: string;
  };
}

// Service data - This would typically come from a CMS or database
const SERVICES_DATA: Record<string, ServiceDetail> = {
  "five-daily-prayers": {
    id: "five-daily-prayers",
    title: "Five Daily Prayers",
    subtitle: "Join us for the five daily prayers and strengthen your connection with Allah",
    heroImage: "/assets/about-us/about-us.jpg",
    heroImageAlt: "Five Daily Prayers at Masjid Al-Falah",
    description:
      "The five daily prayers (Salah) are the cornerstone of Islamic worship and the second pillar of Islam. At Masjid Al-Falah, we provide a welcoming and spiritually uplifting environment for all Muslims to perform their obligatory prayers in congregation.",
    sections: [
      {
        heading: "The Importance of Congregational Prayer",
        content:
          "Praying in congregation is highly emphasized in Islam. The Prophet Muhammad (peace be upon him) said that prayer in congregation is 27 times more rewarding than praying alone. Our masjid provides a clean, peaceful environment where brothers and sisters can come together to worship Allah.",
        layout: "image-right",
      },
      {
        heading: "Prayer Facilities",
        content:
          "Our masjid features separate prayer halls for men and women, with ample space for worshippers. We maintain high standards of cleanliness and provide all necessary facilities including wudu (ablution) areas, prayer mats, and copies of the Quran.",
        layout: "image-left",
      },
    ],
    timings: {
      title: "Prayer Times",
      schedule: [
        { day: "Fajr", time: "5:30 AM" },
        { day: "Dhuhr", time: "1:15 PM" },
        { day: "Asr", time: "4:30 PM" },
        { day: "Maghrib", time: "At Sunset" },
        { day: "Isha", time: "8:00 PM" },
      ],
    },
    features: [
      "Separate prayer halls for men and women",
      "Clean and well-maintained wudu facilities",
      "Air-conditioned prayer spaces",
      "Wheelchair accessible",
      "Free parking available",
      "Prayer mats and Qurans provided",
    ],
    quote: {
      text: "The prayer is the pillar of religion. Whoever establishes it has established religion, and whoever abandons it has destroyed religion.",
      attribution: "Umar ibn Al-Khattab (RA)",
    },
  },
  "jummah-prayer": {
    id: "jummah-prayer",
    title: "Jummah Prayer",
    subtitle: "Join us every Friday for the blessed congregational prayer",
    heroImage: "/assets/about-us/about-us.jpg",
    heroImageAlt: "Jummah Prayer at Masjid Al-Falah",
    description:
      "Jummah (Friday) prayer is a congregational prayer that Muslims hold every Friday, just after noon instead of the Dhuhr prayer. It is one of the most important prayers of the week and is obligatory for all adult Muslim men.",
    sections: [
      {
        heading: "The Significance of Jummah",
        content:
          "Friday is the best day of the week in Islam. The Prophet Muhammad (peace be upon him) said: 'The best day on which the sun has risen is Friday.' Our Jummah services include an inspiring khutbah (sermon) that addresses contemporary issues facing the Muslim community while staying rooted in Islamic teachings.",
        layout: "image-right",
      },
      {
        heading: "What to Expect",
        content:
          "Our Jummah prayer consists of a two-part sermon delivered in English, followed by a two-rakah congregational prayer. We encourage attendees to arrive early to secure a spot and to engage in voluntary prayers and dhikr before the khutbah begins.",
        layout: "image-left",
      },
    ],
    timings: {
      title: "Jummah Schedule",
      schedule: [
        { day: "First Jummah", time: "1:00 PM" },
        { day: "Second Jummah", time: "2:15 PM" },
      ],
    },
    features: [
      "Two Jummah services to accommodate more worshippers",
      "Engaging khutbahs in English",
      "Family-friendly environment",
      "Overflow areas with live audio/video",
      "Ample parking space",
      "Refreshments after prayer (occasionally)",
    ],
    quote: {
      text: "Whoever leaves three Jummah prayers out of negligence, Allah will place a seal over his heart.",
      attribution: "Prophet Muhammad (ﷺ)",
    },
  },
  "taraweeh-prayer": {
    id: "taraweeh-prayer",
    title: "Taraweeh Prayer",
    subtitle: "Experience the spiritual beauty of Ramadan nights",
    heroImage: "/assets/about-us/about-us.jpg",
    heroImageAlt: "Taraweeh Prayer during Ramadan",
    description:
      "Taraweeh prayers are special nightly prayers performed during the blessed month of Ramadan. These prayers are a beautiful tradition that brings the community together in worship and reflection.",
    sections: [
      {
        heading: "The Blessing of Taraweeh",
        content:
          "Taraweeh prayers are a Sunnah of the Prophet Muhammad (peace be upon him) and are performed after the Isha prayer throughout Ramadan. At Masjid Al-Falah, we complete the entire Quran during these prayers, allowing worshippers to hear the beautiful recitation of Allah's words.",
        layout: "image-right",
      },
      {
        heading: "Our Ramadan Program",
        content:
          "During Ramadan, our masjid comes alive with spiritual energy. We offer daily iftar (breaking of fast), Taraweeh prayers with beautiful Quran recitation, and special programs including Quran completion (Khatm) and Laylatul Qadr celebrations.",
        layout: "image-left",
      },
    ],
    timings: {
      title: "Ramadan Schedule",
      schedule: [
        { day: "Iftar", time: "At Maghrib Time" },
        { day: "Maghrib Prayer", time: "Immediately After Iftar" },
        { day: "Isha Prayer", time: "8:30 PM" },
        { day: "Taraweeh Prayer", time: "After Isha" },
      ],
    },
    features: [
      "Complete Quran recitation throughout Ramadan",
      "Qualified and melodious Qaris (reciters)",
      "Daily community iftar",
      "Special programs for children",
      "I'tikaf facilities in last 10 nights",
      "Laylatul Qadr celebrations",
    ],
    quote: {
      text: "Ramadan is the month whose beginning is mercy, whose middle is forgiveness, and whose end is freedom from the fire.",
      attribution: "Prophet Muhammad (ﷺ)",
    },
  },
  "nikah-marriage": {
    id: "nikah-marriage",
    title: "Nikah & Marriage Services",
    subtitle: "Begin your blessed journey together",
    heroImage: "/assets/about-us/about-us.jpg",
    heroImageAlt: "Nikah and Marriage Services",
    description:
      "Marriage in Islam is a sacred bond and a blessed contract. At Masjid Al-Falah, we provide comprehensive marriage services including nikah ceremonies, pre-marital counseling, and ongoing support for Muslim couples.",
    sections: [
      {
        heading: "Islamic Marriage Services",
        content:
          "We offer complete nikah services conducted according to Islamic principles. Our experienced imams guide couples through the marriage contract, ensuring all Islamic requirements are met while creating a memorable and meaningful ceremony.",
        layout: "image-right",
      },
      {
        heading: "Pre-Marital Counseling",
        content:
          "We believe in preparing couples for a successful marriage. Our pre-marital counseling sessions cover important topics including Islamic rights and responsibilities, communication, conflict resolution, and building a strong Islamic household.",
        layout: "image-left",
      },
    ],
    features: [
      "Nikah ceremony services",
      "Pre-marital counseling sessions",
      "Marriage certificate processing",
      "Flexible scheduling for ceremonies",
      "Beautiful masjid venue available",
      "Ongoing marriage support and counseling",
    ],
    quote: {
      text: "When a man marries, he has fulfilled half of his religion, so let him fear Allah regarding the remaining half.",
      attribution: "Prophet Muhammad (ﷺ)",
    },
  },
  "funeral-services": {
    id: "funeral-services",
    title: "Funeral Services",
    subtitle: "Supporting families during difficult times",
    heroImage: "/assets/about-us/about-us.jpg",
    heroImageAlt: "Islamic Funeral Services",
    description:
      "At Masjid Al-Falah, we provide comprehensive Islamic funeral services to support families during their time of loss. Our compassionate team ensures that all Islamic funeral rites are performed with dignity and respect.",
    sections: [
      {
        heading: "Complete Funeral Support",
        content:
          "We offer complete funeral services including ghusl (washing), kafan (shrouding), janazah prayer, and burial arrangements. Our experienced team guides families through each step with compassion and Islamic knowledge.",
        layout: "image-right",
      },
      {
        heading: "24/7 Availability",
        content:
          "Death can occur at any time, and we are here to help whenever needed. Our funeral services team is available 24/7 to assist families with all arrangements and to ensure Islamic funeral rites are performed promptly and properly.",
        layout: "image-left",
      },
    ],
    features: [
      "24/7 emergency funeral services",
      "Ghusl and kafan facilities",
      "Janazah prayer arrangements",
      "Cemetery coordination",
      "Family support and counseling",
      "Transportation assistance",
    ],
    quote: {
      text: "Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection.",
      attribution: "Quran 3:185",
    },
  },
  "food-bank": {
    id: "food-bank",
    title: "Food Bank",
    subtitle: "Serving our community with compassion",
    heroImage: "/assets/about-us/about-us.jpg",
    heroImageAlt: "Community Food Bank",
    description:
      "Our food bank serves families in need within our community, providing nutritious food and essential supplies. This service embodies the Islamic principles of charity, compassion, and community support.",
    sections: [
      {
        heading: "Community Support",
        content:
          "The Masjid Al-Falah Food Bank operates weekly to serve families facing food insecurity. We provide halal food packages, fresh produce, and essential household items to those in need, regardless of their background.",
        layout: "image-right",
      },
      {
        heading: "How to Get Involved",
        content:
          "Our food bank relies on the generosity of our community. You can help by donating non-perishable food items, volunteering your time, or making financial contributions. Every contribution makes a difference in someone's life.",
        layout: "image-left",
      },
    ],
    timings: {
      title: "Food Bank Hours",
      schedule: [
        { day: "Distribution", time: "Saturdays 10:00 AM - 12:00 PM" },
        { day: "Donations Accepted", time: "Daily during prayer times" },
      ],
    },
    features: [
      "Weekly food distribution",
      "Halal food packages",
      "Fresh produce when available",
      "Household essentials",
      "Confidential service",
      "No documentation required",
    ],
    quote: {
      text: "The believer's shade on the Day of Resurrection will be his charity.",
      attribution: "Prophet Muhammad (ﷺ)",
    },
  },
};

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const service = SERVICES_DATA[params.id];

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* <TaraweehEidPrayers service={service} params={params} /> */}
      <NikaahMarriage service={service} params={params} />
    </div>
  )
}

// Generate static params for all services
export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((id) => ({
    id,
  }));
}
