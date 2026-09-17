import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Mail, Phone, X, ArrowRight, ShieldCheck, Award } from 'lucide-react';

interface ExecutiveMember {
  id: string;
  name: string;
  title: string;
  isCEO?: boolean;
  department: string;
  bio: string;
  responsibilities: string;
  email: string;
  phone: string;
  imageUrl?: string;
}

const LEADERSHIP_TEAM: ExecutiveMember[] = [
  {
    id: 'lead-ceo',
    name: 'Executive Leadership',
    title: 'Chief Executive Officer',
    isCEO: true,
    department: 'Executive Office',
    bio: 'Guiding corporate strategy, state healthcare compliance partnerships, and institutional relations across four decades of R.L. Klein leadership.',
    responsibilities: 'Overall institutional direction, government contract alignment, executive compliance oversight, and facility partnerships.',
    email: 'info@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'lead-ops',
    name: 'Director of Healthcare Operations',
    title: 'Vice President of Clinical Operations',
    department: 'Operational Management (Utah HQ)',
    bio: 'Overseeing daily staffing operations, multi-facility shift coordination, and clinical recruiter pipelines.',
    responsibilities: 'Day-to-day operations management, facility communication, workforce scheduling, and client relationship management.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lead-comp',
    name: 'Compliance & Credentialing Director',
    title: 'Director of Credentialing & Regulatory Affairs',
    department: 'Compliance Division',
    bio: 'Directing primary source license checks, background screenings, state department clearances, and clinical audits.',
    responsibilities: 'State licensing board verifications, Joint Commission standards adherence, security clearance submissions, and clinical records review.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lead-payroll',
    name: 'Director of Payroll & Administration',
    title: 'Payroll & Financial Operations Lead',
    department: 'Payroll Management HQ (Provo, UT)',
    bio: 'Managing weekly clinical payroll, direct deposits, tax compliance, and healthcare professional benefits administration.',
    responsibilities: 'Accurate and timely clinician disbursements, timekeeping verification, and state tax filings.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
];

export function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);

  const ceo = LEADERSHIP_TEAM.find((m) => m.isCEO);
  const otherMembers = LEADERSHIP_TEAM.filter((m) => !m.isCEO);

  return (
    <div className="team-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/who-we-are' }, { label: 'Our Team' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Corporate Leadership</span>
            <h1>Our Leadership Team</h1>
            <p className="page-hero__subtitle">
              Guided by experienced executives and operational directors dedicated to dependable healthcare staffing, regulatory compliance, and candidate advocacy.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container">
          {/* 67 — CEO SECTION (PROMINENT FIRST) */}
          {ceo && (
            <div style={{ marginBottom: 60 }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>Executive Leadership</span>
              <div className="admin-card" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 36, overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'var(--color-navy)', height: '100%', minHeight: 320 }}>
                  <img
                    src={ceo.imageUrl}
                    alt={ceo.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '36px 36px 36px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-violet)', fontWeight: 600 }}>
                    {ceo.title}
                  </span>
                  <h2 style={{ fontSize: '28px', color: 'var(--color-navy)', marginTop: 4, marginBottom: 16 }}>
                    {ceo.name}
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--color-gray-700)', marginBottom: 20 }}>
                    {ceo.bio}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: 24 }}>
                    <strong>Key Responsibilities: </strong>{ceo.responsibilities}
                  </p>
                  <div style={{ display: 'flex', gap: 20, fontSize: '14px', borderTop: '1px solid var(--color-gray-100)', paddingTop: 16 }}>
                    <a href={`mailto:${ceo.email}`} style={{ color: 'var(--color-violet)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={15} />
                      <span>{ceo.email}</span>
                    </a>
                    <a href={`tel:${ceo.phone}`} style={{ color: 'var(--color-navy)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={15} />
                      <span>{ceo.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Leadership Team */}
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>Operational &amp; Compliance Directors</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
              {otherMembers.map((member) => (
                <div key={member.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 220, overflow: 'hidden', backgroundColor: 'var(--color-navy)' }}>
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-violet)', fontWeight: 600 }}>
                      {member.title}
                    </span>
                    <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', marginTop: 4, marginBottom: 8 }}>
                      {member.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginBottom: 12 }}>
                      {member.department}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: 1.5, marginBottom: 16, flexGrow: 1 }}>
                      {member.bio}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--color-gray-100)' }}>
                      <a href={`mailto:${member.email}`} style={{ fontSize: '13px', color: 'var(--color-violet)' }}>
                        {member.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className="btn btn--ghost btn--sm"
                        style={{ fontSize: '12px', fontWeight: 600 }}
                      >
                        Profile &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Member Modal */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={() => setSelectedMember(null)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13, 34, 64, 0.6)', backdropFilter: 'blur(2px)' }}
          />

          <div style={{ position: 'relative', width: '100%', maxWidth: 540, backgroundColor: '#fff', borderRadius: 12, padding: 32, zIndex: 1, boxShadow: 'var(--shadow-xl)' }}>
            <button
              onClick={() => setSelectedMember(null)}
              style={{ position: 'absolute', right: 20, top: 20, padding: 8, color: 'var(--color-gray-500)' }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-violet)', fontWeight: 600 }}>
              {selectedMember.title}
            </span>
            <h2 id="member-modal-title" style={{ fontSize: '22px', color: 'var(--color-navy)', marginTop: 4, marginBottom: 8 }}>
              {selectedMember.name}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginBottom: 20 }}>
              {selectedMember.department}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '14px', lineHeight: 1.6, color: 'var(--color-gray-700)', marginBottom: 24 }}>
              <div>
                <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: 4 }}>Biography</strong>
                <p>{selectedMember.bio}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: 4 }}>Responsibilities</strong>
                <p>{selectedMember.responsibilities}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedMember(null)} className="btn btn--secondary btn--sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
