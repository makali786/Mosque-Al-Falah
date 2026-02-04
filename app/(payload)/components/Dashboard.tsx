'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from './dashboard/StatsCard';
import { FundraisingProgress } from './dashboard/FundraisingProgress';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { RecentActivities } from './dashboard/RecentActivities';
import { QuickLinks } from './dashboard/QuickLinks';

interface Stats {
  totalServices: number;
  totalBlogPosts: number;
  activeAppeals: number;
  totalRaised: number;
  academyCourses: number;
  totalEnrollments: number;
  newEnrollments: number;
  websiteViews: number;
  totalDonors: number;
}

interface Appeal {
  name: string;
  current: number;
  target: number;
}

interface Event {
  name: string;
  date: string;
  time: string;
  color: 'green' | 'blue' | 'purple';
}

interface Activity {
  type: 'blog' | 'donation' | 'enrollment' | 'testimonial' | 'announcement';
  title: string;
  description: string;
  timeAgo: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    totalBlogPosts: 0,
    activeAppeals: 0,
    totalRaised: 0,
    academyCourses: 0,
    totalEnrollments: 0,
    newEnrollments: 0,
    websiteViews: 0,
    totalDonors: 0,
  });
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${Math.floor(diffInSeconds / 60) === 1 ? 'minute' : 'minutes'} ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${Math.floor(diffInSeconds / 3600) === 1 ? 'hour' : 'hours'} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ${Math.floor(diffInSeconds / 86400) === 1 ? 'day' : 'days'} ago`;
    return `${Math.floor(diffInSeconds / 604800)} ${Math.floor(diffInSeconds / 604800) === 1 ? 'week' : 'weeks'} ago`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get date for recent items (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch all data in parallel
        const [
          servicesRes,
          blogPostsRes,
          appealsRes,
          eventsRes,
          madrasahRes,
          donationsRes,
          donorsRes,
          noticesRes,
          recentBlogsRes,
          testimonialsRes,
        ] = await Promise.all([
          fetch('/api/services?where[isActive][equals]=true&limit=1'),
          fetch('/api/blog-posts?limit=1'),
          fetch('/api/donation-appeals?limit=10&sort=-createdAt'),
          fetch('/api/events?limit=10&sort=date'),
          fetch('/api/madrasah-classes?limit=1'),
          fetch(`/api/donations?where[createdAt][greater_than_equal]=${thirtyDaysAgo.toISOString()}&limit=1`),
          fetch('/api/donors?limit=1'),
          fetch('/api/notices?limit=5&sort=-createdAt'),
          fetch('/api/blog-posts?limit=5&sort=-createdAt'),
          fetch('/api/madrasah-testimonials?limit=5&sort=-createdAt'),
        ]);

        const services = await servicesRes.json();
        const blogPosts = await blogPostsRes.json();
        const appealsData = await appealsRes.json();
        const events = await eventsRes.json();
        const madrasah = await madrasahRes.json();
        const donations = await donationsRes.json();
        const donors = await donorsRes.json();
        const notices = await noticesRes.json();
        const recentBlogs = await recentBlogsRes.json();
        const testimonials = await testimonialsRes.json();

        // Calculate total raised and active appeals
        let totalRaised = 0;
        let activeCount = 0;
        const appealsList: Appeal[] = [];

        if (appealsData.docs && Array.isArray(appealsData.docs)) {
          appealsData.docs.forEach((appeal: any) => {
            if (appeal.isActive) {
              activeCount++;
              if (appeal.currentAmount) {
                totalRaised += appeal.currentAmount;
              }
              if (appealsList.length < 3) {
                appealsList.push({
                  name: appeal.title || 'Untitled Appeal',
                  current: appeal.currentAmount || 0,
                  target: appeal.targetAmount || 0,
                });
              }
            }
          });
        }

        // Process upcoming events (next 7 days)
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        const eventsList: Event[] = [];
        if (events.docs && Array.isArray(events.docs)) {
          events.docs.forEach((event: any, index: number) => {
            const eventDate = event.date ? new Date(event.date) : null;
            if (eventDate && eventDate >= now && eventDate <= sevenDaysFromNow && eventsList.length < 3) {
              const colors: ('green' | 'blue' | 'purple')[] = ['green', 'blue', 'purple'];
              eventsList.push({
                name: event.title || 'Untitled Event',
                date: eventDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
                time: event.time || 'TBD',
                color: colors[index % 3],
              });
            }
          });
        }

        // Create recent activities from various CMS sources
        const activities: Activity[] = [];

        // Add recent blog posts
        if (recentBlogs.docs && Array.isArray(recentBlogs.docs)) {
          recentBlogs.docs.slice(0, 2).forEach((blog: any) => {
            if (blog.createdAt) {
              activities.push({
                type: 'blog',
                title: `New blog post added: "${blog.title || 'Untitled'}"`,
                description: `Added by ${blog.author?.name || 'Admin'}`,
                timeAgo: getRelativeTime(new Date(blog.createdAt)),
              });
            }
          });
        }

        // Add recent donations
        if (donations.docs && Array.isArray(donations.docs)) {
          donations.docs.slice(0, 1).forEach((donation: any) => {
            if (donation.createdAt) {
              activities.push({
                type: 'donation',
                title: `New donation received${donation.appealId ? ` for ${donation.appealId}` : ''}`,
                description: `£${donation.amount || 0} donated`,
                timeAgo: getRelativeTime(new Date(donation.createdAt)),
              });
            }
          });
        }

        // Add recent testimonials
        if (testimonials.docs && Array.isArray(testimonials.docs)) {
          testimonials.docs.slice(0, 1).forEach((testimonial: any) => {
            if (testimonial.createdAt) {
              activities.push({
                type: 'testimonial',
                title: `New testimonial added${testimonial.courseName ? ` for ${testimonial.courseName}` : ''}`,
                description: testimonial.rating ? `${testimonial.rating}-star rating` : 'New review',
                timeAgo: getRelativeTime(new Date(testimonial.createdAt)),
              });
            }
          });
        }

        // Add recent notices/announcements
        if (notices.docs && Array.isArray(notices.docs)) {
          notices.docs.slice(0, 1).forEach((notice: any) => {
            if (notice.createdAt) {
              activities.push({
                type: 'announcement',
                title: `New announcement: "${notice.title || 'Untitled'}"`,
                description: notice.isPublished ? 'Published' : 'Draft',
                timeAgo: getRelativeTime(new Date(notice.createdAt)),
              });
            }
          });
        }

        // Sort activities by time and limit to 5
        activities.sort((a, b) => {
          const timeA = a.timeAgo.includes('Just now') ? 0 : parseInt(a.timeAgo);
          const timeB = b.timeAgo.includes('Just now') ? 0 : parseInt(b.timeAgo);
          return timeA - timeB;
        });

        setStats({
          totalServices: services.totalDocs || 0,
          totalBlogPosts: blogPosts.totalDocs || 0,
          activeAppeals: activeCount,
          totalRaised: totalRaised,
          academyCourses: madrasah.totalDocs || 0,
          totalEnrollments: 0, // Not available - hide this card or fetch from a different source
          newEnrollments: 0, // Not available
          websiteViews: 0, // Not available - would need analytics integration
          totalDonors: donors.totalDocs || 0,
        });

        setAppeals(appealsList);
        setUpcomingEvents(eventsList);
        setRecentActivities(activities.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6" style={{ backgroundColor: '#f9fafb' }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#111827' }}>
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <a
            href="https://masjid-alfalah.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              height: '2.5rem',
              padding: '0 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            View website
          </a>
        </div>
      </div>

      {/* Stats Grid - First Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Services"
          value={stats.totalServices}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          }
          link={{ href: '/admin/collections/services', text: 'Manage services' }}
        />

        <StatsCard
          title="Blog Posts"
          value={stats.totalBlogPosts}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
              <path d="M18 14h-8"></path>
              <path d="M15 18h-5"></path>
              <path d="M10 6h8v4h-8V6Z"></path>
            </svg>
          }
          link={{ href: '/admin/collections/blog-posts', text: 'Manage blog posts' }}
        />

        <StatsCard
          title="Active Appeals"
          value={stats.activeAppeals}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          }
          description={`£${stats.totalRaised.toLocaleString()} raised`}
          link={{
            href: '/admin/collections/donation-appeals',
            text: `£${stats.totalRaised.toLocaleString()} raised`,
          }}
        />

        <StatsCard
          title="Academy Courses"
          value={stats.academyCourses}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 7v14"></path>
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
          }
          link={{ href: '/admin/collections/madrasah-classes', text: 'Manage courses' }}
        />
      </div>

      {/* Stats Grid - Second Row - Only show if data is available */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Donors"
          value={stats.totalDonors}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              style={{ color: '#d97706' }}
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
          link={{ href: '/admin/collections/donors', text: 'View donor details' }}
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Fundraising Progress and Upcoming Events */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <FundraisingProgress appeals={appeals} />
        <UpcomingEvents events={upcomingEvents} />
      </div>

      {/* Recent Activities and Quick Links */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivities activities={recentActivities} />
        <QuickLinks />
      </div>
    </div>
  );
};

export default Dashboard;
