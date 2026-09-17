import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { ShieldCheck, CheckCircle2, ArrowRight, FileCheck, Award, Lock, FileSearch } from 'lucide-react';

const CREDENTIALING_PROCESS = [
  { step: '01', title: 'APPLICATION', desc: 'Direct candidate submission without account friction or candidate login.' },
  { step: '02', title: 'QUALIFICATION REVIEW', desc: 'Initial recruiter screening assessing clinical scope, background, and alignment with facility needs.' },
  { step: '03', title: 'CREDENTIALING', desc: 'Primary source verification of active, unrestricted state licensure and degree verifications.' },
  { step: '04', title: 'DOCUMENT VERIFICATION', desc: 'TB screening, immunization records, BLS/ACLS certifications, and photo identification.' },
  { step: '05', title: 'FACILITY REQUIREMENTS', desc: 'State Department of Corrections security clearance, fingerprinting, and institutional background check.' },
  { step: '06', title: 'ONBOARDING', desc: 'Orientation on facility policies, security protocols, safety procedures, and initial assignment scheduling.' },
];

export function ComplianceCredentialingPage() {
  return (
    <div className="compliance-credentialing-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Compliance & Credentialing' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Quality Assurance</span>
            <h1>Compliance &amp; Credentialing Standards</h1>
            <p className="page-hero__subtitle">
              Every healthcare professional placed by R.L. Klein &amp; Associates undergoes thorough, multi-stage credential verification to ensure clinical safety, legal compliance, and facility readiness.
            </p>
          </div>
        </div>
      </header>

      {/* Visual Process Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Visual Roadmap</span>
            <h2>Six-Stage Credentialing &amp; Onboarding Model</h2>
            <p className="section-heading__subtitle">
              Structured to maintain absolute compliance with state healthcare mandates and institutional security requirements.
            </p>
          </div>

          <div className="process-flow">
            {CREDENTIALING_PROCESS.map((p) => (
              <div key={p.step} className="process-step">
                <span className="process-step__num">{p.step}</span>
                <h3 className="process-step__title">{p.title}</h3>
                <p className="process-step__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Pillars */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Our Credentialing Pillars</span>
            <h2>How We Protect Facility Integrity</h2>
            <p className="section-heading__subtitle">
              Our compliance protocols reflect four decades of direct experience with state contracts and correctional oversight.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            <div className="service-card">
              <FileSearch size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Primary Source License Verification</h3>
              <p>We directly verify active standing, expiration dates, and any historical disciplinary actions with state licensing boards before presenting any candidate.</p>
            </div>

            <div className="service-card">
              <Award size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Competency &amp; Clinical Scope Review</h3>
              <p>Structured clinical interviews and peer reference verifications confirming candidates have demonstrated competency in their specialty areas.</p>
            </div>

            <div className="service-card">
              <Lock size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Security Clearance &amp; Background Screening</h3>
              <p>Thorough criminal history background screening, OIG/SAM exclusion checks, and state department of corrections clearance documentation.</p>
            </div>

            <div className="service-card">
              <FileCheck size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Assignment Readiness Check</h3>
              <p>Verification that health screenings (TB, immunizations), CPR/BLS certifications, and photo identification are fully current prior to day one.</p>
            </div>
          </div>

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link to="/contact" className="btn btn--primary btn--md">
              <span>Inquire About Credentialing Protocols</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
