import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';

export function TermsOfUsePage() {
  return (
    <div className="terms-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Legal &amp; Terms</span>
            <h1>Terms of Use</h1>
            <p className="page-hero__subtitle">The terms governing your access to and use of the R.L. Klein website and services.</p>
          </div>
        </div>
      </header>

      <main className="section bg-white">
        <div className="container privacy-policy__layout">
          <article className="privacy-policy__content">
            <p>These Terms and Conditions govern your use of the Service and form the agreement between you and R.L. Klein &amp; Associates Inc. By accessing or using the Service, you agree to be bound by these Terms.</p>

            <h2>Message Communications</h2>
            <p>By submitting a form, you consent to receive messages from R.L. Klein &amp; Associates Inc. at the contact information you provide. These messages may include updates about our services, product announcements, special offers, and other relevant communications. Your personal information will not be shared for promotional purposes.</p>
            <p><strong>Message frequency:</strong> Messages may be sent up to once per week.</p>
            <p><strong>Types of messages:</strong> You may receive updates on software solutions, service offerings, support alerts, promotional content, and industry news.</p>
            <p><strong>Data rates disclosure:</strong> Message and data rates may apply depending on your mobile carrier.</p>
            <p><strong>HELP information:</strong> For assistance, reply HELP to any message.</p>
            <p><strong>STOP/UNSUBSCRIBE information:</strong> To opt out at any time, simply reply STOP.</p>
            <p>To learn more about our services, visit <a href="https://www.rlklein.com/">www.rlklein.com</a>.</p>

            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>Words with capitalized initials have meanings defined under the conditions below. These definitions apply whether they appear in singular or plural.</p>
            <h3>Definitions</h3>
            <p>For the purposes of these Terms:</p>
            <ul>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party. “Control” means ownership of 50% or more of the voting shares or other managing authority.</li>
              <li><strong>Country</strong> refers to: Andhra Pradesh, India.</li>
              <li><strong>Company</strong> (referred to as either “the Company”, “We”, “Us” or “Our”) refers to R.L. Klein &amp; Associates Inc.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, cellphone, or tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
              <li><strong>Terms and Conditions</strong> (also referred to as “Terms”) are the terms governing the use of the Service and the agreement between You and the Company.</li>
              <li><strong>Website</strong> refers to R.L. Klein &amp; Associates Inc., accessible from <a href="https://www.rlklein.com/">www.rlklein.com</a>.</li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company or legal entity on behalf of which that individual is using the Service.</li>
            </ul>

            <h2>Acknowledgment</h2>
            <p>These Terms and Conditions govern your use of the Service and form the agreement between you and the Company. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part, you may not access the Service.</p>
            <p>You confirm that you are at least 18 years old. The Service is not intended for users under 18.</p>
            <p>Your access to and use of the Service is also subject to our <Link to="/privacy-policy">Privacy Policy</Link>, which outlines how we handle your personal information. Please review it carefully.</p>

            <h2>Links to Other Websites</h2>
            <p>Our Service may contain links to third-party websites or services not owned or controlled by the Company. We are not responsible for their content, privacy policies, or practices. You acknowledge and agree that we are not liable for any damage or loss arising from such external sites or services.</p>
            <p>We recommend you read the terms and policies of any third-party websites you visit.</p>

            <h2>Termination</h2>
            <p>We may terminate or suspend your access immediately, without notice or liability, if you breach these Terms.</p>
            <p>Upon termination, your right to use the Service ceases immediately.</p>

            <h2>Limitation of Liability</h2>
            <p>To the fullest extent permitted by applicable law, the Company&apos;s liability shall be limited to the greater of the amount paid by you through the Service or $100 if no purchases were made.</p>
            <p>We shall not be liable for indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data, or privacy, even if advised of such possibilities.</p>
            <p>Some jurisdictions do not allow these exclusions, so they may not apply to you in full.</p>

            <h2>“As Is” and “As Available” Disclaimer</h2>
            <p>The Service is provided “as is” and “as available” without warranties of any kind. We do not guarantee the Service will be uninterrupted or error-free, or that it will meet your expectations.</p>
            <p>No warranties are made regarding compatibility, reliability, or security. Use of the Service is at your sole risk.</p>

            <h2>Governing Law</h2>
            <p>These Terms are governed by the laws of Andhra Pradesh, India, without regard to conflict of law principles.</p>

            <h2>Dispute Resolution</h2>
            <p>If you have a dispute with us, you agree to first attempt to resolve it informally by contacting the Company.</p>

            <h2>For European Union Users</h2>
            <p>If you are an EU resident, you may benefit from additional rights under the consumer protection laws of your country of residence.</p>

            <h2>United States Legal Compliance</h2>
            <p>You represent and warrant that:</p>
            <ul>
              <li>You are not located in a country subject to U.S. government embargo.</li>
              <li>You are not listed on any U.S. government list of prohibited or restricted parties.</li>
            </ul>

            <h2>Severability and Waiver</h2>
            <p>If any provision of these Terms is found to be unenforceable, the rest shall remain in full force.</p>
            <p>Failure to enforce any right does not constitute a waiver of future enforcement.</p>

            <h2>Translation Interpretation</h2>
            <p>If these Terms have been translated into other languages, the English version shall prevail in case of conflict.</p>

            <h2>Changes to These Terms and Conditions</h2>
            <p>We may revise these Terms at our discretion. If a change is material, we will provide at least 30 days&apos; notice. Continued use of the Service after changes take effect constitutes your acceptance of the new Terms.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:info@rlklein.com">info@rlklein.com</a></li>
              <li>Website: <Link to="/facilities/staffing-request">www.rlklein.com/contact</Link></li>
            </ul>
          </article>

          <aside className="privacy-policy__aside">
            <div className="privacy-policy__contact">
              <span className="eyebrow">Get in touch</span>
              <h2>Questions about these terms?</h2>
              <p>Contact our team if you need clarification about using the Service.</p>
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