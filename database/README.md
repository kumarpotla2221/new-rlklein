# Database — MySQL

One file, [`schema.sql`](schema.sql), creates every table the website needs. It starts **empty**:
no jobs, no applications, no data copied from Google Sheets.

Works on MySQL 5.7+, MySQL 8 and MariaDB 10.3+, which covers GoDaddy, Turbify and other cPanel hosts.
Tested on MariaDB 10.4.

## Tables

```
admins ──────────< admin_sessions        an admin can be signed in on several devices
   │
   └──(created_by)──< jobs ──────────< applications     one job has many applications
                                                         (job_id empty = general application)

contact_submissions    "Talk to a Recruiter" form   (/contact)
staffing_requests      Facility staffing form       (/facilities/staffing-request)
rate_limits            Spam / password-guessing protection (cleaned up automatically)
```

| Table | Holds | Filled by |
| --- | --- | --- |
| `admins` | Admin panel accounts (email, name, role, password **hash**) | Setup script (Phase 3) |
| `admin_sessions` | Who is signed in, until when | Admin login |
| `jobs` | Job postings: all fields of the admin Job Editor | Admin → Jobs |
| `applications` | Applications + resume file info (the file itself is stored on disk, not in the DB) | Apply form |
| `contact_submissions` | Contact page messages | Contact form |
| `staffing_requests` | Facility staffing requests | Staffing Request form |
| `rate_limits` | Recent attempts per IP / email | Backend, automatically |

### Built-in safety rules
- Two jobs can't have the same URL (`slug`), and two applications can't share a reference number.
- **Deleting a job keeps its applications.** They keep the job title they applied for.
- Deleting an admin signs them out everywhere.
- Status columns accept only valid values (for example `active` / `draft` / `closed`).
- Supports every language and emoji (`utf8mb4`).

## Create the database on cPanel (about 5 minutes)

### 1. Create the database
1. Log in to cPanel → **Databases** → **MySQL® Databases**.
2. Under **Create New Database**, type `rlk_portal` → **Create Database**.
   cPanel adds your account name in front, e.g. `cpuser_rlk_portal`. **Write down the full name.**

### 2. Create a database user
1. Same page, **MySQL Users → Add New User**: username `rlk_api`.
2. Click **Password Generator**, copy the password somewhere safe, then **Create User**.
   The full username will also have the prefix, e.g. `cpuser_rlk_api`.

### 3. Give the user access
1. Same page, **Add User To Database**: choose `cpuser_rlk_api` and `cpuser_rlk_portal` → **Add**.
2. Tick **ALL PRIVILEGES** → **Make Changes**.

### 4. Import the tables
1. cPanel → **Databases** → **phpMyAdmin**.
2. In the left list, click **`cpuser_rlk_portal`**. Don't skip this: the import needs a database selected.
3. Top tabs → **Import** → **Choose File** → select `database/schema.sql` → scroll down → **Import**.
4. You should see a green success message and 7 tables in the left list.

### 5. Keep these 4 values for Phase 3
| Value | Example |
| --- | --- |
| Database host | `localhost` (almost always on cPanel) |
| Database name | `cpuser_rlk_portal` |
| Database user | `cpuser_rlk_api` |
| Database password | *(the generated one)* |

They go into `rlk_app/config.php` on the server only. **Never** put them in the website code or Git.

## Troubleshooting

| Message | Fix |
| --- | --- |
| `#1046 - No database selected` | Click the database name in phpMyAdmin's left list first, then Import. |
| `#1050 - Table 'admins' already exists` | The tables are already there. To start over: select all tables → **Drop**, then import again. ⚠️ This deletes all data. |
| `#1044 - Access denied` | Repeat step 3 and tick **ALL PRIVILEGES**. |
| Import file too large / timeout | Not expected (the file is ~15 KB). Try again, or use another browser. |

## Changing the database later

Don't edit tables by hand on the live site. Future changes will be added as numbered files
(e.g. `migrations/001_add_column.sql`) that you import once, in order, the same way.

## Local testing with XAMPP (optional)

XAMPP includes MariaDB and phpMyAdmin. Start **MySQL** in the XAMPP Control Panel, open
<http://localhost/phpmyadmin>, create a database `rlk_portal` with collation `utf8mb4_unicode_ci`,
and import `schema.sql` the same way.
