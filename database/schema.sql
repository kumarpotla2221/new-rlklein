-- ============================================================
-- R.L. KLEIN & ASSOCIATES — JOB PORTAL DATABASE SCHEMA
--
-- HOW TO USE
--   1. cPanel → MySQL Databases: create the database and a user (cPanel does this —
--      this file deliberately has no CREATE DATABASE / USE line).
--   2. phpMyAdmin → click your database on the left → Import → choose this file → Import.
--
-- Safe to import only into an EMPTY database. It creates 7 tables and no data.
-- The first admin account is created later by the backend setup script (Phase 3),
-- because passwords must be hashed by PHP.
--
-- COMPATIBILITY
--   MySQL 5.7+, MySQL 8.x, MariaDB 10.3+ (all common cPanel hosts).
--   * Collation utf8mb4_unicode_ci works on all of them (utf8mb4_0900_ai_ci is MySQL-8 only).
--   * Lists (responsibilities, benefits, …) are TEXT holding a JSON array, e.g. ["A","B"].
--     The native JSON type behaves differently on MariaDB, so it is avoided.
--   * Indexed text columns are at most 190 characters (older servers' index size limit).
--
-- VALUES
--   Status-type columns store lowercase values (active, draft, closed / new, reviewed, …).
--   The PHP API converts them to the format the website expects.
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';  -- all DATETIME values are stored in UTC

-- ------------------------------------------------------------
-- admins — people who can sign in to /admin
-- ------------------------------------------------------------
CREATE TABLE admins (
  id                  INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  email               VARCHAR(190)     NOT NULL COMMENT 'Used to sign in',
  name                VARCHAR(120)     NOT NULL,
  role                ENUM('admin','recruiter') NOT NULL DEFAULT 'admin',
  password_hash       VARCHAR(255)     NOT NULL COMMENT 'PHP password_hash(); never the plain password',
  is_active           TINYINT(1)       NOT NULL DEFAULT 1 COMMENT '0 = cannot sign in',
  failed_login_count  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until        DATETIME         NULL DEFAULT NULL COMMENT 'Set after too many wrong passwords',
  last_login_at       DATETIME         NULL DEFAULT NULL,
  created_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Admin panel accounts';

-- ------------------------------------------------------------
-- admin_sessions — one row per signed-in browser
-- ------------------------------------------------------------
CREATE TABLE admin_sessions (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  admin_id      INT UNSIGNED     NOT NULL,
  token_hash    CHAR(64)         NOT NULL COMMENT 'SHA-256 of the token; the token itself is never stored',
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at    DATETIME         NOT NULL,
  last_seen_at  DATETIME         NULL DEFAULT NULL,
  ip_address    VARCHAR(45)      NULL DEFAULT NULL COMMENT 'IPv4 or IPv6',
  user_agent    VARCHAR(255)     NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sessions_token (token_hash),
  KEY idx_sessions_admin (admin_id),
  KEY idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_admin FOREIGN KEY (admin_id) REFERENCES admins (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Active admin logins. Deleting an admin signs them out everywhere.';

-- ------------------------------------------------------------
-- jobs — job postings shown on /jobs and /hot-jobs
-- Columns match the Job type in frontend/src/types/index.ts
-- ------------------------------------------------------------
CREATE TABLE jobs (
  id                        VARCHAR(40)      NOT NULL COMMENT 'e.g. RLK-RN-CA-001 (custom or server-generated)',
  slug                      VARCHAR(190)     NOT NULL COMMENT 'Used in the URL: /jobs/<slug>',
  title                     VARCHAR(200)     NOT NULL,
  profession                VARCHAR(120)     NOT NULL,
  specialty                 VARCHAR(120)     NOT NULL DEFAULT '',

  -- Location & setting
  state                     VARCHAR(60)      NOT NULL,
  city                      VARCHAR(120)     NOT NULL DEFAULT '',
  country                   VARCHAR(60)      NOT NULL DEFAULT 'United States',
  facility                  VARCHAR(200)     NULL DEFAULT NULL,
  facility_type             VARCHAR(120)     NULL DEFAULT NULL,
  work_setting              VARCHAR(120)     NOT NULL,

  -- Schedule
  employment_type           ENUM('Full-Time','Part-Time','Per Diem','Contract','Temporary') NOT NULL DEFAULT 'Full-Time',
  shift                     ENUM('Day','Evening','Night','Rotating','Flexible') NOT NULL DEFAULT 'Day',
  shifts_per_week           TINYINT UNSIGNED NULL DEFAULT NULL,
  shift_pattern             VARCHAR(120)     NULL DEFAULT NULL,
  hours_per_week            DECIMAL(5,2)     NULL DEFAULT NULL,

  -- Assignment
  start_date                DATE             NULL DEFAULT NULL,
  end_date                  DATE             NULL DEFAULT NULL,
  assignment_duration       VARCHAR(120)     NULL DEFAULT NULL,
  assignment_term           VARCHAR(120)     NULL DEFAULT NULL,
  contract_type             VARCHAR(120)     NULL DEFAULT NULL,
  extension_available       TINYINT(1)       NOT NULL DEFAULT 0,

  -- Publishing
  status                    ENUM('active','draft','closed') NOT NULL DEFAULT 'draft'
                              COMMENT 'Only active jobs appear on the public site',
  featured                  TINYINT(1)       NOT NULL DEFAULT 0 COMMENT '1 = shown on Hot Jobs / homepage',
  visibility                ENUM('public','unlisted') NOT NULL DEFAULT 'public'
                              COMMENT 'unlisted = reachable by direct link only',
  posted_date               DATE             NOT NULL,
  expiration_date           DATE             NULL DEFAULT NULL COMMENT 'Hidden from the public after this date',

  -- Compensation
  compensation_type         ENUM('hourly','weekly','salary','negotiable') NULL DEFAULT NULL,
  compensation_min          DECIMAL(10,2)    NULL DEFAULT NULL,
  compensation_max          DECIMAL(10,2)    NULL DEFAULT NULL,
  pay_frequency             VARCHAR(60)      NULL DEFAULT NULL,
  show_compensation         TINYINT(1)       NOT NULL DEFAULT 0,
  additional_compensation   TEXT             NULL,

  -- Description (list columns hold JSON arrays of strings)
  overview                  TEXT             NOT NULL,
  responsibilities          TEXT             NULL COMMENT 'JSON array',
  qualifications            TEXT             NULL COMMENT 'JSON array',
  preferred_qualifications  TEXT             NULL COMMENT 'JSON array',
  required_credentials      TEXT             NULL COMMENT 'JSON array',
  benefits                  TEXT             NULL COMMENT 'JSON array',

  -- Staffing agency details shown on the job page
  agency_name               VARCHAR(200)     NULL DEFAULT NULL,
  agency_location           VARCHAR(200)     NULL DEFAULT NULL,
  agency_experience         TEXT             NULL,
  agency_support            TEXT             NULL,
  agency_certifications     TEXT             NULL,
  job_board_disclaimer      TEXT             NULL,

  -- Bookkeeping
  created_by                INT UNSIGNED     NULL DEFAULT NULL,
  created_at                DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_jobs_slug (slug),
  KEY idx_jobs_public (status, visibility, expiration_date) COMMENT 'Speeds up the public job list',
  KEY idx_jobs_featured (featured, status),
  KEY idx_jobs_state (state),
  KEY idx_jobs_profession (profession),
  KEY idx_jobs_posted (posted_date),
  KEY idx_jobs_created_by (created_by),
  CONSTRAINT fk_jobs_created_by FOREIGN KEY (created_by) REFERENCES admins (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Job postings';

-- ------------------------------------------------------------
-- applications — submitted from /apply and /apply/<job>
-- Columns match the Application type in frontend/src/types/index.ts
-- ------------------------------------------------------------
CREATE TABLE applications (
  id                    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  reference_number      VARCHAR(20)      NOT NULL COMMENT 'Shown to the applicant, e.g. RLK-APP-123456',
  job_id                VARCHAR(40)      NULL DEFAULT NULL
                          COMMENT 'NULL = general application (not for a specific job), or the job was deleted',
  job_title             VARCHAR(200)     NOT NULL COMMENT 'Copied at submission so it survives job edits/deletes',

  -- Personal
  first_name            VARCHAR(80)      NOT NULL,
  last_name             VARCHAR(80)      NOT NULL,
  email                 VARCHAR(190)     NOT NULL,
  phone                 VARCHAR(40)      NOT NULL,
  city                  VARCHAR(120)     NULL DEFAULT NULL,
  state                 VARCHAR(60)      NULL DEFAULT NULL,

  -- Professional
  profession            VARCHAR(120)     NOT NULL,
  years_experience      TINYINT UNSIGNED NULL DEFAULT NULL,
  license_number        VARCHAR(60)      NULL DEFAULT NULL,
  license_state         VARCHAR(60)      NULL DEFAULT NULL,
  specialty             VARCHAR(120)     NULL DEFAULT NULL,

  -- Preferences
  assignment_type       VARCHAR(60)      NULL DEFAULT NULL,
  preferred_location    VARCHAR(200)     NULL DEFAULT NULL,
  preferred_shift       VARCHAR(40)      NULL DEFAULT NULL,
  available_start_date  DATE             NULL DEFAULT NULL,
  message               TEXT             NULL,

  -- Resume (the file itself lives in rlk_app/storage/resumes/, never in the database)
  resume_original_name  VARCHAR(255)     NULL DEFAULT NULL COMMENT 'Name the applicant uploaded',
  resume_stored_name    VARCHAR(120)     NULL DEFAULT NULL COMMENT 'Server-generated file name on disk',
  resume_mime           VARCHAR(120)     NULL DEFAULT NULL,
  resume_size           INT UNSIGNED     NULL DEFAULT NULL COMMENT 'Bytes',

  -- Review
  status                ENUM('new','reviewed','shortlisted','interview','hired','rejected') NOT NULL DEFAULT 'new',
  admin_notes           TEXT             NULL,

  -- Record keeping
  consent_given_at      DATETIME         NULL DEFAULT NULL COMMENT 'When the applicant accepted the consent terms',
  ip_address            VARCHAR(45)      NULL DEFAULT NULL,
  user_agent            VARCHAR(255)     NULL DEFAULT NULL,
  applied_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_applications_reference (reference_number),
  UNIQUE KEY uq_applications_resume (resume_stored_name),
  KEY idx_applications_job (job_id),
  KEY idx_applications_status (status, applied_at),
  KEY idx_applications_applied (applied_at),
  KEY idx_applications_email (email),
  CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Job applications. Deleting a job keeps its applications (job_id becomes NULL).';

-- ------------------------------------------------------------
-- contact_submissions — the "Talk to a Recruiter" form on /contact
-- ------------------------------------------------------------
CREATE TABLE contact_submissions (
  id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  first_name      VARCHAR(80)      NOT NULL,
  last_name       VARCHAR(80)      NOT NULL,
  email           VARCHAR(190)     NOT NULL,
  phone           VARCHAR(40)      NOT NULL,
  profession      VARCHAR(120)     NULL DEFAULT NULL,
  specialty       VARCHAR(120)     NULL DEFAULT NULL,
  experience      VARCHAR(40)      NULL DEFAULT NULL COMMENT 'e.g. 04-06 Years',
  start_time      VARCHAR(40)      NULL DEFAULT NULL COMMENT 'e.g. Immediately, 3 months',
  email_consent   TINYINT(1)       NOT NULL DEFAULT 0,
  sms_consent     TINYINT(1)       NOT NULL DEFAULT 0,
  message         TEXT             NULL,
  status          ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  ip_address      VARCHAR(45)      NULL DEFAULT NULL,
  user_agent      VARCHAR(255)     NULL DEFAULT NULL,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_status (status, created_at),
  KEY idx_contact_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Messages from healthcare professionals via the Contact page';

-- ------------------------------------------------------------
-- staffing_requests — the facility form on /facilities/staffing-request
-- ------------------------------------------------------------
CREATE TABLE staffing_requests (
  id                   BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  first_name           VARCHAR(80)       NOT NULL,
  last_name            VARCHAR(80)       NOT NULL,
  title                VARCHAR(120)      NOT NULL COMMENT 'Requester job title',
  email                VARCHAR(190)      NOT NULL,
  phone                VARCHAR(40)       NOT NULL,
  organization         VARCHAR(200)      NOT NULL,
  city                 VARCHAR(120)      NULL DEFAULT NULL,
  state                VARCHAR(60)       NULL DEFAULT NULL,
  facility_type        VARCHAR(120)      NULL DEFAULT NULL,
  profession_needed    VARCHAR(120)      NOT NULL,
  number_needed        SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  assignment_type      VARCHAR(60)       NULL DEFAULT NULL,
  shift                VARCHAR(40)       NULL DEFAULT NULL,
  start_date           DATE              NULL DEFAULT NULL,
  details              TEXT              NULL,
  has_existing_agency  TINYINT(1)        NOT NULL DEFAULT 0,
  improvement_goals    TEXT              NULL,
  status               ENUM('new','in_progress','closed') NOT NULL DEFAULT 'new',
  ip_address           VARCHAR(45)       NULL DEFAULT NULL,
  user_agent           VARCHAR(255)      NULL DEFAULT NULL,
  created_at           DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_staffing_status (status, created_at),
  KEY idx_staffing_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Staffing requests from healthcare facilities';

-- ------------------------------------------------------------
-- rate_limits — recent attempts, used to block spam and password guessing
-- Old rows are deleted automatically by the backend.
-- ------------------------------------------------------------
CREATE TABLE rate_limits (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  action        VARCHAR(40)      NOT NULL COMMENT 'e.g. login, createApplication, submitContact',
  identifier    VARCHAR(190)     NOT NULL COMMENT 'IP address, or email for login attempts',
  attempted_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_rate_lookup (action, identifier, attempted_at),
  KEY idx_rate_cleanup (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Short-lived request log for rate limiting';
