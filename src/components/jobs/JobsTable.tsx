import { Link } from 'react-router-dom';
import { Flame, Star, Sun, Moon, Sunrise, Clock3 } from 'lucide-react';
import type { Job } from '../../types';
import { STATE_ABBREVIATIONS } from '../../data/jobs';

interface JobsTableProps {
  jobs: Job[];
  onOpenDetails: (job: Job) => void;
}

function isNew(postedDate: string) {
  const posted = new Date(postedDate).getTime();
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
  return posted >= twoWeeksAgo;
}

function formatStartDate(startDate?: string) {
  if (!startDate) return 'ASAP';
  return new Date(startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ShiftIcon({ shift }: { shift: Job['shift'] }) {
  switch (shift) {
    case 'Day':
      return <Sun size={14} aria-hidden="true" />;
    case 'Evening':
      return <Sunrise size={14} aria-hidden="true" />;
    case 'Night':
      return <Moon size={14} aria-hidden="true" />;
    default:
      return <Clock3 size={14} aria-hidden="true" />;
  }
}

export function JobsTable({ jobs, onOpenDetails }: JobsTableProps) {
  return (
    <div className="jobs-table-wrap">
      <table className="jobs-table">
        <colgroup>
          <col style={{ width: '21%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Job Type</th>
            <th>Setting</th>
            <th>Profession</th>
            <th>Specialty</th>
            <th>City</th>
            <th>State</th>
            <th>Shift</th>
            <th>Start Date</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <Link to={`/jobs/${job.slug}`} className="jobs-table__title" title={job.title}>{job.title}</Link>
                <div className="jobs-table__badges">
                  {job.featured && (
                    <span className="jobs-table__icon jobs-table__icon--hot" title="Featured opportunity">
                      <Flame size={14} aria-hidden="true" />
                    </span>
                  )}
                  {isNew(job.postedDate) && (
                    <span className="jobs-table__icon jobs-table__icon--new" title="Recently posted">
                      <Star size={14} aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="jobs-table__sub">
                  {job.employmentType}{job.assignmentDuration ? ` · ${job.assignmentDuration}` : ''}
                </div>
              </td>
              <td>{job.workSetting}</td>
              <td>{job.profession}</td>
              <td>{job.specialty}</td>
              <td>{job.city}</td>
              <td>{STATE_ABBREVIATIONS[job.state] || job.state}</td>
              <td>
                <span className="jobs-table__shift">
                  <ShiftIcon shift={job.shift} />
                  {job.shift}
                </span>
              </td>
              <td>{formatStartDate(job.startDate)}</td>
              <td>
                <div className="jobs-table__actions">
                  <Link to={`/apply/${job.id}`} className="btn btn--primary btn--sm jobs-table__action-btn">Apply</Link>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm jobs-table__action-btn"
                    onClick={() => onOpenDetails(job)}
                  >
                    Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
