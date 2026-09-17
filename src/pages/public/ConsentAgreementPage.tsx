import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';

export function ConsentAgreementPage() {
  return (
    <div className="consent-agreement-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Consent Agreement' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Communication Preferences</span>
            <h1>Consent Agreement</h1>
            <p className="page-hero__subtitle">
              Information about messages from R.L. Klein &amp; Associates Inc.
            </p>
          </div>
        </div>
      </header>

      <main className="section bg-white">
        <div className="container" style={{ maxWidth: 820 }}>
          <article className="admin-card" style={{ padding: '40px 44px' }}>
            <h2 style={{ color: 'var(--color-navy)', marginBottom: 20 }}>
              Consent Agreement for R.L. Klein &amp; Associates Inc
            </h2>

            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-gray-700)', marginBottom: 24 }}>
              By submitting this form, you consent to receive messages from R.L. Klein &amp; Associates Inc at the contact information you provide. These messages may include updates about our services, product announcements, special offers, and other relevant communications.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--color-gray-700)', lineHeight: 1.7 }}>
              <section>
                <h3 style={{ color: 'var(--color-navy)', marginBottom: 6 }}>Message Frequency</h3>
                <p>Messages may be sent up to once per week.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--color-navy)', marginBottom: 6 }}>Types of Messages</h3>
                <p>Expect to receive updates on R.L. Klein &amp; Associates Inc, service offerings, support alerts, promotional content, and industry news.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--color-navy)', marginBottom: 6 }}>Data Rates Disclosure</h3>
                <p>Message and data rates may apply depending on your mobile carrier.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--color-navy)', marginBottom: 6 }}>HELP Information</h3>
                <p>For assistance, reply HELP to any message.</p>
              </section>

              <section>
                <h3 style={{ color: 'var(--color-navy)', marginBottom: 6 }}>STOP/UNSUBSCRIBE Information</h3>
                <p>To opt out at any time, simply reply STOP.</p>
              </section>
            </div>

            <p style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-gray-200)', color: 'var(--color-gray-700)' }}>
              To learn more about our services, visit{' '}
              <a href="https://www.rlklein.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-violet)', fontWeight: 600 }}>
                www.rlklein.com
              </a>
            </p>
          </article>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/" className="btn btn--ghost btn--md">Return Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
