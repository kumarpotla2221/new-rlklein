<?php
/**
 * SETTINGS TEMPLATE
 *
 * On the server: copy this file to config.php (same folder) and fill in the values.
 * config.php holds the database password. It is never committed to Git and must
 * stay in rlk_app/ (outside public_html).
 */
return [

    // cPanel → MySQL® Databases. Names include your cPanel prefix.
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'w07ts0ymeqc17532_rlk_portal',
        'user' => 'w07ts0ymeqc17532_rlk_api',
        'pass' => 'PASTE-THE-DATABASE-PASSWORD-HERE',
    ],

    'app' => [
        // Public address of the website (no trailing slash). Used in email links.
        'url' => 'https://new.rlklein.com',
    ],

    // Websites allowed to call the API from a browser on a DIFFERENT address.
    // Production needs none (website and API share new.rlklein.com).
    // For local development add: 'http://localhost:5173'
    'cors_origins' => [],

    // Admin sign-in
    'session_hours' => 6,
    'login' => [
        'max_failures' => 5,   // wrong passwords in a row …
        'lock_minutes' => 15,  // … lock the account for this long
    ],

    // [max requests, per seconds] per visitor IP
    'rate_limits' => [
        'login'                 => [20, 900],
        'createApplication'     => [5, 3600],
        'submitContact'         => [5, 3600],
        'submitStaffingRequest' => [5, 3600],
        'setup'                 => [10, 3600],
    ],

    'uploads' => [
        'resume_max_bytes' => 10 * 1024 * 1024, // keep in sync with the "Max 10 MB" text on the apply form
    ],

    // Email alerts for new applications, contact messages and staffing requests.
    'mail' => [
        'enabled'   => true,
        // Use an address on your own domain, otherwise alerts may land in spam.
        'from'      => 'no-reply@rlklein.com',
        'from_name' => 'R.L. Klein Website',
        'to'        => ['info@rlklein.com', 'operations@rlklein.com', 'jim@rlklein.com'],
    ],

    // One-time key for creating the FIRST admin at /api/setup.php.
    // Set a long random value (at least 16 characters), create the admin, then set it back to ''.
    'setup_key' => '',
];
