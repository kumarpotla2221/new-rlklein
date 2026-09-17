import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types';
import { Breadcrumbs } from '../../components/ui/Typography';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  DollarSign, 
  Building2 
} from 'lucide-react';

export function JobDetailsPage() {
  const { jobId: slug } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJob() {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await jobService.getJobBySlug(slug);
        setJob(found);
      } catch (err) {
        console.error('Error fetching job details', err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p>Loading position details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Opportunity Not Found</h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 24 }}>
          This position may have been filled, expired, or removed from public listings.
        </p>
        <Link to="/hot-jobs" className="btn btn--primary btn--md">
          <ArrowLeft size={16} />
          <span>Browse Active Hot Jobs</span>
        </Link>
      </div>
    );
  }

  const formattedStartDate = job.startDate
    ? new Date(job.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Immediate / Open';

  return (
    <div className="job-details-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Hot Jobs', href: '/hot-jobs' },
          { label: job.title },
        ]}
      />

      {/* Header Banner */}
      <header className="page-hero" style={{ paddingBlock: '48px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span className="eyebrow" style={{ color: '#A0B8E8' }}>{job.profession}</span>
              {job.featured && <StatusBadge status="featured" label="Featured Opportunity" size="sm" />}
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>Job ID: {job.id}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#fff', lineHeight: 1.15 }}>
              {job.title}
            </h1>

            {/* Quick Metadata Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: '15px', color: '#D1D9E6' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={16} />
                <span>{job.state}{job.city ? ` (${job.city})` : ''}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Briefcase size={16} />
                <span>{job.employmentType}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} />
                <span>{job.shift} Shift {job.hoursPerWeek ? `(${job.hoursPerWeek} hrs/wk)` : ''}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={16} />
                <span>{job.workSetting}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={16} />
                <span>Start: {formattedStartDate}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <section className="section bg-white">
        <div className="container">
          <div className="job-details-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'flex-start' }}>
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {/* Position Overview */}
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: 16 }}>
                  Position Overview
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--color-gray-700)' }}>
                  {job.overview}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: 16 }}>
                  Responsibilities &amp; Clinical Scope
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '15px', lineHeight: 1.6, color: 'var(--color-gray-700)' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-violet)', flexShrink: 0, marginTop: 3 }} />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: 16 }}>
                  Qualifications
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '15px', lineHeight: 1.6, color: 'var(--color-gray-700)' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 3 }} />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preferred Qualifications if present */}
              {job.preferredQualifications && job.preferredQualifications.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', marginBottom: 12 }}>
                    Preferred Experience
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {job.preferredQualifications.map((pref, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '15px', color: 'var(--color-gray-600)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-gray-400)', marginTop: 8 }} />
                        <span>{pref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Credentials */}
              <div style={{ backgroundColor: 'var(--color-off-white)', padding: '24px', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}>
                <h2 style={{ fontSize: '20px', color: 'var(--color-navy)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={20} style={{ color: 'var(--color-violet)' }} />
                  <span>Required Credentials &amp; Documentation</span>
                </h2>
                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
                  {job.requiredCredentials.map((cred, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: 'var(--color-gray-700)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-violet)', flexShrink: 0 }} />
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About the Assignment & Why Work with R.L. Klein */}
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: 16 }}>
                  Why Work With R.L. Klein &amp; Associates
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '15px', lineHeight: 1.6, color: 'var(--color-gray-700)' }}>
                  <p>
                    With over 40 years of specialized healthcare staffing experience, R.L. Klein provides dependable placement support, direct payroll coordination, and professional advocacy throughout your assignment.
                  </p>
                  <p>
                    Our dedicated recruitment team ensures low application friction, transparent credential verification, and ongoing operational contact to ensure your clinical placement runs smoothly.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar / Action Card */}
            <aside style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ backgroundColor: 'var(--color-off-white)', border: '1px solid var(--color-gray-200)', borderRadius: '8px', padding: '32px 24px', boxShadow: 'var(--shadow-sm)' }}>
                {job.showCompensation && job.compensationMin && job.compensationMax ? (
                  <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-gray-200)' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                      Approved Compensation
                    </span>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-navy)', marginTop: 4 }}>
                      ${job.compensationMin} – ${job.compensationMax}
                      <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--color-gray-600)' }}> / {job.compensationType || 'hour'}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-gray-200)' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                      Compensation
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-navy)', marginTop: 4 }}>
                      Competitive &middot; Inquire with Recruiter
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  <Link to={`/apply/${job.id}`} className="btn btn--accent btn--lg btn--full">
                    Apply for This Position
                  </Link>
                  <Link to="/healthcare-professionals/recruiters" className="btn btn--secondary btn--md btn--full">
                    Speak With a Recruiter
                  </Link>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--color-gray-500)', lineHeight: 1.5, textAlign: 'center' }}>
                  No candidate login or account creation required. Simple, direct application process.
                </div>
              </div>

              {/* Quick Info Box */}
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-gray-200)', borderRadius: '8px', padding: '24px' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 12 }}>
                  Need Immediate Help?
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: 16 }}>
                  Our team is available Monday–Saturday from 9 AM–6 PM PST.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '14px' }}>
                  <a href="tel:5624275577" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                    Phone: 562-427-5577
                  </a>
                  <a href="mailto:info@rlklein.com" style={{ color: 'var(--color-violet)' }}>
                    Email: info@rlklein.com
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
