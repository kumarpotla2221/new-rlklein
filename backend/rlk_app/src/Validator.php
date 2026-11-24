<?php
declare(strict_types=1);

namespace RLK;

/**
 * Checks and cleans input. Every method either returns a clean value or throws
 * ApiException('VALIDATION', <message shown to the visitor>).
 *
 * Length limits are in characters. TEXT columns hold 65,535 bytes and one
 * character can take up to 4 bytes, so long text fields stay at or below 15,000.
 */
final class Validator
{
    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data)
    {
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->data);
    }

    public function raw(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    /** Single-line text. Returns null when empty and not required. */
    public function string(string $key, string $label, int $max, bool $required = false): ?string
    {
        return $this->text($key, $label, $max, $required, false);
    }

    /** Multi-line text (keeps line breaks). */
    public function text(string $key, string $label, int $max, bool $required = false, bool $multiline = true): ?string
    {
        $value = $this->data[$key] ?? '';
        if (is_int($value) || is_float($value)) {
            $value = (string) $value;
        }
        if (!is_string($value)) {
            throw ApiException::validation("$label is not valid.");
        }
        $value = self::clean($value, $multiline);
        if ($value === '') {
            if ($required) {
                throw ApiException::validation("$label is required.");
            }
            return null;
        }
        if (mb_strlen($value) > $max) {
            throw ApiException::validation("$label must be $max characters or fewer.");
        }
        return $value;
    }

    public function email(string $key, string $label, bool $required = false): ?string
    {
        $value = $this->string($key, $label, 190, $required);
        if ($value !== null && filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            throw ApiException::validation("Please enter a valid $label.");
        }
        return $value;
    }

    public function phone(string $key, string $label, bool $required = false): ?string
    {
        $value = $this->string($key, $label, 40, $required);
        if ($value !== null) {
            $digits = preg_replace('/\D/', '', $value) ?? '';
            if (strlen($digits) < 7 || !preg_match('/^[0-9A-Za-z\s+().#\-]+$/', $value)) {
                throw ApiException::validation("Please enter a valid $label.");
            }
        }
        return $value;
    }

    /** Date as YYYY-MM-DD. Returns null when empty. */
    public function date(string $key, string $label, bool $required = false): ?string
    {
        $value = $this->string($key, $label, 10, $required);
        if ($value === null) {
            return null;
        }
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $value);
        if ($date === false || $date->format('Y-m-d') !== $value) {
            throw ApiException::validation("$label must be a valid date.");
        }
        return $value;
    }

    public function int(string $key, string $label, int $min, int $max, bool $required = false): ?int
    {
        $value = $this->data[$key] ?? null;
        if ($value === null || $value === '') {
            if ($required) {
                throw ApiException::validation("$label is required.");
            }
            return null;
        }
        if (is_float($value) && floor($value) === $value) {
            $value = (int) $value;
        }
        if (is_string($value) && preg_match('/^-?\d{1,9}$/', trim($value))) {
            $value = (int) trim($value);
        }
        if (!is_int($value) || $value < $min || $value > $max) {
            throw ApiException::validation("$label must be a whole number between $min and $max.");
        }
        return $value;
    }

    public function number(string $key, string $label, float $min, float $max): ?float
    {
        $value = $this->data[$key] ?? null;
        if ($value === null || $value === '') {
            return null;
        }
        if (!is_int($value) && !is_float($value) && !(is_string($value) && is_numeric(trim($value)))) {
            throw ApiException::validation("$label must be a number.");
        }
        $value = (float) $value;
        if (!is_finite($value) || $value < $min || $value > $max) {
            throw ApiException::validation("$label must be between $min and $max.");
        }
        return round($value, 2);
    }

    public function bool(string $key, bool $default = false): bool
    {
        $value = $this->data[$key] ?? null;
        return match (true) {
            is_bool($value) => $value,
            $value === 1, $value === '1' => true,
            $value === 0, $value === '0' => false,
            is_string($value) => in_array(strtolower(trim($value)), ['true', 'yes', 'on'], true),
            default => $default,
        };
    }

    /**
     * One of the allowed values (matched case-insensitively, returned as written in $allowed).
     * @param list<string> $allowed
     */
    public function enum(string $key, string $label, array $allowed, ?string $default = null): ?string
    {
        $value = $this->string($key, $label, 60);
        if ($value === null) {
            return $default;
        }
        foreach ($allowed as $option) {
            if (strcasecmp($option, $value) === 0) {
                return $option;
            }
        }
        throw ApiException::validation("$label is not valid.");
    }

    /**
     * A list of short text items, e.g. responsibilities. Empty items are dropped.
     * @return list<string>
     */
    public function list(string $key, string $label, int $maxItems = 50, int $maxLength = 1000): array
    {
        $value = $this->data[$key] ?? [];
        if ($value === null || $value === '') {
            return [];
        }
        if (!is_array($value)) {
            throw ApiException::validation("$label is not valid.");
        }
        $items = [];
        foreach ($value as $item) {
            if (!is_string($item)) {
                throw ApiException::validation("$label is not valid.");
            }
            $item = self::clean($item, false);
            if ($item === '') {
                continue;
            }
            if (mb_strlen($item) > $maxLength) {
                throw ApiException::validation("Each $label item must be $maxLength characters or fewer.");
            }
            $items[] = $item;
        }
        if (count($items) > $maxItems) {
            throw ApiException::validation("$label can have at most $maxItems items.");
        }
        return $items;
    }

    /** Fixes invalid UTF-8, removes control characters and trims. */
    public static function clean(string $value, bool $multiline): string
    {
        if (!mb_check_encoding($value, 'UTF-8')) {
            $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
        }
        $value = str_replace(["\r\n", "\r"], "\n", $value);
        $value = $multiline
            ? preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value)
            : preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
        return trim($value ?? '');
    }
}
