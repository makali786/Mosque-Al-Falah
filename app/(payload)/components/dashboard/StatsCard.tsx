'use client';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    link?: {
        href: string;
        text: string;
    };
    trend?: {
        value: number;
        label: string;
    };
    bgColor?: string;
    iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    description,
    link,
    trend,
    bgColor = 'white',
    iconColor = '#6b7280',
}) => {
    return (
        <div
            style={{
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                backgroundColor: bgColor,
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            }}
        >
            <div
                style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.5rem',
                }}
            >
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>{title}</div>
                <div style={{ color: iconColor }}>{icon}</div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{value}</div>
                {trend && (
                    <div
                        style={{
                            marginTop: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            color: trend.value >= 0 ? '#059669' : '#dc2626',
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
                            style={{ marginRight: '0.25rem', height: '0.75rem', width: '0.75rem' }}
                        >
                            {trend.value >= 0 ? (
                                <>
                                    <path d="m5 12 7-7 7 7"></path>
                                    <path d="M12 19V5"></path>
                                </>
                            ) : (
                                <>
                                    <path d="M12 5v14"></path>
                                    <path d="m19 12-7 7-7-7"></path>
                                </>
                            )}
                        </svg>
                        <span>{trend.label}</span>
                    </div>
                )}
                {description && !link && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                        {description}
                    </p>
                )}
                {link && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                        <a
                            style={{ color: '#2563eb', textDecoration: 'none' }}
                            href={link.href}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                        >
                            {link.text}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};
