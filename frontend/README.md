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

## Settings (`.env`)

| Variable | Meaning |
| --- | --- |
| `VITE_API_URL` | Full URL of the backend API. Must start with `https://`. |

Everything in `VITE_*` variables ends up in the public website code — never put passwords there.
`.env` is not committed to Git.

## Performance notes

- Each page is loaded only when visited (`lazy()` in `App.tsx`). The homepage is bundled up front.
- Keep photos under ~300 KB. Resize large photos before adding them to `public/`.
