<?php
declare(strict_types=1);

namespace RLK\Controllers;

use RLK\Database;
use RLK\Logger;
use RLK\Request;
use RLK\Storage;

final class SystemController
{
    /** No action: a simple "the API is up" answer. */
    public static function status(Request $request): array
    {
        return ['status' => 'ok', 'service' => 'RLKlein Job Portal API'];
    }

    /** GET ?action=health: checks the database and file storage (no secrets in the answer). */
    public static function health(Request $request): array
    {
        $database = 'ok';
        try {
            $tables = (int) Database::value(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE()
                   AND table_name IN ('admins','admin_sessions','jobs','applications','contact_submissions','staffing_requests','rate_limits')"
            );
            if ($tables !== 7) {
                $database = "missing tables ($tables of 7 found), import database/schema.sql";
            }
        } catch (\Throwable $e) {
            Logger::exception($e, 'Health check: database');
            $database = 'error';
        }

        $storage = 'ok';
        try {
            $probe = Storage::resumeDir() . '/.write-test';
            if (file_put_contents($probe, 'ok') === false) {
                $storage = 'not writable';
            }
            @unlink($probe);
        } catch (\Throwable $e) {
            Logger::exception($e, 'Health check: storage');
            $storage = 'not writable';
        }

        $admins = 0;
        if ($database === 'ok') {
            $admins = (int) Database::value('SELECT COUNT(*) FROM admins WHERE is_active = 1');
        }

        return [
            'status' => $database === 'ok' && $storage === 'ok' ? 'ok' : 'problem',
            'database' => $database,
            'storage' => $storage,
            'adminAccounts' => $admins > 0 ? 'ok' : 'none yet: create one with setup.php',
        ];
    }
}
