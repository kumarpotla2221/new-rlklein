import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Copy, Check } from 'lucide-react';
import type { Job } from '../../types';
import { STATE_ABBREVIATIONS } from '../../data/jobs';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
}

function formatDate(date?: string) {
  if (!date) return 'ASAP / Open';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!job) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [job, onClose]);

  useEffect(() => {
    setCopied(false);
  }, [job]);

  if (!job) return null;

  const jobUrl = `${window.location.origin}/jobs/${job.slug}`;
  const location = `${job.city}${job.city ? ', ' : ''}${STATE_ABBREVIATIONS[job.state] || job.state}`;
  const scheduleSummary = `${job.shift} Shift${job.hoursPerWeek ? ` (${job.hoursPerWeek} hrs/week)` : ''}`;
  const termSummary = job.assignmentDuration && job.assignmentDuration !== 'Ongoing'
    ? `${job.assignmentDuration} assignment`
    : 'Ongoing assignment with the potential for extension';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op
    }
  };

  const handleApply = () => {
    onClose();
    navigate(`/apply/${job.id}`);
  };

  return createPortal(
    <div className="job-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="job-modal" role="dialog" aria-modal="true" aria-labelledby="job-modal-title">
        <div className="job-modal__header">
          <h2 id="job-modal-title">Job Details</h2>
          <button type="button" className="job-modal__close" onClick={onClose} aria-label="Close job details">
            <X size={20} />
          </button>
        </div>

        <div className="job-modal__body">
          <div className="job-modal__section">
            <h3>Details</h3>
            <div className="job-modal__grid">
              <div className="job-modal__field">
                <span className="job-modal__field-label">Job Type</span>
                <span className="job-modal__field-value">{job.employmentType}</span>
              </div>
              <div className="job-modal__field">
                <span className="job-modal__field-label">Profession</span>
                <span className="job-modal__field-value">{job.profession}</span>
              </div>
              <div className="job-modal__field">
                <span className="job-modal__field-label">Specialty</span>
                <span className="job-modal__field-value">{job.specialty}</span>
              </div>
              <div className="job-modal__field">
                <span className="job-modal__field-label">Job ID</span>
                <span className="job-modal__field-value">{job.id}</span>
              </div>
              <div className="job-modal__field job-modal__field--full">
                <span className="job-modal__field-label">Job Title</span>
                <span className="job-modal__field-value">{job.title}</span>
              </div>
            </div>
          </div>

          <div className="job-modal__section">
            <h3>Shift Details</h3>
            <div className="job-modal__grid">
              <div className="job-modal__field">
                <span className="job-modal__field-label">Shift</span>
                <span className="job-modal__field-value">{job.shift}</span>
              </div>
              <div className="job-modal__field">
                <span className="job-modal__field-label">Scheduled Hours</span>
                <span className="job-modal__field-value">{job.hoursPerWeek ? `${job.hoursPerWeek} hrs/week` : '—'}</span>
              </div>
            </div>
          </div>

          <div className="job-modal__section">
            <h3>Job Order Details</h3>
            <div className="job-modal__grid">
              <div className="job-modal__field">
                <span className="job-modal__field-label">Start Date</span>
                <span className="job-modal__field-value">{formatDate(job.startDate)}</span>
              </div>
              <div className="job-modal__field">
                <span className="job-modal__field-label">Duration</span>
                <span className="job-modal__field-value">{job.assignmentDuration || 'Ongoing'}</span>
              </div>
            </div>

            <div className="job-modal__description">
              <p className="job-modal__desc-line"><strong>Job Title:</strong> {job.title}</p>
              <p className="job-modal__desc-line"><strong>Location:</strong> {location}</p>
              <p className="job-modal__desc-line"><strong>Schedule:</strong> {scheduleSummary}</p>
              <p className="job-modal__desc-line"><strong>Term:</strong> {termSummary}</p>
              {job.showCompensation && job.compensationMin && job.compensationMax && (
                <p className="job-modal__desc-line">
                  <strong>Pay Rate:</strong> ${job.compensationMin} – ${job.compensationMax} / {job.compensationType || 'hour'}
                </p>
              )}

              {job.overview && <p className="job-modal__desc-paragraph">{job.overview}</p>}

              {job.responsibilities.length > 0 && (
                <>
                  <h4 className="job-modal__subheading">Responsibilities</h4>
                  <ul className="job-modal__bullet-list">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}><span className="job-modal__bullet-dot" />{resp}</li>
                    ))}
                  </ul>
                </>
              )}

              {job.qualifications.length > 0 && (
                <>
                  <h4 className="job-modal__subheading">Qualifications</h4>
                  <ul className="job-modal__bullet-list">
                    {job.qualifications.map((qual, idx) => (
                      <li key={idx}><span className="job-modal__bullet-dot" />{qual}</li>
                    ))}
                  </ul>
                </>
              )}

              <p className="job-modal__desc-paragraph">
                R.L. Klein &amp; Associates brings over 40 years of specialized healthcare staffing experience,
                with dependable placement support, direct payroll coordination, and professional advocacy
                throughout your assignment — plus transparent credential verification and low application friction.
              </p>
            </div>
          </div>

          <div className="job-modal__section">
            <h3>Client Details</h3>
            <div className="job-modal__grid">
              <div className="job-modal__field">
                <span className="job-modal__field-label">City</span>
                <span className="job-modal__field-value">{job.city}</span>
              </div>
              <div className="job-modal__field">
                <span className="job-modal__field-label">State</span>
                <span className="job-modal__field-value">{STATE_ABBREVIATIONS[job.state] || job.state}</span>
              </div>
              {job.facility && (
                <div className="job-modal__field job-modal__field--full">
                  <span className="job-modal__field-label">Facility</span>
                  <span className="job-modal__field-value">{job.facility}</span>
                </div>
              )}
              <div className="job-modal__field job-modal__field--full">
                <span className="job-modal__field-label">Setting</span>
                <span className="job-modal__field-value">{job.workSetting}</span>
              </div>
            </div>
          </div>

          <div className="job-modal__section job-modal__section--disclaimer">
            <h3>Job Board Disclaimer</h3>
            <p className="job-modal__overview">
              Job listings on this board are posted by R.L. Klein &amp; Associates and are subject to change or
              removal at any time without notice. Please call us at{' '}
              <a href="tel:5624275577">562-427-5577</a> or visit{' '}
              <a href="https://www.rlklein.com/" target="_blank" rel="noopener noreferrer">www.rlklein.com</a>{' '}
              for more information.
            </p>
          </div>
        </div>

        <div className="job-modal__footer">
          <div className="job-modal__share">
            <span className="job-modal__share-label">Share on:</span>
            <a
              className="job-modal__share-btn job-modal__share-btn--facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06C2 17.06 5.66 21.2 10.44 21.95V14.9H7.9v-2.84h2.54v-2.17c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.84h2.78l-.44 2.84h-2.34v7.05C18.34 21.2 22 17.06 22 12.06z" />
              </svg>
            </a>
            <a
              className="job-modal__share-btn job-modal__share-btn--linkedin"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
            <div className="job-modal__copy">
              <input type="text" readOnly value={jobUrl} className="job-modal__copy-input" onFocus={(e) => e.target.select()} />
              <button type="button" className="btn btn--ghost btn--sm job-modal__copy-btn" onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="job-modal__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn--primary btn--sm" onClick={handleApply}>Apply</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
