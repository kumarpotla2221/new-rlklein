// ============================================================
// JOB FORM OPTIONS — dropdown lists used by the filters, apply form and job editor.
// Job postings themselves live in the Google Sheet (see apps-script/).
// ============================================================

export const PROFESSIONS = [
  'Dentist',
  'Dental Hygienist',
  'Dental Assistant',
  'Licensed Clinical Social Worker',
  'Licensed Marriage and Family Therapist',
  'Licensed Vocational Nurse',
  'Nurse Practitioner',
  'Occupational Therapist',
  'Optometrist',
  'Pharmacist',
  'Physical Therapist',
  'Physician',
  'Physician Assistant',
  'Psychiatrist',
  'Psychologist',
  'Registered Nurse',
  'Respiratory Therapist',
  'LPT - Licensed Psychiatric Technician',
  'RECT',
];

export const SPECIALTIES = [
  'Behavioral Health',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'General Dentistry',
  'General / Primary Care',
  'Geriatrics',
  'Infectious Disease',
  'Internal Medicine',
  'Mental & Behavioral Health',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Optometry',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Psychology',
  'Pulmonology',
  'Radiology',
  'Rehabilitation',
  'Substance Use / Addiction',
  'Surgery',
  'Urology',
  'Women\'s Health',
];

export const WORK_SETTINGS = [
  'Correctional Healthcare',
  'Government Healthcare',
  'Outpatient Clinic',
  'Community Health Center',
  'Hospital',
];

export const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

export const EMPLOYMENT_TYPES = [
  'Full-Time', 'Part-Time', 'Per Diem', 'Contract', 'Temporary',
];

export const SHIFT_TYPES = [
  'Day', 'Evening', 'Night', 'Rotating', 'Flexible',
];

export const SHIFT_PATTERNS = [
  '8-Hour', '10-Hour', '12-Hour', 'Rotating', 'Flexible',
];

export const CONTRACT_TYPES = [
  'W2', '1099', 'Travel Contract', 'Local Contract', 'Direct Hire',
];

export const PAY_FREQUENCIES = [
  'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly',
];

export const STATE_ABBREVIATIONS: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN',
  'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE',
  'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
  'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR',
  'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
  'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
};
