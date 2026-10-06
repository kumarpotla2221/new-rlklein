import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Building2, Clock3, HeartHandshake, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { SERVICE_AREAS } from '../../data/services';
import { photo, SPECIALTY_PHOTOS } from '../../data/images';

import HERO_IMAGE from '../../../RLklein Hero.jpg';
import HERO_VIDEO from '../../../rlklein bg.mp4';

const TEAM_IMAGE = photo('clinicalTeam', 1200);
const BASE = import.meta.env.BASE_URL;

const BENEFITS = [
  { icon: Clock3, title: 'Responsive support', text: 'A dependable team that stays close from first conversation through assignment.' },
  { icon: ShieldCheck, title: 'Compliance first', text: 'Credentialing, background verification, and facility requirements handled with care.' },
  { icon: BadgeCheck, title: 'Qualified placements', text: 'Healthcare professionals matched to the settings, specialties, and schedules they serve best.' },
  { icon: HeartHandshake, title: 'People-centered service', text: 'Clear communication and practical support for clinicians and facilities alike.' },
];

const INSIGHTS = [
  { title: 'Correctional Healthcare Orientation', category: 'Orientation', text: 'Understand clinical workflows, interdisciplinary protocols, and institutional requirements.', href: '/cdcr-healthcare/correctional-healthcare', image: photo('facilityLobby', 720) },
  { title: 'Credentialing & Onboarding', category: 'For professionals', text: 'Prepare for license verification, background clearance, and assignment readiness.', href: '/healthcare-professionals/credentialing-onboarding', image: photo('credentialing', 720) },
  { title: 'Workforce Continuity', category: 'For facilities', text: 'Explore practical ways public facilities can maintain coverage and care standards.', href: '/cdcr-healthcare/workforce-continuity', image: photo('supportiveCare', 720) },
];

const CERTIFICATIONS = [
  { code: 'MBE', label: 'Minority Business Enterprise', image: `${BASE}mbe.png` },
  { code: 'SBE', label: 'Small Business Enterprise', image: `${BASE}sbe.png` },
  { code: 'LSBE', label: 'Local Small Business Enterprise', image: `${BASE}lsbe.png` },
  { code: 'NMSDC', label: 'NMSDC Corporate Member', image: `${BASE}nmsdc.png` },
];

