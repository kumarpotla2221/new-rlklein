import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string; description?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'CDCR Healthcare',
    children: [
      { label: 'Correctional Healthcare', href: '/cdcr-healthcare/correctional-healthcare', description: 'Specialized staffing for correctional facilities' },
      { label: 'Medical Staffing', href: '/cdcr-healthcare/medical-staffing', description: 'Physicians, nurses and medical professionals' },
      { label: 'Mental & Behavioral Health', href: '/cdcr-healthcare/mental-behavioral-health', description: 'Psychiatrists, psychologists, social workers' },
      { label: 'Dental Healthcare', href: '/cdcr-healthcare/dental-healthcare', description: 'Dental professionals for correctional care' },
      { label: 'Allied Health', href: '/cdcr-healthcare/allied-health', description: 'Pharmacy, lab, radiology and therapy' },
      { label: 'Compliance & Credentialing', href: '/cdcr-healthcare/compliance-credentialing', description: 'Qualification and credentialing process' },
      { label: 'Workforce Continuity', href: '/cdcr-healthcare/workforce-continuity', description: 'Staffing coverage and workforce planning' },
      { label: 'CDCR Facilities', href: '/cdcr-healthcare/facilities', description: 'California facility locations' },
      { label: 'CDCR Opportunities', href: '/cdcr-healthcare/opportunities', description: 'Current CDCR job openings' },
    ],
  },
  {
    label: 'Healthcare Professionals',
    children: [
      { label: 'How It Works', href: '/healthcare-professionals/how-it-works', description: 'Your journey from search to placement' },
      { label: 'Pay & Benefits', href: '/healthcare-professionals/pay-benefits', description: 'Compensation and benefit information' },
      { label: 'Meet Our Recruiters', href: '/healthcare-professionals/recruiters', description: 'Connect with our recruitment team' },
      { label: 'Credentialing & Onboarding', href: '/healthcare-professionals/credentialing-onboarding', description: 'Credential and onboarding process' },
      { label: 'Healthcare Opportunities', href: '/healthcare-professionals/opportunities', description: 'Browse all available positions' },
      { label: 'Apply Now', href: '/apply', description: 'Submit your application' },
      { label: 'FAQs', href: '/healthcare-professionals/faqs', description: 'Frequently asked questions' },
    ],
  },
  {
    label: 'Facilities',
    children: [
      { label: 'Capabilities', href: '/facilities/capabilities', description: 'Our healthcare staffing capabilities' },
      { label: 'Staffing Request', href: '/facilities/staffing-request', description: 'Submit your staffing requirement' },
    ],
  },
  { label: 'Hot Jobs', href: '/hot-jobs' },
  {
    label: 'About Us',
    children: [
      { label: 'Who We Are', href: '/about/who-we-are', description: 'Our history and mission' },
      { label: 'Our Team', href: '/about/team', description: 'Leadership and key personnel' },
      { label: 'Awards & Recognition', href: '/about/awards-recognition', description: 'Certifications and awards' },
      { label: 'Safety & Compliance', href: '/about/safety-compliance', description: 'Our compliance commitment' },
      { label: 'FAQs', href: '/about/faqs', description: 'Frequently asked questions' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href?: string) => href ? location.pathname === href || location.pathname.startsWith(href + '/') : false;

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}
        role="banner"
      >
        <div className="container site-header__inner">
          {/* Logo */}
          <Link to="/" className="site-header__logo" aria-label="R.L. Klein & Associates — Home">
            <RLKLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="site-nav" aria-label="Main navigation" role="navigation">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="site-nav__item"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`site-nav__link ${isActive(item.href) ? 'site-nav__link--active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className={`site-nav__link site-nav__link--dropdown ${item.children?.some(c => isActive(c.href)) ? 'site-nav__link--active' : ''}`}
                    aria-expanded={activeDropdown === item.label}
                    aria-haspopup="true"
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown size={14} className={`site-nav__chevron ${activeDropdown === item.label ? 'rotated' : ''}`} />
                  </button>
                )}

                {item.children && (
                  <div
                    className={`site-nav__dropdown ${activeDropdown === item.label ? 'site-nav__dropdown--open' : ''}`}
                    role="menu"
                  >
                    <div className="site-nav__dropdown-inner">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`site-nav__dropdown-item ${isActive(child.href) ? 'site-nav__dropdown-item--active' : ''}`}
                          role="menuitem"
                        >
                          <span className="site-nav__dropdown-label">{child.label}</span>
                          {child.description && (
                            <span className="site-nav__dropdown-desc">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="site-header__ctas">
            <Link to="/facilities/staffing-request" className="header-staffing-cta" aria-label="Request staffing">
              <span>Request Staffing</span>
              <ArrowRight size={18} strokeWidth={2.25} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="site-header__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="mobile-menu__header">
          <Link to="/" className="mobile-menu__logo" onClick={() => setMobileOpen(false)}>
            <RLKLogo />
          </Link>
          <button
            className="mobile-menu__close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mobile-menu__body">
          <div className="mobile-menu__ctas">
            <Link to="/hot-jobs" className="btn btn--accent btn--full" onClick={() => setMobileOpen(false)}>
              Find Jobs
            </Link>
            <Link to="/facilities/staffing-request" className="btn btn--secondary btn--full" onClick={() => setMobileOpen(false)}>
              Request Staffing
            </Link>
          </div>

          <nav className="mobile-nav" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="mobile-nav__item">
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`mobile-nav__link ${isActive(item.href) ? 'mobile-nav__link--active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      className="mobile-nav__link mobile-nav__link--toggle"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      aria-expanded={mobileExpanded === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`mobile-nav__chevron ${mobileExpanded === item.label ? 'rotated' : ''}`}
                      />
                    </button>
                    {item.children && mobileExpanded === item.label && (
                      <div className="mobile-nav__sub">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="mobile-nav__sub-link"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="mobile-menu__contact">
            <a href="tel:5624275577" className="mobile-menu__phone">562-427-5577</a>
            <a href="mailto:info@rlklein.com" className="mobile-menu__email">info@rlklein.com</a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

function RLKLogo() {
  return (
    <img className="rlk-logo" src="/rlklein-logo.png" alt="R.L. Klein Inc. & Associates" />
  );
}
