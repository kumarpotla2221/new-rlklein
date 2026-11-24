<?php
declare(strict_types=1);

namespace RLK;

/**
 * Admin sign-in and sessions.
 * - Passwords: password_hash() / password_verify(); the plain password is never stored.
 * - Sessions: a random 64-character token given to the browser; the database keeps only its SHA-256 hash.
 * - Too many wrong passwords lock the account for a while.
 */
final class Auth
{
    public const MIN_PASSWORD_LENGTH = 12;
    private const INVALID_CREDENTIALS = 'Invalid credentials. Please check your email and password.';

    /** @return array{token: string, expiresAt: int, admin: array<string, mixed>} */
    public static function login(Request $request): array
    {
        RateLimiter::hit('login', $request->ip);

        $input = $request->input();
        $email = mb_strtolower((string) $input->string('username', 'Email', 190, true));
        $password = $input->raw('password');
        if (!is_string($password) || $password === '' || strlen($password) > 1000) {
            throw ApiException::validation('Please enter both administrative email and password.');
        }

        $admin = Database::one('SELECT * FROM admins WHERE email = ?', [$email]);

        if ($admin !== null && $admin['locked_until'] !== null && $admin['locked_until'] > Database::now()) {
            $minutes = max(1, (int) Config::get('login.lock_minutes', 15));
            throw new ApiException('ACCOUNT_LOCKED', "Too many failed sign-in attempts. Please wait $minutes minutes and try again.");
        }

        // Always run password_verify so unknown emails take as long as known ones.
        // (Hash of a random throwaway value; nothing can sign in with it.)
        $hash = $admin['password_hash'] ?? '$2y$10$GL.YEQFV0Vv3qtbBaX0Rq.GWt8cxpO4TjSE9PDXY0leSv1kXhsMwq';
        $valid = password_verify($password, $hash);

        if ($admin === null || !$valid || (int) $admin['is_active'] !== 1) {
            if ($admin !== null) {
                self::recordFailure($admin);
            }
            Logger::info('Failed admin sign-in', ['ip' => $request->ip]);
            throw new ApiException('INVALID_CREDENTIALS', self::INVALID_CREDENTIALS);
        }

        $changes = ['failed_login_count' => 0, 'locked_until' => null, 'last_login_at' => Database::now()];
        if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
            $changes['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
        }
        Database::update('admins', $changes, 'id = ?', [$admin['id']]);

        // Clean up expired sessions while we're here.
        Database::run('DELETE FROM admin_sessions WHERE expires_at < ?', [Database::now()]);

        $token = bin2hex(random_bytes(32));
        $lifetime = max(1, (int) Config::get('session_hours', 6)) * 3600;
        Database::insert('admin_sessions', [
            'admin_id' => $admin['id'],
            'token_hash' => hash('sha256', $token),
            'created_at' => Database::now(),
            'expires_at' => Database::now($lifetime),
            'last_seen_at' => Database::now(),
            'ip_address' => $request->ip,
            'user_agent' => $request->userAgent,
        ]);

        return [
            'token' => $token,
            'expiresAt' => (time() + $lifetime) * 1000, // milliseconds, as the website expects
            'admin' => self::publicAdmin($admin),
        ];
    }

    /**
     * Checks the token sent with an admin request. Throws UNAUTHORIZED, which makes the website sign out.
     * @return array{id: string, email: string, name: string, role: string}
     */
    public static function requireAdmin(mixed $token): array
    {
        if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/', $token)) {
            throw self::unauthorized();
        }
        $row = Database::one(
            'SELECT a.id, a.email, a.name, a.role, s.id AS session_id, s.last_seen_at
               FROM admin_sessions s
               JOIN admins a ON a.id = s.admin_id
              WHERE s.token_hash = ? AND s.expires_at > ? AND a.is_active = 1',
            [hash('sha256', $token), Database::now()]
        );
        if ($row === null) {
            throw self::unauthorized();
        }
        if ($row['last_seen_at'] === null || $row['last_seen_at'] < Database::now(-300)) {
            Database::update('admin_sessions', ['last_seen_at' => Database::now()], 'id = ?', [$row['session_id']]);
        }
        return self::publicAdmin($row);
    }

    public static function logout(mixed $token): void
    {
        if (is_string($token) && preg_match('/^[a-f0-9]{64}$/', $token)) {
            Database::run('DELETE FROM admin_sessions WHERE token_hash = ?', [hash('sha256', $token)]);
        }
    }

    /** Creates an admin account (used by setup.php and bin/create-admin.php). Returns the new id. */
    public static function createAdmin(string $email, string $name, string $password, string $role = 'admin'): string
    {
        $input = new Validator(['email' => $email, 'name' => $name]);
        $email = mb_strtolower((string) $input->email('email', 'email address', true));
        $name = (string) $input->string('name', 'Name', 120, true);
        self::checkPasswordStrength($password);
        if (!in_array($role, ['admin', 'recruiter'], true)) {
            throw ApiException::validation('Role must be admin or recruiter.');
        }
        try {
            return Database::insert('admins', [
                'email' => $email,
                'name' => $name,
                'role' => $role,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ]);
        } catch (\PDOException $e) {
            if (Database::isDuplicateKey($e)) {
                throw ApiException::validation('An admin with this email address already exists.');
            }
            throw $e;
        }
    }

    public static function checkPasswordStrength(string $password): void
    {
        if (mb_strlen($password) < self::MIN_PASSWORD_LENGTH) {
            throw ApiException::validation('The password must be at least ' . self::MIN_PASSWORD_LENGTH . ' characters long.');
        }
        if (strlen($password) > 1000) {
            throw ApiException::validation('The password is too long.');
        }
    }

    /** @param array<string, mixed> $admin */
    private static function recordFailure(array $admin): void
    {
        $failures = (int) $admin['failed_login_count'] + 1;
        $maxFailures = max(1, (int) Config::get('login.max_failures', 5));
        if ($failures >= $maxFailures) {
            $lockSeconds = max(1, (int) Config::get('login.lock_minutes', 15)) * 60;
            Database::update('admins', ['failed_login_count' => 0, 'locked_until' => Database::now($lockSeconds)], 'id = ?', [$admin['id']]);
            Logger::info('Admin account locked after failed sign-ins', ['admin_id' => $admin['id']]);
        } else {
            Database::update('admins', ['failed_login_count' => $failures], 'id = ?', [$admin['id']]);
        }
    }

    /**
     * @param array<string, mixed> $admin
     * @return array{id: string, email: string, name: string, role: string}
     */
    private static function publicAdmin(array $admin): array
    {
        return [
            'id' => (string) $admin['id'],
            'email' => (string) $admin['email'],
            'name' => (string) $admin['name'],
            'role' => (string) $admin['role'],
        ];
    }

    private static function unauthorized(): ApiException
    {
        return new ApiException('UNAUTHORIZED', 'Your session has expired. Please sign in again.');
    }
}
