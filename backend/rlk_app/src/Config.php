<?php
declare(strict_types=1);

namespace RLK;

/** Reads settings from config.php. */
final class Config
{
    /** @var array<string, mixed>|null */
    private static ?array $values = null;

    public static function load(string $file): void
    {
        if (!is_file($file)) {
            self::$values = null;
            return;
        }
        $values = require $file;
        self::$values = is_array($values) ? $values : null;
    }

    public static function isLoaded(): bool
    {
        return self::$values !== null;
    }

    /** Dotted lookup, e.g. Config::get('db.host'). */
    public static function get(string $key, mixed $default = null): mixed
    {
        if (self::$values === null) {
            throw new ApiException('CONFIG', 'The job portal is not connected yet. Please try again later.');
        }
        $value = self::$values;
        foreach (explode('.', $key) as $part) {
            if (!is_array($value) || !array_key_exists($part, $value)) {
                return $default;
            }
            $value = $value[$part];
        }
        return $value;
    }
}
