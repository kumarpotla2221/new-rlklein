import { useState } from 'react';
import { Link } from 'react-router-dom';
import { photo } from '../../data/images';
import { FAQS } from '../../data/faqs';
import { ChevronsRight, ArrowRight } from 'lucide-react';

export function ProfessionalsFAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const candidateFaqs = FAQS.filter(
    (faq) => faq.id !== 'faq-002' && faq.id !== 'faq-003'
  );

  return (
    <div className="professionals-faq-page">
      <header className="travel-faq-hero" style={{ backgroundImage: `linear-gradient(90deg, #fff 0%, rgba(255,255,255,.9) 26%, transparent 70%), url("${photo('careTeam', 2200)}")` }}>
        <div className="container">
          <div className="page-hero__content">
            <h1>Your questions<br />about R.L. Klein,<br />answered.</h1>
          </div>
        </div>
      </header>

      <section className="section bg-white">
        <div className="container travel-faq-container">
          <div className="faq-list">
            {candidateFaqs.map((faq, idx) => (
              <div key={faq.id} className="faq-item">
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                >
                  <ChevronsRight
                    aria-hidden="true"
                    size={55}
                    style={{
                      transform: openIdx === idx ? 'rotate(90deg)' : 'none',
                      transition: 'transform 200ms ease',
                      flexShrink: 0,
                    }}
                  />
                  <span>{faq.question}</span>
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
              Contact our team for help with job opportunities, applications, credentialing, or facility staffing needs.
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
