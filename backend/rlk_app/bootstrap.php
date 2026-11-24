<?php
/**
 * Loads the backend: class autoloading, settings and error handling.
 * Included by public_html/api/index.php and the scripts in bin/.
 */
declare(strict_types=1);

namespace RLK;

const APP_DIR = __DIR__;

// This folder holds the database password and resumes. Refuse to run if it was
// uploaded somewhere the web can reach (anything inside public_html).
if (preg_match('~[/\\\\]public_html[/\\\\]~i', __DIR__ . DIRECTORY_SEPARATOR)) {
    http_response_code(500);
    error_log('RLK: rlk_app must not be inside public_html. Move it next to public_html.');
    exit('Server configuration error.');
}

spl_autoload_register(static function (string $class): void {
    if (strncmp($class, 'RLK\\', 4) !== 0) {
        return;
    }
    $file = __DIR__ . '/src/' . str_replace('\\', '/', substr($class, 4)) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

date_default_timezone_set('UTC');
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Turn PHP warnings into exceptions so they are caught, logged and answered with clean JSON.
set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new \ErrorException($message, 0, $severity, $file, $line);
});

Config::load(__DIR__ . '/config.php');
