import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { ArrowRight, ShieldCheck, Stethoscope, HeartPulse, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export function CDCRMainPage() {
  return (
    <div className="cdcr-main-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'CDCR Healthcare' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Public Sector Healthcare Partnership</span>
            <h1>CDCR Healthcare Staffing &amp; Workforce Solutions</h1>
            <p className="page-hero__subtitle">
              Delivering specialized, compliant healthcare professionals to California Department of Corrections and Rehabilitation facilities. For over four decades, R.L. Klein has supported institutional healthcare continuity across the state.
            </p>
            <div className="page-hero__actions">
              <Link to="/cdcr-healthcare/opportunities" className="btn btn--accent btn--md">
                <span>View CDCR Healthcare Openings</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/facilities/staffing-request" className="btn btn--outline-white btn--md">
                Request Healthcare Staffing
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Core Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className="difference-layout">
            <div>
              <span className="eyebrow">Institutional Focus</span>
              <h2 style={{ marginTop: 8, marginBottom: 20 }}>
                Specialized Staffing for California State Facilities
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                Staffing within institutional and correctional healthcare environments demands distinct procedural rigor, specialized orientation, and stringent compliance benchmarks.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 24 }}>
                R.L. Klein &amp; Associates maintains continuous active registries of credentialed medical, behavioral, dental, and allied health professionals prepared for the distinct clinical requirements of California facilities.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={20} style={{ color: 'var(--color-violet)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Full State Regulatory &amp; Mandate Compliance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-violet)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Zero Friction for Candidates &middot; Rapid Recruiter Response</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Building2 size={20} style={{ color: 'var(--color-violet)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Serving Northern, Central, and Southern California Facilities</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-off-white)', padding: 36, borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: 22, color: 'var(--color-navy)', marginBottom: 16 }}>
                Key Healthcare Divisions
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li>
                  <Link to="/cdcr-healthcare/correctional-healthcare" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600, fontSize: 15 }}>
                    <span>Correctional Healthcare Principles</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Orientation, institutional culture, and clinical workflows.
                  </p>
                </li>
                <li>
                  <Link to="/cdcr-healthcare/medical-staffing" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600, fontSize: 15 }}>
                    <span>Medical &amp; Nursing Staffing</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Physicians, RNs, LVNs, and Advanced Practice Providers.
                  </p>
                </li>
                <li>
                  <Link to="/cdcr-healthcare/mental-behavioral-health" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600, fontSize: 15 }}>
                    <span>Mental &amp; Behavioral Health</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Psychiatrists, Psychologists, LCSWs, LMFTs, and clinical counselors.
                  </p>
                </li>
                <li>
                  <Link to="/cdcr-healthcare/dental-healthcare" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600, fontSize: 15 }}>
                    <span>Dental Healthcare Services</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Dentists, hygienists, and chairside assistants.
                  </p>
                </li>
                <li>
                  <Link to="/cdcr-healthcare/compliance-credentialing" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600, fontSize: 15 }}>
                    <span>Compliance &amp; Credentialing Process</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    6-stage qualification verification and onboarding roadmap.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Grid */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Comprehensive Coverage</span>
            <h2>Supported Clinical Specialties</h2>
            <p className="section-heading__subtitle">
              Tailored workforce models for medical clinics, urgent care units, chronic care clinics, and specialized housing units.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <Stethoscope size={24} style={{ color: 'var(--color-navy)' }} />
              <h3>Primary Care &amp; Chronic Disease</h3>
              <p>Management of hypertension, diabetes, infectious disease, and preventive health screenings.</p>
              <Link to="/cdcr-healthcare/medical-staffing" className="service-card__link">Learn more &rarr;</Link>
            </div>
            <div className="service-card">
              <HeartPulse size={24} style={{ color: 'var(--color-navy)' }} />
              <h3>Behavioral Health Interventions</h3>
              <p>Crisis triage, individual and group therapy, suicide prevention, and psychiatric medication management.</p>
              <Link to="/cdcr-healthcare/mental-behavioral-health" className="service-card__link">Learn more &rarr;</Link>
            </div>
            <div className="service-card">
              <Sparkles size={24} style={{ color: 'var(--color-navy)' }} />
              <h3>Oral &amp; Dental Health</h3>
              <p>Preventive exams, restorative dentistry, extractions, and acute pain management in correctional clinics.</p>
              <Link to="/cdcr-healthcare/dental-healthcare" className="service-card__link">Learn more &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
