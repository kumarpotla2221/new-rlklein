import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const DETAILED_STAGES = [
  {
    num: '01',
    title: 'APPLICATION',
    summary: 'Candidate identifies a matching position or submits credentials through our low-friction direct application without needing candidate passwords.',
    details: 'You provide basic contact details, your primary profession, state license information, and upload your current CV or resume.',
  },
  {
    num: '02',
    title: 'QUALIFICATION REVIEW',
    summary: 'Recruiter review of clinical background, clinical scope experience, shift preferences, and facility alignment.',
    details: 'A dedicated coordinator reviews your submission, verifies target facility requirements, and initiates initial phone contact.',
  },
  {
    num: '03',
    title: 'CREDENTIALING',
    summary: 'Primary source license check with state licensing boards (BRN, Medical Board, Dental Board, BBS).',
    details: 'Our credentialing specialists directly confirm active, unrestricted licensing and check National Practitioner Data Bank (NPDB) when applicable.',
  },
  {
    num: '04',
    title: 'DOCUMENT VERIFICATION',
    summary: 'Collection and verification of required health clearances, TB testing, and clinical certifications.',
    details: 'Verification of BLS/ACLS/CPR certifications, TB skin/blood testing within 12 months, and valid government-issued photo identification.',
  },
  {
    num: '05',
    title: 'FACILITY REQUIREMENTS',
    summary: 'State Department of Corrections security clearance, fingerprinting, and institutional background screening.',
    details: 'Completion of required state institutional forms, background questionnaires, and fingerprint-based live scan clearances.',
  },
  {
    num: '06',
    title: 'ONBOARDING',
    summary: 'Orientation on institutional safety protocols, medical record systems, and administrative expectations.',
    details: 'Detailed briefing on correctional safety rules, emergency alarm systems, key control, and clinical documentation guidelines.',
  },
  {
    num: '07',
    title: 'ASSIGNMENT',
    summary: 'First shift coordination, facility escort introduction, and continuous ongoing recruiter advocacy.',
    details: 'You begin your clinical shift with full confirmation details, shift supervisor contacts, and regular coordinator check-ins.',
  },
];

export function CredentialingOnboardingPage() {
  return (
    <div className="credentialing-onboarding-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Healthcare Professionals', href: '/healthcare-professionals' },
          { label: 'Credentialing & Onboarding' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Clinical Readiness</span>
            <h1>Credentialing &amp; Onboarding Roadmap</h1>
            <p className="page-hero__subtitle">
              A transparent, rigorous verification process that prepares healthcare professionals for clinical excellence in institutional healthcare facilities.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Step-by-Step Overview</span>
            <h2>Seven-Stage Placement Lifecycle</h2>
            <p className="section-heading__subtitle">
              From application to day one on shift, our credentialing coordinators support every step.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 880, margin: '0 auto' }}>
            {DETAILED_STAGES.map((s) => (
              <div key={s.num} className="admin-card" style={{ padding: 28, display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 'bold', color: 'var(--color-violet)', textAlign: 'center', lineHeight: 1 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', marginBottom: 8 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-gray-800)', fontWeight: 500, marginBottom: 8, lineHeight: 1.5 }}>
                    {s.summary}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                    {s.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/apply" className="btn btn--primary btn--lg">
              <span>Begin Your Application Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
