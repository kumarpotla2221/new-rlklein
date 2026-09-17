import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Activity, ArrowRight } from 'lucide-react';

const ALLIED_DISCIPLINES = [
  { name: 'Pharmacy & Pharmacists', desc: 'Licensed pharmacists and pharmacy technicians managing institutional medication dispensing, drug interactions, and strict formulary control.' },
  { name: 'Laboratory Technologists', desc: 'Clinical laboratory scientists conducting diagnostic hematology, chemistry, microbiology, and rapid testing.' },
  { name: 'Radiology Technologists', desc: 'Certified radiologic technologists operating institutional X-ray, fluoroscopy, and diagnostic imaging equipment.' },
  { name: 'Physical Therapy (PT / PTA)', desc: 'Licensed physical therapists providing musculoskeletal rehabilitation, mobility assessments, and therapeutic exercise.' },
  { name: 'Occupational Therapy (OT)', desc: 'Occupational therapists facilitating functional independence and adaptive daily living evaluations.' },
  { name: 'Respiratory Therapy (RT)', desc: 'Respiratory care practitioners delivering pulmonary rehabilitation, ventilator management, and emergency airway support.' },
  { name: 'Optometry', desc: 'Licensed optometrists conducting visual acuity exams, refractive corrections, and diabetic retinopathy screening.' },
  { name: 'Rehabilitation Specialists', desc: 'Multi-disciplinary rehabilitation therapists supporting long-term restorative care plans.' },
];

export function AlliedHealthPage() {
  return (
    <div className="allied-health-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Allied Health' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Ancillary Healthcare Support</span>
            <h1>Allied Healthcare Workforce Solutions</h1>
            <p className="page-hero__subtitle">
              Supplying specialized allied health practitioners across pharmacy, radiology, laboratory, and therapy disciplines to institutional healthcare facilities.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Allied Staffing
              </Link>
              <Link to="/hot-jobs" className="btn btn--outline-white btn--md">
                View Allied Positions
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Disciplines Supported</span>
            <h2>Allied Health Disciplines We Place</h2>
            <p className="section-heading__subtitle">
              Carefully vetted practitioners meeting strict state clinical competency and institutional readiness guidelines.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {ALLIED_DISCIPLINES.map((d) => (
              <div key={d.name} className="service-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Activity size={22} style={{ color: 'var(--color-navy)' }} />
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)' }}>{d.name}</h3>
                </div>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 8, border: '1px solid var(--color-gray-200)', textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 8 }}>
              Need Specialized Allied Healthcare Coverage?
            </h3>
            <p style={{ fontSize: 15, color: 'var(--color-gray-600)', maxWidth: 640, margin: '0 auto 20px' }}>
              Connect with our recruitment coordinators to discuss specific facility credentialing requirements and scheduling models.
            </p>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--md">
              <span>Submit Staffing Requirement</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
