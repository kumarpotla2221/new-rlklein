# Deploy — putting the site live on cPanel

> **Status:** planned (Phase 6). The full step-by-step guide and `.htaccess` file will be added here.

Works on any cPanel hosting with PHP 8.1+, MySQL and `.htaccess` support (GoDaddy, Turbify).

## Planned files

| File | Purpose |
| --- | --- |
| `.htaccess` | Goes in `public_html/`: forces HTTPS, makes page URLs work on refresh, enables compression and caching |
| `robots.txt` | Tells search engines to skip `/admin` and `/api` |
| `DEPLOY_GUIDE.md` | Step-by-step upload and setup instructions |

## What goes where on the server

```
/home/<cpanel-user>/
├── public_html/                 ← contents of frontend/dist/  +  backend/public_html/  +  deploy/.htaccess
│   ├── index.html
│   ├── assets/
│   ├── api/index.php
│   └── .htaccess
└── rlk_app/                     ← backend/rlk_app/  (outside the web root)
    ├── config.php               ← created on the server, holds the database password
    └── storage/resumes/
```

## Short version of the steps

1. Create the MySQL database and import `database/schema.sql` (see `database/README.md`).
2. Upload `backend/rlk_app/` next to `public_html`, then create `config.php` from `config.example.php`.
3. In `frontend/.env` set `VITE_API_URL=https://yourdomain.com/api/index.php`, then run `npm run build`.
4. Upload the contents of `frontend/dist/`, `backend/public_html/` and `deploy/.htaccess` into `public_html/`.
5. In cPanel, turn on SSL (AutoSSL) and set PHP limits: `post_max_size = 20M`, `memory_limit = 256M`.
6. Run the one-time admin setup script, then delete it.

## Before choosing a host, confirm with support

1. `.htaccess` with `mod_rewrite` works (required for page URLs)
2. PHP 8.1 or newer
3. Files can be stored outside `public_html`
4. PHP upload limit can be raised to ~20 MB
5. Free SSL certificate included
