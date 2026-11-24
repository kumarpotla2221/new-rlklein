# System Design — React + PHP + MySQL on cPanel

## Goals

1. Host everything on standard cPanel hosting (GoDaddy or Turbify) with a MySQL database in phpMyAdmin.
2. No errors for visitors: every failure returns a clear message, never a broken page.
3. Fast loading on phones and desktops.
4. SEO-friendly: every page and every job can be found on Google.

## Architecture

```
Browser
   │  HTTPS
   ▼
(optional, free) Cloudflare CDN — caches images/JS/CSS, hides slow shared-hosting response times
   │
   ▼
cPanel host — Apache + PHP 8.1+
   ├── public_html/                ← React build (static files)
   │     index.html, assets/
   │     .htaccess                  ← HTTPS, page routing, caching, compression
   │     api/index.php              ← single entry point for the whole API
   │
   ├── rlk_app/   (outside public_html — not reachable from the web)
   │     config.php                 ← database password, secrets
   │     src/                       ← PHP code
   │     storage/resumes/           ← uploaded resumes (private)
   │     logs/
   │
   └── MySQL database (phpMyAdmin)
```

Website and API share one domain (`yourdomain.com` and `yourdomain.com/api/`), so there is
no cross-origin (CORS) setup and requests are faster.

### Why PHP and not Node.js
Shared cPanel hosting runs PHP everywhere; Node.js backends generally are not supported.
PHP + MySQL also makes the project portable between GoDaddy, Turbify and most other hosts.

## API contract (unchanged from today)

The frontend already calls `?action=<name>` with a JSON body and expects
`{"ok":true,"data":…}` / `{"ok":false,"error":{"code","message"}}`.
The PHP API copies this exactly, so switching backends only means changing
`VITE_API_URL` in `frontend/.env`. It must be a full `https://` URL
(`apiClient.ts` passes it to `new URL()`).

Actions: see [backend/README.md](../backend/README.md#api-contract).

## Database

Tables: `admins`, `admin_sessions`, `jobs`, `applications`, `contact_submissions`,
`staffing_requests`, `rate_limits`. Details in [database/README.md](../database/README.md).

Key indexes: `jobs (status, visibility, expiration_date)`, `jobs.slug` unique,
`applications.reference_number` unique, `admin_sessions.token_hash` unique.

## Reliability ("no errors")

- One `try/catch` around the whole API: any crash becomes
  `{ok:false,error:{code:"SERVER",…}}`, which the frontend already shows as a friendly message.
- `display_errors = Off`; details go to `rlk_app/logs/`.
- Every input is validated on the server; the frontend never has to be trusted.
- PHP limits raised for resumes (base64 makes a 10 MB file ~13.4 MB):
  `post_max_size = 20M`, `memory_limit = 256M`.
- Email alerts to the team for each application, contact message and staffing request.

## Security

| Area | Measure |
| --- | --- |
| Secrets | Only in `rlk_app/config.php`, outside the web root, not in Git |
| SQL injection | PDO prepared statements only |
| Passwords | `password_hash()` / `password_verify()`; 5 failed logins → 15 min lockout |
| Sessions | 64-char random token, stored as SHA-256 hash, expires after 6 hours |
| Resumes | Extension + real file type (`finfo`) checked, 10 MB max, private folder, admin-only download |
| Spam | Per-IP rate limits, honeypot field, Cloudflare Turnstile on public forms |
| Transport | HTTPS forced; security headers in `.htaccess` |

## Performance

| Measure | Status |
| --- | --- |
| Compressed photos and hero video (≈30 MB → ≈2 MB total) | ✅ Phase 1 |
| Each page downloads only when visited; admin code kept away from visitors | ✅ Phase 1 |
| Decorative US map loads after the homepage | ✅ Phase 1 |
| Long-term browser caching for hashed assets, no-cache for `index.html` | Phase 6 |
| Gzip/Brotli compression | Phase 6 |
| Cloudflare CDN | Phase 6 (optional) |
| Database indexes + short cache on the public job list | Phase 3 |
| Trim or self-host web fonts | Phase 5 |

## SEO

1. **A title and description for every page.** React 19 renders `<title>`/`<meta>` from inside page components.
2. **Pre-render marketing pages** at build time so search engines get full HTML.
3. **Job pages served by PHP** with title, description and `JobPosting` structured data →
   jobs appear in **Google for Jobs**. Closed/expired jobs return 404/410.
4. **`sitemap.xml`** generated from the database; **`robots.txt`** blocks `/admin` and `/api`.
5. **Real 404 pages** (✅ page added in Phase 1; server 404 status in Phase 6).

## Hosting checklist (ask the host's support)

1. `.htaccess` + `mod_rewrite` supported — **required** for page URLs to work on refresh
2. PHP 8.1+
3. Files allowed outside `public_html`
4. PHP upload limits can be raised to ~20 MB
5. Free SSL and SMTP email

If a host can't do #1 or #3, use GoDaddy cPanel Linux hosting. The code is identical on both.

## Launch plan: preview → rlklein.com

1. **Preview:** the site runs at `new.rlklein.com` (hidden from Google) while WordPress keeps serving
   `rlklein.com`. Every push to `main` deploys automatically ([deploy/README.md](../deploy/README.md)).
2. **Client review:** changes requested by the client are made and pushed the same way.
3. **Swap (after approval):** both domains are on the same Turbify server, so there are no DNS or
   database changes.
   - Full cPanel backup of WordPress (files + `_wp_myk96` database).
   - Map old WordPress URLs → new pages as 301 redirects (keeps Google rankings and old links).
   - Delete test jobs/applications in the admin panel.
   - Move WordPress files out of `public_html` into a backup folder (not deleted).
   - Point the deployment at `public_html` with a main-domain `.htaccess` (no noindex), set
     `VITE_API_URL=https://rlklein.com/api/index.php` and `app.url` in `config.php`.
   - Redirect `new.rlklein.com` → `rlklein.com`; submit the sitemap to Google Search Console.
   - Switch off the Vercel project and the Google Apps Script deployment.
   - **Rollback:** move the WordPress files back; its database was never changed.

## Fresh start (no data migration)

The new system starts with an empty database. Nothing is copied from the Google Sheet or
Google Drive. Jobs are created again in the admin panel. Switching over:

1. Create the database and import `database/schema.sql` ([database/README.md](../database/README.md)).
2. Deploy the PHP backend and create the first admin account (Phase 3).
3. Switch `VITE_API_URL`, rebuild, upload.
4. The Google Apps Script project can then be switched off.
