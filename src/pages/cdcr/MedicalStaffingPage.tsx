import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Stethoscope, CheckCircle2, ArrowRight } from 'lucide-react';

const MEDICAL_ROLES = [
  { role: 'Physicians (MD / DO)', desc: 'Board-certified or board-eligible practitioners in Internal Medicine, Family Medicine, and Emergency Medicine providing primary and urgent patient care.' },
  { role: 'Nurse Practitioners (NP)', desc: 'Advanced practice registered nurses performing patient evaluations, managing treatment regimens, and ordering diagnostic tests.' },
  { role: 'Physician Assistants (PA)', desc: 'Certified clinicians practicing medicine in collaboration with supervising physicians across triage and chronic care clinics.' },
  { role: 'Registered Nurses (RN)', desc: 'Essential nursing leadership administering medications, performing health assessments, triaging emergencies, and leading clinical care plans.' },
  { role: 'Licensed Vocational Nurses (LVN)', desc: 'Dependable clinical support delivering routine treatments, direct patient monitoring, intake documentation, and medication rounds.' },
];

export function MedicalStaffingPage() {
  return (
    <div className="medical-staffing-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Medical Staffing' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Clinical Excellence</span>
            <h1>Medical &amp; Nursing Staffing for Institutional Care</h1>
            <p className="page-hero__subtitle">
              Supplying fully licensed physicians, nurse practitioners, physician assistants, registered nurses, and licensed vocational nurses to state and correctional healthcare environments.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Medical Staffing
              </Link>
              <Link to="/hot-jobs" className="btn btn--outline-white btn--md">
                Explore Medical Positions
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Medical Disciplines</span>
            <h2>Healthcare Professionals We Place</h2>
            <p className="section-heading__subtitle">
              Every medical candidate undergoes primary source credentialing, background review, and licensing verification before placement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {MEDICAL_ROLES.map((item) => (
              <div key={item.role} className="service-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Stethoscope size={22} style={{ color: 'var(--color-navy)' }} />
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)' }}>{item.role}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 8, border: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 6 }}>
                Need Qualified Medical Staff for Your Facility?
              </h3>
              <p style={{ fontSize: 15, color: 'var(--color-gray-600)' }}>
                Tell us your staffing requirements, required credentials, and shift needs.
              </p>
            </div>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--md">
              <span>Request Medical Staffing</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
