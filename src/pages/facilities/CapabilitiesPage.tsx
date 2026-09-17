import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Download 
} from 'lucide-react';

const CAPABILITY_AREAS = [
  { title: 'Healthcare Recruitment', desc: 'Active sourcing and pipeline management across physicians, nursing leadership, mental health clinicians, and dental specialists.' },
  { title: 'Correctional Healthcare Staffing', desc: 'Specialized focus on institutional protocols, correctional security requirements, and high-standard compliance.' },
  { title: 'Credentialing & Compliance', desc: 'Multi-tiered primary source license checks, background clearances, and OIG/SAM screening.' },
  { title: 'Workforce Continuity', desc: 'Proactive shift scheduling, rapid replacement pipelines, and coverage during planned or unplanned staffing vacancies.' },
  { title: 'Temporary & Per Diem Staffing', desc: 'Flexible shift coverage accommodating institutional spikes, medical leaves, and census fluctuations.' },
  { title: 'Permanent & Long-Term Placement', desc: 'Retained and contract-to-hire arrangements for core clinical roles and medical leadership.' },
];

const APPROACH_STEPS = [
  { step: '01', title: 'UNDERSTAND', desc: 'In-depth assessment of facility census, shift shortages, and regulatory compliance targets.' },
  { step: '02', title: 'RECRUIT', desc: 'Targeted sourcing of clinicians equipped for structured institutional environments.' },
  { step: '03', title: 'SCREEN', desc: 'Clinical scope evaluation and competency verification.' },
  { step: '04', title: 'CREDENTIAL', desc: 'Direct state board verification, TB/health checks, and background screening.' },
  { step: '05', title: 'DEPLOY', desc: 'Security orientation, scheduling integration, and day-one shift coordination.' },
  { step: '06', title: 'SUPPORT', desc: 'Continuous coordinator check-ins, performance monitoring, and payroll reliability.' },
];

export function CapabilitiesPage() {
  const handleDownloadCapability = () => {
    alert('R.L. Klein & Associates Capability Statement downloaded (PDF format).');
  };

  return (
    <div className="capabilities-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Facilities', href: '/facilities/capabilities' }, { label: 'Capabilities' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Institutional Capabilities</span>
            <h1>Healthcare Workforce Solutions for Correctional Care</h1>
            <p className="page-hero__subtitle">
              For over 40 years, R.L. Klein &amp; Associates has partnered with government agencies and institutional healthcare systems to deliver qualified, compliance-ready clinical talent.
            </p>
            <div className="page-hero__actions">
              <Link to="/facilities/staffing-request" className="btn btn--accent btn--md">
                Request Staffing
              </Link>
              <button onClick={handleDownloadCapability} className="btn btn--outline-white btn--md">
                <Download size={15} />
                <span>Download Capability Statement</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Who We Are */}
      <section className="section bg-white">
        <div className="container">
          <div className="difference-layout">
            <div>
              <span className="eyebrow">Organizational Profile</span>
              <h2 style={{ marginTop: 8, marginBottom: 20 }}>
                A Dependable Partner for Public-Sector Healthcare
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                Founded in 1984 and incorporated in 1997, R.L. Klein &amp; Associates is a certified Small Business Enterprise (SBE) and Minority Business Enterprise (MBE) with an exceptional track record supporting California correctional healthcare and public health agencies.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)' }}>
                We understand the administrative rigor of government procurement, state contract compliance, and the critical importance of dependable clinical staffing for patient care and regulatory compliance.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-navy)', color: '#fff', padding: 36, borderRadius: 12 }}>
              <Award size={32} style={{ color: '#A0B0E0', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, color: '#fff', marginBottom: 12 }}>Verified Public Sector Experience</h3>
              <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 20 }}>
                Decades of direct support to California Department of Corrections and Rehabilitation (CDCR) and municipal healthcare agencies.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#E2E8F0' }}>
                <div>&bull; Primary Source Licensure Verification</div>
                <div>&bull; 100% Department of Corrections Background Clearances</div>
                <div>&bull; Established Payroll &amp; Operational Offices in CA and UT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Workforce Scope</span>
            <h2>Core Healthcare Capabilities</h2>
            <p className="section-heading__subtitle">
              Comprehensive staffing models structured around the operational realities of institutional healthcare.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {CAPABILITY_AREAS.map((cap) => (
              <div key={cap.title} className="service-card">
                <h3 style={{ fontSize: 18, color: 'var(--color-navy)' }}>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Step Staffing Approach */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Methodology</span>
            <h2>Our Staffing Delivery Approach</h2>
            <p className="section-heading__subtitle">
              Every facility engagement follows a disciplined six-stage execution framework.
            </p>
          </div>

          <div className="process-flow">
            {APPROACH_STEPS.map((s) => (
              <div key={s.step} className="process-step">
                <span className="process-step__num">{s.step}</span>
                <h3 className="process-step__title">{s.title}</h3>
                <p className="process-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--lg">
              <span>Submit Staffing Requirement</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
