# Backend — PHP API

Plain PHP 8.1+ with PDO and MySQL/MariaDB, with no framework and no Composer packages, so it runs on
any cPanel shared hosting. Built for Turbify (PHP 8.3 on new.rlklein.com, set in deploy/new-subdomain/.htaccess; MariaDB 10.11); tested locally on PHP 8.2,
MariaDB 10.4 and Apache.

## Folder layout

The two folders mirror where they go on the server:

```
backend/
├── public_html/api/            → upload to  public_html/new.rlklein.com/api/
│   ├── index.php               The API: https://new.rlklein.com/api/index.php?action=…
│   ├── setup.php               One-time page to create the first admin (delete after use)
│   ├── _locate.php             Finds rlk_app (not reachable from the web)
│   └── .htaccess               Only index.php and setup.php can be opened
│
├── rlk_app/                    → upload to  /home/<cpanel-user>/rlk_app/   (NOT inside public_html)
│   ├── bootstrap.php           Startup: autoload, settings, error handling
│   ├── config.example.php      Settings template → copy to config.php on the server
│   ├── config.php              ⚠ Your real settings + DB password. Never in Git, never shared.
│   ├── .htaccess               Deny-all safety net
│   ├── bin/create-admin.php    Add more admin/recruiter accounts (cPanel Terminal)
│   ├── src/
│   │   ├── Api.php             Router: action name → controller, admin check, error handling
│   │   ├── Auth.php            Passwords, sessions, lockout
│   │   ├── Validator.php       Checks and cleans every input field
│   │   ├── Database.php        PDO connection (strict mode, UTC)
│   │   ├── RateLimiter.php     Per-IP limits (spam / password guessing)
│   │   ├── Mailer.php          Email alerts to the team
│   │   ├── Request.php, Response.php, Config.php, Logger.php, Storage.php, ApiException.php
│   │   ├── Controllers/        Jobs, Applications, Forms (contact + staffing), Auth, System
│   │   └── Repositories/       Jobs and Applications ↔ database rows
│   ├── storage/resumes/        Created automatically. Uploaded resumes (private)
│   └── logs/                   Created automatically. api-YYYY-MM.log
│
└── tests/api_smoke_test.php    78 automated checks (local only; don't upload)
```

If `rlk_app` is accidentally uploaded inside `public_html`, it refuses to run, so the database
password can't be exposed.

## API actions

Same names and JSON format the website already uses. Responses are always
`{"ok":true,"data":…}` or `{"ok":false,"error":{"code":"…","message":"…"}}`; the message is safe
to show to visitors.

| Action | Method | Who | Purpose |
| --- | --- | --- | --- |
| *(none)* | GET | public | `{"status":"ok"}`, quick "is it up" check |
| `health` | GET | public | Checks database tables, file storage, and whether an admin exists |
| `getJobs` | GET | public | Active, unexpired, public jobs (hidden pay removed) |
| `getJob` | GET | public | One open job by `jobId` or `slug`, else `null` |
| `createApplication` | POST | public | Application + resume `{name, type, data(base64)}` |
| `submitContact` | POST | public | Contact page form |
| `submitStaffingRequest` | POST | public | Facility staffing request form |
| `login` / `logout` | POST | public | `{username, password}` → `{token, expiresAt, admin}` |
| `getSession` | POST | admin | Is the token still valid? |
| `getAdminJobs`, `getAdminJob`, `createJob`, `updateJob`, `deleteJob` | POST | admin | Manage jobs |
| `getApplications`, `getApplication`, `updateApplicationStatus`, `addApplicationNote`, `getResume` | POST | admin | Manage applications |

Admin actions need `"token"` in the JSON body. A missing or expired token gives `UNAUTHORIZED`,
and the website then signs out.

## Security summary

| Area | How |
| --- | --- |
| Secrets | Only in `rlk_app/config.php`, outside the web root; refuses to run from inside `public_html` |
| SQL injection | Prepared statements everywhere; strict SQL mode rejects bad values |
| Passwords | `password_hash()`; min 12 characters; 5 wrong attempts → 15-minute lock; same message for unknown emails |
| Sessions | Random 64-character token, stored only as a SHA-256 hash, 6 hours, removed on sign-out |
| Admin checks | Every admin action re-checks the token and that the account is active |
| Resumes | PDF / DOC / DOCX recognised by **file content**, 10 MB max, random file names, private folder, admin-only download |
| Applications | Job title looked up on the server; closed/expired/draft jobs refuse applications |
| Spam | Per-IP rate limits + hidden "website" honeypot field |
| Email | Header injection blocked; a mail failure never loses a submission (it's logged) |
| Errors | Visitors see a friendly message; details go to `rlk_app/logs/` |

## Email alerts

Sent to the addresses in `config.php` → `mail.to` (info@, operations@, jim@rlklein.com) for every
new application, contact message and staffing request. They contain a direct link to the
application in the admin panel. If alerts don't arrive, check spam first, then `rlk_app/logs/`.

## Testing locally (XAMPP)

```bash
# 1. Test database: create "rlk_test" and import database/schema.sql
# 2. backend/rlk_app/config.php → point "db" at it, add 'http://localhost:5173' to cors_origins
# 3. Start the API
php -S 127.0.0.1:8080 -t backend/public_html
# 4. Create two test accounts
php backend/rlk_app/bin/create-admin.php --email=admin@test.local --name="Test" --password=...
php backend/rlk_app/bin/create-admin.php --email=lock@test.local --name="Lock" --password=...
# 5. Run the checks (needs an EMPTY database; refuses to run against anything but localhost)
php backend/tests/api_smoke_test.php --url=http://127.0.0.1:8080/api/index.php \
    --email=admin@test.local --password=... --lock-email=lock@test.local --lock-password=...
```

Expected: `Result: 78 passed, 0 failed`.

## Deploying to Turbify

Covered step by step in Phase 6 ([deploy/README.md](../deploy/README.md)). In short: upload
`rlk_app/` to your home folder, create `config.php` there with the database password, upload
`public_html/api/` into `public_html/new.rlklein.com/api/`, open
`https://new.rlklein.com/api/index.php?action=health`, then create the first admin with `setup.php`.
