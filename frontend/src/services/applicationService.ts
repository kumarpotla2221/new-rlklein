// ============================================================
// APPLICATION SERVICE: submissions go to the PHP API, which validates them,
// stores the resume in its private folder and records the application in MySQL.
// Everything except submitApplication is admin-only and authorized by the server.
// ============================================================

import { adminPost, apiPost, ApiError } from './apiClient';
import type { Application, ApplicationStatus } from '../types';

type ApiApplication = Omit<Application, 'status'> & { status: string };

export type ApplicationSubmission = Omit<
  Application,
  'id' | 'referenceNumber' | 'appliedDate' | 'status' | 'adminNotes' | 'resumeFileName' | 'resumeUrl'
>;

// Keep in sync with uploads.resume_max_bytes in backend/rlk_app/config.php and the "Max 10 MB" form text.
export const RESUME_MAX_BYTES = 10 * 1024 * 1024;
export const RESUME_EXTENSIONS = /\.(pdf|doc|docx)$/i;

function fromApi(app: ApiApplication): Application {
  return { ...app, status: app.status.toLowerCase() as ApplicationStatus };
}

function toApiStatus(status: ApplicationStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(new ApiError('FILE_READ', 'Your resume could not be read. Please choose the file again.'));
    reader.readAsDataURL(file);
  });
}

export const applicationService = {
  /**
   * `consent`: the applicant ticked the consent box (the server records when).
   * `website`: hidden honeypot field; people leave it empty, bots fill it in.
   */
  async submitApplication(
    data: ApplicationSubmission,
    resumeFile: File,
    extras: { consent?: boolean; website?: string } = {}
  ): Promise<Application> {
    if (!RESUME_EXTENSIONS.test(resumeFile.name)) {
      throw new ApiError('VALIDATION', 'Please upload a PDF, DOC, or DOCX file.');
    }
    if (resumeFile.size > RESUME_MAX_BYTES) {
      throw new ApiError('VALIDATION', 'Resume must be 10 MB or smaller.');
    }

    const resume = {
      name: resumeFile.name,
      type: resumeFile.type,
      data: await readFileAsBase64(resumeFile),
    };
    const created = await apiPost<{ id: string; referenceNumber: string; appliedDate: string; status: string }>(
      'createApplication',
      { ...data, consent: extras.consent === true, website: extras.website ?? '', resume }
    );

    return {
      ...data,
      id: created.id,
      referenceNumber: created.referenceNumber,
      appliedDate: created.appliedDate,
      status: created.status.toLowerCase() as ApplicationStatus,
      resumeFileName: resumeFile.name,
      adminNotes: '',
    };
  },

  // ---------------- Admin ----------------

  async getApplications(statusFilter?: ApplicationStatus): Promise<Application[]> {
    const apps = (await adminPost<ApiApplication[]>('getApplications')).map(fromApi);
    return statusFilter ? apps.filter(a => a.status === statusFilter) : apps;
  },

  async getApplicationById(id: string): Promise<Application | null> {
    const app = await adminPost<ApiApplication | null>('getApplication', { applicationId: id });
    return app ? fromApi(app) : null;
  },

  async getApplicationsByJob(jobId: string): Promise<Application[]> {
    const apps = await this.getApplications();
    return apps.filter(a => a.jobId === jobId);
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
    const app = await adminPost<ApiApplication>('updateApplicationStatus', {
      applicationId: id,
      status: toApiStatus(status),
    });
    return fromApi(app);
  },

  async addAdminNote(id: string, note: string): Promise<Application | null> {
    const app = await adminPost<ApiApplication>('addApplicationNote', { applicationId: id, note });
    return fromApi(app);
  },

  /** Downloads the private resume through the authenticated API. */
  async getResume(id: string): Promise<{ blob: Blob; fileName: string }> {
    const file = await adminPost<{ fileName: string; mimeType: string; data: string }>('getResume', {
      applicationId: id,
    });
    const binary = atob(file.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { blob: new Blob([bytes], { type: file.mimeType }), fileName: file.fileName };
  },

  async getDashboardStats() {
    const apps = await this.getApplications();
    return {
      total: apps.length,
      newCount: apps.filter(a => a.status === 'new').length,
      shortlisted: apps.filter(a => a.status === 'shortlisted').length,
      hired: apps.filter(a => a.status === 'hired').length,
    };
  },
};
