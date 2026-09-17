import { Search, RotateCcw } from 'lucide-react';
import type { JobFilters as FilterType } from '../../types';
import { PROFESSIONS, STATES, SPECIALTIES, WORK_SETTINGS } from '../../data/jobs';

interface JobFiltersProps {
  filters: FilterType;
  onFilterChange: (key: keyof FilterType, value: string | boolean | undefined) => void;
  onReset: () => void;
  totalCount: number;
}

export function JobFilters({ filters, onFilterChange, onReset, totalCount }: JobFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.profession ||
    filters.state ||
    filters.specialty ||
    filters.workSetting ||
    filters.employmentType ||
    filters.shift
  );

  return (
    <div className="job-search-panel" role="search" aria-label="Job Search and Filters">
      {/* Search Bar */}
      <div className="job-search-input-row">
        <div className="job-search-input-wrap">
          <Search size={18} className="job-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="job-search-input"
            placeholder="Search by job title, specialty, setting, or keyword..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value || undefined)}
            aria-label="Search jobs"
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={onReset}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Select Filters Grid */}
      <div className="job-filters-grid">
        <div>
          <label htmlFor="filter-profession" className="sr-only">Profession</label>
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

        <div>
          <label htmlFor="filter-state" className="sr-only">State</label>
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

        <div>
          <label htmlFor="filter-specialty" className="sr-only">Specialty</label>
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

        <div>
          <label htmlFor="filter-work-setting" className="sr-only">Work Setting</label>
          <select
            id="filter-work-setting"
            className="job-select"
            value={filters.workSetting || ''}
            onChange={(e) => onFilterChange('workSetting', e.target.value || undefined)}
          >
            <option value="">All Work Settings</option>
            {WORK_SETTINGS.map((ws) => (
              <option key={ws} value={ws}>{ws}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results bar */}
      <div className="job-results-bar" style={{ margin: 0, padding: 0, border: 'none' }}>
        <div className="job-count" aria-live="polite">
          {totalCount} {totalCount === 1 ? 'opportunity' : 'opportunities'} found
        </div>
      </div>
    </div>
  );
}
