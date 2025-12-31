'use client';

import { useEffect, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaBullhorn,
  FaChartLine,
  FaDonate,
  FaMosque,
  FaPlus,
} from 'react-icons/fa';

interface Stats {
  totalDonations: number;
  donationTrend: number;
  totalEvents: number;
  eventTrend: number;
  totalServices: number;
  serviceTrend: number;
  totalMedia: number;
  mediaTrend: number;
  monthlyData: Array<{ month: string; count: number }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    donationTrend: 0,
    totalEvents: 0,
    eventTrend: 0,
    totalServices: 0,
    serviceTrend: 0,
    totalMedia: 0,
    mediaTrend: 0,
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get date ranges for trend calculation
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch all collections
        const [
          donationsRes,
          donationsLastMonthRes,
          eventsRes,
          eventsLastMonthRes,
          servicesRes,
          mediaRes,
          noticesRes,
        ] = await Promise.all([
          // Current donations
          fetch('/api/donation-appeals?limit=1'),
          // Last month donations
          fetch(
            `/api/donation-appeals?where[createdAt][greater_than_equal]=${lastMonth.toISOString()}&where[createdAt][less_than]=${thisMonth.toISOString()}&limit=1`
          ),
          // Current events
          fetch('/api/events?limit=1'),
          // Last month events
          fetch(
            `/api/events?where[createdAt][greater_than_equal]=${lastMonth.toISOString()}&where[createdAt][less_than]=${thisMonth.toISOString()}&limit=1`
          ),
          // Services
          fetch('/api/services?where[isActive][equals]=true'),
          // Media
          fetch('/api/media-items?limit=1'),
          // Notices
          fetch('/api/notices?limit=1'),
        ]);

        const donations = await donationsRes.json();
        const donationsLastMonth = await donationsLastMonthRes.json();
        const events = await eventsRes.json();
        const eventsLastMonth = await eventsLastMonthRes.json();
        const services = await servicesRes.json();
        const media = await mediaRes.json();
        const notices = await noticesRes.json();

        // Calculate trends
        const donationTrend =
          donationsLastMonth.totalDocs > 0
            ? ((donations.totalDocs - donationsLastMonth.totalDocs) /
                donationsLastMonth.totalDocs) *
              100
            : 0;

        const eventTrend =
          eventsLastMonth.totalDocs > 0
            ? ((events.totalDocs - eventsLastMonth.totalDocs) /
                eventsLastMonth.totalDocs) *
              100
            : 0;

