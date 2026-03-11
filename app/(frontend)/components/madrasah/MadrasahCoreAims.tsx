import './MadrasahCoreAims.css';

type CoreAim = {
    id?: string | null;
    title: string;
    description: string;
};

type SafeguardingPoint = {
    id?: string | null;
    text: string;
};

type CoreAimsData = {
    enableSection?: boolean | null;
    title: string;
    description: string;
    aims?: CoreAim[] | null;
    safeguardingTitle: string;
    safeguardingDescription: string;
    safeguardingPoints?: SafeguardingPoint[] | null;
};

interface MadrasahCoreAimsProps {
    data: CoreAimsData;
}

export default function MadrasahCoreAims({ data }: MadrasahCoreAimsProps) {
    if (!data.enableSection) return null;

    const aims = data.aims ?? [];
    const points = data.safeguardingPoints ?? [];

    return (
        <div className="ca-section">
            <div className="section-padding ca-inner">
                {/* ── Left: Core Aims ── */}
                <div className="ca-left">
                    <div className="ca-heading-block">
                        <div className="ca-title">{data.title}</div>
                        <div className="ca-subtitle">{data.description}</div>
                    </div>

                    <div className="ca-aims-list">
                        {aims.map((aim, idx) => (
                            <div key={aim.id ?? idx} className="ca-aim-row">
                                <div className="ca-bullet-wrap">
                                    <img src="/assets/madrasah/icon-core-aim.svg" alt="" width={28} height={28} className="object-contain" />
                                </div>
                                <div className="ca-aim-content">
                                    <div className="ca-aim-title">{aim.title}</div>
                                    <div className="ca-aim-desc">{aim.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: Safeguarding card ── */}
                <div className="ca-right relative">
                    <div
                        className="absolute inset-0 pointer-events-none z-1"
                        style={{
                            background: "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
                        }}
                    >
                        <div
                            className="absolute inset-0 opacity-30 bg-repeat"
                            style={{
                                backgroundImage: "url('/assets/services/bg-pattern.png')",
                                backgroundSize: "154px 154px",
                            }}
                        />
                    </div>
                    <div className="ca-card-inner relative z-2">
                        {/* Header */}
                        <div className="ca-card-header">
                            <img src="/assets/madrasah/icon-safeguard-main.svg" alt="" width={40} height={40} className="object-contain flex-shrink-0" />
                            <div className="ca-card-title">{data.safeguardingTitle}</div>
                        </div>

                        {/* Description */}
                        <div className="ca-card-desc">{data.safeguardingDescription}</div>

                        {/* Points */}
                        <div className="ca-card-points">
                            {points.map((point, idx) => (
                                <div key={point.id ?? idx} className="ca-point-row">
                                    <img src="/assets/madrasah/icon-safeguard-list.svg" alt="" width={24} height={24} className="object-contain flex-shrink-0" />
                                    <div className="ca-point-text">{point.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
