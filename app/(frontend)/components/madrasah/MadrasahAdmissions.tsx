import Link from 'next/link';
import './MadrasahAdmissions.css';

type FeePoint = {
  id?: string | null;
  text: string;
};

type AdmissionsData = {
  enableSection?: boolean | null;
  title: string;
  description: string;
  /* Eligibility card */
  eligibilityAgeRange: string;
  eligibilityAgeUnit: string;
  eligibilityBody: string;
  /* Process card */
  processHeadline: string;
  processBody: string;
  /* Fees card */
  feesBadgeLabel: string;
  feesBody: string;
  feePoints?: FeePoint[] | null;
  feesHardshipNote: string;
  feesCtaText: string;
  feesCtaUrl?: string | null;
};

interface MadrasahAdmissionsProps {
  data: AdmissionsData;
  target?: string;
  rel?: string;
}

export default function MadrasahAdmissions({ data, target, rel }: MadrasahAdmissionsProps) {
  if (!data.enableSection) return null;

  const feePoints = data.feePoints ?? [];

  return (
    <div id="enroll" className="adm-section relative">
      <div id="apply" className="absolute -top-24" />
      <div className="section-padding adm-inner">
        {/* Header */}
        <div className="adm-header">
          <div className="adm-title">{data.title}</div>
          <div className="adm-desc-wrap">
            <div className="adm-desc">{data.description}</div>
          </div>
        </div>

        {/* Three cards */}
        <div className="adm-cards">
          {/* ── Card 1: Eligibility ── */}
          <div className="adm-card">
            <div className="adm-card-label">Eligibility</div>
            <div className="adm-card-value">
              {data.eligibilityAgeRange}
              <span className="adm-card-unit">{data.eligibilityAgeUnit}</span>
            </div>
            <div
              className="adm-card-body"
              dangerouslySetInnerHTML={{
                __html: data.eligibilityBody
                  .replace(/\n\n/g, '<br/><br/>')
                  .replace(/\n/g, '<br/>'),
              }}
            />
          </div>

          {/* ── Card 2: Process ── */}
          <div className="adm-card">
            <div className="adm-card-label">Process</div>
            <div className="adm-card-value-yellow">{data.processHeadline}</div>
            <div
              className="adm-card-body"
              dangerouslySetInnerHTML={{
                __html: data.processBody
                  .replace(/\n\n/g, '<br/><br/>')
                  .replace(/\n/g, '<br/>'),
              }}
            />
          </div>

          {/* ── Card 3: Fees (featured) ── */}
          <div className="adm-card-featured">
            <div className="absolute left-0 top-0 w-full h-full bg-white rounded-[24px] shadow-2xl z-[-1]" />

            {/* Badge */}
            <div className="adm-badge">
              <span className="adm-badge-text">{data.feesBadgeLabel}</span>
            </div>

            <div
              className="adm-card-body"
              style={{ paddingTop: '8px' }}
              dangerouslySetInnerHTML={{
                __html: data.feesBody.replace(/\n/g, '<br/>'),
              }}
            />

            {/* Bullet points */}
            {feePoints.length > 0 && (
              <div className="adm-fee-points">
                {feePoints.map((point, idx) => (
                  <div key={point.id ?? idx} className="adm-fee-row">
                    <div className="adm-fee-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="adm-fee-text">{point.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Hardship note */}
            {data.feesHardshipNote && (
              <div className="adm-hardship">{data.feesHardshipNote}</div>
            )}

            {/* CTA */}
            <Link
              href="mailto:masjid@masjid-alfalah.org.uk?subject=Admissions%20Enquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="adm-cta-btn"
            >
              <span className="adm-cta-btn-text">
                {data.feesCtaText || 'Apply Now'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
