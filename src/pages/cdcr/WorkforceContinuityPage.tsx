import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Users2, CalendarCheck2, Clock, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';

export function WorkforceContinuityPage() {
  return (
    <div className="workforce-continuity-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Workforce Continuity' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Operational Stability</span>
            <h1>Workforce Continuity for Healthcare Facilities</h1>
            <p className="page-hero__subtitle">
              Ensuring uninterrupted patient care and shift coverage across correctional and government healthcare institutions through proactive talent pipelines and dependable staffing support.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Continuity Staffing
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="difference-layout">
            <div>
              <span className="eyebrow">The Continuity Challenge</span>
              <h2 style={{ marginTop: 8, marginBottom: 20 }}>
                Why Workforce Continuity Matters in Institutional Healthcare
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                In 24/7 institutional healthcare settings, unexpected vacancies or turnover disrupt patient monitoring, increase mandatory overtime for permanent staff, and threaten regulatory compliance.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)' }}>
                R.L. Klein &amp; Associates acts as a reliable staffing buffer. We maintain relationships with qualified medical, nursing, and behavioral professionals who are credentialed and ready to deploy for temporary, per diem, or long-term coverage.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 12, border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <CalendarCheck2 size={24} style={{ color: 'var(--color-navy)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)', marginBottom: 4 }}>Proactive Pipeline Planning</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>Anticipating seasonal shift shortages, leaves of absence, and regional staffing surges.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <Users2 size={24} style={{ color: 'var(--color-navy)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)', marginBottom: 4 }}>Assignment Retention Support</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>Regular check-ins with deployed clinicians to address concerns and support shift satisfaction.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <PhoneCall size={24} style={{ color: 'var(--color-navy)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)', marginBottom: 4 }}>Responsive Recruiter Coordination</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>Direct point-of-contact for facility schedulers and clinical directors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
