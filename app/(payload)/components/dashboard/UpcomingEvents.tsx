'use client';

interface Event {
    name: string;
    date: string;
    time: string;
    color: 'green' | 'blue' | 'purple';
}

interface UpcomingEventsProps {
    events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
    const colorStyles = {
        green: { bg: '#d1fae5', text: '#059669' },
        blue: { bg: '#dbeafe', text: '#2563eb' },
        purple: { bg: '#ede9fe', text: '#7c3aed' },
    };

    return (
        <div
            style={{
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            }}
        >
            <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    Upcoming Events
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Next 7 days</div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {events.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No upcoming events in the next 7 days.</p>
                    ) : (
                        events.map((event, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    style={{
                                        marginRight: '1rem',
                                        borderRadius: '9999px',
                                        padding: '0.5rem',
                                        backgroundColor: colorStyles[event.color].bg,
                                    }}
                                >
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
                                        style={{ height: '1rem', width: '1rem', color: colorStyles[event.color].text }}
                                    >
                                        <path d="M8 2v4"></path>
                                        <path d="M16 2v4"></path>
                                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                        <path d="M3 10h18"></path>
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                                        {event.name}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {event.date} • {event.time}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <a
                    href="/admin/collections/events"
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
                    View All Events
                </a>
            </div>
        </div>
    );
};
