import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import type { Job, JobStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  PlusCircle, 
  Edit3, 
  Copy, 
  CheckCircle, 
  PauseCircle, 
  Archive, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

export function AdminJobsPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    const view = searchParams.get('view');
    return view === 'drafts' ? 'draft' : 'all';
  });
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [hotOnly, setHotOnly] = useState(() => searchParams.get('view') === 'hot');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllJobsAdmin();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    try {
      await jobService.updateJob(id, { status: newStatus });
      setActionMessage(`Job status updated to "${newStatus}".`);
      await loadJobs();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await jobService.duplicateJob(id);
      if (copy) {
        setActionMessage(`Job duplicated as draft: "${copy.title}"`);
        await loadJobs();
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to duplicate job', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await jobService.deleteJob(id);
        setActionMessage(`Job "${title}" deleted.`);
        await loadJobs();
        setTimeout(() => setActionMessage(null), 3000);
      } catch (err) {
        console.error('Failed to delete job', err);
      }
    }
  };

  const locations = [...new Set(jobs.map((job) => job.state))].sort();
  const employmentTypes = [...new Set(jobs.map((job) => job.employmentType))].sort();
  const specialties = [...new Set(jobs.map((job) => job.specialty).filter(Boolean))].sort();
  const filteredJobs = jobs
    .filter((job) => statusFilter === 'all' || job.status === statusFilter)
    .filter((job) => locationFilter === 'all' || job.state === locationFilter)
    .filter((job) => typeFilter === 'all' || job.employmentType === typeFilter)
    .filter((job) => specialtyFilter === 'all' || job.specialty === specialtyFilter)
    .filter((job) => !hotOnly || (job.status === 'published' && job.featured))
    .filter((job) => {
      const query = search.trim().toLowerCase();
      return !query || [job.title, job.profession, job.specialty, job.city, job.state, job.id]
        .some((value) => value.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      const direction = sortOrder === 'newest' ? -1 : 1;
      return direction * (new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    });

  return (
    <div className="admin-jobs-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--color-navy)', marginBottom: 4 }}>
            Job Postings Management
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Create, publish, pause, duplicate, or archive healthcare career opportunities.
          </p>
        </div>
        <Link to="/admin/jobs/new" className="btn btn--primary btn--md">
          <PlusCircle size={16} />
          <span>Add New Job</span>
        </Link>
      </div>

      {actionMessage && (
        <div style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', padding: '12px 16px', borderRadius: 4, marginBottom: 20, fontSize: '14px' }}>
          {actionMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 12 }}>
        {['all', 'published', 'draft', 'paused', 'expired', 'archived'].map((tab) => {
          const count = tab === 'all' ? jobs.length : jobs.filter((j) => j.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className="btn btn--ghost btn--sm"
              style={{
                textTransform: 'capitalize',
                fontWeight: statusFilter === tab ? 700 : 500,
                backgroundColor: statusFilter === tab ? 'var(--color-navy)' : 'transparent',
                color: statusFilter === tab ? '#fff' : 'var(--color-gray-700)',
              }}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="admin-job-filters">
        <input className="form-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, profession, ID..." aria-label="Search jobs" />
        <select className="form-select" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} aria-label="Filter by location">
          <option value="all">All locations</option>
          {locations.map((location) => <option key={location} value={location}>{location}</option>)}
        </select>
        <select className="form-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter by job type">
          <option value="all">All job types</option>
          {employmentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select className="form-select" value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)} aria-label="Filter by specialty">
          <option value="all">All specialties</option>
          {specialties.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
        </select>
        <label className="form-checkbox-label" style={{ whiteSpace: 'nowrap' }}>
          <input type="checkbox" className="form-checkbox" checked={hotOnly} onChange={(event) => setHotOnly(event.target.checked)} />
          <span>Hot jobs only</span>
        </label>
        <select className="form-select" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'newest' | 'oldest')} aria-label="Sort jobs">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Jobs Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-500)' }}>Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-500)' }}>
            No jobs found in status &ldquo;{statusFilter}&rdquo;.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title &amp; ID</th>
                  <th>Profession</th>
                  <th>Location</th>
                  <th>Type / Shift</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j) => (
                  <tr key={j.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{j.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', fontFamily: 'monospace' }}>{j.id}</div>
                      {j.featured && (
                        <span style={{ fontSize: '10px', color: 'var(--color-violet)', fontWeight: 600, textTransform: 'uppercase' }}>
                          ★ Featured on Homepage
                        </span>
                      )}
                    </td>
                    <td>{j.profession}</td>
                    <td>{j.state}</td>
                    <td>
                      <div>{j.employmentType}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>{j.shift} Shift</div>
                    </td>
                    <td>
                      <StatusBadge status={j.status} size="sm" />
                    </td>
                    <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{j.postedDate}</td>
                    <td>
                      <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        {j.status === 'published' && (
                          <Link to={`/hot-jobs/${j.slug}`} target="_blank" className="btn btn--ghost btn--icon" title="View live page">
                            <ExternalLink size={15} />
                          </Link>
                        )}
                        <Link to={`/admin/jobs/${j.id}/edit`} className="btn btn--ghost btn--icon" title="Edit job">
                          <Edit3 size={15} />
                        </Link>
                        <button onClick={() => handleDuplicate(j.id)} className="btn btn--ghost btn--icon" title="Duplicate job">
                          <Copy size={15} />
                        </button>
                        {j.status !== 'published' && (
                          <button onClick={() => handleStatusChange(j.id, 'published')} className="btn btn--ghost btn--icon" title="Publish job" style={{ color: 'var(--color-success)' }}>
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {j.status === 'published' && (
                          <button onClick={() => handleStatusChange(j.id, 'paused')} className="btn btn--ghost btn--icon" title="Pause job" style={{ color: 'var(--color-warning)' }}>
                            <PauseCircle size={15} />
                          </button>
                        )}
                        <button onClick={() => jobService.updateJob(j.id, { featured: !j.featured }).then(loadJobs)} className="btn btn--ghost btn--icon" title={j.featured ? 'Remove hot job status' : 'Mark as hot job'} style={{ color: j.featured ? 'var(--color-violet)' : undefined }}>
                          {j.featured ? '★' : '☆'}
                        </button>
                        {j.status !== 'archived' && (
                          <button onClick={() => handleStatusChange(j.id, 'archived')} className="btn btn--ghost btn--icon" title="Archive job">
                            <Archive size={15} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(j.id, j.title)} className="btn btn--ghost btn--icon" title="Delete job" style={{ color: 'var(--color-error)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
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
