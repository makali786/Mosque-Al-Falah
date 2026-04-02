'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}

const Breadcrumb: React.FC = () => {
    const [pathname, setPathname] = useState(
        typeof window !== 'undefined' ? window.location.pathname : ''
    );

    useEffect(() => {
        const handlePopState = () => {
            setPathname(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        
        const interval = setInterval(() => {
            if (window.location.pathname !== pathname) {
                setPathname(window.location.pathname);
            }
        }, 100);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            clearInterval(interval);
        };
    }, [pathname]);

    if (!pathname || pathname === '/admin' || pathname === '/admin/') {
        return null;
    }

    const buildBreadcrumbs = (): BreadcrumbItem[] => {
        const items: BreadcrumbItem[] = [
            { label: 'Dashboard', href: '/admin' }
        ];

        if (pathname.includes('/admin/collections/')) {
            const parts = pathname.replace('/admin/collections/', '').split('/');
            const collectionName = parts[0];
            const itemId = parts[1];
            const collectionLabel = getCollectionLabel(collectionName);
            
            if (itemId) {
                items.push({
                    label: collectionLabel,
                    href: `/admin/collections/${collectionName}`
                });
                items.push({ label: 'Edit', isActive: true });
            } else {
                items.push({ label: collectionLabel, isActive: true });
            }
        }
        else if (pathname.includes('/admin/globals/')) {
            const globalName = pathname.replace('/admin/globals/', '').split('/')[0];
            items.push({
                label: getGlobalLabel(globalName),
                isActive: true
            });
        }

        return items;
    };

    const getCollectionLabel = (slug: string): string => {
        const labels: Record<string, string> = {
            'users': 'Users',
            'media': 'Media Library',
            'banners': 'Banners',
            'events': 'Events',
            'event-bookings': 'Event Bookings',
            'services': 'Services',
            'imams': 'Imams',
            'ayat-of-the-month': 'Ayat of the Month',
            'sermons': 'Sermons',
            'donation-appeals': 'Appeals',
            'donations': 'Donations',
            'donors': 'Donors',
            'core-values': 'Core Values',
            'committees': 'Committees',
            'madrasah-classes': 'Madrasah Classes',
            'madrasah-testimonials': 'Madrasah Testimonials',
            'blog-posts': 'Blog Posts',
            'notices': 'Announcements',
            'popups': 'Popups',
            'questions': 'Q&A / Fatwa',
            'newsletter-subscribers': 'Newsletter',
            'event-requests': 'Event Requests',
            'service-requests': 'Service Requests',
            'media-items': 'Media Items',
            'notifications': 'Notifications',
        };
        return labels[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getGlobalLabel = (slug: string): string => {
        const labels: Record<string, string> = {
            'home-page': 'Home Page',
            'about-page': 'About Page',
            'contact-page': 'Contact Page',
            'madrasah-page': 'Madrasah Page',
            'events-page': 'Events Page',
            'services-page': 'Services Page',
            'sermons-page': 'Sermons Page',
            'donation-appeals-page': 'Appeals Page',
            'blogs-page': 'Blogs Page',
            'media-page': 'Media Page',
            'prayer-times-page': 'Prayer Times Page',
            'prayer-time-settings': 'Prayer Time Settings',
            'donation-settings': 'Donation Page',
        };
        return labels[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const breadcrumbs = buildBreadcrumbs();

    if (breadcrumbs.length <= 1) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '4rem',
                left: '16rem',
                right: 0,
                height: '2.5rem',
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1.5rem',
                zIndex: 35,
            }}
        >
            <nav aria-label="Breadcrumb">
                <ol
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        gap: '0.5rem',
                        width: '100%',
                    }}
                >
                    {breadcrumbs.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            {index > 0 && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#9ca3af"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flexShrink: 0 }}
                                >
                                    <path d="m9 18 6-6-6-6"></path>
                                </svg>
                            )}
                            {item.href && !item.isActive ? (
                                <Link
                                    href={item.href}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6b7280',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#111827',
                                        fontWeight: 500,
                                    }}
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumb;
