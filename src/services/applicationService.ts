// ============================================================
// APPLICATION SERVICE — API-Ready Architecture
// ============================================================

import { MOCK_APPLICATIONS } from '../data/applications';
import type { Application, ApplicationStatus } from '../types';

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

let applicationsStore: Application[] = [...MOCK_APPLICATIONS];

function generateRef(): string {
  const n = 100000 + Math.floor(Math.random() * 900000);
  return `RLK-APP-${n}`;
}

export const applicationService = {
  async submitApplication(data: Omit<Application, 'id' | 'referenceNumber' | 'appliedDate' | 'status' | 'adminNotes'>): Promise<Application> {
    await delay(500);
    const app: Application = {
      ...data,
      id: `app-${Date.now()}`,
      referenceNumber: generateRef(),
      appliedDate: new Date().toISOString(),
      status: 'new',
      adminNotes: '',
    };
    applicationsStore.push(app);
    return app;
  },

  async getApplications(statusFilter?: ApplicationStatus): Promise<Application[]> {
    await delay();
    if (statusFilter) {
      return applicationsStore.filter(a => a.status === statusFilter);
    }
    return [...applicationsStore].sort((a, b) =>
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
  },

  async getApplicationById(id: string): Promise<Application | null> {
    await delay();
    return applicationsStore.find(a => a.id === id) ?? null;
  },

  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    await delay();
    return applicationsStore.filter(a => a.jobId === jobId);
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
    await delay();
    const idx = applicationsStore.findIndex(a => a.id === id);
    if (idx === -1) return null;
    applicationsStore[idx] = { ...applicationsStore[idx], status };
    return applicationsStore[idx];
  },

  async addAdminNote(id: string, note: string): Promise<Application | null> {
    await delay();
    const idx = applicationsStore.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const existing = applicationsStore[idx].adminNotes || '';
    const timestamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    applicationsStore[idx] = {
      ...applicationsStore[idx],
      adminNotes: existing ? `${existing}\n\n[${timestamp}]\n${note}` : `[${timestamp}]\n${note}`,
    };
    return applicationsStore[idx];
  },

  async getDashboardStats() {
    await delay();
    const total = applicationsStore.length;
    const newCount = applicationsStore.filter(a => a.status === 'new').length;
    const shortlisted = applicationsStore.filter(a => a.status === 'shortlisted').length;
    const hired = applicationsStore.filter(a => a.status === 'hired').length;
    return { total, newCount, shortlisted, hired };
  },
};
