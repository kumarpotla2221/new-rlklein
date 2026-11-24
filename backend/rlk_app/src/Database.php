<?php
declare(strict_types=1);

namespace RLK;

use PDO;
use PDOStatement;

/** MySQL/MariaDB access. Every query uses prepared statements. */
final class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            (string) Config::get('db.host', 'localhost'),
            (int) Config::get('db.port', 3306),
            (string) Config::get('db.name', '')
        );
        try {
            $pdo = new PDO($dsn, (string) Config::get('db.user', ''), (string) Config::get('db.pass', ''), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_STRINGIFY_FETCHES => false,
            ]);
            // Strict mode rejects invalid values instead of silently storing them; all times are UTC.
            $pdo->exec("SET time_zone = '+00:00', sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
        } catch (\PDOException $e) {
            Logger::exception($e, 'Database connection failed');
            throw new ApiException('SERVICE_UNAVAILABLE', 'The job portal is temporarily unavailable. Please try again shortly.');
        }
        return self::$pdo = $pdo;
    }

    /** @param array<int|string, mixed> $params */
    public static function run(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return array<string, mixed>|null
     */
    public static function one(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return list<array<string, mixed>>
     */
    public static function all(string $sql, array $params = []): array
    {
        return self::run($sql, $params)->fetchAll();
    }

    /** @param array<int|string, mixed> $params */
    public static function value(string $sql, array $params = []): mixed
    {
        $value = self::run($sql, $params)->fetchColumn();
        return $value === false ? null : $value;
    }

    /** @param array<string, mixed> $columns */
    public static function insert(string $table, array $columns): string
    {
        $names = array_keys($columns);
        $sql = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $table,
            implode(', ', $names),
            implode(', ', array_fill(0, count($names), '?'))
        );
        self::run($sql, array_values($columns));
        return self::pdo()->lastInsertId();
    }

    /**
     * @param array<string, mixed> $columns
     * @param array<int, mixed> $whereParams
     */
    public static function update(string $table, array $columns, string $where, array $whereParams): int
    {
        if (!$columns) {
            return 0;
        }
        $set = implode(', ', array_map(static fn (string $c): string => "$c = ?", array_keys($columns)));
        return self::run("UPDATE $table SET $set WHERE $where", [...array_values($columns), ...$whereParams])->rowCount();
    }

    public static function isDuplicateKey(\PDOException $e): bool
    {
        return ($e->errorInfo[1] ?? null) === 1062;
    }

    /** Current UTC time in DATETIME format. */
    public static function now(int $offsetSeconds = 0): string
    {
        return gmdate('Y-m-d H:i:s', time() + $offsetSeconds);
    }

    /** DATETIME (UTC) → ISO 8601, e.g. 2026-11-24T10:15:00Z */
    public static function iso(?string $datetime): ?string
    {
        return $datetime === null ? null : str_replace(' ', 'T', $datetime) . 'Z';
    }
}
