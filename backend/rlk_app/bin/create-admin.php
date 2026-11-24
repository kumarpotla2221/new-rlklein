<?php
/**
 * Adds an admin or recruiter account from the command line.
 *
 *   php rlk_app/bin/create-admin.php --email=jim@rlklein.com --name="Jim" [--role=admin|recruiter]
 *
 * You are asked for the password (it is not shown on screen and never saved in plain text).
 * For automated tests only: --password=… (avoid on shared machines; it ends up in shell history).
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require dirname(__DIR__) . '/bootstrap.php';

$options = getopt('', ['email:', 'name:', 'role::', 'password::']);
$email = (string) ($options['email'] ?? '');
$name = (string) ($options['name'] ?? '');
$role = (string) ($options['role'] ?? 'admin');

if ($email === '' || $name === '') {
    fwrite(STDERR, "Usage: php create-admin.php --email=you@example.com --name=\"Your Name\" [--role=admin|recruiter]\n");
    exit(1);
}

$password = isset($options['password']) ? (string) $options['password'] : readPassword('Password (min 12 characters): ');
if (!isset($options['password']) && $password !== readPassword('Repeat password: ')) {
    fwrite(STDERR, "The passwords do not match.\n");
    exit(1);
}

try {
    $id = RLK\Auth::createAdmin($email, $name, $password, $role);
    echo "Created $role account #$id for $email\n";
} catch (RLK\ApiException $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}

function readPassword(string $prompt): string
{
    echo $prompt;
    $hide = DIRECTORY_SEPARATOR === '/' && stream_isatty(STDIN);
    if ($hide) {
        shell_exec('stty -echo');
    }
    $value = rtrim((string) fgets(STDIN), "\r\n");
    if ($hide) {
        shell_exec('stty echo');
        echo "\n";
    }
    return $value;
}
