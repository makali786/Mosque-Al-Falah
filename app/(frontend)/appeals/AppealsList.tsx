'use client';

import { useState } from 'react';
import AppealCard from '../components/common/AppealCard';

export default function AppealsList({
  appealsData,
  gridClass,
}: {
  appealsData: any[];
  gridClass: string;
}) {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleAppeals = appealsData.slice(0, visibleCount);

  // Helper to calculate days left
  const getDaysLeft = (dateString?: string) => {
    if (!dateString) return 0;
    const end = new Date(dateString);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <div>
      <div className={`grid grid-cols-1 md:grid-cols-2 ${gridClass} gap-6`}>
        {visibleAppeals.map((appeal: any, index: number) => (
          <AppealCard
            key={appeal.id || index}
            title={appeal?.title}
            description={appeal?.shortDescription}
            image={appeal?.heroMedia?.heroImage}
            organization={{
              name: 'Masjid Al-Falah',
              logo: '/assets/common/logo-small.svg',
            }}
            stats={{
              donors: appeal?.funding?.totalDonors || 0,
              daysLeft: appeal?.funding?.isOngoing
                ? 0
                : getDaysLeft(appeal?.timeline?.endDate),
            }}
            funding={{
              raised: appeal?.funding?.currentAmount || 0,
              goal: appeal?.funding?.targetAmount || 0,
              isOngoing: appeal?.funding?.isOngoing || false,
            }}
            links={{
              donate: `/donate?appealId=${appeal.id}`,
              details: `/appeals/${appeal.slug}`,
            }}
            buttonVariant="primary"
            disableOnlineDonation={appeal?.disableOnlineDonation || false}
          />
        ))}
      </div>

      {visibleCount < appealsData.length && (
        <div className="mt-8 flex justify-center w-full">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-[#F4F4F5] rounded-lg text-sm font-medium text-[#18181B] hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
