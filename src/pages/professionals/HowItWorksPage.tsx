import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { ArrowRight, Search, PhoneCall, FileText, ShieldCheck, CheckCircle2, HeartHandshake } from 'lucide-react';

const CANDIDATE_STEPS = [
  {
    step: '01',
    title: 'Explore Opportunities',
    desc: 'Browse our live Hot Jobs directory by profession, setting, shift, and specialty. No account or password required.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Connect With a Recruiter',
    desc: 'Speak directly with an experienced healthcare recruiter who understands institutional workflows and your career goals.',
    icon: PhoneCall,
  },
  {
    step: '03',
    title: 'Application & Qualification',
    desc: 'Complete our streamlined direct application form and upload your resume for review.',
    icon: FileText,
  },
  {
    step: '04',
    title: 'Credentialing',
    desc: 'Our credentialing specialists verify active state licenses, certifications, and background clearances.',
    icon: ShieldCheck,
  },
  {
    step: '05',
    title: 'Assignment & Onboarding',
    desc: 'Complete facility-specific security orientation, receive your schedule, and begin clinical placement.',
    icon: CheckCircle2,
  },
  {
    step: '06',
    title: 'Ongoing Support',
    desc: 'Benefit from regular coordinator check-ins, prompt payroll processing, and renewal coordination.',
    icon: HeartHandshake,
  },
];

export function HowItWorksPage() {
  return (
    <div className="how-it-works-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Healthcare Professionals', href: '/healthcare-professionals' },
          { label: 'How It Works' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Placement Journey</span>
            <h1>Your Next Healthcare Opportunity Starts Here</h1>
            <p className="page-hero__subtitle">
              A transparent, step-by-step roadmap from initial job search to day one on assignment.
            </p>
            <div className="page-hero__actions">
              <Link to="/hot-jobs" className="btn btn--accent btn--md">
                Search Healthcare Jobs
              </Link>
              <Link to="/contact" className="btn btn--outline-white btn--md">
                Talk to a Recruiter
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Six Simple Steps</span>
            <h2>How Our Placement Process Works</h2>
            <p className="section-heading__subtitle">
              Built to remove bureaucratic friction and ensure you step into an assignment with complete clarity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {CANDIDATE_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="service-card" style={{ borderTop: '3px solid var(--color-violet)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="service-card__icon" aria-hidden="true">
                      <Icon size={22} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 'bold', color: 'var(--color-violet)' }}>
                      {s.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-navy)' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 54, flexWrap: 'wrap' }}>
            <Link to="/hot-jobs" className="btn btn--primary btn--lg">
              <span>Search Healthcare Jobs</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn--secondary btn--lg">
              Talk to a Recruiter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
