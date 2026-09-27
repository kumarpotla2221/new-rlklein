// ============================================================
// JOB SERVICE — jobs come from the Google Apps Script API (Jobs sheet).
// Public reads only ever receive Active, unexpired jobs; the server enforces that.
// Admin calls are authorized by the server on every request.
// ============================================================

import { adminPost, apiGet } from './apiClient';
import type { Job, JobFilters, JobStatus } from '../types';

type ApiJob = Omit<Job, 'status'> & { status: string };

const API_STATUS: Record<JobStatus, string> = { active: 'Active', draft: 'Draft', closed: 'Closed' };

function fromApi(job: ApiJob): Job {
  return { ...job, status: job.status.toLowerCase() as JobStatus };
}

function toApi(job: Partial<Job>): Record<string, unknown> {
  return job.status ? { ...job, status: API_STATUS[job.status] } : { ...job };
}

// The public list is fetched once and filtered in the browser, so changing
// filters on the jobs pages does not wait on a network round trip.
const PUBLIC_CACHE_MS = 60_000;
let publicJobs: { fetchedAt: number; promise: Promise<Job[]> } | null = null;

function loadPublicJobs(): Promise<Job[]> {
  if (publicJobs && Date.now() - publicJobs.fetchedAt < PUBLIC_CACHE_MS) return publicJobs.promise;
  const promise = apiGet<ApiJob[]>('getJobs').then((jobs) => jobs.map(fromApi));
  publicJobs = { fetchedAt: Date.now(), promise };
  promise.catch(() => { publicJobs = null; });
  return promise;
}

function invalidatePublicJobs() {
  publicJobs = null;
}

async function getPublicJob(params: Record<string, string>, match: (job: Job) => boolean): Promise<Job | null> {
  const cached = publicJobs ? (await publicJobs.promise.catch(() => [])).find(match) : undefined;
  if (cached) return cached;
  const job = await apiGet<ApiJob | null>('getJob', params);
  return job ? fromApi(job) : null;
}

type NewJob = Omit<Job, 'id' | 'slug' | 'postedDate' | 'applicationCount'> & { id?: string };

export const jobService = {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    let jobs = await loadPublicJobs();

    // The public API only returns active jobs.
    if (filters?.status && filters.status !== 'active') return [];

    if (filters?.featured !== undefined) {
      jobs = jobs.filter(j => j.featured === filters.featured);
    }

    if (filters?.profession) {
      jobs = jobs.filter(j =>
        j.profession.toLowerCase().includes(filters.profession!.toLowerCase())
      );
    }

    if (filters?.state) {
      jobs = jobs.filter(j =>
        j.state.toLowerCase() === filters.state!.toLowerCase()
      );
    }

    if (filters?.specialty) {
      jobs = jobs.filter(j =>
        j.specialty.toLowerCase().includes(filters.specialty!.toLowerCase())
      );
    }

    if (filters?.workSetting) {
      jobs = jobs.filter(j =>
        j.workSetting.toLowerCase() === filters.workSetting!.toLowerCase()
      );
    }

    if (filters?.employmentType) {
      jobs = jobs.filter(j =>
        j.employmentType.toLowerCase() === filters.employmentType!.toLowerCase()
      );
    }

    if (filters?.shift) {
      jobs = jobs.filter(j =>
        j.shift.toLowerCase() === filters.shift!.toLowerCase()
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.profession.toLowerCase().includes(q) ||
        j.specialty.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q) ||
        j.state.toLowerCase().includes(q) ||
        j.workSetting.toLowerCase().includes(q)
      );
    }

    return jobs;
  },

  async getJobBySlug(slug: string): Promise<Job | null> {
    return getPublicJob({ slug }, j => j.slug === slug);
  },

  /** Public lookup used by the application form: returns only jobs open for applications. */
  async getJobById(id: string): Promise<Job | null> {
    return getPublicJob({ jobId: id }, j => j.id === id);
  },

  async getFeaturedJobs(limit = 6): Promise<Job[]> {
    const jobs = await loadPublicJobs();
    return jobs.filter(j => j.featured).slice(0, limit);
  },

  // ---------------- Admin ----------------

  async getJobByIdAdmin(id: string): Promise<Job | null> {
    const job = await adminPost<ApiJob | null>('getAdminJob', { jobId: id });
    return job ? fromApi(job) : null;
  },

  async getAllJobsAdmin(): Promise<Job[]> {
    const jobs = await adminPost<ApiJob[]>('getAdminJobs');
    return jobs.map(fromApi);
  },

  async createJob(job: NewJob): Promise<Job> {
    // Publishing a job also lists it under Find Your Next Role (featured).
    const payload = job.status === 'active' ? { ...job, featured: true } : job;
    const created = await adminPost<ApiJob>('createJob', { job: toApi(payload) });
    invalidatePublicJobs();
    return fromApi(created);
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const payload = updates.status === 'active' ? { ...updates, featured: true } : updates;
    const updated = await adminPost<ApiJob>('updateJob', { jobId: id, updates: toApi(payload) });
    invalidatePublicJobs();
    return fromApi(updated);
  },

  async publishJob(id: string): Promise<Job | null> {
    return this.updateJob(id, { status: 'active' });
  },

  async closeJob(id: string): Promise<Job | null> {
    return this.updateJob(id, { status: 'closed' });
  },

  async deleteJob(id: string): Promise<boolean> {
    await adminPost('deleteJob', { jobId: id });
    invalidatePublicJobs();
    return true;
  },

  async duplicateJob(id: string): Promise<Job | null> {
    const original = await this.getJobByIdAdmin(id);
    if (!original) return null;
    // The server assigns a new ID, slug and posted date.
    const { id: _id, slug: _slug, postedDate: _posted, applicationCount: _count, ...rest } = original;
    return this.createJob({ ...rest, title: `${original.title} (Copy)`, status: 'draft' });
  },
};
