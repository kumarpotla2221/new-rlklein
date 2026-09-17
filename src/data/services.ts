// ============================================================
// SERVICE AREAS DATA
// ============================================================

import type { ServiceArea } from '../types';

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'correctional-healthcare',
    title: 'Correctional Healthcare',
    description: 'Specialized staffing solutions for correctional healthcare environments, connecting qualified healthcare professionals with facilities that serve incarcerated populations.',
    slug: '/cdcr-healthcare/correctional-healthcare',
  },
  {
    id: 'medical-staffing',
    title: 'Medical Staffing',
    description: 'Qualified physicians, registered nurses, licensed vocational nurses, nurse practitioners, and physician assistants for government and institutional healthcare environments.',
    slug: '/cdcr-healthcare/medical-staffing',
  },
  {
    id: 'mental-behavioral-health',
    title: 'Mental & Behavioral Health',
    description: 'Behavioral healthcare professionals including psychiatrists, psychologists, licensed clinical social workers, and licensed marriage and family therapists.',
    slug: '/cdcr-healthcare/mental-behavioral-health',
  },
  {
    id: 'dental-healthcare',
    title: 'Dental Healthcare',
    description: 'Dental professionals including dentists, dental hygienists, and dental assistants for correctional and government healthcare facilities.',
    slug: '/cdcr-healthcare/dental-healthcare',
  },
  {
    id: 'allied-health',
    title: 'Allied Health',
    description: 'Specialized allied healthcare professionals across pharmacy, laboratory, radiology, physical therapy, occupational therapy, and respiratory therapy disciplines.',
    slug: '/cdcr-healthcare/allied-health',
  },
  {
    id: 'government-healthcare',
    title: 'Government Healthcare',
    description: 'Healthcare staffing and workforce support for public-sector environments, including federal, state, and local government healthcare organizations.',
    slug: '/cdcr-healthcare',
  },
];

// State presence data for the interactive map
// Only verified presence is marked as active
export const STATE_DATA: Record<string, { name: string; status: 'active' | 'inactive'; notes?: string }> = {
  AL: { name: 'Alabama', status: 'inactive' },
  AK: { name: 'Alaska', status: 'inactive' },
  AZ: { name: 'Arizona', status: 'inactive' },
  AR: { name: 'Arkansas', status: 'inactive' },
  CA: { name: 'California', status: 'active', notes: 'Primary service area. Correctional healthcare staffing for California Department of Corrections and Rehabilitation facilities.' },
  CO: { name: 'Colorado', status: 'inactive' },
  CT: { name: 'Connecticut', status: 'inactive' },
  DE: { name: 'Delaware', status: 'inactive' },
  FL: { name: 'Florida', status: 'inactive' },
  GA: { name: 'Georgia', status: 'inactive' },
  HI: { name: 'Hawaii', status: 'inactive' },
  ID: { name: 'Idaho', status: 'inactive' },
  IL: { name: 'Illinois', status: 'inactive' },
  IN: { name: 'Indiana', status: 'inactive' },
  IA: { name: 'Iowa', status: 'inactive' },
  KS: { name: 'Kansas', status: 'inactive' },
  KY: { name: 'Kentucky', status: 'inactive' },
  LA: { name: 'Louisiana', status: 'inactive' },
  ME: { name: 'Maine', status: 'inactive' },
  MD: { name: 'Maryland', status: 'inactive' },
  MA: { name: 'Massachusetts', status: 'inactive' },
  MI: { name: 'Michigan', status: 'inactive' },
  MN: { name: 'Minnesota', status: 'inactive' },
  MS: { name: 'Mississippi', status: 'inactive' },
  MO: { name: 'Missouri', status: 'inactive' },
  MT: { name: 'Montana', status: 'inactive' },
  NE: { name: 'Nebraska', status: 'inactive' },
  NV: { name: 'Nevada', status: 'inactive' },
  NH: { name: 'New Hampshire', status: 'inactive' },
  NJ: { name: 'New Jersey', status: 'inactive' },
  NM: { name: 'New Mexico', status: 'inactive' },
  NY: { name: 'New York', status: 'inactive' },
  NC: { name: 'North Carolina', status: 'inactive' },
  ND: { name: 'North Dakota', status: 'inactive' },
  OH: { name: 'Ohio', status: 'inactive' },
  OK: { name: 'Oklahoma', status: 'inactive' },
  OR: { name: 'Oregon', status: 'inactive' },
  PA: { name: 'Pennsylvania', status: 'inactive' },
  RI: { name: 'Rhode Island', status: 'inactive' },
  SC: { name: 'South Carolina', status: 'inactive' },
  SD: { name: 'South Dakota', status: 'inactive' },
  TN: { name: 'Tennessee', status: 'inactive' },
  TX: { name: 'Texas', status: 'inactive' },
  UT: { name: 'Utah', status: 'active', notes: 'Operational and payroll management offices located in Orem and Provo, Utah.' },
  VT: { name: 'Vermont', status: 'inactive' },
  VA: { name: 'Virginia', status: 'inactive' },
  WA: { name: 'Washington', status: 'inactive' },
  WV: { name: 'West Virginia', status: 'inactive' },
  WI: { name: 'Wisconsin', status: 'inactive' },
  WY: { name: 'Wyoming', status: 'inactive' },
};
