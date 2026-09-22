// ============================================================
// JOB SERVICE — API-ready local development implementation.
// Replace these storage calls with authenticated API requests when a backend is connected.
// ============================================================

import { MOCK_JOBS } from '../data/jobs';
import type { Job, JobFilters } from '../types';

// Simulate async behavior (swap with fetch() calls for production)
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));
const JOBS_STORAGE_KEY = 'rlk_jobs_store';

function loadJobs(): Job[] {
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!stored) return [...MOCK_JOBS];

    const jobs = JSON.parse(stored) as Job[];
    return jobs.map(job =>
      job.status === 'published' ? { ...job, featured: true } : job
    );
  } catch {
    return [...MOCK_JOBS];
  }
}

let jobsStore: Job[] = loadJobs();

function persistJobs() {
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobsStore));
}

export const jobService = {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    await delay();
    let jobs = [...jobsStore].filter(j => j.visibility !== 'unlisted');

    if (filters?.status) {
      jobs = jobs.filter(j => j.status === filters.status);
    } else if (filters?.status === undefined && !filters?.featured) {
      // Default public view: published only
      jobs = jobs.filter(j => j.status === 'published');
    }

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

    // Filter out expired jobs for public view
    const now = new Date();
    jobs = jobs.filter(j => {
      if (!j.expirationDate) return true;
      return new Date(j.expirationDate) > now;
    });

    return jobs;
  },

  async getJobBySlug(slug: string): Promise<Job | null> {
    await delay();
    const job = jobsStore.find(j => j.slug === slug);
    if (!job || job.status !== 'published') return null;
    if (job.expirationDate && new Date(job.expirationDate) <= new Date()) return null;
    return job;
  },

  async getJobById(id: string): Promise<Job | null> {
    await delay();
    return jobsStore.find(j => j.id === id) ?? null;
  },

  async getAllJobsAdmin(): Promise<Job[]> {
    await delay();
    return [...jobsStore];
  },

  async createJob(job: Omit<Job, 'id' | 'slug' | 'postedDate' | 'applicationCount'> & { id?: string }): Promise<Job> {
    await delay();
    const { id: customId, ...rest } = job;
    const trimmedId = customId?.trim();
    const newJob: Job = {
      ...rest,
      id: trimmedId && !jobsStore.some(j => j.id === trimmedId) ? trimmedId : `RLK-${Date.now()}`,
      slug: job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      applicationCount: 0,
    };
    jobsStore.push(newJob);
    persistJobs();
    return newJob;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    await delay();
    const idx = jobsStore.findIndex(j => j.id === id);
    if (idx === -1) return null;
    jobsStore[idx] = {
      ...jobsStore[idx],
      ...updates,
      ...(updates.status === 'published' ? { featured: true } : {}),
    };
    persistJobs();
    return jobsStore[idx];
  },

  async publishJob(id: string): Promise<Job | null> {
    return this.updateJob(id, { status: 'published' });
  },

  async pauseJob(id: string): Promise<Job | null> {
    return this.updateJob(id, { status: 'paused' });
  },

  async archiveJob(id: string): Promise<Job | null> {
    return this.updateJob(id, { status: 'archived' });
  },

  async expireJob(id: string): Promise<Job | null> {
    return this.updateJob(id, { status: 'expired' });
  },

  async deleteJob(id: string): Promise<boolean> {
    await delay();
    const idx = jobsStore.findIndex(j => j.id === id);
    if (idx === -1) return false;
    jobsStore.splice(idx, 1);
    persistJobs();
    return true;
  },

  async duplicateJob(id: string): Promise<Job | null> {
    await delay();
    const original = jobsStore.find(j => j.id === id);
    if (!original) return null;
    const copy: Job = {
      ...original,
      id: `RLK-${Date.now()}`,
      slug: original.slug + '-copy-' + Date.now(),
      title: original.title + ' (Copy)',
      status: 'draft',
      postedDate: new Date().toISOString().split('T')[0],
      applicationCount: 0,
    };
    jobsStore.push(copy);
    persistJobs();
    return copy;
  },

  async getFeaturedJobs(limit = 6): Promise<Job[]> {
    await delay();
    const now = new Date();
    const featured = jobsStore.filter(j =>
      j.status === 'published' &&
      j.featured &&
      (!j.expirationDate || new Date(j.expirationDate) > now)
    );
    return featured.slice(0, limit);
  },
};