        // Fetch monthly data for chart (last 6 months)
        const monthlyData = [];
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const nextMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            1
          );

          const monthEvents = await fetch(
            `/api/events?where[createdAt][greater_than_equal]=${date.toISOString()}&where[createdAt][less_than]=${nextMonth.toISOString()}&limit=1`
          ).then(r => r.json());

          monthlyData.push({
            month: monthNames[date.getMonth()],
            count: monthEvents.totalDocs || 0,
          });
        }

        setStats({
          totalDonations: donations.totalDocs || 0,
          donationTrend: Math.round(donationTrend * 10) / 10,
          totalEvents: events.totalDocs || 0,
          eventTrend: Math.round(eventTrend * 10) / 10,
          totalServices: services.totalDocs || 0,
          serviceTrend: 0,
          totalMedia: media.totalDocs || 0,
          mediaTrend: 0,
          monthlyData,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#f8f9fa' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            color: '#6c757d',
          }}
        >
          Loading dashboard...
        </div>
      </div>
    );
  }

  // Calculate max value for chart scaling
  const maxCount = Math.max(...stats.monthlyData.map(d => d.count), 1);

  return (
    <div
      style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '0.25rem',
            letterSpacing: '-0.025em',
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>
          Welcome to Masjid Al-Falah CMS
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Total Donations */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                color: '#6c757d',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Total Donation Appeals
            </div>
            {stats.donationTrend !== 0 && (
              <div
                style={{
                  backgroundColor:
                    stats.donationTrend > 0 ? '#d1ecf1' : '#f8d7da',
                  color: stats.donationTrend > 0 ? '#0c5460' : '#721c24',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {stats.donationTrend > 0 ? (
                  <FaArrowUp size={10} />
                ) : (
                  <FaArrowDown size={10} />
                )}
                {Math.abs(stats.donationTrend)}%
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em',
            }}
          >
            {stats.totalDonations}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#495057',
              fontSize: '0.8125rem',
            }}
          >
            {stats.donationTrend > 0 ? (
              <FaArrowUp size={12} color="#0c5460" />
            ) : (
              <FaArrowDown size={12} color="#721c24" />
            )}
            <span>
              {stats.donationTrend > 0 ? 'Trending up' : 'Trending down'} this
              month
            </span>
          </div>
          <div
            style={{
              color: '#adb5bd',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            Active campaigns
          </div>
        </div>

        {/* Total Events */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                color: '#6c757d',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Total Events
            </div>
            {stats.eventTrend !== 0 && (
              <div
                style={{
                  backgroundColor: stats.eventTrend > 0 ? '#d1ecf1' : '#f8d7da',
                  color: stats.eventTrend > 0 ? '#0c5460' : '#721c24',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {stats.eventTrend > 0 ? (
                  <FaArrowUp size={10} />
                ) : (
                  <FaArrowDown size={10} />
                )}
                {Math.abs(stats.eventTrend)}%
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em',
            }}
          >
            {stats.totalEvents}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#495057',
              fontSize: '0.8125rem',
            }}
          >
            {stats.eventTrend > 0 ? (
              <FaArrowUp size={12} color="#0c5460" />
            ) : (
              <FaArrowDown size={12} color="#721c24" />
            )}
            <span>
              {stats.eventTrend > 0 ? 'Growing' : 'Needs attention'} this period
            </span>
          </div>
          <div
            style={{
              color: '#adb5bd',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            Scheduled events
          </div>
        </div>

        {/* Active Services */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                color: '#6c757d',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Active Services
            </div>
          </div>
          <div
            style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em',
            }}
          >
            {stats.totalServices}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#495057',
              fontSize: '0.8125rem',
            }}
          >
            <FaMosque size={12} color="#0c5460" />
            <span>Services available</span>
          </div>
          <div
            style={{
              color: '#adb5bd',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            Currently active
          </div>
        </div>

        {/* Media Items */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                color: '#6c757d',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Media Items
            </div>
          </div>
          <div
            style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em',
            }}
          >
            {stats.totalMedia}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#495057',
              fontSize: '0.8125rem',
            }}
          >
            <FaChartLine size={12} color="#0c5460" />
            <span>Videos & podcasts</span>
          </div>
          <div
            style={{
              color: '#adb5bd',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            Total media library
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#212529',
              marginBottom: '0.25rem',
              letterSpacing: '-0.025em',
            }}
          >
            Events Overview
          </h3>
          <p style={{ color: '#6c757d', fontSize: '0.8125rem' }}>
            Events created in the last 6 months
          </p>
        </div>

        {/* Real Chart with API Data */}
        <div
          style={{
            height: '200px',
            background:
              'linear-gradient(180deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.02) 100%)',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '1rem',
            gap: '0.5rem',
          }}
        >
          {stats.monthlyData.map((data, i) => {
            const heightPercent =
              maxCount > 0 ? (data.count / maxCount) * 100 : 10;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(heightPercent, 10)}%`,
                    background: 'linear-gradient(to top, #0d6efd, #6ea8fe)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scaleY(1.1)';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scaleY(1)';
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                  title={`${data.month}: ${data.count} events`}
                >
                  {data.count > 0 && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {data.count}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6c757d',
                    fontWeight: '500',
                  }}
                >
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <a
          href="/admin/collections/events/create"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '1.25rem',
            textDecoration: 'none',
            color: '#212529',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#0d6efd';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(13, 110, 253, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e9ecef';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div
            style={{
              backgroundColor: '#e7f1ff',
              borderRadius: '8px',
              padding: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaPlus color="#0d6efd" size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              Create Event
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
              Add new event
            </div>
          </div>
        </a>

        <a
          href="/admin/collections/donation-appeals/create"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '1.25rem',
            textDecoration: 'none',
            color: '#212529',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#198754';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(25, 135, 84, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e9ecef';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div
            style={{
              backgroundColor: '#d1f4e0',
              borderRadius: '8px',
              padding: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaDonate color="#198754" size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              New Donation
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
              Create appeal
            </div>
          </div>
        </a>

        <a
          href="/admin/collections/notices/create"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '10px',
            padding: '1.25rem',
            textDecoration: 'none',
            color: '#212529',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#ffc107';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(255, 193, 7, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e9ecef';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div
            style={{
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              padding: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaBullhorn color="#ffc107" size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              Post Notice
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
              Add announcement
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
