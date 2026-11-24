import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { DollarSign, ShieldCheck, CreditCard, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';

interface BenefitItem {
  title: string;
  desc: string;
  icon: typeof DollarSign;
}

const BENEFITS_LIST: BenefitItem[] = [
  {
    title: 'Competitive Compensation Rates',
    desc: 'Transparent, competitive hourly and assignment rates reflective of specialized institutional healthcare work.',
    icon: DollarSign,
  },
  {
    title: 'Dedicated Payroll & Direct Deposit',
    desc: 'Reliable weekly or bi-weekly direct deposit payroll managed through our dedicated Utah payroll operations office.',
    icon: CreditCard,
  },
  {
    title: 'Assignment Flexibility',
    desc: 'Choose between full-time, part-time, per diem, and contract assignments tailored to your schedule.',
    icon: Clock,
  },
  {
    title: 'Clinical & Credentialing Support',
    desc: 'Hands-on assistance navigating state primary source credentialing, background checks, and renewals.',
    icon: ShieldCheck,
  },
];

const PAY_FAQS = [
  {
    q: 'How often are healthcare professionals paid?',
    a: 'Payroll is processed on a regular, dependable schedule (typically weekly or bi-weekly depending on the contract structure). All payroll questions are supported directly by our Utah payroll office.',
  },
  {
    q: 'Is direct deposit available?',
    a: 'Yes. Direct deposit is available and recommended for all placed healthcare professionals to ensure prompt, secure transfer of earnings.',
  },
  {
    q: 'What compensation packages are available?',
    a: 'Compensation varies by clinical discipline, licensure level, experience, facility setting, and shift type. Approved rates are clearly communicated by your recruiter before assignment acceptance.',
  },
  {
    q: 'Is license and credentialing assistance provided?',
    a: 'Yes. Our dedicated credentialing coordinators assist you through required state document submissions, background checks, and verification requirements.',
  },
  {
    q: 'Are benefits available between assignments?',
    a: 'Benefit eligibility depends on assignment duration, classification, and continuous service. Speak with your recruitment coordinator for details specific to your employment structure.',
  },
];

export function PayBenefitsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="pay-benefits-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Healthcare Professionals', href: '/healthcare-professionals' },
          { label: 'Pay & Benefits' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Compensation &amp; Support</span>
            <h1>Pay, Benefits &amp; Professional Support</h1>
            <p className="page-hero__subtitle">
              Transparent, competitive compensation backed by 40 years of dependable payroll management and personalized recruitment advocacy.
            </p>
          </div>
        </div>
      </header>

      {/* Benefits Grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">The Support You Deserve</span>
            <h2>Compensation &amp; Service Highlights</h2>
            <p className="section-heading__subtitle">
              We ensure our healthcare providers have clear visibility into rates, reliable direct deposit, and direct access to their recruitment team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {BENEFITS_LIST.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="service-card">
                  <div className="service-card__icon">
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: 18, color: 'var(--color-navy)' }}>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verified FAQ Accordion */}
      <section className="section bg-off-white">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Common Questions</span>
            <h2>Frequently Asked Questions: Pay &amp; Policies</h2>
            <p className="section-heading__subtitle">
              Verified answers to common compensation and payroll questions.
            </p>
          </div>

          <div className="faq-list">
            {PAY_FAQS.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 200ms ease',
                      flexShrink: 0,
                    }}
                  />
                </button>
                {openFaq === idx && (
                  <div className="faq-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/contact" className="btn btn--primary btn--md">
              Ask a Payroll or Compensation Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
