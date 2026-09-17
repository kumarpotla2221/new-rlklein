import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Mail, Phone, User, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface RecruiterProfile {
  id: string;
  name: string;
  designation: string;
  specialties: string[];
  bio: string;
  email: string;
  phone: string;
  background: string;
  responsibilities: string;
  imageUrl?: string;
}

const RECRUITERS: RecruiterProfile[] = [
  {
    id: 'rec-1',
    name: 'Senior Clinical Recruitment Coordinator',
    designation: 'Nursing & Allied Health Lead',
    specialties: ['Registered Nurses (RN)', 'LVNs', 'Allied Healthcare'],
    bio: 'Guiding nursing and allied health candidates through credentialing, facility orientation, and California correctional placements.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    background: 'Over a decade of dedicated clinical recruitment experience in government and state healthcare staffing.',
    responsibilities: 'Manages candidate intake, licensing verification, schedule matching, and initial assignment coordination.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec-2',
    name: 'Physician & Advanced Practice Specialist',
    designation: 'Medical Staffing Coordinator',
    specialties: ['Internal Medicine', 'Family Medicine', 'Nurse Practitioners', 'PAs'],
    bio: 'Specializing in physician and advanced practice placements across institutional medical clinics throughout California.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    background: 'Specialized healthcare staffing background focused on DEA registration, credentialing verifications, and clinical retention.',
    responsibilities: 'Physician scope review, board certification tracking, state department clearances, and facility scheduling.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec-3',
    name: 'Behavioral & Dental Health Coordinator',
    designation: 'Mental Health & Dental Recruiter',
    specialties: ['LCSW / LMFT', 'Psychiatry', 'Psychologists', 'Dentists / RDH'],
    bio: 'Dedicated coordinator supporting mental health professionals and dental teams through credentialing and facility onboarding.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    background: 'Focused on high-need clinical disciplines in correctional, county health, and institutional settings.',
    responsibilities: 'Therapeutic credentialing, clinical supervisor alignments, and ongoing assignment support.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
];

export function RecruitersPage() {
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterProfile | null>(null);

  return (
    <div className="recruiters-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Healthcare Professionals', href: '/healthcare-professionals' },
          { label: 'Meet Our Recruiters' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Personalized Advocacy</span>
            <h1>Meet Our Recruitment Coordinators</h1>
            <p className="page-hero__subtitle">
              Connect directly with dedicated coordinators who understand institutional healthcare environments and work on your behalf from day one.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Direct Contact</span>
            <h2>Dedicated Clinical Coordinators</h2>
            <p className="section-heading__subtitle">
              Our coordinators guide you through licensing, credentialing, shift options, and assignment continuity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {RECRUITERS.map((r) => (
              <div key={r.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 220, overflow: 'hidden', backgroundColor: 'var(--color-navy)' }}>
                  <img
                    src={r.imageUrl}
                    alt={r.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-violet)', fontWeight: 600 }}>
                    {r.designation}
                  </span>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', marginTop: 4, marginBottom: 8 }}>
                    {r.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: 1.5, marginBottom: 16, flexGrow: 1 }}>
                    {r.bio}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {r.specialties.map((s) => (
                      <span key={s} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 4, backgroundColor: 'var(--color-off-white)', color: 'var(--color-gray-700)', border: '1px solid var(--color-gray-200)' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--color-gray-100)' }}>
                    <a href={`tel:${r.phone}`} style={{ fontSize: '13px', color: 'var(--color-gray-700)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={14} />
                      <span>{r.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedRecruiter(r)}
                      className="btn btn--ghost btn--sm"
                      style={{ fontSize: '12px', color: 'var(--color-violet)', fontWeight: 600 }}
                    >
                      View Profile &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 8 }}>
              Ready to Discuss Current Openings?
            </h3>
            <p style={{ fontSize: 15, color: 'var(--color-gray-600)', marginBottom: 20 }}>
              Call our main line at <strong>562-427-5577</strong> or apply directly without creating an account.
            </p>
            <Link to="/hot-jobs" className="btn btn--primary btn--md">
              <span>View All Hot Jobs</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      {selectedRecruiter && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recruiter-modal-title"
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={() => setSelectedRecruiter(null)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13, 34, 64, 0.6)', backdropFilter: 'blur(2px)' }}
          />

          <div style={{ position: 'relative', width: '100%', maxWidth: 580, backgroundColor: '#fff', borderRadius: 12, padding: 36, zIndex: 1, boxShadow: 'var(--shadow-xl)' }}>
            <button
              onClick={() => setSelectedRecruiter(null)}
              style={{ position: 'absolute', right: 20, top: 20, padding: 8, color: 'var(--color-gray-500)' }}
              aria-label="Close profile"
            >
              <X size={20} />
            </button>

            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-violet)', fontWeight: 600 }}>
              {selectedRecruiter.designation}
            </span>
            <h2 id="recruiter-modal-title" style={{ fontSize: '24px', color: 'var(--color-navy)', marginTop: 4, marginBottom: 16 }}>
              {selectedRecruiter.name}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '14px', lineHeight: 1.6, color: 'var(--color-gray-700)', marginBottom: 24 }}>
              <div>
                <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: 4 }}>Professional Background</strong>
                <p>{selectedRecruiter.background}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: 4 }}>Recruiting Responsibilities</strong>
                <p>{selectedRecruiter.responsibilities}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: 4 }}>Contact Coordinator</strong>
                <p>
                  Official Email: <a href={`mailto:${selectedRecruiter.email}`} style={{ color: 'var(--color-violet)' }}>{selectedRecruiter.email}</a><br />
                  Office Phone: <a href={`tel:${selectedRecruiter.phone}`} style={{ color: 'var(--color-navy)' }}>{selectedRecruiter.phone}</a>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setSelectedRecruiter(null)} className="btn btn--ghost btn--sm">
                Close
              </button>
              <Link to="/apply" onClick={() => setSelectedRecruiter(null)} className="btn btn--primary btn--sm">
                Submit Application
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
