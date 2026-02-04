'use client';

interface Appeal {
    name: string;
    current: number;
    target: number;
}

interface FundraisingProgressProps {
    appeals: Appeal[];
}

export const FundraisingProgress: React.FC<FundraisingProgressProps> = ({ appeals }) => {
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
                    Fundraising Progress
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Current active appeals and their progress
                </div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appeals.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No active appeals at the moment.</p>
                    ) : (
                        appeals.map((appeal, index) => {
                            const percentage = appeal.target > 0 ? (appeal.current / appeal.target) * 100 : 0;
                            return (
                                <div key={index}>
                                    <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{appeal.name}</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                            £{appeal.current.toLocaleString()} / £{appeal.target.toLocaleString()}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '9999px',
                                            backgroundColor: '#e5e7eb',
                                            height: '0.5rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                backgroundColor: '#3b82f6',
                                                transition: 'all 0.3s',
                                                width: `${Math.min(percentage, 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                        {Math.round(percentage)}% of target reached
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                <a
                    href="/admin/collections/donation-appeals"
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
                    Manage Appeals
                </a>
            </div>
        </div>
    );
};
