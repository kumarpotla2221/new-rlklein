# R.L. Klein & Associates — Website & Job Portal

Healthcare staffing website with a public job board, an application form with resume upload,
and an admin panel for managing jobs and applications.

## How the project is organized

```
rlklein/
├── frontend/   React website (what visitors and admins see in the browser)
├── backend/    PHP API (talks to the database, handles logins and uploads)
├── database/   MySQL table definitions (imported through phpMyAdmin)
├── deploy/     Files and steps for putting the site live on cPanel hosting
└── docs/       System design and setup guides
```

Each folder has its own `README.md` explaining what is inside.

## How the parts work together

```
Visitor's browser
      │
      ▼
yourdomain.com            ← frontend/  (built React files in public_html)
yourdomain.com/api/...    ← backend/   (PHP)
      │
      ▼
MySQL database            ← database/  (managed in phpMyAdmin)
```

The website and the API live on the same domain on cPanel hosting (GoDaddy or Turbify).
Full details: [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md).

## Run the website on your computer

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
cd frontend
npm install        # first time only
npm run dev        # opens at http://localhost:5173
```

Other commands (run inside `frontend/`):

| Command | What it does |
| --- | --- |
| `npm run build` | Creates the production files in `frontend/dist/` (these get uploaded to hosting) |
| `npm run preview` | Serves the production build locally to test it |
| `npx oxlint` | Checks the code for mistakes |
| `npx tsc -b` | Checks TypeScript types |

## Project status

| Phase | Work | Status |
| --- | --- | --- |
| 1 | Speed fixes: compressed images/video, page-by-page loading, 404 page, cleanup | ✅ Done |
| 2 | MySQL database schema (fresh start, no Google Sheets data) | ✅ Done |
| 3 | PHP backend API (replaces Google Apps Script), 78 automated tests | ✅ Done |
| 4 | Connect website to the PHP API; make Contact & Staffing forms actually send | ✅ Done |
| 5 | SEO: page titles, pre-rendering, job listings in Google for Jobs, sitemap | ⏳ Next |
| 6 | Deployment to cPanel (.htaccess, caching, HTTPS) | ⏳ Planned |

> The website now talks to the PHP backend (`backend/` + MySQL). The old Google Apps Script
> setup ([docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md)) stays live until the new site is deployed
> (Phase 6), and can be switched off after that. No Google Sheets data is carried over.
