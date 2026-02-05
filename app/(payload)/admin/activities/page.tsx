'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    user: string;
    metadata?: any;
}

interface ActivityResponse {
    docs: Activity[];
    totalDocs: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// SVG Icon Components
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M10 9H8"></path>
        <path d="M16 13H8"></path>
        <path d="M16 17H8"></path>
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
);

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <path d="M12 7v14"></path>
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <path d="M3 10h18"></path>
    </svg>
);

const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <path d="m3 11 18-5v12L3 14v-3z"></path>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
    </svg>
);

const DollarSignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <line x1="12" x2="12" y1="2" y2="22"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const activityTypes = [
    { value: 'all', label: 'All', icon: null },
    { value: 'blog', label: 'Blog', icon: <FileTextIcon /> },
    { value: 'donation', label: 'Donations', icon: <HeartIcon /> },
    { value: 'academy', label: 'Academy', icon: <BookOpenIcon /> },
    { value: 'event', label: 'Events', icon: <CalendarIcon /> },
    { value: 'announcement', label: 'Announcements', icon: <MegaphoneIcon /> },
    { value: 'appeal', label: 'Appeals', icon: <DollarSignIcon /> },
    { value: 'user', label: 'Users', icon: <UserIcon /> },
];

const getActivityIcon = (type: string) => {
    const iconMap: Record<string, JSX.Element> = {
        blog: <FileTextIcon />,
        donation: <HeartIcon />,
        event: <CalendarIcon />,
        announcement: <MegaphoneIcon />,
        academy: <BookOpenIcon />,
        appeal: <DollarSignIcon />,
        user: <UserIcon />,
    };
    return iconMap[type] || <FileTextIcon />;
};

const getActivityColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
        blog: { bg: '#eff6ff', text: '#1e40af' },
        donation: { bg: '#fee2e2', text: '#991b1b' },
        event: { bg: '#eef2ff', text: '#3730a3' },
        announcement: { bg: '#ffedd5', text: '#9a3412' },
        academy: { bg: '#dcfce7', text: '#166534' },
        appeal: { bg: '#d1fae5', text: '#065f46' },
        user: { bg: '#cffafe', text: '#155e75' },
        testimonial: { bg: '#f3e8ff', text: '#6b21a8' },
        service: { bg: '#f3f4f6', text: '#374151' },
        prayer: { bg: '#ccfbf1', text: '#115e59' },
        media: { bg: '#fce7f3', text: '#9f1239' },
        sermon: { bg: '#fef3c7', text: '#92400e' },
    };
    return colors[type] || { bg: '#f3f4f6', text: '#374151' };
};

const getRelativeTime = (date: string): string => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
};

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<ActivityResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchActivities();
    }, [selectedType, searchQuery, currentPage]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                type: selectedType,
                search: searchQuery,
            });
            const response = await fetch(`/api/activities?${params}`);
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        setCurrentPage(1);
    };

    return (
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin" style={{ textDecoration: 'none', marginRight: '1rem' }}>
                    <button
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            whiteSpace: 'nowrap',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            height: '2rem',
                            padding: '0 0.75rem',
                            gap: '0.25rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s, color 0.2s',
                            color: '#111827',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#111827';
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem' }}>
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        Back to Dashboard
                    </button>
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, lineHeight: '2rem', color: "black" }}>Activity Log</h1>
                {activities && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.125rem 0.625rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            borderRadius: '9999px',
                            border: '1px solid transparent',
                            backgroundColor: '#f3f4f6',
                            color: '#111827',
                            marginLeft: '0.5rem',
                        }}
                    >
                        {activities.totalDocs} activities
                    </span>
                )}
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
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
                        style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '1rem',
                            height: '1rem',
                            color: '#6b7280',
                        }}
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input
                        type="search"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                            fontSize: '0.875rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Type Filters */}
                <div
                    style={{
                        display: 'inline-flex',
                        minWidth: '100%',
                        gap: '0.25rem',
                        padding: '0.25rem',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        overflowX: 'auto',
                    }}
                >
                    {activityTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => handleTypeChange(type.value)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                height: '2.25rem',
                                padding: '0 0.75rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                backgroundColor: selectedType === type.value ? '#111827' : 'transparent',
                                color: selectedType === type.value ? 'white' : '#374151',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (selectedType !== type.value) {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedType !== type.value) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {type.icon}
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activities List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    Loading activities...
                </div>
            ) : activities && activities.docs.length > 0 ? (
                <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    {activities.docs.map((activity, index) => {
                        const colors = getActivityColor(activity.type);
                        return (
                            <div
                                key={activity.id}
                                style={{
                                    padding: '1rem',
                                    borderBottom: index < activities.docs.length - 1 ? '1px solid #e5e7eb' : 'none',
                                    transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                            >
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                                        <div style={{ color: colors.text }}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <div>
                                                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0 0 0.25rem 0' }}>
                                                    {activity.title}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            padding: '0 0.5rem',
                                                            height: '1.25rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            borderRadius: '9999px',
                                                            border: '1px solid transparent',
                                                            backgroundColor: colors.bg,
                                                            color: colors.text,
                                                        }}
                                                    >
                                                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        {getRelativeTime(activity.timestamp)}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        by <span style={{ fontWeight: '500' }}>{activity.user}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                                            {activity.description}
                                        </p>
                                        {activity.metadata?.role && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.75rem',
                                                        backgroundColor: '#faf5ff',
                                                        color: '#7c3aed',
                                                        borderRadius: '0.375rem',
                                                    }}
                                                >
                                                    Role: {activity.metadata.role}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>No activities found</p>
                </div>
            )}

            {/* Pagination */}
            {activities && activities.totalPages > 1 && (
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={!activities.hasPrevPage}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            borderRadius: '0.375rem',
                            border: '1px solid #e5e7eb',
                            backgroundColor: activities.hasPrevPage ? 'white' : '#f9fafb',
                            color: activities.hasPrevPage ? '#111827' : '#9ca3af',
                            cursor: activities.hasPrevPage ? 'pointer' : 'not-allowed',
                        }}
                    >
                        ← Previous
                    </button>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {Array.from({ length: Math.min(5, activities.totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    style={{
                                        width: '2rem',
                                        height: '2rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        borderRadius: '0.375rem',
                                        border: currentPage === pageNum ? 'none' : '1px solid #e5e7eb',
                                        backgroundColor: currentPage === pageNum ? '#111827' : 'white',
                                        color: currentPage === pageNum ? 'white' : '#374151',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={!activities.hasNextPage}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            borderRadius: '0.375rem',
                            border: '1px solid #e5e7eb',
                            backgroundColor: activities.hasNextPage ? 'white' : '#f9fafb',
                            color: activities.hasNextPage ? '#111827' : '#9ca3af',
                            cursor: activities.hasNextPage ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
