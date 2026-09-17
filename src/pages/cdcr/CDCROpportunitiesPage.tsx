import { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import type { Job, JobFilters as FilterType } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { Breadcrumbs } from '../../components/ui/Typography';
import { ShieldCheck } from 'lucide-react';

export function CDCROpportunitiesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    status: 'published',
    state: 'California',
    workSetting: 'Correctional Healthcare',
  });

  useEffect(() => {
    async function loadCDCRJobs() {
      setLoading(true);
      try {
        const fetched = await jobService.getJobs(filters);
        setJobs(fetched);
      } catch (err) {
        console.error('Error fetching CDCR jobs', err);
      } finally {
        setLoading(false);
      }
    }
    loadCDCRJobs();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterType, value: string | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      status: 'published',
      state: 'California',
      workSetting: 'Correctional Healthcare',
    });
  };

  return (
    <div className="cdcr-opportunities-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'CDCR Healthcare', href: '/cdcr-healthcare' },
          { label: 'CDCR Opportunities' },
        ]}
      />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A0B8E8', marginBottom: 4 }}>
              <ShieldCheck size={18} />
              <span className="eyebrow" style={{ color: '#A0B8E8', margin: 0 }}>California Facilities</span>
            </div>
            <h1>California Correctional Healthcare Opportunities</h1>
            <p className="page-hero__subtitle">
              Current clinical openings for Physicians, Registered Nurses, LVNs, Social Workers, Psychiatrists, and Allied Health practitioners within California correctional facilities.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-off-white">
        <div className="container">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            totalCount={jobs.length}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-gray-500)' }}>
              Loading CDCR positions...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', marginBottom: 8 }}>
                No CDCR opportunities match your current filter selection.
              </h3>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 20 }}>
                Try resetting filters or submitting an application directly for general consideration.
              </p>
              <button onClick={handleReset} className="btn btn--primary btn--sm">
                Reset California Filters
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
