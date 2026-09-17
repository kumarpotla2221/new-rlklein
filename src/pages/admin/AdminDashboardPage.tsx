import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import type { Job, Application } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Briefcase, Users, PlusCircle, ArrowRight, Eye } from 'lucide-react';

export function AdminDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allJobs, allApps] = await Promise.all([
          jobService.getAllJobsAdmin(),
          applicationService.getApplications(),
        ]);
        setJobs(allJobs);
        setApplications(allApps);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeJobsCount = jobs.filter((j) => j.status === 'published').length;
  const hotJobsCount = jobs.filter((j) => j.status === 'published' && j.featured).length;
  const draftJobsCount = jobs.filter((j) => j.status === 'draft').length;
  const closedJobsCount = jobs.filter((j) => j.status === 'expired' || j.status === 'archived' || j.status === 'paused').length;
  const newAppsCount = applications.filter((a) => a.status === 'new').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading administrative dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--color-navy)', marginBottom: 4 }}>
            Executive Recruitment Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Overview of live job postings, active candidates, and facility staffing pipeline.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/jobs/new" className="btn btn--primary btn--sm">
            <PlusCircle size={16} />
            <span>Add New Job</span>
          </Link>
          <Link to="/hot-jobs" target="_blank" className="btn btn--secondary btn--sm">
            <span>View Public Listings</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 32 — DYNAMIC METRICS */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Jobs</span>
          <span className="admin-stat-val">{jobs.length}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>All job records</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Active Jobs</span>
          <span className="admin-stat-val" style={{ color: 'var(--color-success)' }}>{activeJobsCount}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Published and visible</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Hot Jobs</span>
          <span className="admin-stat-val" style={{ color: 'var(--color-violet)' }}>{hotJobsCount}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Published and featured</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Draft Jobs</span>
          <span className="admin-stat-val" style={{ color: 'var(--color-gray-700)' }}>{draftJobsCount}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Unpublished</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Closed / Expired</span>
          <span className="admin-stat-val" style={{ color: 'var(--color-warning)' }}>{closedJobsCount}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>No longer public</span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Total Applications</span>
          <span className="admin-stat-val">{applications.length}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>{shortlistedCount} Shortlisted candidates</span>
        </div>
      </div>

      {/* Dual Table Section: Recent Jobs & Recent Applications */}
      <div className="admin-dashboard-panels" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        {/* Recent Jobs */}
        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>Recent Positions</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Showing latest job postings</span>
            </div>
            <Link to="/admin/jobs" style={{ fontSize: '13px', color: 'var(--color-violet)', fontWeight: 600 }}>
              View All Jobs &rarr;
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 5).map((j) => (
                  <tr key={j.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{j.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>{j.profession}</div>
                    </td>
                    <td>{j.state}</td>
                    <td><StatusBadge status={j.status} size="sm" /></td>
                    <td>
                      <Link to={`/admin/jobs/${j.id}/edit`} className="btn btn--ghost btn--sm" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="admin-card">
          <div className="admin-card__header">
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>Recent Submissions</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Candidate applications</span>
            </div>
            <Link to="/admin/applications" style={{ fontSize: '13px', color: 'var(--color-violet)', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Profession</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{app.firstName} {app.lastName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>{app.referenceNumber}</div>
                    </td>
                    <td>{app.profession}</td>
                    <td><StatusBadge status={app.status} size="sm" /></td>
                    <td>
                      <Link to={`/admin/applications/${app.id}`} className="btn btn--ghost btn--sm" style={{ padding: '4px 8px' }} title="View details">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
