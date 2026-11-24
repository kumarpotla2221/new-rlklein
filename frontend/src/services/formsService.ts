// ============================================================
// FORMS SERVICE: the Contact page and the Facility Staffing Request form.
// Submissions are saved by the PHP API and emailed to the R.L. Klein team.
// ============================================================

import { apiPost } from './apiClient';

export interface ContactSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  specialty: string;
  experience: string;
  startTime: string;
  emailConsent: boolean;
  smsConsent: boolean;
  message: string;
}

export interface StaffingRequestSubmission {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  organization: string;
  city: string;
  state: string;
  facilityType: string;
  professionNeeded: string;
  numberNeeded: number | string;
  assignmentType: string;
  shift: string;
  startDate: string;
  details: string;
  hasExistingAgency: boolean;
  improvementGoals: string;
}

/** `website` is the hidden honeypot field: people leave it empty, bots fill it in. */
export const formsService = {
  submitContact(data: ContactSubmission, website = ''): Promise<{ received: boolean }> {
    return apiPost('submitContact', { ...data, website });
  },

  submitStaffingRequest(data: StaffingRequestSubmission, website = ''): Promise<{ received: boolean }> {
    return apiPost('submitStaffingRequest', { ...data, website });
  },
};
