import { Link } from 'react-router-dom';
import type { Job } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, Briefcase, Clock, Calendar } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onViewDetails?: (job: Job) => void;
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  const formattedStartDate = job.startDate
    ? new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Immediate';

  return (
    <article className="job-card" aria-labelledby={`job-title-${job.id}`}>
      <div className="job-card__header">
        <span className="job-card__profession">{job.profession}</span>
        {job.featured && <StatusBadge status="featured" label="Featured" size="sm" />}
      </div>

      <h3 className="job-card__title" id={`job-title-${job.id}`}>
        <Link to={`/jobs/${job.slug}`}>{job.title}</Link>
      </h3>

      <div className="job-card__meta">
        <span className="job-card__meta-item">
          <MapPin size={14} aria-hidden="true" />
          <span>{job.state}{job.city && job.city !== 'Multiple Locations' ? ` · ${job.city}` : ''}</span>
        </span>
        <span className="job-card__meta-item">
          <Briefcase size={14} aria-hidden="true" />
          <span>{job.employmentType}</span>
        </span>
        <span className="job-card__meta-item">
          <Clock size={14} aria-hidden="true" />
          <span>{job.shift} Shift</span>
        </span>
        <span className="job-card__meta-item">
          <Calendar size={14} aria-hidden="true" />
          <span>Start: {formattedStartDate}</span>
        </span>
      </div>

      {job.showCompensation && job.compensationMin && job.compensationMax && (
        <div className="job-card__compensation">
          ${job.compensationMin} – ${job.compensationMax} / {job.compensationType || 'hour'}
        </div>
      )}

      <div className="job-card__footer">
        {onViewDetails ? (
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => onViewDetails(job)}>
            View Job
          </button>
        ) : (
          <Link to={`/jobs/${job.slug}`} className="btn btn--secondary btn--sm">
            View Job
          </Link>
        )}
        <Link to={`/apply/${job.id}`} className="btn btn--primary btn--sm">
          Apply Now
        </Link>
      </div>
    </article>
  );
}
