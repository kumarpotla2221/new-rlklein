import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Sparkles, ArrowRight } from 'lucide-react';

const DENTAL_ROLES = [
  { role: 'Dentists (DDS / DMD)', desc: 'Fully licensed dentists conducting comprehensive oral examinations, operative restorations, oral surgery, endodontic triage, and acute pain management.' },
  { role: 'Registered Dental Hygienists (RDH)', desc: 'Licensed professionals providing preventive oral prophylaxis, periodontal charting, scaling, root planing, and patient dental education.' },
  { role: 'Dental Assistants (DA / RDA)', desc: 'Skilled chairside dental assistants managing operatory sterilization, instrument preparation, digital radiography, and clinical workflow support.' },
];

export function DentalHealthcarePage() {
  return (
    <div className="dental-healthcare-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Dental Healthcare' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Oral Health Services</span>
            <h1>Dental Healthcare Staffing for Institutional Care</h1>
            <p className="page-hero__subtitle">
              Delivering licensed dentists, registered dental hygienists, and chairside dental assistants to correctional and government healthcare clinics throughout California.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Dental Staffing
              </Link>
              <Link to="/hot-jobs" className="btn btn--outline-white btn--md">
                View Dental Opportunities
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Dental Professionals</span>
            <h2>Comprehensive Oral Health Placements</h2>
            <p className="section-heading__subtitle">
              Ensuring state correctional and institutional dental clinics maintain full compliance with mandated treatment timelines and emergency access.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {DENTAL_ROLES.map((item) => (
              <div key={item.role} className="service-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={22} style={{ color: 'var(--color-navy)' }} />
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)' }}>{item.role}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--lg">
              <span>Submit Dental Staffing Requirement</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
