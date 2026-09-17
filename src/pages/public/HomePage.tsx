import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { InteractiveUSMap } from '../../components/map/InteractiveUSMap';
import { SERVICE_AREAS } from '../../data/services';
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  ArrowRight, 
  Users, 
  Building2, 
  FileCheck2, 
  HeartHandshake, 
  Stethoscope,
  BookOpen
} from 'lucide-react';

export function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const jobs = await jobService.getFeaturedJobs(6);
        setFeaturedJobs(jobs);
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* 11 — HERO SECTION */}
      <section className="hero" aria-label="Hero Introduction">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__content">
              <span className="hero__eyebrow">Established Healthcare Staffing &middot; Since 1984</span>
              <h1 className="hero__headline">
                Healthcare Staffing Built for Government &amp; Correctional Care.
              </h1>
              <p className="hero__supporting">
                Connecting government and correctional healthcare organizations with qualified healthcare professionals through dependable, compliance-focused workforce solutions.
              </p>
              
              <div className="hero__actions">
                <Link to="/hot-jobs" className="btn btn--accent btn--lg">
                  <span>Find Healthcare Opportunities</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/facilities/staffing-request" className="btn btn--outline-white btn--lg">
                  Request Staffing
                </Link>
              </div>

              <div className="hero__trust">
                <div className="hero__trust-item">
                  <span className="hero__trust-value">40+</span>
                  <span className="hero__trust-label">Years Experience</span>
                </div>
                <div className="hero__trust-item">
                  <span className="hero__trust-value">CDCR</span>
                  <span className="hero__trust-label">Correctional Healthcare</span>
                </div>
                <div className="hero__trust-item">
                  <span className="hero__trust-value">Public</span>
                  <span className="hero__trust-label">Sector Healthcare</span>
                </div>
                <div className="hero__trust-item">
                  <span className="hero__trust-value">100%</span>
                  <span className="hero__trust-label">Compliance Focused</span>
                </div>
              </div>
            </div>

            {/* 12 — HERO IMAGE: Editorial, realistic, institutional */}
            <div className="hero__image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                alt="Healthcare professionals team in clinical consultation"
                className="hero__image"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 13 — TRUSTED ORGANIZATIONS / LOGO CLOUD */}
      <section className="logo-cloud-section" aria-label="Trusted Organizations">
        <div className="container">
          <p className="logo-cloud__label">
            Trusted by Government &amp; Institutional Healthcare Organizations
          </p>
          <div className="logo-cloud__grid">
            <div className="logo-cloud__item">
              <span className="logo-cloud__name">State Corrections &amp; Rehabilitation</span>
            </div>
            <div className="logo-cloud__item">
              <span className="logo-cloud__name">California Department of Corrections</span>
            </div>
            <div className="logo-cloud__item">
              <span className="logo-cloud__name">Institutional Healthcare Systems</span>
            </div>
            <div className="logo-cloud__item">
              <span className="logo-cloud__name">County Health &amp; Behavioral Facilities</span>
            </div>
            <div className="logo-cloud__item">
              <span className="logo-cloud__name">Public Health &amp; Specialized Clinics</span>
            </div>
          </div>
        </div>
      </section>

      {/* 14 — INTERACTIVE USA MAP */}
      <section className="map-section" aria-label="National Reach and Regional Presence">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Workforce Coverage</span>
            <h2>Regional Focus &amp; National Capabilities</h2>
            <p className="section-heading__subtitle">
              With dedicated headquarters in California and operational management in Utah, R.L. Klein &amp; Associates delivers healthcare staffing expertise with focused regional presence.
            </p>
          </div>
          <InteractiveUSMap />
        </div>
      </section>

      {/* 15 — EXPERIENCE / TRUST SECTION */}
      <section className="experience-section" aria-label="Company Experience and Credibility">
        <div className="container">
          <div className="section-heading section-heading--light">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Institutional Track Record</span>
            <h2>Experience That Supports Better Healthcare</h2>
            <p className="section-heading__subtitle">
              For four decades, R.L. Klein &amp; Associates has stood as a dependable partner to public institutions and healthcare professionals alike.
            </p>
          </div>

          <div className="experience-grid">
            <div className="experience-stat">
              <span className="experience-stat__num">40+</span>
              <span className="experience-stat__title">Years of Experience</span>
              <p className="experience-stat__desc">Continuous operation supporting public healthcare and staffing since 1984.</p>
            </div>
            <div className="experience-stat">
              <span className="experience-stat__num">1984</span>
              <span className="experience-stat__title">Founded</span>
              <p className="experience-stat__desc">Incorporated in 1997 with institutional focus in specialized workforce delivery.</p>
            </div>
            <div className="experience-stat">
              <span className="experience-stat__num">Govt</span>
              <span className="experience-stat__title">Healthcare Focus</span>
              <p className="experience-stat__desc">Proven compliance with rigorous state, federal, and correctional mandates.</p>
            </div>
            <div className="experience-stat">
              <span className="experience-stat__num">National</span>
              <span className="experience-stat__title">Workforce Solutions</span>
              <p className="experience-stat__desc">Comprehensive recruitment, credentialing, and ongoing assignment support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 16 — HEALTHCARE WORKFORCE SOLUTIONS */}
      <section className="section bg-off-white" aria-label="Healthcare Workforce Solutions">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Specialized Disciplines</span>
            <h2>Healthcare Workforce Solutions</h2>
            <p className="section-heading__subtitle">
              Tailored staffing solutions designed around the operational complexities of institutional and government healthcare environments.
            </p>
          </div>

          <div className="services-grid">
            {SERVICE_AREAS.map((srv) => (
              <div key={srv.id} className="service-card">
                <div className="service-card__icon" aria-hidden="true">
                  <Stethoscope size={24} />
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
                <Link to={srv.slug} className="service-card__link">
                  <span>Learn more</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17 — R.L. KLEIN DIFFERENCE (EDITORIAL LAYOUT) */}
      <section className="section bg-white" aria-label="The R.L. Klein Difference">
        <div className="container">
          <div className="difference-layout">
            <div className="difference-items">
              <div className="section-heading" style={{ marginBottom: 24 }}>
                <span className="eyebrow">Why Organizations Choose Us</span>
                <h2>The R.L. Klein Difference</h2>
                <p className="section-heading__subtitle">
                  We bridge the gap between healthcare talent and demanding facilities through methodical screening, credentialing, and continuous partnership.
                </p>
              </div>

              <div className="difference-item">
                <span className="difference-num">01</span>
                <div className="difference-text">
                  <h4>40+ Years of Experience</h4>
                  <p>Decades of institutional knowledge in complex healthcare environments that generic staffing agencies cannot replicate.</p>
                </div>
              </div>

              <div className="difference-item">
                <span className="difference-num">02</span>
                <div className="difference-text">
                  <h4>Compliance-Focused Staffing</h4>
                  <p>Comprehensive credential verification, license checks, background clearances, and strict alignment with state standards.</p>
                </div>
              </div>

              <div className="difference-item">
                <span className="difference-num">03</span>
                <div className="difference-text">
                  <h4>Qualified Healthcare Professionals</h4>
                  <p>Rigorous vetting ensuring professionals are clinically prepared and comfortable in institutional settings.</p>
                </div>
              </div>

              <div className="difference-item">
                <span className="difference-num">04</span>
                <div className="difference-text">
                  <h4>Government Healthcare Experience</h4>
                  <p>Deep familiarity with state agency procedures, billing expectations, and operational protocols.</p>
                </div>
              </div>

              <div className="difference-item">
                <span className="difference-num">05</span>
                <div className="difference-text">
                  <h4>Workforce Continuity &amp; Responsive Support</h4>
                  <p>Proactive candidate pipelines ensuring shift coverage and stability across all facility departments.</p>
                </div>
              </div>
            </div>

            <div className="difference-callout">
              <Award size={36} style={{ color: '#A0B0E0' }} />
              <h3>Institutional Reliability Meets Personal Support</h3>
              <p>
                Whether you are a medical director needing immediate shift coverage or a physician seeking a predictable schedule, R.L. Klein delivers responsive, human-driven coordination.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={20} style={{ color: '#4ADE80' }} />
                  <span style={{ fontSize: '15px', color: '#fff' }}>Verified credentials &amp; background clearance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={20} style={{ color: '#4ADE80' }} />
                  <span style={{ fontSize: '15px', color: '#fff' }}>After-hours operational line (562-512-7740)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HeartHandshake size={20} style={{ color: '#4ADE80' }} />
                  <span style={{ fontSize: '15px', color: '#fff' }}>Zero applicant friction — no account required</span>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Link to="/about/who-we-are" className="btn btn--outline-white btn--md">
                  Read Our Full Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 18 & 19 — AUDIENCE PATHWAYS (SPLIT LAYOUTS) */}
      <section className="section bg-off-white" aria-label="Healthcare Professionals Pathway">
        <div className="container">
          <div className="split-section">
            <div className="split-section__image-wrap">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Physician and healthcare colleague reviewing documentation"
                className="split-section__image"
                loading="lazy"
              />
            </div>
            <div className="split-section__content">
              <span className="eyebrow">For Healthcare Workers</span>
              <h2>Your Skills. Your Career. Your Next Opportunity.</h2>
              <p>
                Healthcare professionals can explore current opportunities, connect directly with recruiters, complete credentialing and onboarding, and apply for rewarding positions.
              </p>
              <p>
                We value your time: <strong>no account creation or candidate login is required</strong>. View open roles, submit your details, and our recruitment team will handle the rest.
              </p>
              <div className="split-section__actions">
                <Link to="/hot-jobs" className="btn btn--primary btn--md">
                  Find Jobs
                </Link>
                <Link to="/healthcare-professionals/recruiters" className="btn btn--secondary btn--md">
                  Meet Our Recruiters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-label="Healthcare Facilities Pathway">
        <div className="container">
          <div className="split-section split-section--reverse">
            <div className="split-section__image-wrap">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                alt="Institutional hospital and healthcare facility exterior"
                className="split-section__image"
                loading="lazy"
              />
            </div>
            <div className="split-section__content">
              <span className="eyebrow">For Healthcare Organizations</span>
              <h2>Your Workforce. Our Expertise.</h2>
              <p>
                R.L. Klein helps government healthcare organizations, correctional healthcare facilities, and institutional providers identify qualified professionals and address urgent staffing requirements.
              </p>
              <p>
                From per-diem nursing to full-time physician placements and specialized behavioral health teams, our rigorous credentialing ensures immediate assignment readiness.
              </p>
              <div className="split-section__actions">
                <Link to="/facilities/staffing-request" className="btn btn--primary btn--md">
                  Request Staffing
                </Link>
                <Link to="/facilities/capabilities" className="btn btn--secondary btn--md">
                  View Capabilities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 20 — HOT JOBS HOMEPAGE (DYNAMICALLY LOADED FROM JOB SERVICE) */}
      <section className="section bg-off-white" aria-label="Featured Hot Jobs">
        <div className="container">
          <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow">Immediate Openings</span>
              <h2>Hot Jobs</h2>
              <p className="section-heading__subtitle">
                Explore current healthcare opportunities with R.L. Klein &amp; Associates.
              </p>
            </div>
            <Link to="/hot-jobs" className="btn btn--secondary btn--md">
              <span>View All Hot Jobs</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p>Loading current opportunities...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', background: '#fff', borderRadius: 8 }}>
              <p>No hot jobs are currently available. Check back soon for new opportunities.</p>
              <Link to="/hot-jobs" className="btn btn--primary btn--sm" style={{ marginTop: 16 }}>Browse All Jobs</Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/hot-jobs" className="btn btn--primary btn--lg">
              <span>View All Available Hot Jobs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* RESOURCES PREVIEW */}
      <section className="section bg-white" aria-label="Insights and Resources">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Institutional Knowledge</span>
            <h2>Resources &amp; Staffing Insights</h2>
            <p className="section-heading__subtitle">
              Guidance on credentialing, government compliance, and career pathways in specialized healthcare settings.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <BookOpen size={24} style={{ color: 'var(--color-navy)' }} />
              <h3>Correctional Healthcare Orientation</h3>
              <p>Understanding clinical workflows, interdisciplinary protocols, and institutional security requirements.</p>
              <Link to="/cdcr-healthcare/correctional-healthcare" className="service-card__link">
                <span>Read guide</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="service-card">
              <FileCheck2 size={24} style={{ color: 'var(--color-navy)' }} />
              <h3>Credentialing &amp; License Verification</h3>
              <p>Step-by-step checklist of documents, state verifications, and compliance milestones required for placement.</p>
              <Link to="/healthcare-professionals/credentialing-onboarding" className="service-card__link">
                <span>View requirements</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="service-card">
              <Building2 size={24} style={{ color: 'var(--color-navy)' }} />
              <h3>Workforce Continuity for Public Facilities</h3>
              <p>Strategies for addressing clinical vacancies while maintaining patient care standards and regulatory compliance.</p>
              <Link to="/cdcr-healthcare/workforce-continuity" className="service-card__link">
                <span>Learn more</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="section bg-navy text-white" aria-label="Get in Touch">
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <span className="eyebrow" style={{ color: '#A0B0D8' }}>Start the Conversation</span>
          <h2 style={{ color: '#fff', marginTop: 12, marginBottom: 20 }}>
            Dependable Healthcare Staffing Solutions Since 1984
          </h2>
          <p style={{ color: '#D1D9E6', fontSize: 18, lineHeight: 1.6, marginBottom: 36 }}>
            Whether you are looking to advance your healthcare career or need an experienced workforce partner for your facility, our dedicated recruitment coordinators are ready to assist.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/hot-jobs" className="btn btn--accent btn--lg">
              Find Healthcare Opportunities
            </Link>
            <Link to="/facilities/staffing-request" className="btn btn--outline-white btn--lg">
              Submit Facility Staffing Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
