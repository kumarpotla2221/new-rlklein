import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Reveal } from '../../components/ui/Reveal';
import { photo } from '../../data/images';
import { ArrowRight, Award, ClipboardList, FileText, Headset, ShieldCheck, Users } from 'lucide-react';

const HERO_POINTS = [
  { icon: Users, label: 'Qualified Professionals' },
  { icon: ShieldCheck, label: 'Compliant Placements' },
  { icon: ClipboardList, label: 'Dedicated Support' },
];

const WHY_ITEMS = [
  { icon: ShieldCheck, title: 'Safety & Security Standards', desc: 'Institutional orientation ensuring professionals understand safety protocols and security standards.' },
  { icon: FileText, title: 'Regulatory Compliance', desc: 'Strict adherence to state documentation standards, formulary guidelines, and court-mandated care benchmarks.' },
  { icon: Users, title: 'Improved Continuity of Care', desc: 'Reduced turnover through realistic candidate expectations and transparent orientation.' },
];

const STATS = [
  { value: '40+', label: 'Years of Experience' },
  { value: 'Trusted', label: 'by State & Local Facilities' },
  { value: 'Ongoing', label: 'Support & Compliance' },
];

const WORKFLOW_STEPS = [
  { step: '01', icon: Users, title: 'RECRUIT', desc: 'Sourcing qualified healthcare practitioners seeking purposeful careers in public healthcare.' },
  { step: '02', icon: FileText, title: 'SCREEN', desc: 'Rigorous competency evaluation and structured clinical background interview.' },
  { step: '03', icon: Award, title: 'CREDENTIAL', desc: 'Primary source license verification, TB/health clearances, and state background checks.' },
  { step: '04', icon: ClipboardList, title: 'DEPLOY', desc: 'Facility-specific orientation, security briefing, and clinical schedule integration.' },
  { step: '05', icon: Headset, title: 'SUPPORT', desc: 'Ongoing recruiter check-ins, clinical advocacy, and responsive payroll management.' },
];

export function CorrectionalHealthcarePage() {
  return (
    <div className="correctional-healthcare-page ch-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Correctional Healthcare', href: '/cdcr-healthcare' },
          { label: 'Correctional Healthcare' },
        ]}
      />

      {/* HERO */}
      <header className="ch-hero">
        <div className="ch-hero__media"><img src={photo('correctionalCare', 1600)} alt="" /></div>
        <div className="container">
          <div className="ch-hero__copy page-hero__content">
            <span className="eyebrow">Specialized Healthcare Delivery</span>
            <h1>Correctional Healthcare Staffing Built Around the Needs of <span>California Facilities</span></h1>
            <p className="ch-hero__subtitle">
              Providing dependable, clinically sound, and compliance-driven healthcare professionals to California correctional facilities.
            </p>
            <div className="ch-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Staffing <ArrowRight size={16} />
              </Link>
              <Link to="/cdcr-healthcare/opportunities" className="btn btn--secondary btn--md">
                View Correctional Jobs
              </Link>
            </div>
            <ul className="ch-hero__points">
              {HERO_POINTS.map(({ icon: Icon, label }) => (
                <li key={label}><Icon size={30} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {/* WHAT IS CORRECTIONAL HEALTHCARE STAFFING */}
      <section className="ch-about">
        <div className="container ch-about__inner">
          <div className="ch-about__copy">
            <span className="eyebrow">Clinical Reality</span>
            <h2>What Is Correctional <span>Healthcare Staffing?</span></h2>
            <p>
              Correctional healthcare represents one of the most vital segments of public health in the United States. Healthcare professionals working within correctional facilities provide comprehensive primary care, chronic disease management, dental care, and psychiatric stabilization to incarcerated patients.
            </p>
            <p>
              Unlike private clinics, correctional healthcare operates within a structured institutional environment where safety protocols, security checks, and interdisciplinary collaboration with correctional staff are part of daily workflow.
            </p>
          </div>

          <div className="ch-why">
            <h3>Why Specialized Staffing Matters</h3>
            <ul>
              {WHY_ITEMS.map(({ icon: Icon, title, desc }) => (
                <li key={title}>
                  <span className="ch-why__icon"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
                  <div>
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="ch-stats" aria-label="R.L. Klein at a glance">
        <div className="container ch-stats__row">
          {STATS.map(({ value, label }) => (
            <div className="ch-stat" key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      {/* 5-STEP PROCESS */}
      <section className="ch-approach">
        <div className="container">
          <Reveal className="section-heading section-heading--center">
            <span className="eyebrow">Structured Delivery Model</span>
            <h2>The R.L. Klein Approach</h2>
            <p className="section-heading__subtitle">
              A disciplined five-phase process ensuring every healthcare placement is compliant, prepared, and supported.
            </p>
          </Reveal>

          <Reveal stagger className="ch-steps">
            {WORKFLOW_STEPS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="ch-step">
                <span className="ch-step__num">{step}</span>
                <div className="ch-step__card">
                  <Icon size={28} strokeWidth={1.7} aria-hidden="true" />
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="ch-cta">
        <div className="container ch-cta__inner">
          <div className="ch-cta__copy">
            <span className="eyebrow">Partner with R.L. Klein</span>
            <h2>Reliable Healthcare Staffing for Safer, Healthier Communities.</h2>
            <p>Let us help you build a compliant, high-performing healthcare team for your correctional facility.</p>
          </div>
          <Link to="/facilities/staffing-request" className="btn btn--white btn--lg">
            <span>Request Staffing for Your Facility</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
