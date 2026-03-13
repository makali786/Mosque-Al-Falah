import Link from 'next/link';
import './MadrasahJourneyCTA.css';

type JourneyCtaData = {
  enableSection?: boolean | null;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl?: string | null;
  secondaryButtonText: string;
  secondaryButtonUrl?: string | null;
  target?: string;
  rel?: string;
};

interface MadrasahJourneyCTAProps {
  data: JourneyCtaData;
}

export default function MadrasahJourneyCTA({ data }: MadrasahJourneyCTAProps) {
  if (!data.enableSection) return null;

  return (
    <div className="journey-section relative">
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30 bg-repeat"
          style={{
            backgroundImage: "url('/assets/services/bg-pattern.png')",
            backgroundSize: '154px 154px',
          }}
        />
      </div>
      <div className="section-padding journey-inner z-2 relative">
        <div className="journey-content">
          {/* Title */}
          <div className="journey-title">{data.title}</div>

          {/* Description */}
          <div className="journey-desc-wrap">
            <div
              className="journey-desc"
              dangerouslySetInnerHTML={{
                __html: data.description.replace(/\n/g, '<br/>'),
              }}
            />
          </div>

          {/* Buttons */}
          <div className="journey-buttons">
            <Link
              href={data.primaryButtonUrl || '#'}
              target={data.target}
              rel={data.rel || (data.target === '_blank' ? 'noopener noreferrer' : undefined)}
              className="journey-btn journey-btn-primary"
            >
              <div className="journey-btn-shadow" />
              <span className="journey-btn-primary-text">
                {data.primaryButtonText}
              </span>
            </Link>

            <Link
              href={data.secondaryButtonUrl || '#'}
              target={data.target}
              rel={data.rel || (data.target === '_blank' ? 'noopener noreferrer' : undefined)}
              className="journey-btn journey-btn-secondary"
            >
              <span className="journey-btn-secondary-text">
                {data.secondaryButtonText}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
