'use client';

import Image from '@/components/common/CustomImage';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

const SUPPORTERS: any[] = [];

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    icon: '/assets/common/facebook-icon.svg',
    url: 'https://www.facebook.com/profile.php?id=100068190076068#',
  },
  {
    name: 'YouTube',
    icon: '/assets/common/youtube-icon.svg',
    url: 'https://www.youtube.com/channel/UCB-Ux707yantEZ3FDUqQiyw',
  },
  {
    name: 'Instagram',
    icon: '/assets/common/instagram-icon.svg',
    url: 'https://www.instagram.com/masjidalfalahilford/?hl=en',
  },
] as const;

const FOOTER_LINKS = [
  { label: 'Copyright', href: '/copyright' },
  { label: 'Terms of use', href: '/terms-of-services' },
  { label: 'Privacy policy', href: '/privacy-policy' },
] as const;

const EDUCATIONS_COLUMN = {
  title: 'Educations',
  links: [
    {
      label: 'Adult Classes',
      href: '/our-services/adult-classes',
    },
    { label: "Children's Madrasah", href: '/madrasah' },
    { label: 'Educational Events', href: '/events' },
    { label: 'Youth Activities', href: '/our-services/youth-activities' },
  ],
};

const CONTACT_INFO = [
  {
    icon: '/assets/footer/map-icon.svg',
    text: 'Masjid Al-Falah, North Ilford Islamic Centre, 97 Kensington Gardens, Ilford, Essex IG1 3EN',
    href: 'https://www.google.com/maps/dir/?api=1&destination=97+Kensington+Gardens+Ilford+Essex+IG1+3EN',
  },

  {
    icon: '/assets/footer/email-icon.svg',
    text: 'info@masjid-alfalah.org.uk',
    href: 'mailto:info@masjid-alfalah.org.uk',
  },
] as const;

const STATS = [
  { value: '0', label: 'Campaigns' },
  { value: '0', label: 'Donors' },
  { value: '£0', label: 'Funds Raised' },
];

interface SupporterCardProps {
  name: string;
  amount: string;
  time: string;
}

const SupporterCard = ({ name, amount, time }: SupporterCardProps) => (
  <div className="flex gap-2 items-center w-full">
    <div className="bg-[#a1a1aa] flex items-center justify-center overflow-hidden rounded-full shrink-0 w-10 h-10">
      <Image
        src="/assets/footer/supporter-avatar.png"
        alt={name}
        width={40}
        height={40}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex flex-col leading-0">
      <p className="font-normal text-sm leading-5 text-[#ecedee]">{name}</p>
      <p className="font-normal text-xs leading-4 text-[#a1a1aa]">
        <span className="text-[#a1a1aa]">{amount}</span>{' '}
        <span className="text-[#52525b]">{time}</span>
      </p>
    </div>
  </div>
);

const StatsCard = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-1 items-center py-2 text-white">
    <p className="font-bold text-xl leading-7">{value}</p>
    <p className="font-normal text-sm leading-5">{label}</p>
  </div>
);

const SupporterSkeleton = () => (
  <div className="flex gap-2 items-center w-full animate-pulse">
    <div className="bg-gray-700 rounded-full shrink-0 w-10 h-10"></div>
    <div className="flex flex-col gap-1 w-full">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="flex flex-col gap-2 items-center py-2 w-full animate-pulse">
    <div className="h-7 bg-gray-700 rounded w-12"></div>
    <div className="h-4 bg-gray-700 rounded w-16"></div>
  </div>
);

