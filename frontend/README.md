# Frontend — React website

Built with React 19, TypeScript, Vite and React Router.

```bash
npm install     # first time only
npm run dev     # http://localhost:5173
npm run build   # production files → dist/
```

## Folder map

```
frontend/
├── index.html            Page shell (default title, fonts)
├── public/               Files served as-is (logos, photos, favicon)
├── RLklein Hero.jpg      Homepage hero image
├── rlklein bg.mp4        Homepage background video
└── src/
    ├── main.tsx          Starts the app
    ├── App.tsx           ★ All website URLs (routes) are listed here
    ├── layouts/          Page frames: PublicLayout (header+footer), AdminLayout (sidebar)
    ├── pages/            One file per page
    │   ├── public/                Home, jobs, apply, contact, blog, legal pages, 404
    │   ├── about/                 Who we are, team, awards, safety, Joint Commission
    │   ├── staffig solutions/     CDCR healthcare pages
    │   ├── facilities/            Capabilities, staffing request form
    │   ├── professionals/         For healthcare professionals (how it works, pay, FAQ…)
    │   └── admin/                 Admin login, dashboard, jobs, applications
    ├── components/       Reusable pieces
    │   ├── layout/                Header, Footer
    │   ├── jobs/                  Job cards, filters, table, details modal
    │   ├── map/                   Interactive US map
    │   └── ui/                    Buttons, badges, loaders, animations, route guard
    ├── services/         ★ All communication with the backend API
    │   ├── apiClient.ts           The only file that calls the server
    │   ├── jobService.ts          Jobs
    │   ├── applicationService.ts  Applications & resumes
    │   └── authService.ts         Admin login/logout
    ├── contexts/         AuthContext — who is logged in to admin
    ├── data/             Fixed content: services, FAQs, blog posts, job dropdown options, images
    ├── types/            TypeScript shapes for Job, Application, etc.
    ├── hooks/            Small reusable React hooks
    └── styles/           CSS, one file per area (header, home, jobs, forms…)
```

## Where to change common things

| I want to… | Edit |
| --- | --- |
| Add or rename a page URL | `src/App.tsx` |
| Change the menu | `src/components/layout/Header.tsx` |
| Change the footer | `src/components/layout/Footer.tsx` |
| Change FAQ text | `src/data/faqs.ts` |
| Change blog posts | `src/data/blogPosts.ts` |
| Change job form dropdown options | `src/data/jobs.ts` |
| Point the site at a different API | `.env` → `VITE_API_URL` |

## Settings: which API the website talks to

| File | Used by | `VITE_API_URL` |
| --- | --- | --- |
| `.env.development` | `npm run dev` | `http://127.0.0.1:8080/api/index.php` (PHP backend on this computer) |
| `.env.production` | `npm run build` | `https://new.rlklein.com/api/index.php` (live site) |

To run the backend locally for `npm run dev`, see [backend/README.md](../backend/README.md#testing-locally-xampp).
These two files hold only public addresses and are committed to Git. Everything in `VITE_*`
variables ends up in the public website code, so never put passwords there.

The old `.env` (Google Apps Script address) is no longer used. The two files above take priority
over it, and it can be deleted.

## Forms

| Page | Sends to API action | Saved in table |
| --- | --- | --- |
| Apply (`/apply`, `/apply/:jobId`) | `createApplication` | `applications` |
| Contact (`/contact`) | `submitContact` | `contact_submissions` |
| Staffing Request (`/facilities/staffing-request`) | `submitStaffingRequest` | `staffing_requests` |

All three include a hidden spam-trap field (`HoneypotField`) and show the server's error message
in a red box (`FormAlert`) if sending fails. Each submission also emails the team.

## Performance notes

- Each page is loaded only when visited (`lazy()` in `App.tsx`). The homepage is bundled up front.
- Keep photos under ~300 KB. Resize large photos before adding them to `public/`.
