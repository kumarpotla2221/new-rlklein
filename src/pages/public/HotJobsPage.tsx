import { useState, useEffect, useMemo } from 'react';
import { jobService } from '../../services/jobService';
import type { Job, JobFilters as FilterType } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFiltersSidebar } from '../../components/jobs/JobFiltersSidebar';
import { JobsTable } from '../../components/jobs/JobsTable';
import { JobDetailsModal } from '../../components/jobs/JobDetailsModal';
import { Breadcrumbs } from '../../components/ui/Typography';
import { Briefcase } from 'lucide-react';

type SortOption = 'featured' | 'newest' | 'startDate';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Latest Listings' },
  { value: 'startDate', label: 'Closest Start Date' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function HotJobsPage({ hotOnly = true }: { hotOnly?: boolean }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    status: 'published',
    ...(hotOnly ? { featured: true } : {}),
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / pageSize));
  const pageStart = sortedJobs.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, sortedJobs.length);
  const pagedJobs = sortedJobs.slice(pageStart - 1, pageEnd);

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
          <div className="job-board-layout">
            <JobFiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              totalCount={sortedJobs.length}
            />

            <div className="job-board-main">
              <div className="job-board-toolbar">
                <h2 className="job-board-toolbar__title">Job Board</h2>
                <div className="job-sort-pills" role="group" aria-label="Sort jobs">
                  <span className="job-sort-pills__label">Sort by:</span>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`job-sort-pill ${sortBy === opt.value ? 'job-sort-pill--active' : ''}`}
                      onClick={() => setSortBy(opt.value)}
                      aria-pressed={sortBy === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

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
                <>
                  <div className="jobs-table-view">
                    <JobsTable jobs={pagedJobs} onOpenDetails={setSelectedJob} />
                  </div>
                  <div className="jobs-card-view jobs-grid">
                    {pagedJobs.map((job) => (
                      <JobCard key={job.id} job={job} onViewDetails={setSelectedJob} />
                    ))}
                  </div>

                  <div className="job-board-footer">
                    <div className="job-board-footer__showing">
                      <label htmlFor="page-size-select">Showing</label>
                      <select
                        id="page-size-select"
                        className="job-select job-select--compact"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                      >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <span>{pageStart}-{pageEnd} of {sortedJobs.length}</span>
                    </div>

                    {totalPages > 1 && (
                      <div className="job-board-pagination">
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                        <span className="job-board-pagination__status">Page {page} of {totalPages}</span>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}

                    <div className="job-board-footer__total">
                      Total Jobs: <strong>{sortedJobs.length}</strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
