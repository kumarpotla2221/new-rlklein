import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Stethoscope, DollarSign, Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ProfessionalsMainPage() {
  return (
    <div className="professionals-main-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Healthcare Professionals' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>For Clinical Practitioners</span>
            <h1>Advance Your Career in High-Impact Healthcare Settings</h1>
            <p className="page-hero__subtitle">
              R.L. Klein &amp; Associates connects Physicians, Registered Nurses, Mental Health Clinicians, Dentists, and Allied Health practitioners with dependable, rewarding institutional opportunities.
            </p>
            <div className="page-hero__actions">
              <Link to="/hot-jobs" className="btn btn--accent btn--md">
                <span>Browse Find Your Next Role</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/apply" className="btn btn--outline-white btn--md">
                Direct Application (No Login)
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="difference-layout">
            <div>
              <span className="eyebrow">Candidate Experience</span>
              <h2 style={{ marginTop: 8, marginBottom: 20 }}>
                Low Friction. Dedicated Support.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                We respect your time as a clinician. Unlike automated platforms requiring account creation and password portals, R.L. Klein operates with direct, human-driven recruitment.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 24 }}>
                Search available opportunities, apply in minutes with your resume, and connect one-on-one with a dedicated recruitment coordinator who guides you through credentialing, scheduling, and onboarding.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
                  <span style={{ fontSize: 15, color: 'var(--color-navy)', fontWeight: 600 }}>No candidate login or portal registration required</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
                  <span style={{ fontSize: 15, color: 'var(--color-navy)', fontWeight: 600 }}>Competitive compensation with dependable payroll</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
                  <span style={{ fontSize: 15, color: 'var(--color-navy)', fontWeight: 600 }}>Full credentialing guidance and administrative support</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 20 }}>
                Candidate Resources &amp; Pathways
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li>
                  <Link to="/healthcare-professionals/how-it-works" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600 }}>
                    <span>How It Works (6 Step Placement Journey)</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    From exploration and recruiter conversation to assignment deployment.
                  </p>
                </li>
                <li>
                  <Link to="/healthcare-professionals/pay-benefits" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600 }}>
                    <span>Pay &amp; Benefits Information</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Payroll schedules, direct deposit, and clinical support.
                  </p>
                </li>
                <li>
                  <Link to="/healthcare-professionals/recruiters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600 }}>
                    <span>Meet Our Recruiters</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    Connect directly with specialized healthcare talent coordinators.
                  </p>
                </li>
                <li>
                  <Link to="/healthcare-professionals/credentialing-onboarding" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-navy)', fontWeight: 600 }}>
                    <span>Credentialing &amp; Onboarding</span>
                    <ArrowRight size={16} />
                  </Link>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-600)', marginTop: 4 }}>
                    What documents and license verifications are required.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
