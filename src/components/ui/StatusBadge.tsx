import React from 'react';
import type { ApplicationStatus, JobStatus } from '../../types';

type BadgeVariant = ApplicationStatus | JobStatus | 'featured' | string;

const STATUS_LABELS: Record<string, string> = {
  'new': 'New',
  'under-review': 'Under Review',
  'credentialing': 'Credentialing',
  'shortlisted': 'Shortlisted',
  'interview': 'Interview',
  'hired': 'Hired',
  'rejected': 'Rejected',
  'published': 'Published',
  'draft': 'Draft',
  'paused': 'Paused',
  'expired': 'Expired',
  'archived': 'Archived',
  'featured': 'Featured',
};

interface BadgeProps {
  status: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'md' }: BadgeProps) {
  const displayLabel = label || STATUS_LABELS[status] || status;
  return (
    <span
      className={`status-badge status-badge--${status} status-badge--${size}`}
      aria-label={`Status: ${displayLabel}`}
    >
      {displayLabel}
    </span>
  );
}
