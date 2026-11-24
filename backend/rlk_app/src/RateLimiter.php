<?php
declare(strict_types=1);

namespace RLK;

/** Limits how often one visitor (IP) can call an action, using the rate_limits table. */
final class RateLimiter
{
    public static function hit(string $action, string $identifier): void
    {
        $limit = Config::get("rate_limits.$action");
        if (!is_array($limit) || count($limit) !== 2) {
            return;
        }
        [$max, $windowSeconds] = [(int) $limit[0], (int) $limit[1]];

        $recent = (int) Database::value(
            'SELECT COUNT(*) FROM rate_limits WHERE action = ? AND identifier = ? AND attempted_at > ?',
            [$action, $identifier, Database::now(-$windowSeconds)]
        );
        if ($recent >= $max) {
            Logger::info('Rate limit reached', ['action' => $action, 'ip' => $identifier]);
            throw new ApiException('RATE_LIMITED', 'Too many requests. Please wait a few minutes and try again.');
        }

        Database::insert('rate_limits', ['action' => $action, 'identifier' => $identifier, 'attempted_at' => Database::now()]);

        // Occasionally remove old rows so the table stays small.
        if (random_int(1, 50) === 1) {
            Database::run('DELETE FROM rate_limits WHERE attempted_at < ?', [Database::now(-86400)]);
        }
    }
}
