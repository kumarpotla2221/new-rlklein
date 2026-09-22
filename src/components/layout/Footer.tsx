import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const FOOTER_NAV = [
  {
    heading: 'CDCR Healthcare',
    links: [
      { label: 'Correctional Healthcare', href: '/cdcr-healthcare/correctional-healthcare' },
      { label: 'Medical Staffing', href: '/cdcr-healthcare/medical-staffing' },
      { label: 'Mental & Behavioral Health', href: '/cdcr-healthcare/mental-behavioral-health' },
      { label: 'Dental Healthcare', href: '/cdcr-healthcare/dental-healthcare' },
      { label: 'Allied Health', href: '/cdcr-healthcare/allied-health' },
      { label: 'CDCR Opportunities', href: '/cdcr-healthcare/opportunities' },
    ],
  },
  {
    heading: 'Healthcare Professionals',
    links: [
      { label: 'How It Works', href: '/healthcare-professionals/how-it-works' },
      { label: 'Pay & Benefits', href: '/healthcare-professionals/pay-benefits' },
      { label: 'Meet Our Recruiters', href: '/healthcare-professionals/recruiters' },
      { label: 'Credentialing & Onboarding', href: '/healthcare-professionals/credentialing-onboarding' },
      { label: 'Apply Now', href: '/apply' },
      { label: 'FAQs', href: '/healthcare-professionals/faqs' },
    ],
  },
  {
    heading: 'Facilities',
    links: [
      { label: 'Capabilities', href: '/facilities/capabilities' },
      { label: 'Staffing Request', href: '/facilities/staffing-request' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Find Your Next Role', href: '/hot-jobs' },
      { label: 'Who We Are', href: '/about/who-we-are' },
      { label: 'Our Team', href: '/about/team' },
      { label: 'Awards & Recognition', href: '/about/awards-recognition' },
      { label: 'Safety & Compliance', href: '/about/safety-compliance' },
      { label: 'Resources', href: '/resources' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Top */}
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <div className="site-footer__logo">
              <img src={`${import.meta.env.BASE_URL}rlk-secondary.png`} alt="R.L. Klein Inc. & Associates" />
            </div>
            <p className="site-footer__tagline">
              Healthcare staffing and workforce solutions for government and correctional healthcare environments. Dependable. Compliance-focused. People-centered.
            </p>
            <div className="site-footer__contact-block">
              <a href="tel:5624275577" className="site-footer__contact-item">
                <Phone size={14} />
                <span>562-427-5577</span>
              </a>
              <a href="tel:5625127740" className="site-footer__contact-item">
                <Phone size={14} />
                <span>562-512-7740 (After Hours)</span>
              </a>
              <a href="mailto:info@rlklein.com" className="site-footer__contact-item">
                <Mail size={14} />
                <span>info@rlklein.com</span>
              </a>
              <a href="mailto:operations@rlklein.com" className="site-footer__contact-item">
                <Mail size={14} />
                <span>operations@rlklein.com</span>
              </a>
              <div className="site-footer__contact-item">
                <Clock size={14} />
                <span>Mon–Sat, 9 AM–6 PM PST</span>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="site-footer__nav">
            {FOOTER_NAV.map(col => (
              <div key={col.heading} className="site-footer__col">
                <h4 className="site-footer__col-heading">{col.heading}</h4>
                <ul className="site-footer__col-links">
                  {col.links.map(link => (
                    <li key={link.href}>
                      <Link to={link.href} className="site-footer__link">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Offices */}
        <div className="site-footer__offices">
          <div className="site-footer__office">
            <div className="site-footer__office-label">Corporate HQ</div>
            <div className="site-footer__office-addr">46 E Peninsula Center Drive, #298 · Rolling Hills Estates, CA 90274</div>
          </div>
          <div className="site-footer__office">
            <div className="site-footer__office-label">Operational HQ</div>
            <div className="site-footer__office-addr">504 West 800 North · Orem, UT 84057</div>
          </div>
          <div className="site-footer__office">
            <div className="site-footer__office-label">Payroll Management</div>
            <div className="site-footer__office-addr">59 West 3140 North · Provo, UT 84604</div>
          </div>
        </div>

        <div className="site-footer__certifications" aria-label="Business certifications">
          <span className="site-footer__certifications-label">Certified business enterprise</span>
          <div className="site-footer__certification-logos">
            <img src={`${import.meta.env.BASE_URL}sbe.png`} alt="Small Business Enterprise certification" />
            <img src={`${import.meta.env.BASE_URL}mbe.png`} alt="Minority Business Enterprise certification" />
            <img src={`${import.meta.env.BASE_URL}lsbe.png`} alt="Local Small Business Enterprise certification" />
            <img src={`${import.meta.env.BASE_URL}nmsdc.png`} alt="NMSDC certification" />
          </div>
        </div>

        {/* Bottom */}
        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            &copy; {year} R.L. Klein &amp; Associates. All rights reserved. 
          </p>
          <nav className="site-footer__legal" aria-label="Legal navigation">
            <Link to="/privacy-policy" className="site-footer__legal-link">Privacy Policy</Link>
            <Link to="/terms" className="site-footer__legal-link">Terms of Use</Link>
            <Link to="/consent-agreement" className="site-footer__legal-link">Consent Agreement</Link>
            <Link to="/about/safety-compliance" className="site-footer__legal-link">Safety &amp; Compliance</Link>
            <Link to="/admin" className="site-footer__legal-link">Admin Portal</Link>
            <a href="mailto:info@rlklein.com" className="site-footer__legal-link">Accessibility</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
