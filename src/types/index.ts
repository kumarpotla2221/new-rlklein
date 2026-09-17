// ============================================================
// R.L. KLEIN & ASSOCIATES — TYPE DEFINITIONS
// ============================================================

export type JobStatus = 'draft' | 'published' | 'paused' | 'expired' | 'archived';
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Per Diem' | 'Contract' | 'Temporary';
export type ShiftType = 'Day' | 'Evening' | 'Night' | 'Rotating' | 'Flexible';
export type CompensationType = 'hourly' | 'weekly' | 'salary' | 'negotiable';

export interface Job {
  id: string;
  slug: string;
  title: string;
  profession: string;
  specialty: string;
  state: string;
  city: string;
  facility?: string;
  workSetting: string;
  employmentType: EmploymentType;
  shift: ShiftType;
  hoursPerWeek?: number;
  startDate?: string;
  assignmentDuration?: string;
  status: JobStatus;
  featured: boolean;
  postedDate: string;
  expirationDate?: string;
  compensationType?: CompensationType;
  compensationMin?: number;
  compensationMax?: number;
  showCompensation: boolean;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications?: string[];
  requiredCredentials: string[];
  additionalCompensation?: string;
  applicationCount?: number;
}

export type ApplicationStatus =
  | 'new'
  | 'under-review'
  | 'credentialing'
  | 'shortlisted'
  | 'interview'
  | 'hired'
  | 'rejected';

export interface Application {
  id: string;
  referenceNumber: string;
  jobId: string;
  jobTitle: string;
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  // Professional
  profession: string;
  yearsExperience?: number;
  licenseNumber?: string;
  licenseState?: string;
  specialty?: string;
  // Preferences
  assignmentType?: string;
  preferredLocation?: string;
  preferredShift?: string;
  availableStartDate?: string;
  // Documents
  resumeFileName?: string;
  resumeUrl?: string;
  // Extra
  message?: string;
  // Metadata
  appliedDate: string;
  status: ApplicationStatus;
  adminNotes?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'recruiter';
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  department?: string;
  bio?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  isCEO?: boolean;
}

export interface Recruiter {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  email?: string;
  photoUrl?: string;
}

export interface ServiceArea {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StateData {
  name: string;
  abbreviation: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface JobFilters {
  profession?: string;
  state?: string;
  specialty?: string;
  workSetting?: string;
  employmentType?: string;
  shift?: string;
  search?: string;
  featured?: boolean;
  status?: JobStatus;
}

export interface StaffingRequest {
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
  numberNeeded?: number;
  assignmentType?: string;
  shift?: string;
  startDate?: string;
  details?: string;
  hasExistingAgency?: boolean;
  improvementGoals?: string;
}

export interface ContactFormData {
  userType: 'healthcare-professional' | 'facility' | 'partner' | 'general';
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  profession?: string;
  organization?: string;
  location?: string;
  staffingType?: string;
  professionNeeded?: string;
  numberNeeded?: number;
  assignmentType?: string;
  startDate?: string;
  message?: string;
  consent: boolean;
}
