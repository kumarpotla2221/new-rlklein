import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Building2, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface CaliforniaRegion {
  name: string;
  counties: string;
  description: string;
  focus: string;
}

const CA_REGIONS: CaliforniaRegion[] = [
  {
    name: 'Northern California Region',
    counties: 'Sacramento, Solano, San Joaquin, Marin, Lassen, Del Norte, and surrounding areas',
    description: 'Providing staffing coverage for institutional healthcare facilities and regional medical clinics in Northern California.',
    focus: 'Primary care, mental health counseling, general dentistry, nursing coverage.',
  },
  {
    name: 'Central California & Valley Region',
    counties: 'Fresno, Kern, Kings, Madera, Tulare, Monterey, San Luis Obispo, and surrounding areas',
    description: 'Supporting high-capacity healthcare facilities with dedicated nursing, psychiatric services, and allied health professionals.',
    focus: 'Chronic care management, crisis intervention, pharmacy services, physical therapy.',
  },
  {
    name: 'Southern California Region',
    counties: 'Los Angeles, Riverside, San Bernardino, San Diego, Imperial, and surrounding areas',
    description: 'Delivering comprehensive clinical coverage for state institutional healthcare facilities in Southern California.',
    focus: 'Urgent care triage, licensed clinical social work, dental services, specialized internal medicine.',
  },
];

export function CDCRFacilitiesPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>(CA_REGIONS[0].name);

  const current = CA_REGIONS.find((r) => r.name === selectedRegion) || CA_REGIONS[0];

  return (
    <div className="cdcr-facilities-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'Facilities' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>California Presence</span>
            <h1>California Correctional Healthcare Facilities</h1>
            <p className="page-hero__subtitle">
              Providing qualified healthcare professionals to state and institutional facilities across Northern, Central, and Southern California regions.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Regional Overview</span>
            <h2>California Facility Coverage</h2>
            <p className="section-heading__subtitle">
              Select a regional area below to learn about healthcare staffing scope, clinical disciplines, and available opportunities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'flex-start' }}>
            {/* Region Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CA_REGIONS.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRegion(r.name)}
                  className="btn btn--ghost"
                  style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '16px 20px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: selectedRegion === r.name ? 'var(--color-navy)' : 'var(--color-gray-200)',
                    backgroundColor: selectedRegion === r.name ? 'var(--color-off-white)' : '#fff',
                    color: selectedRegion === r.name ? 'var(--color-navy)' : 'var(--color-gray-700)',
                    fontWeight: selectedRegion === r.name ? 700 : 500,
                  }}
                >
                  <MapPin size={18} style={{ color: selectedRegion === r.name ? 'var(--color-violet)' : 'var(--color-gray-400)', flexShrink: 0 }} />
                  <span>{r.name}</span>
                </button>
              ))}
            </div>

            {/* Region Details Card */}
            <div className="admin-card" style={{ padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-violet)', marginBottom: 8 }}>
                <Building2 size={22} />
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Regional Detail
                </span>
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: 16 }}>
                {current.name}
              </h3>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--color-gray-700)', marginBottom: 20 }}>
                {current.description}
              </p>

              <div style={{ backgroundColor: 'var(--color-off-white)', padding: 16, borderRadius: 6, marginBottom: 24, fontSize: '14px' }}>
                <strong>Key Areas &amp; Counties: </strong>
                <span style={{ color: 'var(--color-gray-600)' }}>{current.counties}</span>
              </div>

              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontSize: '15px', color: 'var(--color-navy)', marginBottom: 8 }}>Typical Clinical Focus:</h4>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>{current.focus}</p>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/cdcr-healthcare/opportunities" className="btn btn--primary btn--md">
                  <span>View Regional Opportunities</span>
                  <ArrowRight size={14} />
                </Link>
                <Link to="/facilities/staffing-request" className="btn btn--secondary btn--md">
                  Request Staffing for Region
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
