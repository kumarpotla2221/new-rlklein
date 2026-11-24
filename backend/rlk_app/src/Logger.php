<?php
declare(strict_types=1);

namespace RLK;

/** Writes to rlk_app/logs/api-YYYY-MM.log. Never throws. Never log passwords or tokens. */
final class Logger
{
    /** @param array<string, mixed> $context */
    public static function error(string $message, array $context = []): void
    {
        self::write('ERROR', $message, $context);
    }

    /** @param array<string, mixed> $context */
    public static function info(string $message, array $context = []): void
    {
        self::write('INFO', $message, $context);
    }

    public static function exception(\Throwable $e, string $where): void
    {
        self::error($where, [
            'type' => $e::class,
            'message' => $e->getMessage(),
            'at' => basename($e->getFile()) . ':' . $e->getLine(),
        ]);
    }

    /** @param array<string, mixed> $context */
    private static function write(string $level, string $message, array $context): void
    {
        $line = sprintf('[%s] %s %s', gmdate('Y-m-d H:i:s'), $level, $message);
        if ($context) {
            $line .= ' ' . json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
        }
        try {
            $file = Storage::logDir() . '/api-' . gmdate('Y-m') . '.log';
            file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX);
        } catch (\Throwable) {
            error_log('RLK ' . $line);
        }
    }
}
