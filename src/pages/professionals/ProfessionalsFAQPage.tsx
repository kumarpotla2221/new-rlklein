import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { FAQS } from '../../data/faqs';
import { ChevronDown, ArrowRight } from 'lucide-react';

export function ProfessionalsFAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const candidateFaqs = FAQS.filter(
    (f) => f.category === 'Healthcare Professionals' || f.category === 'Jobs' || f.category === 'Credentialing'
  );

  return (
    <div className="professionals-faq-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Healthcare Professionals', href: '/healthcare-professionals' },
          { label: 'FAQs' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Help &amp; Information</span>
            <h1>Healthcare Professionals FAQ</h1>
            <p className="page-hero__subtitle">
              Frequently asked questions about applying, licensing, credentialing, payroll, and placement workflows.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="faq-list">
            {candidateFaqs.map((faq, idx) => (
              <div key={faq.id} className="faq-item">
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openIdx === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 200ms ease',
                      flexShrink: 0,
                    }}
                  />
                </button>
                {openIdx === idx && (
                  <div className="faq-content">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, backgroundColor: 'var(--color-off-white)', padding: 32, borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, color: 'var(--color-navy)', marginBottom: 8 }}>
              Have a Specific Question?
            </h3>
            <p style={{ fontSize: 15, color: 'var(--color-gray-600)', marginBottom: 20 }}>
              Our recruitment team is available Monday–Saturday from 9 AM–6 PM PST.
            </p>
            <Link to="/contact" className="btn btn--primary btn--md">
              <span>Contact Us Directly</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
