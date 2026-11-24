<?php
/**
 * Finds the private rlk_app folder by looking in the parent folders.
 * Server:  /home/<user>/public_html/new.rlklein.com/api → /home/<user>/rlk_app
 * Local:   backend/public_html/api                     → backend/rlk_app
 * Not reachable from the web (.htaccess allows only index.php and setup.php).
 */
declare(strict_types=1);

function rlk_locate_app(): ?string
{
    $fromEnv = getenv('RLK_APP_DIR');
    if (is_string($fromEnv) && $fromEnv !== '' && is_file($fromEnv . '/bootstrap.php')) {
        return $fromEnv;
    }
    $dir = __DIR__;
    for ($i = 0; $i < 6; $i++) {
        $dir = dirname($dir);
        if (is_file($dir . '/rlk_app/bootstrap.php')) {
            return $dir . '/rlk_app';
        }
    }
    return null;
}
