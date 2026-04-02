'use client';

import { useState, useEffect } from 'react';
import { useAuth, useTheme } from '@payloadcms/ui';

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    timeAgo: string;
    createdAt: string;
}

const CustomHeader: React.FC = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState<Activity[]>([]);
    const [seenNotifications, setSeenNotifications] = useState<Set<string>>(new Set());
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load seen notifications from localStorage
    useEffect(() => {
        const savedSeenNotifications = localStorage.getItem('seenNotifications');

        if (savedSeenNotifications) {
            setSeenNotifications(new Set(JSON.parse(savedSeenNotifications)));
        }
    }, []);

    // Fetch notifications from activities API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/activities?limit=10');
                const data = await response.json();

                if (data.activities && Array.isArray(data.activities)) {
                    setNotifications(data.activities);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();

        // Refresh notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Toggle dark mode using Payload's theme system
    const toggleDarkMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Mark all notifications as seen
    const markAllAsSeen = () => {
        const allIds = new Set(notifications.map(n => n.id || n.createdAt));
        setSeenNotifications(allIds);
        localStorage.setItem('seenNotifications', JSON.stringify([...allIds]));
    };

    // Handle notification click
    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            // Mark as seen when opening
            setTimeout(markAllAsSeen, 1000);
        }
    };

    // Calculate unseen count
    const unseenCount = notifications.filter(n =>
        !seenNotifications.has(n.id || n.createdAt)
    ).length;

    // Get user display name
    const userName = user?.name || user?.email?.split('@')[0] || 'User';
    const userSubtitle = user?.email || 'Masjid Al-Falah';

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: '16rem',
                right: 0,
                height: '4rem',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                zIndex: 40,
            }}
        >
            {/* Search Bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    width: '400px',
                    gap: '0.75rem',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Search..."
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '0.875rem',
                        color: '#111827',
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#6b7280',
                    }}
                >
                    ⌘ K
                </div>
            </div>

            {/* Right Section */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                }}
            >
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    {theme === 'dark' ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111827"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2"></path>
                            <path d="M12 20v2"></path>
                            <path d="m4.93 4.93 1.41 1.41"></path>
                            <path d="m17.66 17.66 1.41 1.41"></path>
                            <path d="M2 12h2"></path>
                            <path d="M20 12h2"></path>
                            <path d="m6.34 17.66-1.41 1.41"></path>
                            <path d="m19.07 4.93-1.41 1.41"></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111827"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                        </svg>
                    )}
                </button>

                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={handleNotificationClick}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2.5rem',
                            height: '2.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111827"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                        </svg>
                        {/* Notification Badge */}
                        {unseenCount > 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '0.375rem',
                                    right: '0.375rem',
                                    minWidth: '1.125rem',
                                    height: '1.125rem',
                                    backgroundColor: '#3b82f6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.625rem',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    padding: '0 0.25rem',
                                }}
                            >
                                {unseenCount > 9 ? '9+' : unseenCount}
                            </div>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 0.5rem)',
                                right: 0,
                                width: '360px',
                                maxHeight: '400px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                overflow: 'hidden',
                                zIndex: 50,
                            }}
                        >
                            <div
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #e5e7eb',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    Notifications
                                </h3>
                                {unseenCount > 0 && (
                                    <button
                                        onClick={markAllAsSeen}
                                        style={{
                                            fontSize: '0.75rem',
                                            color: '#3b82f6',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                {loading ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                        Loading...
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map((notification) => {
                                        const isUnseen = !seenNotifications.has(notification.id || notification.createdAt);
                                        return (
                                            <div
                                                key={notification.id || notification.createdAt}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    borderBottom: '1px solid #f3f4f6',
                                                    backgroundColor: isUnseen ? '#eff6ff' : 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isUnseen) e.currentTarget.style.backgroundColor = '#f9fafb';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isUnseen) e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                                                    {notification.title}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    {notification.description}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                    {notification.timeAgo}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderTop: '1px solid #e5e7eb',
                                    textAlign: 'center',
                                }}
                            >
                                <a
                                    href="/admin/activities"
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#3b82f6',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                    }}
                                >
                                    View all activities
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <button
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>

                    {/* User Info */}
                    <div style={{ textAlign: 'left', lineHeight: '1.25' }}>
                        <div
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#111827',
                            }}
                        >
                            {userName}
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                            }}
                        >
                            {userSubtitle}
                        </div>
                    </div>

                    {/* Dropdown Arrow */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CustomHeader;
