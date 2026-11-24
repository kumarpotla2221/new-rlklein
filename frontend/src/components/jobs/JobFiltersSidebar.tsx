import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { JobFilters as FilterType } from '../../types';
import { PROFESSIONS, STATES, SPECIALTIES, EMPLOYMENT_TYPES, SHIFT_TYPES } from '../../data/jobs';

interface JobFiltersSidebarProps {
  filters: FilterType;
  onFilterChange: (key: keyof FilterType, value: string | boolean | undefined) => void;
  onReset: () => void;
  totalCount: number;
}

export function JobFiltersSidebar({ filters, onFilterChange, onReset, totalCount }: JobFiltersSidebarProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.profession ||
    filters.state ||
    filters.specialty ||
    filters.employmentType ||
    filters.shift
  );

  return (
    <aside className="quick-filter-panel" role="search" aria-label="Job Search and Filters">
      <div className="quick-filter-panel__header">
        <SlidersHorizontal size={17} aria-hidden="true" />
        <h2>Quick Filter</h2>
      </div>

      <div className="quick-filter-panel__body">
        <div className="quick-filter-field">
          <label htmlFor="filter-search" className="quick-filter-label">Search</label>
          <div className="job-search-input-wrap">
            <Search size={16} className="job-search-icon" aria-hidden="true" />
            <input
              id="filter-search"
              type="text"
              className="job-search-input"
              placeholder="Title, specialty, city…"
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value || undefined)}
              aria-label="Search jobs"
            />
          </div>
        </div>

        <div className="quick-filter-field">
          <label htmlFor="filter-profession" className="quick-filter-label">Profession</label>
          <select
            id="filter-profession"
            className="job-select"
            value={filters.profession || ''}
            onChange={(e) => onFilterChange('profession', e.target.value || undefined)}
          >
            <option value="">All Professions</option>
            {PROFESSIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="quick-filter-field">
          <label htmlFor="filter-specialty" className="quick-filter-label">Specialty</label>
          <select
            id="filter-specialty"
            className="job-select"
            value={filters.specialty || ''}
            onChange={(e) => onFilterChange('specialty', e.target.value || undefined)}
          >
            <option value="">All Specialties</option>
            {SPECIALTIES.map((sp) => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>
        </div>

        <div className="quick-filter-field">
          <label htmlFor="filter-state" className="quick-filter-label">State</label>
          <select
            id="filter-state"
            className="job-select"
            value={filters.state || ''}
            onChange={(e) => onFilterChange('state', e.target.value || undefined)}
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="quick-filter-field">
          <label htmlFor="filter-job-type" className="quick-filter-label">Job Type</label>
          <select
            id="filter-job-type"
            className="job-select"
            value={filters.employmentType || ''}
            onChange={(e) => onFilterChange('employmentType', e.target.value || undefined)}
          >
            <option value="">All Job Types</option>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="quick-filter-field">
          <label htmlFor="filter-shift" className="quick-filter-label">Shift</label>
          <select
            id="filter-shift"
            className="job-select"
            value={filters.shift || ''}
            onChange={(e) => onFilterChange('shift', e.target.value || undefined)}
          >
            <option value="">All Shifts</option>
            {SHIFT_TYPES.map((sh) => (
              <option key={sh} value={sh}>{sh}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="quick-filter-panel__footer">
        <span className="job-count" aria-live="polite">
          {totalCount} {totalCount === 1 ? 'opportunity' : 'opportunities'} found
        </span>
        {hasActiveFilters && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onReset}>
            <RotateCcw size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </aside>
  );
}
