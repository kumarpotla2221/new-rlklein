# Deploy: automatic updates from GitHub to new.rlklein.com

```
Edit in VS Code → Commit → Push ("Sync Changes")
        ↓
GitHub Actions (.github/workflows/deploy.yml)
  1. Checks: type check, lint, build, PHP syntax, 78 backend tests on MariaDB 10.11 + PHP 8.4
  2. Only if ALL pass → uploads to Turbify over encrypted FTP (FTPS)
        ↓
https://new.rlklein.com is updated (about 3–5 minutes after pushing)
```

If any check fails, **nothing is uploaded** and the site stays as it was. You'll see a red ✗ on
the commit in GitHub, and GitHub emails you.

## What goes where on Turbify

```
/home/w07ts0ymeqc17532/
├── public_html/                     WordPress (rlklein.com). NEVER touched by deployments
│   └── new.rlklein.com/             ← website + api/ + .htaccess + robots.txt   (FTP account 1)
└── rlk_app/                         ← backend code                              (FTP account 2)
    ├── config.php                   created ONCE by you on the server; never uploaded or overwritten
    ├── storage/resumes/             uploaded resumes; never touched by deployments
    └── logs/                        never touched by deployments
```

Each FTP account can only see its own folder, so a deployment **can't reach WordPress**.

---

## One-time setup (about 30 minutes)

### Step 1: Make the GitHub repository private (recommended)
GitHub → `new-rlklein` → **Settings** → scroll to **Danger Zone** → **Change visibility** → **Private**.
The code contains no passwords, but it's a client's business system.

### Step 2: Freeze the old Vercel site
Vercel builds automatically from `main`. Once the new folder layout is pushed, its builds would fail.
1. vercel.com → project **new-rlklein** → **Settings** → **Git** → **Disconnect**.
2. The current site at `new-rlklein.vercel.app` **stays online exactly as it is**. It just stops rebuilding.
   It's switched off after the move to rlklein.com.

### Step 3: Create two FTP accounts in cPanel
cPanel → **Files** → **FTP Accounts** → **Add FTP Account**:

| | Account 1 (website) | Account 2 (backend) |
| --- | --- | --- |
| Log In | `deploysite` | `deployapp` |
| Password | **Password Generator** → copy it somewhere safe | **Password Generator** → copy it |
| Directory | `public_html/new.rlklein.com` | `rlk_app` |
| Quota | Unlimited | Unlimited |

⚠️ Check the **Directory** field carefully before clicking **Create FTP Account**. cPanel fills it
in automatically from the login name. It must be exactly as above, and must **not** be `public_html`.

The full login names become `deploysite@rlklein.com` and `deployapp@rlklein.com`.

### Step 4: Add the logins to GitHub (encrypted; nobody can read them back)
GitHub → `new-rlklein` → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
Add these five, one at a time:

| Name | Value |
| --- | --- |
| `FTP_SERVER` | `cpanel199.turbify.biz` (not ftp.rlklein.com, which points to the wrong server) |
| `FTP_SITE_USERNAME` | `deploysite@rlklein.com` |
| `FTP_SITE_PASSWORD` | password of account 1 |
| `FTP_APP_USERNAME` | `deployapp@rlklein.com` |
| `FTP_APP_PASSWORD` | password of account 2 |

### Step 5: First deployment
The new code is merged into `main` and pushed. GitHub → **Actions** tab → watch **Test and deploy**.
Both jobs should turn green ✓ (about 3–5 minutes).

### Step 6: Create config.php on the server (only once)
1. cPanel → **File Manager** → open `rlk_app`.
2. Right-click `config.example.php` → **Copy** → name it `config.php`.
3. Right-click `config.php` → **Edit**, and change:
   - `'pass' => '…'`: the **database password** of `w07ts0ymeqc17532_rlk_api` (from Phase 2)
   - `'setup_key' => ''`: put a long random temporary value, e.g. `'setup-7Kq2-Lm9x-Pz41-Wd8e'`
4. **Save**. Right-click `config.php` → **Change Permissions** → `600`.

### Step 7: Check it works
Open **https://new.rlklein.com/api/index.php?action=health**. You should see:
```
{"ok":true,"data":{"status":"ok","database":"ok","storage":"ok","adminAccounts":"none yet: create one with setup.php"}}
```
| If you see | Fix |
| --- | --- |
| `"database":"error"` | Wrong password/name in `config.php` |
| `"The job portal is not connected yet"` | `config.php` missing, or `rlk_app` not uploaded (check Step 5) |
| `"storage":"not writable"` | File Manager → `rlk_app` → Permissions `755` |

### Step 8: Create your admin account
1. Open **https://new.rlklein.com/api/setup.php**, enter the setup key, your name, email and a
   password (12+ characters), then **Create admin account**.
2. In `config.php`, set `'setup_key' => ''` again and save. The setup page is now permanently locked
   (it also locks itself once an admin exists).
3. Sign in at **https://new.rlklein.com/admin/login**.

### Step 9: Test
- Post a job → it appears on **/jobs**.
- Apply to it with a PDF → check it in **Admin → Applications**, download the resume.
- Send the **Contact** and **Staffing Request** forms.
- Confirm the **email alerts** reach info@, operations@ and jim@rlklein.com (check spam too).

---

## Everyday use

1. Change files in VS Code.
2. **Source Control** panel → type a message → **Commit**.
3. Click **Sync Changes** (this pushes to GitHub). *Committing alone doesn't publish. Pushing does.*
4. Optional: GitHub → **Actions** to watch it deploy.

Tip: to push automatically after every commit, in VS Code open **Settings**, search
`git.postCommitCommand`, and choose **sync**.

**Not deployed automatically (on purpose):** `rlk_app/config.php`, resumes and logs. Database changes
(new tables or columns) are done once by hand in phpMyAdmin with a migration file.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Red ✗ at **Check website + backend** | A check failed. Open it in the Actions tab to see which line. Nothing was uploaded. |
| Red ✗ at **Upload to new.rlklein.com** with a login error | Re-check the 5 secrets (Step 4) and the FTP account directories (Step 3). |
| Upload error mentioning TLS/SSL | In `deploy.yml`, change `protocol: ftps` to `protocol: ftp` for both uploads. This is less secure; ask Turbify about FTPS first. |
| Site shows an old version | Hard-refresh the browser (Ctrl+F5). |
| Need to re-deploy without a change | GitHub → **Actions** → **Test and deploy** → **Run workflow**. |

## Later: moving to rlklein.com (after the client approves)

See the launch plan in [docs/SYSTEM_DESIGN.md](../docs/SYSTEM_DESIGN.md). In short: back up WordPress, move it
aside, deploy the same build to `public_html` with a main-domain `.htaccess` (no "hide from
Google" rule), set `app.url` to `https://rlklein.com`, redirect `new.rlklein.com` and old WordPress
links, then switch off Vercel and Google Apps Script.
