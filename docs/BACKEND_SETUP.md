# RLKlein Job Portal — Backend Setup (Google Apps Script)

This guide connects the website to a **private Google Sheet** and a **private Google Drive folder**
through Google Apps Script. No prior backend experience needed. Allow about 30 minutes.

```
React website  ──►  Apps Script Web App  ──►  Google Sheet (Jobs, Applications, Admins)
                    (runs as you)         └─►  Google Drive (RLKlein Job Applications/Resumes)
```

**Why the Sheet and Drive stay private:** the Web App runs *as you*. Visitors never get access
to the Sheet or the folder — they can only call the API actions the script allows, and every
admin action checks the admin's session on the server first.

**Where secrets live:**

| Item | Where it goes | Never put it in |
| --- | --- | --- |
| Admin password | Script Properties, briefly (deleted automatically) → stored only as a hash | React code, `.env` files, GitHub |
| Spreadsheet ID, folder ID | Script Properties (set automatically by `setup()`) | React code |
| Web App URL | `.env.local` as `VITE_API_URL` (this is public — that's fine) | — |

---

## 1. Create the Google Sheet

1. Go to <https://sheets.google.com> and create a **Blank spreadsheet**.
2. Rename it **RLKlein Job Portal** (click "Untitled spreadsheet" at the top left).
3. Click **Share** (top right). Under **General access** make sure it says **Restricted**.
   Don't add anyone.

## 2. Sheet tabs

You don't need to create them by hand. `setup()` (step 6) creates **Jobs**, **Applications**
and **Admins** with the right column headers, freezes the header row, and adds status dropdowns.

The first columns match the original spec exactly. Extra columns to the right store data the
website already displays (profession, specialty, shift, featured flag, license info, notes…).
You can safely edit these in the sheet: `title`, `description`, `requirements` and `benefits`
(one item per line), `status`, `featured` (TRUE/FALSE), `profession`, `specialty`, `city`,
`state`, `work_setting`, `shift`, `expiration_date` (YYYY-MM-DD), and application `status`.
Don't edit `job_id`, `slug`, `details_json`, `resume_file_id` or `password_hash` by hand.

## 3. Google Drive folder

Also created by `setup()`: **RLKlein Job Applications / Resumes** in your My Drive.
If you already created a folder with that exact name, the script reuses it.
Its sharing must stay **Restricted** — `setup()` and `checkSetup()` warn you if it isn't.

## 4. Create the Apps Script project

1. In the spreadsheet, click **Extensions → Apps Script**. A new tab opens with a project
   connected to this sheet.
2. Rename the project (top left) to **RLKlein Job Portal API**.

## 5. Add the code

All the code is in the `apps-script/` folder of this repository.

1. In the Apps Script editor, click **Project Settings** (⚙ gear, left sidebar) and tick
   **Show "appsscript.json" manifest file in editor**.
2. Go back to **Editor** (`< >` icon). Click `appsscript.json`, replace everything in it
   with the contents of `apps-script/appsscript.json`, and save (Ctrl+S).
3. Click the existing `Code.gs`, replace everything with `apps-script/Code.gs`, and save.
4. For each remaining file, click **+ → Script**, type the name **without** `.gs`
   (the editor adds it), paste the contents, and save:
   `Config`, `Utils`, `Auth`, `Jobs`, `Applications`, `DriveService`, `Setup`, `SeedData`.

You should end up with 9 `.gs` files plus `appsscript.json`. File order in the sidebar doesn't matter.

## 6. Run `setup()` and grant access (Sheets + Drive)

1. In the toolbar, choose **setup** in the function dropdown and click **Run**.
2. Google asks for permission:
   **Review permissions** → pick your account → you'll see *"Google hasn't verified this app"*
   → **Advanced** → **Go to RLKlein Job Portal API (unsafe)** → **Allow**.
   This warning appears for every personal script. It's your own code asking to use your own
   Sheet and Drive, which is why it asks for the Spreadsheets and Drive permissions.
3. Open **Execution log**. You should see the Sheet URL, the folder URLs, and "Setup complete".
   Check the spreadsheet: the three tabs now exist.

## 7. Create the admin account

1. **Project Settings** (⚙) → scroll to **Script Properties** → **Add script property**, and add:

   | Property | Value |
   | --- | --- |
   | `ADMIN_USERNAME` | the admin's email address, e.g. `operations@rlklein.com` (used to sign in) |
   | `ADMIN_PASSWORD` | a new password, **at least 12 characters**, not used anywhere else |
   | `ADMIN_NAME` | display name, e.g. `R.L. Klein Administrator` |

2. Click **Save script properties**.
3. Back in the Editor, run **setupAdmin**.
4. Check the log: it says the admin was saved and that `ADMIN_PASSWORD` was removed.
   Refresh Project Settings to confirm `ADMIN_PASSWORD` is gone. The **Admins** tab now has
   one row whose `password_hash` starts with `pbkdf2_sha256$`. The plain password is stored nowhere.

> ⚠️ Don't reuse the old demo password `RLK-Admin-2024!`. It was in the website's source code
> and GitHub history, so treat it as public.

**To change the password later:** add `ADMIN_PASSWORD` again with the new value and run
`setupAdmin` again. Any open admin sessions are signed out immediately.

There is only ever **one active admin**. Running `setupAdmin` with a different
`ADMIN_USERNAME` makes the new account active and marks the old one Inactive.

## 8. (Optional) Load the existing jobs

Run **seedSampleJobs**. It copies the six jobs that used to be hardcoded in the website into
the Jobs sheet, so the live site looks the same as before. It does nothing if the Jobs sheet
already has rows. Afterwards you can delete the `SeedData` file and the `seedSampleJobs`
function.

Run **checkSetup** at any time for a health report.

## 9. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Fill in:
   - **Description:** `v1`
   - **Execute as:** **Me** (your account) — this is what keeps the Sheet and Drive private
   - **Who has access:** **Anyone** — website visitors don't sign in to Google.
     (Not "Anyone with Google account": that would make every visitor sign in, and the website would fail.)
4. Click **Deploy**, then **Authorize access** if asked (same steps as in step 6).

## 10. Get the Web App URL

Copy the **Web app URL** shown after deploying. It looks like
`https://script.google.com/macros/s/AKfycb…/exec`. Use the one ending in **`/exec`**,
not `/dev`.

> **When you change the script later:** go to **Deploy → Manage deployments → ✏️ (edit) →
> Version: New version → Deploy**. That keeps the same URL. Using "New deployment" instead
> creates a new URL, and you'd have to update the website.

## 11. Connect the React website

1. In the project folder, copy `.env.example` to a new file named **`.env.local`**.
2. Replace the placeholder so it reads:
   ```
   VITE_API_URL=https://script.google.com/macros/s/AKfycb…/exec
   ```
3. Restart the dev server (`Ctrl+C`, then `npm run dev`). Vite only reads `.env` files when it starts.
4. For the live site, run `npm run deploy` as usual. It builds with `.env.local`.

`.env.local` is already ignored by Git (`*.local` in `.gitignore`). The URL is public anyway;
keeping it out of Git just keeps environments separate.

## 12. Test the API

Paste these into your browser's address bar (use your own URL):

- `…/exec` → `{"ok":true,"data":{"status":"ok","service":"RLKlein Job Portal API"}}`
- `…/exec?action=getJobs` → `{"ok":true,"data":[ …jobs… ]}`
- `…/exec?action=getJob&jobId=RLK-RN-CA-001` → one job (or `null` if you skipped step 8)

If you see a Google sign-in page or an HTML error instead of JSON, go back to step 9 and check
**Who has access: Anyone**.

## 13. Test an application submission

1. With `npm run dev` running, open `http://localhost:5173/hot-jobs` and click **Apply** on a job.
2. Fill in the form, attach a small PDF, and submit.
3. You should see the usual **Application Received** screen with a reference like `RLK-APP-123456`.
4. In the **Applications** tab, a new row appears with status `New` and the job title taken from
   the Jobs sheet.

## 14. Test the resume upload

1. Open Google Drive → **RLKlein Job Applications → Resumes**. There's a file named like
   `RLK-APP-123456_Lastname_Firstname.pdf`.
2. Right-click it → **Share**: General access is **Restricted**.
3. Try uploading a renamed `.exe` or `.jpg` as `resume.pdf`. The form shows
   *"does not appear to be a valid PDF document"*, because the server checks the file's
   contents, not just its name. Files over 10 MB are rejected.

## 15. Test admin login and job creation

1. Open `http://localhost:5173/admin/login` and sign in with `ADMIN_USERNAME` and the password
   from step 7.
2. A wrong password shows *"Invalid credentials…"*. After 5 wrong attempts the account is
   locked for 15 minutes.
3. Go to **Jobs → Add New Job**, fill in a title and overview, and click **Publish Job**.
4. The job appears as a new row in the **Jobs** tab with status `Active`.

## 16. Test that the job appears publicly

1. Open `http://localhost:5173/hot-jobs` (or reload it). The new job is listed.
2. In the admin Jobs list, click the pause icon (**Close job**). Reload `/hot-jobs`: the job is gone.
3. Open a closed job's direct link (`/jobs/<slug>`): it shows "Opportunity Not Found".
4. Also try: open an application in the admin panel, change its status, add a note, and click
   the download icon to download the resume.

**Timing:** changes made in the admin panel show on the website immediately (after a page
reload). Changes typed **directly into the Sheet** can take up to 5 minutes, because the server
caches the public job list.

---

## API reference

All responses are `{"ok":true,"data":…}` or `{"ok":false,"error":{"code":"…","message":"…"}}`.

| Action | Method | Who | Body / params |
| --- | --- | --- | --- |
| `getJobs` | GET | public | — (Active, unexpired, public jobs only) |
| `getJob` | GET | public | `jobId` or `slug` (Active only) |
| `createApplication` | POST | public | applicant fields + `resume: {name, type, data(base64)}` |
| `login` | POST | public | `username`, `password` → `token` |
| `logout` | POST | public | `token` |
| `getSession` | POST | admin | `token` |
| `getAdminJobs`, `getAdminJob` | POST | admin | `token`, (`jobId`) |
| `createJob`, `updateJob`, `deleteJob` | POST | admin | `token`, `job` / `jobId` + `updates` / `jobId` |
| `getApplications`, `getApplication` | POST | admin | `token`, (`applicationId`) |
| `updateApplicationStatus` | POST | admin | `token`, `applicationId`, `status` |
| `addApplicationNote` | POST | admin | `token`, `applicationId`, `note` |
| `getResume` | POST | admin | `token`, `applicationId` → base64 file |

POST requests use `Content-Type: text/plain` with a JSON body. Apps Script can't answer CORS
preflight requests; a text/plain POST is a CORS "simple request", so the browser doesn't send one.
Because of that, any website could *call* the API. That's fine: public actions only expose
public data, and admin actions require a valid session token checked on the server.

## Security summary

- **Passwords:** PBKDF2-HMAC-SHA256 with a random salt. 5 failed logins lock that username for 15 minutes.
- **Sessions:** a random 64-character token that expires after 6 hours. The server stores only
  a hash of it. Logging out, changing the password, or setting the admin to Inactive ends all sessions.
- **Every admin action** checks the token and that the admin is still Active in the Admins sheet.
  Nothing the browser says about who it is gets trusted.
- **Applications:** every field is validated on the server. The job title is looked up on the
  server, and applications to Draft, Closed or expired jobs are rejected.
- **Resumes:** the file extension, the declared type **and the actual file contents** (PDF /
  DOC / DOCX signatures) are all checked, with a 10 MB limit. Files are stored under a
  server-generated name, never shared, and only downloadable through the authenticated `getResume` action.
- **Spreadsheet formula injection** is blocked: text starting with `=`, `+`, `-` or `@` is stored as plain text.
- **Errors:** internal errors go to the Apps Script log (**Executions** in the left sidebar),
  never to the browser.

**Known limits (worth knowing):**
- Apps Script can't see visitors' IP addresses, so the public application form can't be
  rate-limited per visitor. If spam appears, the next step is a CAPTCHA.
- Sessions are kept in Apps Script's cache, which Google may occasionally clear early. When that
  happens, the admin just signs in again.
- Each API call takes roughly 1–3 seconds (normal for Apps Script). The website loads the job
  list once and filters it in the browser.
- Resumes contain personal data. Consider periodically deleting old applications and their
  resume files, according to your retention policy.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Website says "The job portal is not connected yet" | `VITE_API_URL` is missing. Create `.env.local` (step 11) and restart `npm run dev`. |
| "Unable to reach the server" | Check the URL ends in `/exec` and access is **Anyone** (step 9). Open `…/exec` in the browser to test. |
| Script changes don't show up | Publish a **new version** of the existing deployment (see the note in step 10). |
| `Script property "SPREADSHEET_ID" is missing` in the log | Run `setup()`. |
| "Too many failed sign-in attempts" | Wait 15 minutes. |
| Job edited in the Sheet isn't showing | Wait up to 5 minutes (server cache), and check `status` is `Active` and `expiration_date` is empty or in the future. |
| Error in the site, "Something went wrong on our side" | Apps Script editor → **Executions** shows the full error. |
