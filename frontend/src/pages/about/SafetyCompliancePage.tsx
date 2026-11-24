import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ExternalLink, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Typography';

const COMMITMENTS = [
  {
    title: 'Rigorous Credentialing',
    text: 'Every clinician\'s licensure, certification, education, and competency is verified through primary sources before placement.',
  },
  {
    title: 'Ongoing Competency Review',
    text: 'We assess and reassess performance continuously, integrating client feedback into structured evaluations for each assigned professional.',
  },
  {
    title: 'Regulatory Compliance',
    text: 'Our practices comply with federal, state, and local requirements, including HIPAA privacy and confidentiality obligations.',
  },
  {
    title: 'Incident & Event Tracking',
    text: 'We document, track, and analyze safety events, then report them appropriately to clients, regulators, and The Joint Commission.',
  },
  {
    title: 'Performance Improvement',
    text: 'Data from feedback, incidents, and assessments drives an annual improvement plan that measurably strengthens our services.',
  },
];

const SAFETY_GOALS = [
  ['Accuracy of Patient Identification', 'Verify patient identity using two identifiers.'],
  ['Safe Medication Use', 'Proper labeling, storage, and administration.'],
  ['Infection Prevention', 'Hand hygiene and standard precautions.'],
  ['Safe Surgery', 'Team communication and checklists.'],
  ['Preventing Wrong-Site Surgery', 'Surgical site marking and verification.'],
  ['Patient Fall Prevention', 'Risk assessment and protective measures.'],
  ['Alarm Management', 'Proper use and monitoring of clinical alarms.'],
];

