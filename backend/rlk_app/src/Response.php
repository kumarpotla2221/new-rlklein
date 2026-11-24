<?php
declare(strict_types=1);

namespace RLK;

/**
 * JSON responses in the format the website expects:
 *   {"ok":true,"data":…}   or   {"ok":false,"error":{"code":"…","message":"…"}}
 * Errors use HTTP 200 so the browser code can read and show the message.
 */
final class Response
{
    private static string $cacheControl = 'no-store';

    /** Lets a public, non-personal response be cached briefly by browsers. */
    public static function cacheFor(int $seconds): void
    {
        self::$cacheControl = "public, max-age=$seconds";
    }

    public static function ok(mixed $data): void
    {
        self::send(['ok' => true, 'data' => $data]);
    }

    public static function fail(string $code, string $message): void
    {
        self::$cacheControl = 'no-store';
        self::send(['ok' => false, 'error' => ['code' => $code, 'message' => $message]]);
    }

    /** @param array<string, mixed> $payload */
    private static function send(array $payload): void
    {
        if (!headers_sent()) {
            http_response_code(200);
            header('Content-Type: application/json; charset=utf-8');
            header('Cache-Control: ' . self::$cacheControl);
            header('X-Content-Type-Options: nosniff');
            header('Referrer-Policy: strict-origin-when-cross-origin');
        }
        echo json_encode(
            $payload,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRESERVE_ZERO_FRACTION
        );
    }
}
