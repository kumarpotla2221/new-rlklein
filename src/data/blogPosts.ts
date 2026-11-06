import { photo, type PhotoKey } from './images';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image: PhotoKey;
  imageAlt: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'building-a-resilient-healthcare-workforce',
    title: 'Building a More Resilient Healthcare Workforce',
    excerpt:
      'Reliable care depends on more than filling an open shift. Thoughtful workforce planning helps facilities support their teams and the communities they serve.',
    category: 'Workforce Planning',
    publishedAt: '11/2/26',
    readTime: '4 min read',
    image: 'clinicalTeam',
    imageAlt: 'Healthcare professionals collaborating as a care team',
    sections: [
      {
        heading: 'Plan for continuity, not just coverage',
        paragraphs: [
          'An unfilled role can affect schedules, workloads, and continuity of care. A resilient staffing plan looks beyond the immediate vacancy and considers the people, skills, and coverage a facility needs over time.',
          'Start by identifying hard-to-cover roles, anticipated schedule changes, and the qualifications required for each position. This gives teams a clearer picture of where coverage gaps may emerge and what support will help address them.',
        ],
      },
      {
        heading: 'Make onboarding part of the plan',
        paragraphs: [
          'A placement is only one part of a successful staffing solution. Clear communication, organized credentialing, and a consistent onboarding process help clinicians understand expectations and prepare to contribute.',
          'When facility teams and staffing partners share timelines and requirements early, they can reduce avoidable delays and create a smoother start for everyone involved.',
        ],
      },
      {
        heading: 'Keep communication open',
        paragraphs: [
          'Workforce needs change. Regular check-ins help facilities adjust coverage, surface concerns, and plan for upcoming transitions. A responsive process supports both operational continuity and a better experience for healthcare professionals.',
        ],
      },
    ],
  },
  {
    slug: 'starting-a-career-in-correctional-healthcare',
    title: 'Starting a Career in Correctional Healthcare',
    excerpt:
      'Considering a new clinical setting? Learn what to think about when exploring healthcare roles in correctional and government environments.',
    category: 'For Professionals',
    publishedAt: '10/19/26',
    readTime: '5 min read',
    image: 'nurseVitals',
    imageAlt: 'Nurse providing attentive care in a clinical setting',
    sections: [
      {
        heading: 'A distinct care environment',
        paragraphs: [
          'Correctional healthcare brings clinical teams into a structured environment with its own protocols, security requirements, and interdisciplinary partners. Professionals considering this setting should be ready to learn site-specific procedures and work collaboratively.',
          'As in any healthcare role, patient-centered practice, sound professional judgment, and respect for each individual are essential.',
        ],
      },
      {
        heading: 'Ask questions before you apply',
        paragraphs: [
          'Ask about the position’s responsibilities, schedule, work location, required qualifications, and onboarding steps. Understanding these details can help you decide whether an opportunity aligns with your experience and goals.',
          'You can also ask what support is available during credentialing and after your start date. A clear conversation early on makes it easier to plan your next steps.',
        ],
      },
      {
        heading: 'Find the right opportunity',
        paragraphs: [
          'Every role and facility is different. Review the requirements carefully and talk with a recruiter if you would like help understanding the application process or the details of a specific opening.',
        ],
      },
    ],
  },
  {
    slug: 'credentialing-for-a-smoother-start',
    title: 'Credentialing: Preparing for a Smoother Start',
    excerpt:
      'A little preparation can make the credentialing process easier to navigate. Here are practical ways to get organized before your next placement.',
    category: 'Credentialing',
    publishedAt: '10/5/26',
    readTime: '3 min read',
    image: 'credentialing',
    imageAlt: 'Healthcare professional reviewing information at a desk',
    sections: [
      {
        heading: 'Gather key information early',
        paragraphs: [
          'Credentialing requirements vary by role and facility. Commonly requested materials may include current license information, education and training details, work history, and professional references. Confirm the specific list for your opportunity before sending documents.',
          'Keeping your information current and organized can help you respond promptly when a recruiter or credentialing coordinator follows up.',
        ],
      },
      {
        heading: 'Pay attention to details',
        paragraphs: [
          'Check that forms are complete and that names, dates, and contact information are consistent. If a document is missing or needs renewal, flag it early so you can understand what is needed and the expected timing.',
          'Use secure channels when sharing personal or professional records, and ask who to contact if you have questions about a request.',
        ],
      },
      {
        heading: 'Stay in touch',
        paragraphs: [
          'Credentialing can involve several steps and stakeholders. Replying to requests, sharing updates, and asking for clarification when something is unclear help keep the process moving toward your planned start.',
        ],
      },
    ],
  },
  {
    slug: 'locum-tenens-tax-planning-basics',
    title: 'Locum Tenens Tax Planning Basics',
    excerpt:
      'Locum tenens work can bring new tax questions. Learn why it helps to keep good records and consult a qualified tax professional about your situation.',
    category: 'Career Resources',
    publishedAt: '12/20/24',
    readTime: '4 min read',
    image: 'clinicalReview',
    imageAlt: 'Healthcare professional reviewing clinical information',
    sections: [
      {
        heading: 'Keep organized records',
        paragraphs: [
          'Travel and temporary assignments can involve expenses and documentation that differ from a permanent role. Keep clear records of income, assignments, and work-related costs, and retain receipts and relevant documents.',
          'Tax rules depend on your individual circumstances and can change. General information is not a substitute for advice tailored to you.',
        ],
      },
      {
        heading: 'Get professional guidance',
        paragraphs: [
          'Before making tax decisions, speak with a qualified tax professional who understands your work arrangements and can answer questions based on your situation.',
          'If you are evaluating an assignment, ask the recruiter to clarify the compensation and benefits information they can provide, and direct tax questions to your advisor.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string | undefined): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostImage(post: BlogPost, width = 1200): string {
  return photo(post.image, width);
}