export function SafetyCompliancePage() {
  return (
    <div className="safety-compliance-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Safety & Compliance' }]} />

      <header className="page-hero page-hero--dark">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Quality, Safety &amp; Accountability</span>
            <h1>A standard of care worth speaking up for.</h1>
            <p className="page-hero__subtitle">
              R.L. Klein &amp; Associates is committed to meeting The Joint Commission&apos;s Standards for Healthcare Staffing Services and to protecting every voice that safeguards patient safety.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="safety-notice">
            <div className="safety-notice__icon"><ShieldCheck size={28} /></div>
            <div>
              <span className="eyebrow">Public notice</span>
              <h2>Notice No. RLK-HCSS-CPR-06</h2>
              <p><strong>Audience:</strong> Public &middot; Clients &middot; Clinical Staff</p>
              <p><strong>Standard:</strong> The Joint Commission &mdash; CPR.06</p>
            </div>
          </div>

          <div className="safety-report-grid">
            <div>
              <span className="eyebrow">Your right to report</span>
              <h2>Report a concern to The Joint Commission.</h2>
              <p>
                We welcome your feedback and work diligently to resolve concerns within our organization. If a concern about the quality or safety of care provided by R.L. Klein &amp; Associates staff has not been resolved to your satisfaction by RLK management, you have the right to report it directly to The Joint Commission at any time.
              </p>
              <p className="safety-emphasis">Reporting is voluntary and may be made anonymously. You are not required to notify RLK before contacting The Joint Commission.</p>
            </div>
            <div className="safety-contact-card">
              <a href="https://jointcommission.org/report-a-complaint" target="_blank" rel="noreferrer" className="safety-contact-card__row">
                <span><strong>Online</strong><small>Submit a report online &mdash; anonymously if you prefer.</small></span>
                <ExternalLink size={17} />
              </a>
              <div className="safety-contact-card__row"><span><strong>By Phone</strong><small>1-800-994-6610<br />Office of Quality and Patient Safety</small></span><Phone size={17} /></div>
              <a href="https://www.jointcommission.org/en" target="_blank" rel="noreferrer" className="safety-contact-card__row"><span><strong>Website</strong><small>www.jointcommission.org<br />Learn more about the reporting process.</small></span><ExternalLink size={17} /></a>
              <div className="safety-contact-card__row"><span><strong>By Mail</strong><small>The Joint Commission Office of Quality and Patient Safety<br />One Renaissance Boulevard<br />Oakbrook Terrace, IL 60181</small></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Our commitment</span>
            <h2>Quality built into every placement.</h2>
            <p className="section-heading__subtitle">
              Serving government healthcare clients since 1984, we hold our operations to national standards for quality, competency, and patient safety &mdash; before, during, and after every assignment.
            </p>
          </div>
          <div className="safety-commitment-grid">
            {COMMITMENTS.map((commitment) => (
              <article className="service-card" key={commitment.title}>
                <CheckCircle2 size={25} style={{ color: 'var(--color-violet)' }} />
                <h3>{commitment.title}</h3>
                <p>{commitment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="safety-retaliation">
            <div>
              <span className="eyebrow">Protection against retaliation</span>
              <h2>Your good-faith report is protected.</h2>
            </div>
            <p>
              R.L. Klein &amp; Associates takes no retaliatory or disciplinary action against any employee, healthcare professional, client, or individual who reports a quality or safety concern in good faith. This commitment is communicated to all RLK employees and assigned professionals through our Employee Handbook, orientation, and ongoing compliance training. Open communication about safety leads to better outcomes for patients and staff alike.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Prefer to reach us first?</span>
            <h2>Report a concern to RLK.</h2>
            <p className="section-heading__subtitle">
              We encourage you to contact us directly so we can address your concern promptly. We acknowledge every report, investigate thoroughly, and share our findings.
            </p>
          </div>
          <div className="safety-team-grid">
            <div className="safety-team-card"><span>Account Team</span><h3>Lindsey Jabbora</h3><a href="tel:5624275577"><Phone size={15} /> 562-427-5577</a><small>Mon&ndash;Fri, business hours</small></div>
            <div className="safety-team-card"><span>Client Operations</span><h3>Vincent Jones</h3><a href="mailto:info@rlklein.com"><Mail size={15} /> info@rlklein.com</a><a href="tel:5624275577"><Phone size={15} /> 562-427-5577</a></div>
            <div className="safety-team-card"><span>Compliance</span><h3>Compliance Manager</h3><a href="mailto:info@rlklein.com"><Mail size={15} /> info@rlklein.com</a><a href="tel:5624275577"><Phone size={15} /> 562-427-5577</a></div>
            <div className="safety-team-card"><span>After Hours</span><h3>Emergency Line</h3><a href="tel:5625127740"><Phone size={15} /> 562-512-7740</a><small>Outside business hours</small></div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">The framework we follow</span>
            <h2>Joint Commission Standards for Healthcare Staffing Services.</h2>
            <p className="section-heading__subtitle">
              These standards shape how we recruit, credential, place, and monitor the clinical professionals we serve you with.
            </p>
          </div>
          <div className="safety-framework">
            <div><h3>Human Resources Management (HSHR)</h3><p>We verify the qualifications, competencies, and health status of every professional before placement, maintain individual credentialing files, and conduct ongoing performance evaluations grounded in clinical feedback.</p></div>
            <div><h3>Culture, Performance &amp; Reporting (CPR)</h3><p>We maintain a culture where quality concerns can be raised, reviewed, documented, and addressed through clear reporting and performance improvement processes.</p></div>
            <div><h3>Information Management</h3><p>We protect the accuracy, confidentiality, and availability of information used to support safe staffing and compliant operations.</p></div>
            <div><h3>Performance Measurement &amp; Improvement</h3><p>We use measurable feedback, incident information, and evaluation results to improve the quality and reliability of our services.</p></div>
          </div>
        </div>
      </section>

      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">National Patient Safety Goals</span>
            <h2>Safety practices built into orientation and training.</h2>
            <p className="section-heading__subtitle">
              R.L. Klein &amp; Associates incorporates The Joint Commission&apos;s National Patient Safety Goals into all staff orientation and ongoing compliance training. These goals address critical safety practices including:
            </p>
          </div>
          <div className="safety-goals-grid">
            {SAFETY_GOALS.map(([title, text]) => <div className="safety-goal" key={title}><CheckCircle2 size={19} /><div><h3>{title}</h3><p>{text}</p></div></div>)}
          </div>
          <p className="safety-training-note">All RLK clinical staff receive documented training on applicable NPSGs relevant to their assigned roles and settings.</p>
        </div>
      </section>

      <section className="section bg-navy text-white">
        <div className="container safety-final-cta">
          <span className="eyebrow" style={{ color: '#A0B8E8' }}>Questions about quality or safety?</span>
          <h2>We are here to listen and respond.</h2>
          <p>Contact our team directly or learn more about our credentialing and compliance practices.</p>
          <div className="safety-final-cta__actions"><a href="mailto:info@rlklein.com" className="btn btn--accent btn--md"><Mail size={16} /> Contact RLK</a><Link to="/healthcare-professionals/credentialing-onboarding" className="btn btn--outline-white btn--md">Credentialing &amp; Onboarding <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </div>
  );
}
