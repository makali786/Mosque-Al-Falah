'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DonationData {
  id: string;
  amount: number;
  currency: string;
  donationType: string;
  city: string;
  country: string;
  timestamp: string;
}

export default function DonationToast() {
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastDonationId, setLastDonationId] = useState<string | null>(null);

  const fetchLatestDonation = async () => {
    try {
      const res = await fetch('/api/donations/latest');
      if (!res.ok) return;

      const data = await res.json();

      if (data && data.id !== lastDonationId) {
        // New donation found
        setDonation(data);
        setLastDonationId(data.id);
        setIsVisible(true);

        // Hide after 8 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 8000);
      }
    } catch (error) {
      console.error('Error polling donation:', error);
    }
  };

  useEffect(() => {
    // Initial check
    fetchLatestDonation();

    // Poll every 30 seconds
    const interval = setInterval(fetchLatestDonation, 30000);

    return () => clearInterval(interval);
  }, [lastDonationId]);

  const handleDonate = () => {
    window.location.href = '/donate';
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Map donation types to readable text
  const getDonationLabel = (type: string) => {
    const types: Record<string, string> = {
      general: 'General Fund',
      zakat: 'Zakat',
      sadaqah: 'Sadaqah',
      building: 'Building Fund',
      ramadan: 'Ramadan Appeal',
      gaza: 'Gaza Emergency',
      orphan: 'Orphan Support',
      education: 'Education',
    };
    return types[type] || type;
  };

  if (!donation) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <div className="w-[340px] sm:w-[380px] px-4 py-3 bg-blue-50/95 backdrop-blur-sm border border-blue-100 rounded-lg shadow-lg inline-flex justify-between items-center overflow-hidden">
            <div className="flex-1 inline-flex flex-col justify-start items-start mr-3">
              <div className="self-stretch text-blue-600 text-base font-semibold font-['Inter'] leading-6">
                {formatCurrency(donation.amount, donation.currency)} received
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                <div className="self-stretch text-blue-500 text-xs font-normal font-['Inter'] leading-4">
                  to {getDonationLabel(donation.donationType)}
                </div>
                <div className="self-stretch inline-flex justify-start items-center gap-1.5 mt-1">
                  <div className="w-5 h-3.5 relative shadow-sm rounded-sm overflow-hidden">
                    {/* British Flag / Union Jack SVG */}
                    <svg viewBox="0 0 60 30" className="w-full h-full">
                      <clipPath id="t">
                        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                      </clipPath>
                      <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
                      <path
                        d="M0,0 L60,30 M60,0 L0,30"
                        stroke="#fff"
                        strokeWidth="6"
                      />
                      <path
                        d="M0,0 L60,30 M60,0 L0,30"
                        clipPath="url(#t)"
                        stroke="#cf142b"
                        strokeWidth="4"
                      />
                      <path
                        d="M30,0 v30 M0,15 h60"
                        stroke="#fff"
                        strokeWidth="10"
                      />
                      <path
                        d="M30,0 v30 M0,15 h60"
                        stroke="#cf142b"
                        strokeWidth="6"
                      />
                    </svg>
                  </div>
                  <div className="text-slate-500 text-xs font-normal font-['Inter'] leading-4">
                    {donation.city}, {donation.country}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDonate}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex justify-center items-center transition-colors shadow-md hover:shadow-lg"
            >
              <span className="text-sm font-medium font-['Inter']">Donate</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
