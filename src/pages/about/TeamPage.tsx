import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Mail, Phone, X, ArrowRight } from 'lucide-react';

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
    name: 'James W. Kommu',
    title: 'President & CEO',
    isCEO: true,
    department: 'Executive Office',
    bio: 'James W. Kommu brings extensive experience in healthcare staffing, executive leadership, and strategic business management to R.L. Klein & Associates Inc. As President and CEO, he provides visionary leadership focused on sustainable growth, operational excellence, and exceptional workforce solutions. His expertise and strategic insight enable RLK to respond effectively to the evolving needs of the healthcare industry. Kommu is committed to building strong client partnerships through integrity, responsiveness, quality, and service excellence. Under his leadership, RLK continues to strengthen its capabilities and expand its position as a trusted healthcare staffing partner.',
    responsibilities: 'Executive leadership, strategic growth, operational excellence, and client partnerships.',
    email: 'jim@rlklein.com',
    phone: '562-427-5577',
    imageUrl: `${import.meta.env.BASE_URL}james-w-kommu.jpg`,
  },
  {
    id: 'lead-ops',
    name: 'Lindsey Jabbora',
    title: 'Sales & Recruitment Head',
    department: 'Sales & Recruitment',
    bio: 'Lindsey Jabbora brings strong expertise in sales, recruitment, and client relationship management to R.L. Klein & Associates Inc. As Sales and Recruitment Head, she drives strategic growth through a client-focused approach and effective talent acquisition strategies. Her ability to understand client needs and connect them with the right healthcare professionals strengthens RLK\'s workforce solutions. Lindsey is committed to building lasting partnerships through responsiveness, professionalism, and service excellence. Her leadership and dedication continue to contribute significantly to RLK\'s growth and reputation in the healthcare staffing industry.',
    responsibilities: 'Strategic sales growth, talent acquisition, and client relationship management.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lead-comp',
    name: 'Jithender Bhog',
    title: 'Contracts / Compliance Manager',
    department: 'Contracts & Compliance',
    bio: 'Jithender Bhog is an experienced Contracts & Compliance professional supporting healthcare staffing operations. He specializes in contract management, regulatory compliance, RFPs, and client requirements. He manages compliance documentation, credentialing, background verification, and onboarding processes. He is skilled in identifying compliance risks and supporting audits and regulatory reviews. He collaborates across operations, recruitment, legal, and client teams to ensure contractual compliance. His focus is on maintaining quality, integrity, compliance, and strong client service.',
    responsibilities: 'Contract management, regulatory compliance, credentialing, audits, and onboarding.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lead-payroll',
    name: 'Vincent Jones',
    title: 'Operations Lead',
    department: 'VMS Operations',
    bio: 'Vincent Jones is an experienced healthcare workforce operations professional specializing in VMS administration, job order management, vendor coordination, compliance, and staffing workflows. As VMS Operations Lead, he manages end-to-end processes, ensures data accuracy, resolves system issues, and collaborates with recruitment, compliance, and account teams to improve efficiency, fill rates, and turnaround times at RLK.',
    responsibilities: 'VMS administration, job order management, vendor coordination, and staffing workflow optimization.',
    email: 'operations@rlklein.com',
    phone: '562-427-5577',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
];

export function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<ExecutiveMember | null>(null);

  return (
    <div className="team-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about/who-we-are' }, { label: 'Our Team' }]} />

      <header className="team-intro">
        <div className="container team-intro__inner">
          <span className="eyebrow">Our people</span>
          <h1>We work for you.</h1>
          <h2>We can&apos;t wait to get to know you</h2>
          <p>At R.L. Klein, staffing is about much more than filling a position. It&apos;s about the people who make dependable healthcare possible. Meet the team dedicated to helping you find the right opportunity and supporting you at every step.</p>
        </div>
      </header>

      <section className="team-gallery section bg-white">
        <div className="container">
          <div className="team-section-heading">
            <span className="eyebrow">The people behind the support</span>
            <h2>Meet The Team</h2>
            <p>Tap on a picture to get to know your future biggest fans.</p>
          </div>
          <div className="team-member-grid">
            {LEADERSHIP_TEAM.map((member) => (
              <button key={member.id} type="button" className="team-member-tile" onClick={() => setSelectedMember(member)}>
                <span className="team-member-tile__image-wrap">
                  <img src={member.imageUrl} alt={member.name} className="team-member-tile__image" />
                  <span className="team-member-tile__view">View profile <ArrowRight size={15} /></span>
                </span>
                <span className="team-member-tile__content">
                  <span className="team-member-tile__name">{member.name}</span>
                  <span className="team-member-tile__title">{member.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="team-commitment section">
        <div className="container">
          <div className="team-section-heading team-section-heading--light">
            <span className="eyebrow">Our commitment to you</span>
            <h2>What you can expect from our team</h2>
            <p>We live our core values every day so you feel valued, appreciated, and cared for.</p>
          </div>
          <div className="team-values-grid">
            {[
              ['We are humble and kind', 'We take the time to know you as an individual and help you find work that fits your experience and needs.'],
              ['We have a passion for caring', 'Expect regular check-ins and a real person you can call or text throughout your assignment.'],
              ['We build open and honest relationships', 'We set clear expectations about your contract, pay, benefits, and every next step.'],
              ['We will be resourceful', 'From credentialing to housing details, we take care of the practical work behind a smooth assignment.'],
              ['We will create fun and happiness', 'When you feel supported, you can bring your best care to the people who need it most.'],
            ].map(([title, text], index) => (
              <article key={title} className="team-value">
                <span className="team-value__number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="team-commitment__cta">
            <Link to="/hot-jobs" className="btn btn--accent btn--lg">Get started <ArrowRight size={17} /></Link>
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