const SocialIcon = ({
  name,
  icon,
  url,
}: {
  name: string;
  icon: string;
  url: string;
}) => (
  <Link
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white h-[32px] w-[32px] lg:bg-[#e6f1fe] flex items-center justify-center p-2 rounded-full shrink-0"
    aria-label={name}
  >
    <Image src={icon} alt={name} width={16} height={16} />
  </Link>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`lg:hidden w-5 h-5 text-white transition-transform duration-300 ${
      isOpen ? 'rotate-90' : ''
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

interface FooterColumnProps {
  title: string;
  links: readonly { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}

const FooterColumn = ({
  title,
  links,
  isOpen,
  onToggle,
}: FooterColumnProps) => (
  <div className="flex flex-col h-full px-0 lg:px-2 xl:px-4 py-0 lg:py-9 w-full lg:w-auto xl:w-[232px]">
    <div
      className="flex items-center justify-between lg:block py-4 lg:py-0 border-b lg:border-0 border-gray-700 cursor-pointer lg:cursor-default"
      onClick={onToggle}
    >
      <h4 className="font-bold text-base lg:text-lg leading-7 text-white">
        {title}
      </h4>
      <ChevronIcon isOpen={isOpen} />
    </div>
    <div
      className={`lg:flex flex-col gap-6 w-full mt-0 lg:mt-6 overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 mt-4' : 'max-h-0 lg:max-h-none'
      }`}
    >
      <div className="flex flex-col gap-2 w-full">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white font-normal text-base leading-6 py-1 hover:text-[#006fee]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const ContactItem = ({
  icon,
  text,
  href,
}: {
  icon: string;
  text: string;
  href: string | null;
}) => (
  <div className="flex gap-2 lg:gap-2.5 py-0 lg:py-1 w-full max-w-[352px]">
    <div className="shrink-0 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center relative">
      <Image src={icon} alt="contact-icon" fill className="object-contain" />
    </div>
    {href ? (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="flex-1 min-w-0 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white hover:text-[#006FEE] wrap-break-word"
      >
        {text}
      </a>
    ) : (
      <p className="flex-1 min-w-0 font-normal text-sm lg:text-base leading-5 lg:leading-6 text-white wrap-break-word">
        {text}
      </p>
    )}
  </div>
);

interface Service {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
}

interface Appeal {
  id: string;
  title: string;
  slug: string;
  isActive: boolean;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{
    loading: boolean;
    message: string;
    type: 'success' | 'error' | null;
  }>({
    loading: false,
    message: '',
    type: null,
  });
  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [footerColumns, setFooterColumns] = useState<any[]>([
    EDUCATIONS_COLUMN,
  ]);

  // Dynamic donation data
  const [recentDonors, setRecentDonors] = useState(SUPPORTERS);
  const [donationStats, setDonationStats] = useState(STATS);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);

  const toggleColumn = (title: string) => {
    setOpenColumns(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Handle newsletter subscription
  const handleNewsletterSubscribe = async () => {
    // Reset status
    setNewsletterStatus({ loading: false, message: '', type: null });

    // Validate email
    if (!email || !email.includes('@')) {
      setNewsletterStatus({
        loading: false,
        message: 'Please enter a valid email address',
        type: 'error',
      });
      return;
    }

    try {
      setNewsletterStatus({ loading: true, message: '', type: null });

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'footer',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterStatus({
          loading: false,
          message: data.message || 'Successfully subscribed!',
          type: 'success',
        });
        setEmail(''); // Clear email input on success

        // Clear success message after 5 seconds
        setTimeout(() => {
          setNewsletterStatus({ loading: false, message: '', type: null });
        }, 5000);
      } else {
        setNewsletterStatus({
          loading: false,
          message: data.error || 'Failed to subscribe. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus({
        loading: false,
        message: 'An error occurred. Please try again later.',
        type: 'error',
      });
    }
  };

  // Handle Enter key press in email input
  const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNewsletterSubscribe();
    }
  };

  // Fetch services and appeals on component mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [servicesRes, appealsRes] = await Promise.all([
          fetch('/api/services?limit=5&where[isActive][equals]=true'),
          fetch(
            '/api/donation-appeals?limit=5&where[isActive][equals]=true&sort=order'
          ),
        ]);

        let newColumns: any[] = [EDUCATIONS_COLUMN];

        // Handle Services
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.docs || []);

          const serviceColumn = {
            title: 'Services',
            links: (servicesData.docs || []).map((service: Service) => ({
              label: service.title,
              href: `/our-services/${service.slug}`,
            })),
          };
          newColumns.unshift(serviceColumn);
        }

        // Handle Appeals
        if (appealsRes.ok) {
          const appealsData = await appealsRes.json();
          if (appealsData.docs && appealsData.docs.length > 0) {
            const appealColumn = {
              title: 'Donate',
              links: appealsData.docs.map((appeal: Appeal) => ({
                label: appeal.title,
                href: `/appeals/${appeal.slug}`,
              })),
            };
            newColumns.push(appealColumn);
          }
        }

        setFooterColumns(newColumns);
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
        // Fallback
        setFooterColumns([EDUCATIONS_COLUMN]);
      }
    };

    fetchFooterData();
  }, []);

  // Fetch donation data — also re-runs after any successful donation
  // (via the 'donation-completed' event dispatched from /donate/complete),
  // and when the tab regains focus.
  const fetchDonations = useCallback(async () => {
    try {
      setIsLoadingDonations(true);
      const response = await fetch('/api/donations/recent?limit=4', {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          if (data.recentDonors) {
            setRecentDonors(data.recentDonors);
          }

          if (data.stats) {
            setDonationStats([
              {
                value: String(data.stats.campaigns).padStart(2, '0'),
                label: 'Campaigns',
              },
              { value: String(data.stats.donors), label: 'Donors' },
              { value: data.stats.fundsRaised, label: 'Funds Raised' },
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setIsLoadingDonations(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();

    const handleDonationCompleted = () => {
      fetchDonations();
    };
    const handleFocus = () => {
      fetchDonations();
    };

    window.addEventListener('donation-completed', handleDonationCompleted);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('donation-completed', handleDonationCompleted);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchDonations]);

  return (
    <>
      <footer className="bg-[#27272a] flex flex-col w-full">
        {/* Top Section - Newsletter, Supporters, Donations */}
        <div className="bg-[#18181b] ">
          {/* Newsletter Section */}
          <div className="hn-container-footer flex flex-col lg:flex-row gap-6 lg:gap-15 items-start lg:items-center justify-center p-4 sm:p-8 lg:px-17 lg:py-17 w-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-109.75">
              <h3 className="font-bold text-sm sm:text-base leading-6 text-white">
                Stay Connected, Join our newsletter
              </h3>
              <div className="flex flex-col gap-4 sm:gap-6 w-full">
                <div className="flex items-center w-full min-w-0">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyPress={handleEmailKeyPress}
                    disabled={newsletterStatus.loading}
                    className="bg-[#27272a] flex-1 min-w-0 text-sm sm:text-base leading-6 text-[#d4d4d8] placeholder:text-[#d4d4d8] px-2 sm:px-3 py-2 min-h-10.5 shadow-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleNewsletterSubscribe}
                    disabled={newsletterStatus.loading}
                    className="bg-[#3f3f46] text-white font-normal text-xs sm:text-sm leading-5 h-10.5 w-25 shrink-0 hover:bg-[#52525b] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus.loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>

                {/* Status Message */}
                {newsletterStatus.message && (
                  <div
                    className={`text-sm px-3 py-2 rounded ${
                      newsletterStatus.type === 'success'
                        ? 'bg-green-900/50 text-green-200 border border-green-700'
                        : 'bg-red-900/50 text-red-200 border border-red-700'
                    }`}
                  >
                    <span className="text-white">
                      {newsletterStatus.message}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 lg:gap-4 items-center flex-wrap">
                  {SOCIAL_LINKS.map(social => (
                    <SocialIcon key={social.name} {...social} />
                  ))}
                  <Link
                    href="https://emasjidlive.co.uk/listen/masjidalfalahilford"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full shrink-0"
                    aria-label="Qibla Finder"
                  >
                    <Image
                      src="/assets/common/qibla.svg"
                      alt="Qibla"
                      width={34}
                      height={34}
                      className="shrink-0"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Supporters Section */}
            <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-126.5">
              <h3 className="font-bold text-base leading-6 text-white">
                Recent supporters
              </h3>
              <div className="flex flex-row gap-3 lg:gap-0 w-full">
                <div className="flex flex-col gap-3 lg:gap-4 flex-1">
                  {isLoadingDonations ? (
                    <>
                      <SupporterSkeleton />
                      <SupporterSkeleton />
                    </>
                  ) : (
                    recentDonors
                      .slice(0, 2)
                      .map((supporter, idx) => (
                        <SupporterCard
                          key={supporter.id || idx}
                          {...supporter}
                        />
                      ))
                  )}
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  {isLoadingDonations ? (
                    <>
                      <SupporterSkeleton />
                      <SupporterSkeleton />
                    </>
                  ) : (
                    recentDonors
                      .slice(2)
                      .map((supporter, idx) => (
                        <SupporterCard
                          key={supporter.id || idx}
                          {...supporter}
                        />
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* Donations & Campaigns Section */}
            <div className="flex flex-col gap-6 w-full lg:w-82">
              <h3 className="font-bold text-base leading-6 text-white">
                Donations & Campaigns
              </h3>
              <div className="flex items-center justify-between w-full">
                {isLoadingDonations ? (
                  <>
                    <StatsSkeleton />
                    <StatsSkeleton />
                    <StatsSkeleton />
                  </>
                ) : (
                  donationStats.map(stat => (
                    <StatsCard key={stat.label} {...stat} />
                  ))
                )}
              </div>
              <div className="flex gap-5 w-full justify-center ">
                <Link
                  href="/appeals"
                  className="w-full sm:w-fit bg-[#3f3f46] text-white font-normal text-base leading-6 px-4 h-12 flex items-center justify-center rounded-lg hover:bg-[#52525b] transition-colors"
                >
                  Discover
                </Link>
                <Link
                  href="/donate"
                  className="w-full sm:w-fit bg-[#006fee] text-white font-normal text-base leading-6 px-4 h-12 flex items-center justify-center rounded-xl hover:bg-[#0056cc] transition-colors"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col lg:flex-row lg:flex-wrap xl:flex-nowrap items-start py-0 w-full hn-container-footer ">
          {/* Mobile: Logo */}
          <div className="flex flex-col items-center gap-6 py-8 lg:hidden w-full hn-container ">
            <Link href="/" className="w-24 h-24">
              <Image
                src="/assets/footer/footer-logo.png"
                alt="Masjid Al-Falah"
                width={96}
                height={96}
                className="object-cover"
              />
            </Link>
          </div>

          {/* Desktop: Logo & Copyright Section */}
          <div className="hidden lg:flex flex-col gap-9 items-center px-2 xl:px-4 py-9 lg:w-auto lg:min-w-[240px] xl:min-w-[352px] xl:max-w-[352px]">
            <Link href="/" className="w-32 h-32">
              <Image
                src="/assets/footer/footer-logo.png"
                alt="Masjid Al-Falah"
                width={128}
                height={128}
                className="object-cover"
              />
            </Link>
            <div className="flex gap-2 items-center justify-center flex-wrap">
              {FOOTER_LINKS.map((link, idx) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white font-light text-sm leading-5 py-1"
                  >
                    {link.label}
                  </Link>
                  {idx < FOOTER_LINKS.length - 1 && (
                    <Image
                      src="/assets/footer/dot-icon.svg"
                      alt=""
                      width={8}
                      height={8}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {footerColumns.map(column => (
            <FooterColumn
              key={column.title}
              {...column}
              isOpen={openColumns[column.title] || false}
              onToggle={() => toggleColumn(column.title)}
            />
          ))}

          {/* Contact Information Column */}
          <div className="flex flex-col h-full px-0 lg:px-2 xl:px-4 py-4 lg:py-9 w-full lg:flex-1 lg:min-w-[280px] xl:min-w-0">
            <h4 className="font-bold text-base lg:text-lg leading-7 text-white mb-3 lg:mb-4">
              Contact information
            </h4>
            <div className="flex flex-col gap-3 lg:gap-4 w-full">
              {CONTACT_INFO.map((contact, idx) => (
                <ContactItem key={idx} {...contact} />
              ))}
            </div>
          </div>

          {/* Mobile: Footer Links */}
          <div className="flex lg:hidden gap-2 items-center justify-center flex-wrap py-8 w-full">
            {FOOTER_LINKS.map((link, idx) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className="text-white font-light text-xs leading-5"
                >
                  {link.label}
                </Link>
                {idx < FOOTER_LINKS.length - 1 && (
                  <span className="text-white">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="bg-[#18181b] flex items-center justify-center px-6 lg:px-8 py-6 lg:py-0 lg:h-25.25 w-full">
          <div className="hn-container flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
            <p className="font-normal text-xs lg:text-sm leading-5 text-white text-center sm:text-left">
              COPYRIGHT © {new Date().getFullYear()}{' '}
              <Link href="" className="hover:text-[#006fee]">
                Masjid Al Falah
              </Link>
              <span className="text-[#006fee]">.</span> All Rights Reserved.
            </p>
            <p className="font-normal text-xs lg:text-sm leading-5 text-[#71717a] text-center sm:text-right whitespace-nowrap">
              Developed by{' '}
              <Link
                href="https://qibla-tech.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006fee] hover:text-[#0056cc] transition-colors"
              >
                Qibla Tech
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
