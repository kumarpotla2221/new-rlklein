import { useState, useEffect, useMemo } from 'react';
import { jobService } from '../../services/jobService';
import type { Job, JobFilters as FilterType } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Briefcase } from 'lucide-react';

export function HotJobsPage({ hotOnly = true }: { hotOnly?: boolean }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    status: 'published',
    ...(hotOnly ? { featured: true } : {}),
  });
  const [sortBy, setSortBy] = useState<'newest' | 'featured' | 'startDate'>('featured');

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const fetched = await jobService.getJobs(filters);
        setJobs(fetched);
      } catch (err) {
        console.error('Error fetching jobs', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [filters]);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      if (sortBy === 'startDate') {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateA - dateB;
      }
      // default: newest
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [jobs, sortBy]);

  const handleFilterChange = (key: keyof FilterType, value: string | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({ status: 'published', ...(hotOnly ? { featured: true } : {}) });
    setSortBy('featured');
  };

  return (
    <div className="hot-jobs-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Find Your Next Role' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Current Opportunities</span>
            <h1>{hotOnly ? 'Find Your Next Role' : 'Healthcare Jobs'}</h1>
            <p className="page-hero__subtitle">
              {hotOnly ? 'Find highlighted healthcare opportunities with R.L. Klein & Associates.' : 'Browse published healthcare opportunities across correctional, government, and institutional healthcare facilities.'}
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-off-white" aria-label="Job Search and Results">
        <div className="container">
          {/* Filters and search panel */}
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            totalCount={sortedJobs.length}
          />

          {/* Sort control bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24, gap: 12 }}>
            <label htmlFor="sort-select" style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
              Sort by:
            </label>
            <select
              id="sort-select"
              className="job-select"
              style={{ width: 'auto', minWidth: 160 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'featured' | 'startDate')}
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Posted</option>
              <option value="startDate">Start Date</option>
            </select>
          </div>

          {/* Results Area */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-gray-500)' }}>
              <p>Searching available positions...</p>
            </div>
          ) : sortedJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 32px', backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--color-gray-200)' }}>
              <Briefcase size={40} style={{ margin: '0 auto 16px', color: 'var(--color-gray-400)' }} />
              <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', marginBottom: 8 }}>
                No opportunities match your current filters.
              </h3>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: 24 }}>
                Try adjusting your search criteria, clearing filters, or contacting our recruitment team directly.
              </p>
              <button onClick={handleReset} className="btn btn--primary btn--md">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {sortedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
