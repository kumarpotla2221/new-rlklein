import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import type { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Search, Eye, Users, FileText } from 'lucide-react';

const STATUS_TABS: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'Credentialing', value: 'credentialing' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Interview', value: 'interview' },
  { label: 'Hired', value: 'hired' },
  { label: 'Rejected', value: 'rejected' },
];

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      try {
        const data = await applicationService.getApplications();
        setApplications(data);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.profession.toLowerCase().includes(q) ||
      app.referenceNumber.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-applications-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--color-navy)', marginBottom: 4 }}>
            Candidate Applications
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Review candidate qualifications, update credentialing workflows, and record internal notes.
          </p>
        </div>
      </div>

      {/* Search and Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 36, fontSize: '13px' }}
            placeholder="Search candidate name, ref #, job..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUS_TABS.map((tab) => {
            const count = tab.value === 'all'
              ? applications.length
              : applications.filter((a) => a.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className="btn btn--ghost btn--sm"
                style={{
                  fontWeight: selectedStatus === tab.value ? 700 : 500,
                  backgroundColor: selectedStatus === tab.value ? 'var(--color-navy)' : 'transparent',
                  color: selectedStatus === tab.value ? '#fff' : 'var(--color-gray-700)',
                  fontSize: '12px',
                  padding: '6px 12px',
                }}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-500)' }}>Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-500)' }}>
            <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>No applications match current filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Reference #</th>
                  <th>Job Title Applied For</th>
                  <th>Profession</th>
                  <th>Location</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>
                        {app.firstName} {app.lastName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>
                        {app.email}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{app.referenceNumber}</td>
                    <td>
                      <div style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.jobTitle}
                      </div>
                    </td>
                    <td>{app.profession}</td>
                    <td>{app.state || '—'}</td>
                    <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="btn btn--secondary btn--sm"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        <Eye size={13} />
                        <span>Review</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
