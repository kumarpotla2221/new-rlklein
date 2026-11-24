import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';

export function PrivacyPolicyPage() {
  return (
    <div className="privacy-policy-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Legal &amp; Privacy</span>
            <h1>Privacy Policy</h1>
            <p className="page-hero__subtitle">How R.L. Klein &amp; Associates Inc. collects, uses, and protects your information.</p>
          </div>
        </div>
      </header>

      <main className="section bg-white">
        <div className="container privacy-policy__layout">
          <article className="privacy-policy__content">
            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
            <p>We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>

            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>Words with initial capital letters have meanings defined under the following conditions. These definitions apply equally whether they appear in singular or plural form.</p>
            <h3>Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul>
              <li><strong>Account</strong> means a unique account created for You to access Our Service or parts of Our Service.</li>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party.</li>
              <li><strong>Company</strong> (referred to as either “the Company”, “We”, “Us” or “Our”) refers to R.L. Klein &amp; Associates Inc.</li>
              <li><strong>Cookies</strong> are small files placed on Your device by a website, containing browsing history and other data.</li>
              <li><strong>Country</strong> refers to: United States.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, cellphone, or tablet.</li>
              <li><strong>Personal Data</strong> is information that relates to an identifiable individual.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Service Provider</strong> means third-party individuals or companies who help deliver the Service.</li>
              <li><strong>Usage Data</strong> refers to data collected automatically during use of the Service.</li>
              <li><strong>Website</strong> refers to R.L. Klein &amp; Associates Inc., accessible from <a href="https://www.rlklein.com/">www.rlklein.com</a>.</li>
              <li><strong>You</strong> means the individual or legal entity using the Service.</li>
            </ul>

            <h2>Collecting and Using Your Personal Data</h2>
            <h3>Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>We may ask You to provide personally identifiable information, including but not limited to:</p>
            <ul>
              <li>Email address</li>
              <li>First and last name</li>
              <li>Phone number</li>
              <li>Usage Data</li>
            </ul>

            <h4>Usage Data</h4>
            <p>Usage Data is collected automatically when using the Service and may include Your device&apos;s Internet Protocol address, browser and device type, pages visited, the time and date of visits, time spent on pages, and other diagnostic data.</p>

            <h2>Tracking Technologies and Cookies</h2>
            <p>We use cookies and similar tracking technologies to analyze and improve Our Service. These may include:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Essential for Service functionality.</li>
              <li><strong>Persistent Cookies:</strong> Save Your preferences and login details.</li>
              <li><strong>Web Beacons:</strong> Track usage and engagement.</li>
            </ul>
            <p>You may disable cookies through Your browser settings, but some features may become unavailable.</p>

            <h2>Data Use and Sharing</h2>
            <p>We may use Personal Data to provide and maintain Our Service, contact You, respond to requests, improve the Service, and monitor usage. We do not share, sell, rent, trade, or disclose Your Personal Data to any third parties under any circumstances, except where disclosure is required by law or necessary to protect Our rights, users, or Service.</p>

            <h2>Security</h2>
            <p>We use commercially acceptable methods to protect Your Personal Data. However, no method of transmission over the Internet or electronic storage is 100% secure, and We cannot guarantee its absolute security.</p>

            <h2>Children&apos;s Privacy</h2>
            <p>Our Service is not intended for anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13. If We discover that such data has been collected, We will delete it promptly.</p>

            <h2>External Links</h2>
            <p>Our Website may contain links to third-party sites. We are not responsible for the content, privacy practices, or policies of those third-party websites.</p>

            <h2>Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with a new “Last updated” date. We recommend reviewing this page regularly.</p>

            <h2>Contact Us</h2>
            <p>If You have any questions about this Privacy Policy, You can contact us:</p>
            <ul>
              <li>By email: <a href="mailto:info@rlklein.com">info@rlklein.com</a></li>
              <li>By visiting: <Link to="/facilities/staffing-request">Contact Us</Link></li>
            </ul>

            <section className="privacy-policy__sms">
              <h2>Communications Consent</h2>
              <p>By submitting a form, You consent to receive communications that may include updates about Our services, product announcements, special offers, and other relevant content. Your personal information will not be shared for promotional purposes.</p>
              <p><strong>Message frequency:</strong> Messages may be sent up to once per week.</p>
              <p><strong>Types of messages:</strong> Updates on software solutions, service offerings, support alerts, promotional content, and industry news.</p>
              <p><strong>Data rates:</strong> Message and data rates may apply depending on Your mobile carrier.</p>
              <p><strong>HELP:</strong> For assistance, reply HELP to any message.</p>
              <p><strong>STOP/UNSUBSCRIBE:</strong> To opt out at any time, simply reply STOP.</p>
            </section>
          </article>

          <aside className="privacy-policy__aside">
            <div className="privacy-policy__contact">
              <span className="eyebrow">Get in touch</span>
              <h2>Questions about your privacy?</h2>
              <p>Our team is here to help clarify how your information is handled.</p>
              <a className="btn btn--primary btn--md" href="mailto:info@rlklein.com">Email Us</a>
              <a className="privacy-policy__phone" href="tel:5624275577">Main line: 562-427-5577</a>
              <a className="privacy-policy__phone" href="tel:5625127740">After hours: 562-512-7740</a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}