import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Award, ShieldCheck, History, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export function WhoWeArePage() {
  return (
    <div className="who-we-are-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/who-we-are' }, { label: 'Who We Are' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Our Heritage</span>
            <h1>Four Decades of Dependable Healthcare Workforce Solutions</h1>
            <p className="page-hero__subtitle">
              Founded in 1984 and incorporated in 1997, R.L. Klein &amp; Associates has spent over 40 years connecting public institutions and correctional healthcare facilities with qualified, dedicated clinical practitioners.
            </p>
          </div>
        </div>
      </header>

      {/* Legacy & Foundation */}
      <section className="section bg-white">
        <div className="container">
          <div className="difference-layout">
            <div>
              <span className="eyebrow">Institutional Roots</span>
              <h2 style={{ marginTop: 8, marginBottom: 20 }}>
                Our Legacy
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                R.L. Klein &amp; Associates was established with a clear mandate: to provide public healthcare institutions with reliable, high-caliber clinical professionals who excel within complex, highly regulated operational environments.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 16 }}>
                Over four decades, our leadership has worked hand-in-hand with California correctional healthcare administrators, county public health systems, and state oversight bodies. We do not operate as a generalized online job board; we operate as a specialized workforce solutions firm with hands-on credentialing, direct payroll management, and responsive clinical coordination.
              </p>
            </div>

            {/* Verified Timeline */}
            <div style={{ backgroundColor: 'var(--color-off-white)', padding: 36, borderRadius: 12, border: '1px solid var(--color-gray-200)' }}>
              <span className="eyebrow" style={{ color: 'var(--color-navy)', marginBottom: 16, display: 'block' }}>Verified Milestones</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 'bold', color: 'var(--color-violet)', minWidth: 60 }}>
                    1984
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, color: 'var(--color-navy)', marginBottom: 4 }}>Company Founded</h3>
                    <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>
                      Commenced specialized healthcare staffing and workforce services supporting government and institutional healthcare requirements.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 'bold', color: 'var(--color-violet)', minWidth: 60 }}>
                    1997
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, color: 'var(--color-navy)', marginBottom: 4 }}>Formally Incorporated</h3>
                    <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>
                      Incorporated in California to expand specialized correctional healthcare contracts, dedicated payroll systems, and multi-facility coverage.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 'bold', color: 'var(--color-violet)', minWidth: 60 }}>
                    40+
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, color: 'var(--color-navy)', marginBottom: 4 }}>Years of Continuous Operation</h3>
                    <p style={{ fontSize: 14, color: 'var(--color-gray-600)' }}>
                      Decades of uninterrupted partnership with state and local healthcare organizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments & Vision */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Guiding Principles</span>
            <h2>Our Core Commitments</h2>
            <p className="section-heading__subtitle">
              How our values guide clinical placements, client relationships, and candidate advocacy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            <div className="service-card">
              <ShieldCheck size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Absolute Compliance</h3>
              <p>We treat state credentialing, licensing mandates, and security requirements as essential non-negotiables that protect facilities and clinicians alike.</p>
            </div>
            <div className="service-card">
              <HeartHandshake size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Human-Centered UX</h3>
              <p>We believe clinicians deserve respect and prompt answers. No applicant logins, no opaque candidate portals, and continuous recruiter contact.</p>
            </div>
            <div className="service-card">
              <History size={26} style={{ color: 'var(--color-navy)' }} />
              <h3>Workforce Continuity</h3>
              <p>Public sector facilities depend on reliable shift coverage. We cultivate sustainable clinical pipelines that minimize vacancy rates.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/about/team" className="btn btn--primary btn--md">
              <span>Meet Our Leadership Team</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
