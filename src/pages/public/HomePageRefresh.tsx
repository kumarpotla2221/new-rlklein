import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Building2, Clock3, FileCheck2, HeartHandshake, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { SERVICE_AREAS } from '../../data/services';

import HERO_IMAGE from '../../../RLklein Hero.jpg';
const TEAM_IMAGE = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85';

const BENEFITS = [
  { icon: Clock3, title: 'Responsive support', text: 'A dependable team that stays close from first conversation through assignment.' },
  { icon: ShieldCheck, title: 'Compliance first', text: 'Credentialing, background verification, and facility requirements handled with care.' },
  { icon: BadgeCheck, title: 'Qualified placements', text: 'Healthcare professionals matched to the settings, specialties, and schedules they serve best.' },
  { icon: HeartHandshake, title: 'People-centered service', text: 'Clear communication and practical support for clinicians and facilities alike.' },
];

const INSIGHTS = [
  { title: 'Correctional Healthcare Orientation', text: 'Understand clinical workflows, interdisciplinary protocols, and institutional requirements.', href: '/cdcr-healthcare/correctional-healthcare', icon: Stethoscope },
  { title: 'Credentialing & Onboarding', text: 'Prepare for license verification, background clearance, and assignment readiness.', href: '/healthcare-professionals/credentialing-onboarding', icon: FileCheck2 },
  { title: 'Workforce Continuity', text: 'Explore practical ways public facilities can maintain coverage and care standards.', href: '/cdcr-healthcare/workforce-continuity', icon: Building2 },
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
      <section
        className="refresh-hero"
        aria-label="Healthcare staffing introduction"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(13, 34, 64, 0.9) 0%, rgba(13, 34, 64, 0.7) 48%, rgba(13, 34, 64, 0.2) 100%), url("${HERO_IMAGE}")` }}
      >
        <div className="container refresh-hero__inner">
          <div className="refresh-hero__copy">
            <span className="eyebrow refresh-hero__eyebrow">Healthcare staffing since 1984</span>
            <h1>Your next healthcare opportunity starts here.</h1>
            <p>R.L. Klein &amp; Associates connects qualified healthcare professionals with dependable opportunities and helps public and correctional facilities build stronger teams.</p>
            <div className="refresh-hero__actions">
              <Link to="/hot-jobs" className="btn btn--accent btn--lg">Find Your Next Role <ArrowRight size={17} /></Link>
              <Link to="/facilities/staffing-request" className="btn btn--outline-white btn--lg">Request Staffing</Link>
            </div>
            <div className="refresh-hero__proof">
              <span><strong>40+</strong> years of experience</span>
              <span><strong>CDCR</strong> healthcare expertise</span>
              <span><strong>100%</strong> compliance focused</span>
            </div>
          </div>
        </div>
      </section>

      <section className="refresh-search-band" aria-label="Opportunity search">
        <div className="container refresh-search-band__inner">
          <div>
            <span className="eyebrow">For healthcare professionals</span>
            <h2>Find your next opportunity, wherever you are.</h2>
          </div>
          <Link to="/hot-jobs" className="btn btn--primary btn--md">Search Current Jobs <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="section bg-white" aria-label="Featured healthcare jobs">
        <div className="container">
          <div className="refresh-section-heading">
            <div><span className="eyebrow">Current opportunities</span><h2>Featured Find Your Next Role</h2><p>Explore open positions across healthcare settings and specialties.</p></div>
            <Link to="/hot-jobs" className="text-link">View all jobs <ArrowRight size={15} /></Link>
          </div>
          {loading ? <div className="refresh-loading">Loading current opportunities...</div> : featuredJobs.length > 0 ? (
            <div className="jobs-grid">{featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
          ) : (
            <div className="refresh-empty"><p>New opportunities are being added regularly.</p><Link to="/hot-jobs" className="btn btn--secondary btn--sm">Browse all jobs</Link></div>
          )}
        </div>
      </section>

      <section className="section refresh-disciplines" aria-label="Healthcare disciplines">
        <div className="container">
          <div className="refresh-section-heading refresh-section-heading--center"><div><span className="eyebrow">Who we place</span><h2>Professionals we proudly support</h2><p>Specialized workforce solutions for the people and facilities delivering essential care.</p></div></div>
          <div className="refresh-discipline-grid">
            {SERVICE_AREAS.slice(0, 6).map((service) => <Link to={service.slug} className="refresh-discipline" key={service.id}><span className="refresh-discipline__icon"><Stethoscope size={22} /></span><span><strong>{service.title}</strong><small>{service.description}</small></span><ArrowRight size={17} /></Link>)}
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-label="Why work with R.L. Klein">
        <div className="container">
          <div className="refresh-section-heading refresh-section-heading--center"><div><span className="eyebrow">The RLK difference</span><h2>Built around better healthcare outcomes.</h2><p>Our work is grounded in responsiveness, readiness, and long-term partnerships.</p></div></div>
          <div className="refresh-benefits">{BENEFITS.map(({ icon: Icon, title, text }) => <article className="refresh-benefit" key={title}><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="refresh-story" aria-label="About R.L. Klein">
        <div className="container refresh-story__inner">
          <div className="refresh-story__media"><img src={TEAM_IMAGE} alt="Healthcare staffing team collaborating in an office" /></div>
          <div className="refresh-story__copy"><span className="eyebrow">Meet R.L. Klein</span><h2>A workforce partner you can count on.</h2><p>For more than four decades, we have helped government, correctional, and institutional healthcare organizations find dependable professionals while supporting clinicians through each step of the process.</p><p>We bring practical knowledge, responsive coordination, and a commitment to quality to every placement.</p><div className="refresh-story__actions"><Link to="/about/who-we-are" className="btn btn--primary btn--md">Who We Are <ArrowRight size={16} /></Link><Link to="/about/team" className="text-link">Meet our team <ArrowRight size={15} /></Link></div></div>
        </div>
      </section>

      <section className="section bg-off-white" aria-label="Resources and insights">
        <div className="container">
          <div className="refresh-section-heading"><div><span className="eyebrow">Resources</span><h2>Knowledge for the work ahead.</h2><p>Useful guidance for healthcare professionals and the organizations they serve.</p></div><Link to="/healthcare-professionals/faqs" className="text-link">Explore FAQs <ArrowRight size={15} /></Link></div>
          <div className="refresh-insights">{INSIGHTS.map(({ title, text, href, icon: Icon }) => <Link to={href} className="refresh-insight" key={title}><Icon size={24} /><h3>{title}</h3><p>{text}</p><span>Read more <ArrowRight size={14} /></span></Link>)}</div>
        </div>
      </section>

      <section className="refresh-final-cta" aria-label="Get started">
        <div className="container"><Users size={34} /><span className="eyebrow">Let&apos;s get started</span><h2>Good healthcare starts with the right people.</h2><p>Whether you are exploring your next opportunity or building a stronger facility team, R.L. Klein is ready to help.</p><div className="refresh-final-cta__actions"><Link to="/hot-jobs" className="btn btn--accent btn--lg">Find Your Opportunity</Link><Link to="/facilities/staffing-request" className="btn btn--outline-white btn--lg">Talk With Our Team</Link></div></div>
      </section>
    </div>
  );
}
