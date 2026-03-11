import Image from 'next/image';
import './MadrasahLeadership.css';

type LeaderMember = {
    id?: string | null;
    name: string;
    role: string;
    bio: string;
    whatsappUrl?: string | null;
    emailUrl?: string | null;
    photo?: { url: string } | null;
};

type LeadershipData = {
    enableSection?: boolean | null;
    title: string;
    description: string;
    members?: LeaderMember[] | null;
};

interface MadrasahLeadershipProps {
    data: LeadershipData;
}

function WhatsAppIcon() {
    return (
        <svg className="ml-whatsapp-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366" />
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.891c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.004c6.585 0 11.946-5.336 11.949-11.893 0-3.176-1.24-6.165-3.478-8.45zM12.045 21.785h-.003c-1.774 0-3.513-.476-5.031-1.378l-.361-.214-3.741.975.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884z" fill="#25D366" />
        </svg>
    );
}

function EmailIcon() {
    return (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z" fill="#1e40af" />
        </svg>
    );
}

function LeaderCard({ member }: { member: LeaderMember }) {
    const photoUrl = member.photo?.url || null;
    return (
        <div className="ml-card">
            {/* Photo */}
            {photoUrl ? (
                <div style={{ width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <Image
                        src={photoUrl}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            ) : (
                <div className="ml-card-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                </div>
            )}

            {/* Identity */}
            <div className="ml-card-identity">
                <div className="ml-card-name">{member.name}</div>
                <div className="ml-card-role">{member.role}</div>
            </div>

            {/* Divider */}
            <div className="ml-card-divider" />

            {/* Bio */}
            <div className="ml-card-bio">{member.bio}</div>

            {/* Actions */}
            <div className="ml-card-actions">
                {member.whatsappUrl && (
                    <a href={member.whatsappUrl} target="_blank" rel="noopener noreferrer" className="ml-btn-whatsapp">
                        <WhatsAppIcon />
                        <span className="ml-btn-whatsapp-label">Whatsapp</span>
                    </a>
                )}
                {!member.whatsappUrl && (
                    <span className="ml-btn-whatsapp" style={{ cursor: 'default', opacity: 0.5 }}>
                        <WhatsAppIcon />
                        <span className="ml-btn-whatsapp-label">Whatsapp</span>
                    </span>
                )}
                {member.emailUrl ? (
                    <a href={member.emailUrl} target="_blank" rel="noopener noreferrer" className="ml-btn-email">
                        <EmailIcon />
                    </a>
                ) : (
                    <span className="ml-btn-email" style={{ cursor: 'default', opacity: 0.5 }}>
                        <EmailIcon />
                    </span>
                )}
            </div>
        </div>
    );
}

export default function MadrasahLeadership({ data }: MadrasahLeadershipProps) {
    if (!data.enableSection) return null;

    const members = data.members ?? [];

    return (
        <div className="ml-section">
            <div className="section-padding ml-inner">
                {/* Header */}
                <div className="ml-header">
                    <div className="ml-title">{data.title}</div>
                    <div className="ml-desc-wrap">
                        <div className="ml-desc-text">{data.description}</div>
                    </div>
                </div>

                {/* Cards */}
                {members.length > 0 && (
                    <div className="ml-cards">
                        {members.map((member, idx) => (
                            <LeaderCard key={member.id ?? idx} member={member} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
