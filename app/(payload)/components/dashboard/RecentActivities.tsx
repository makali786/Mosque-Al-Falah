'use client';

interface Activity {
    type: 'blog' | 'donation' | 'enrollment' | 'testimonial' | 'announcement';
    title: string;
    description: string;
    timeAgo: string;
}

interface RecentActivitiesProps {
    activities: Activity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
    const getActivityIcon = (type: Activity['type']) => {
        const iconColor = '#3b82f6';

        switch (type) {
            case 'blog':
                return (
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
                        style={{ height: '1rem', width: '1rem', color: iconColor }}
                    >
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                    </svg>
                );
            case 'donation':
                return (
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
                        style={{ height: '1rem', width: '1rem', color: iconColor }}
                    >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                );
            case 'enrollment':
                return (
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
                        style={{ height: '1rem', width: '1rem', color: iconColor }}
                    >
                        <path d="M12 7v14"></path>
                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                    </svg>
                );
            case 'testimonial':
                return (
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
                        style={{ height: '1rem', width: '1rem', color: iconColor }}
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                );
            case 'announcement':
                return (
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
                        style={{ height: '1rem', width: '1rem', color: iconColor }}
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="M9 3v18"></path>
                    </svg>
                );
        }
    };

    return (
        <div
            style={{
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                gridColumn: 'span 4 / span 4',
            }}
        >
            <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    Recent Activities
                </div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activities.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No recent activities to display.</p>
                    ) : (
                        activities.map((activity, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        marginRight: '1rem',
                                        borderRadius: '9999px',
                                        backgroundColor: '#eff6ff',
                                        padding: '0.5rem',
                                    }}
                                >
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                                        {activity.title}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{activity.description}</p>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                                    {activity.timeAgo}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <a
                    href="#"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        height: '2.5rem',
                        padding: '0 1rem',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        color: '#111827',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                    View all activities
                </a>
            </div>
        </div>
    );
};
