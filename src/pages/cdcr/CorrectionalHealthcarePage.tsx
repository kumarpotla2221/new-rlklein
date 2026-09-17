import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: '01', title: 'RECRUIT', desc: 'Sourcing qualified healthcare practitioners seeking purposeful careers in public healthcare.' },
  { step: '02', title: 'SCREEN', desc: 'Rigorous competency evaluation and structured clinical background interview.' },
  { step: '03', title: 'CREDENTIAL', desc: 'Primary source license verification, TB/health clearances, and state background checks.' },
  { step: '04', title: 'DEPLOY', desc: 'Facility-specific orientation, security briefing, and clinical schedule integration.' },
  { step: '05', title: 'SUPPORT', desc: 'Ongoing recruiter check-ins, clinical advocacy, and responsive payroll management.' },
];

export function CorrectionalHealthcarePage() {
  return (
    <div className="correctional-healthcare-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Correctional Healthcare' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Specialized Healthcare Delivery</span>
            <h1>Correctional Healthcare Staffing Built Around the Needs of California Facilities</h1>
            <p className="page-hero__subtitle">
              Providing dependable, clinically sound, and compliance-driven healthcare professionals to California correctional facilities.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Staffing
              </Link>
              <Link to="/cdcr-healthcare/opportunities" className="btn btn--outline-white btn--md">
                View Correctional Jobs
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* What is Correctional Healthcare Staffing */}
      <section className="section bg-white">
        <div className="container">
          <div className="difference-layout">
            <div>
              <span className="eyebrow">Clinical Reality</span>
              <h2 style={{ marginTop: 8, marginBottom: 20 }}>
                What Is Correctional Healthcare Staffing?
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                Correctional healthcare represents one of the most vital segments of public health in the United States. Healthcare professionals working within correctional facilities provide comprehensive primary care, chronic disease management, dental care, and psychiatric stabilization to incarcerated patients.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)' }}>
                Unlike private clinics, correctional healthcare operates within a structured institutional environment where safety protocols, security checks, and interdisciplinary collaboration with correctional staff are part of daily workflow.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 16 }}>
                Why Specialized Staffing Matters
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: 'var(--color-gray-700)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-violet)', flexShrink: 0, marginTop: 3 }} />
                  <span>Institutional orientation ensuring professionals understand safety protocols and security standards.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: 'var(--color-gray-700)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-violet)', flexShrink: 0, marginTop: 3 }} />
                  <span>Strict adherence to state documentation standards, formulary guidelines, and court-mandated care benchmarks.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: 'var(--color-gray-700)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-violet)', flexShrink: 0, marginTop: 3 }} />
                  <span>Reduced turnover through realistic candidate expectations and transparent orientation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Structured Delivery Model</span>
            <h2>The R.L. Klein Approach</h2>
            <p className="section-heading__subtitle">
              A disciplined five-phase process ensuring every healthcare placement is compliant, prepared, and supported.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {WORKFLOW_STEPS.map((s) => (
              <div key={s.step} className="process-step">
                <span className="process-step__num">{s.step}</span>
                <h3 className="process-step__title">{s.title}</h3>
                <p className="process-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--lg">
              <span>Request Staffing for Your Facility</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