export function HomePageRefresh() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getFeaturedJobs(3)
      .then(setFeaturedJobs)
      .catch((error) => console.error('Failed to load featured jobs', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-refresh">
      {/* HERO */}
      <section className="refresh-hero" aria-label="Healthcare staffing introduction">
        <div className="refresh-hero__media">
          <video className="refresh-hero__video" src={HERO_VIDEO} autoPlay muted loop playsInline aria-hidden="true" />
          {/* Still image shown instead of the video when the visitor prefers reduced motion */}
          <img className="refresh-hero__still" src={HERO_IMAGE} alt="Three healthcare professionals in scrubs walking together" />
        </div>
        <div className="container refresh-hero__inner">
          <div className="refresh-hero__copy">
            <span className="eyebrow refresh-hero__eyebrow">Healthcare staffing since 1984</span>
            <h1>Your next healthcare opportunity <span>starts here.</span></h1>
            <p>R.L. Klein &amp; Associates connects qualified healthcare professionals with dependable opportunities and helps public and correctional facilities build stronger teams.</p>
            <div className="refresh-hero__actions">
              <Link to="/hot-jobs" className="btn btn--accent btn--lg">Find Your Next Role <ArrowRight size={18} /></Link>
              <Link to="/facilities/staffing-request" className="btn btn--outline-white btn--lg">Request Staffing</Link>
            </div>
            <div className="refresh-hero__proof">
              <span><strong>40+</strong> years of experience</span>
              <span><strong>Correctional</strong> healthcare expertise</span>
              <span><strong>100%</strong> compliance focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="refresh-pathways" aria-label="Opportunity search">
        <div className="container">
          <div className="refresh-pathways__card">
            <div className="refresh-pathway">
              <span className="refresh-pathway__icon"><Stethoscope size={22} aria-hidden="true" /></span>
              <div className="refresh-pathway__copy">
                <span className="eyebrow">For healthcare professionals</span>
                <h2>Find your next opportunity, wherever you are.</h2>
              </div>
              <Link to="/hot-jobs" className="btn btn--primary btn--md">Search Current Jobs <ArrowRight size={16} /></Link>
            </div>
            <div className="refresh-pathway">
              <span className="refresh-pathway__icon"><Building2 size={22} aria-hidden="true" /></span>
              <div className="refresh-pathway__copy">
                <span className="eyebrow">For facilities</span>
                <h2>Build a stronger, compliant care team.</h2>
              </div>
              <Link to="/facilities/staffing-request" className="btn btn--secondary btn--md">Request Staffing <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="section refresh-jobs" aria-label="Featured healthcare jobs">
        <div className="container">
          <div className="refresh-section-heading">
            <div><span className="eyebrow">Current opportunities</span><h2>Featured opportunities</h2><p>Explore open positions across healthcare settings and specialties.</p></div>
            <Link to="/hot-jobs" className="text-link">View all jobs <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <div className="jobs-grid" aria-busy="true" aria-label="Loading current opportunities">
              {[0, 1, 2].map((i) => <div className="refresh-skeleton" key={i}><span /><span /><span /><span /></div>)}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="jobs-grid">{featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
          ) : (
            <div className="refresh-empty"><p>New opportunities are being added regularly.</p><Link to="/hot-jobs" className="btn btn--secondary btn--sm">Browse all jobs</Link></div>
          )}
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="section refresh-disciplines" aria-label="Healthcare disciplines">
        <div className="container">
          <div className="refresh-section-heading">
            <div><span className="eyebrow">Who we place</span><h2>Professionals we proudly support</h2><p>Specialized workforce solutions for the people and facilities delivering essential care.</p></div>
          </div>
          <div className="refresh-discipline-grid">
            {SERVICE_AREAS.slice(0, 6).map((service) => (
              <Link to={service.slug} className="refresh-discipline" key={service.id}>
                <span className="refresh-discipline__media">
                  <img src={photo(SPECIALTY_PHOTOS[service.id], 720)} alt="" loading="lazy" />
                </span>
                <span className="refresh-discipline__body">
                  <strong>{service.title}</strong>
                  <small>{service.description}</small>
                  <span className="refresh-discipline__cta">Explore <ArrowRight size={15} /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENCE / BENEFITS */}
      <section className="section bg-white refresh-difference" aria-label="Why work with R.L. Klein">
        <div className="container refresh-difference__inner">
          <div className="refresh-difference__intro">
            <span className="eyebrow">The RLK difference</span>
            <h2>Built around better healthcare outcomes.</h2>
            <p>Our work is grounded in responsiveness, readiness, and long-term partnerships.</p>
            <Link to="/healthcare-professionals/how-it-works" className="text-link">How it works <ArrowRight size={16} /></Link>
          </div>
          <div className="refresh-benefits">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article className="refresh-benefit" key={title}>
                <span className="refresh-benefit__icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="refresh-story" aria-label="About R.L. Klein">
        <div className="container refresh-story__inner">
          <div className="refresh-story__media">
            <img src={TEAM_IMAGE} alt="Two clinicians reviewing patient imaging together" loading="lazy" />
            <div className="refresh-story__badge">
              <strong>40+</strong>
              <span>years supporting public &amp; correctional healthcare</span>
            </div>
          </div>
          <div className="refresh-story__copy">
            <span className="eyebrow">Meet R.L. Klein</span>
            <h2>A workforce partner you can count on.</h2>
            <p>For more than four decades, we have helped government, correctional, and institutional healthcare organizations find dependable professionals while supporting clinicians through each step of the process.</p>
            <p>We bring practical knowledge, responsive coordination, and a commitment to quality to every placement.</p>
            <div className="refresh-story__actions">
              <Link to="/about/who-we-are" className="btn btn--primary btn--md">Who We Are <ArrowRight size={16} /></Link>
              <Link to="/about/team" className="text-link">Meet our team <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="refresh-trust" aria-label="Certifications and credentials">
        <div className="container">
          <div className="refresh-trust__top">
            <div className="refresh-trust__intro">
              <span className="eyebrow">Verified credentials</span>
              <h2>Certified, compliant, and accountable.</h2>
              <p>R.L. Klein &amp; Associates maintains verified state, local, and national business certifications supporting government procurement and healthcare diversity.</p>
            </div>
            <dl className="refresh-trust__stats">
              <div><dt>Since 1984</dt><dd>Serving government healthcare clients</dd></div>
              <div><dt>4</dt><dd>Verified business certifications</dd></div>
              <div><dt>CA &amp; UT</dt><dd>Corporate, operational &amp; payroll offices</dd></div>
            </dl>
          </div>
          <div className="refresh-trust__certs">
            {CERTIFICATIONS.map((cert) => (
              <div className="refresh-cert" key={cert.code}>
                <span className="refresh-cert__logo"><img src={cert.image} alt={`${cert.code} certification`} loading="lazy" /></span>
                <span className="refresh-cert__text"><strong>{cert.code}</strong><small>{cert.label}</small></span>
              </div>
            ))}
          </div>
          <div className="refresh-trust__links">
            <Link to="/about/awards-recognition" className="refresh-trust__link"><BadgeCheck size={17} aria-hidden="true" /> Awards &amp; recognition <ArrowRight size={15} /></Link>
            <Link to="/about/safety-compliance" className="refresh-trust__link"><ShieldCheck size={17} aria-hidden="true" /> Safety &amp; compliance <ArrowRight size={15} /></Link>
            <Link to="/contact" className="refresh-trust__link"><MapPin size={17} aria-hidden="true" /> Our offices <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="section bg-off-white" aria-label="Resources and insights">
        <div className="container">
          <div className="refresh-section-heading"><div><span className="eyebrow">Resources</span><h2>Knowledge for the work ahead.</h2><p>Useful guidance for healthcare professionals and the organizations they serve.</p></div><Link to="/healthcare-professionals/faqs" className="text-link">Explore FAQs <ArrowRight size={16} /></Link></div>
          <div className="refresh-insights">
            {INSIGHTS.map(({ title, category, text, href, image }) => (
              <Link to={href} className="refresh-insight" key={title}>
                <span className="refresh-insight__media"><img src={image} alt="" loading="lazy" /></span>
                <span className="refresh-insight__body">
                  <span className="refresh-insight__category">{category}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="refresh-insight__cta">Read more <ArrowRight size={15} /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="refresh-final-cta" aria-label="Get started" style={{ backgroundImage: `url("${BASE}capabilities.jpg")` }}>
        <div className="container refresh-final-cta__inner">
          <div className="refresh-final-cta__copy">
            <span className="eyebrow">Let&apos;s get started</span>
            <h2>Good healthcare starts with the right people.</h2>
            <p>Whether you are exploring your next opportunity or building a stronger facility team, R.L. Klein is ready to help.</p>
          </div>
          <div className="refresh-final-cta__actions">
            <Link to="/hot-jobs" className="btn btn--accent btn--lg">Find Your Opportunity <ArrowRight size={18} /></Link>
            <Link to="/facilities/staffing-request" className="btn btn--outline-white btn--lg">Talk With Our Team</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
