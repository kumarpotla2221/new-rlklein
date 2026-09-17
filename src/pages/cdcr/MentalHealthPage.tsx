import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';

const BEHAVIORAL_ROLES = [
  { role: 'Psychiatrists (MD / DO)', desc: 'Board-certified psychiatrists diagnosing complex disorders, managing psychotropic medications, and conducting psychiatric crisis evaluations.' },
  { role: 'Clinical Psychologists (PhD / PsyD)', desc: 'Licensed psychologists delivering cognitive behavioral therapy, conducting formal psychological testing, and risk assessments.' },
  { role: 'Licensed Clinical Social Workers (LCSW)', desc: 'Providing individual and group therapy, crisis intervention, treatment planning, and discharge coordination.' },
  { role: 'Licensed Marriage & Family Therapists (LMFT)', desc: 'Licensed clinicians addressing relational dynamics, behavioral coping mechanisms, and emotional regulation.' },
  { role: 'Licensed Professional Clinical Counselors (LPCC)', desc: 'Specialized counseling professionals delivering evidence-based clinical interventions.' },
];

export function MentalHealthPage() {
  return (
    <div className="mental-health-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Mental & Behavioral Health' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Behavioral Health Workforce</span>
            <h1>Mental &amp; Behavioral Health Staffing Solutions</h1>
            <p className="page-hero__subtitle">
              Supplying credentialed psychiatrists, psychologists, LCSWs, LMFTs, and behavioral health clinicians to institutional healthcare facilities across California.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Behavioral Staffing
              </Link>
              <Link to="/hot-jobs" className="btn btn--outline-white btn--md">
                View Mental Health Openings
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Clinical Specialties</span>
            <h2>Behavioral Health Professionals We Place</h2>
            <p className="section-heading__subtitle">
              Compassionate, trauma-informed, and resilient clinicians prepared for the distinct needs of institutional environments.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {BEHAVIORAL_ROLES.map((item) => (
              <div key={item.role} className="service-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HeartPulse size={22} style={{ color: 'var(--color-navy)' }} />
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)' }}>{item.role}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 8, border: '1px solid var(--color-gray-200)' }}>
            <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 12 }}>
              Dedicated Behavioral Support for Public Facilities
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-gray-700)', marginBottom: 20 }}>
              Correctional mental health programs face rigorous compliance standards and active interdisciplinary treatment teams. Our recruiters specialize in matching experienced clinicians with positions where their therapeutic skills create meaningful stability.
            </p>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--md">
              Request Behavioral Health Staffing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
