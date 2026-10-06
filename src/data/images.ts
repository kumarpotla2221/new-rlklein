// ============================================================
// SITE PHOTOGRAPHY
// Unsplash-licensed images (free for commercial use), chosen for
// natural, in-the-moment clinical care rather than posed portraits.
// ============================================================

export const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

const PHOTO_IDS = {
  correctionalCare: '1631815588090-d4bfec5b1ccb',
  nurseVitals: '1542884748-2b87b36c6b90',
  behavioralConsult: '1631217868264-e5b90bb7e133',
  dentalXray: '1588776814546-1ffcf47267a5',
  labTechnician: '1527613426441-4da17471b66d',
  bedsideCare: '1581056771107-24ca5f033842',
  clinicalTeam: '1666214280557-f1b5022eb634',
  facilityLobby: '1519494026892-80bbd2d6fd0d',
  credentialing: '1576091160550-2173dba999ef',
  supportiveCare: '1584515933487-779824d29309',
} as const;

export type PhotoKey = keyof typeof PHOTO_IDS;

export const photo = (key: PhotoKey, width = 1200) => unsplash(PHOTO_IDS[key], width);

// Specialty photography keyed by SERVICE_AREAS id
export const SPECIALTY_PHOTOS: Record<string, PhotoKey> = {
  'correctional-healthcare': 'correctionalCare',
  'medical-staffing': 'nurseVitals',
  'mental-behavioral-health': 'behavioralConsult',
  'dental-healthcare': 'dentalXray',
  'allied-health': 'labTechnician',
  'government-healthcare': 'bedsideCare',
};
