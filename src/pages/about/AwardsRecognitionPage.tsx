import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const VERIFIED_CERTIFICATIONS = [
  {
    code: 'MBE',
    image: `${import.meta.env.BASE_URL}mbe.png`,
    title: 'Minority Business Enterprise',
    organization: 'National Minority Supplier Development Council (NMSDC) / Regional Affiliate',
    status: 'Verified / Active',
    description: 'Certified minority-owned business enterprise supporting diversity in public and healthcare procurement contracts.',
  },
  {
    code: 'SBE',
    image: `${import.meta.env.BASE_URL}sbe.png`,
    title: 'Small Business Enterprise',
    organization: 'State of California Department of General Services (DGS)',
    status: 'Verified / Active',
    description: 'Certified California Small Business eligible for state procurement preferences and dedicated public-sector staffing contracts.',
  },
  {
    code: 'LSBE',
    image: `${import.meta.env.BASE_URL}lsbe.png`,
    title: 'Local Small Business Enterprise',
    organization: 'County & Municipal Procurement Authorities',
    status: 'Verified / Active',
    description: 'Recognized local enterprise participating in county healthcare, correctional, and community staffing initiatives.',
  },
  {
    code: 'NMSDC',
    image: `${import.meta.env.BASE_URL}nmsdc.png`,
    title: 'NMSDC Corporate Member Recognition',
    organization: 'National Supplier Diversity Network',
    status: 'Active Institutional Standing',
    description: 'Committed to corporate supplier diversity, transparent governance, and equitable clinical workforce representation.',
  },
];

export function AwardsRecognitionPage() {
  return (
    <div className="awards-recognition-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/who-we-are' }, { label: 'Awards & Recognition' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Verified Institutional Credentials</span>
            <h1>Awards, Certifications &amp; Recognition</h1>
            <p className="page-hero__subtitle">
              R.L. Klein &amp; Associates maintains verified state, local, and national business certifications supporting government procurement and healthcare diversity.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Public Sector Standing</span>
            <h2>Business Certifications &amp; Accreditations</h2>
            <p className="section-heading__subtitle">
              We strictly list verified corporate certifications. No fabricated awards or unverified claims.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {VERIFIED_CERTIFICATIONS.map((cert) => (
              <div key={cert.code} className="admin-card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
                <div className="certification-logo-wrap">
                  <img src={cert.image} alt={`${cert.title} certification`} className="certification-logo" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 'bold', color: 'var(--color-navy)' }}>
                    {cert.code}
                  </span>
                  <span className="status-badge status-badge--published status-badge--sm">
                    {cert.status}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, color: 'var(--color-navy)', marginBottom: 6 }}>
                  {cert.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--color-gray-500)', marginBottom: 16 }}>
                  Issuing Authority: <strong>{cert.organization}</strong>
                </div>

                <p style={{ fontSize: 14, color: 'var(--color-gray-600)', lineHeight: 1.6, flexGrow: 1 }}>
                  {cert.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, color: 'var(--color-navy)', marginBottom: 4 }}>
                Need Certified Small Business Staffing for State Contracts?
              </h3>
              <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>
                Our certifications allow government contracting officers to fulfill SBE and MBE subcontracting and prime participation goals.
              </p>
            </div>
            <Link to="/facilities/staffing-request" className="btn btn--primary btn--md">
              <span>Contact Contracting Team</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
