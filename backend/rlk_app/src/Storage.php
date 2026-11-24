<?php
declare(strict_types=1);

namespace RLK;

/** Private folders inside rlk_app (logs, resumes). */
final class Storage
{
    public static function resumeDir(): string
    {
        return self::privateDir(APP_DIR . '/storage/resumes');
    }

    public static function logDir(): string
    {
        return self::privateDir(APP_DIR . '/logs');
    }

    /** Creates the folder if needed and adds a deny-all .htaccess as a second line of defence. */
    private static function privateDir(string $dir): string
    {
        if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
            throw new \RuntimeException("Cannot create folder: $dir");
        }
        $htaccess = $dir . '/.htaccess';
        if (!is_file($htaccess)) {
            file_put_contents($htaccess, "Require all denied\n");
        }
        return $dir;
    }
}
