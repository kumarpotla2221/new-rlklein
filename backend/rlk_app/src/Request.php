<?php
declare(strict_types=1);

namespace RLK;

/** The incoming API call: ?action=…, query string and JSON body. */
final class Request
{
    private const MAX_BODY_BYTES = 1024 * 1024;              // 1 MB for normal requests
    private const MAX_UPLOAD_BODY_BYTES = 16 * 1024 * 1024;  // 10 MB resume ≈ 13.4 MB as base64

    /**
     * @param array<string, mixed> $query
     * @param array<string, mixed> $body
     */
    private function __construct(
        public readonly string $method,
        public readonly string $action,
        public readonly array $query,
        public readonly array $body,
        public readonly string $ip,
        public readonly string $userAgent,
    ) {
    }

    public static function fromGlobals(): self
    {
        $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        $action = is_string($_GET['action'] ?? null) ? trim($_GET['action']) : '';
        $body = $method === 'POST' ? self::readJsonBody($action === 'createApplication') : [];

        return new self(
            $method,
            $action,
            $_GET,
            $body,
            (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'),
            mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
        );
    }

    /** @return array<string, mixed> */
    private static function readJsonBody(bool $allowUpload): array
    {
        $limit = $allowUpload ? self::MAX_UPLOAD_BODY_BYTES : self::MAX_BODY_BYTES;
        $declared = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($declared > $limit) {
            throw self::tooLarge($allowUpload);
        }
        $raw = file_get_contents('php://input', false, null, 0, $limit + 1);
        if ($raw === false) {
            $raw = '';
        }
        if (strlen($raw) > $limit) {
            throw self::tooLarge($allowUpload);
        }
        // PHP drops bodies bigger than post_max_size; report that clearly instead of "invalid request".
        if ($raw === '' && $declared > 0) {
            throw self::tooLarge($allowUpload);
        }
        if ($raw === '') {
            return [];
        }
        $data = json_decode($raw, true, 32);
        if (!is_array($data)) {
            throw new ApiException('BAD_REQUEST', 'The request could not be read. Please refresh the page and try again.');
        }
        return $data;
    }

    private static function tooLarge(bool $upload): ApiException
    {
        return new ApiException(
            'PAYLOAD_TOO_LARGE',
            $upload ? 'Your upload is too large. Please use a resume of 10 MB or smaller.' : 'The request is too large.'
        );
    }

    public function input(): Validator
    {
        return new Validator($this->body);
    }

    public function queryInput(): Validator
    {
        return new Validator($this->query);
    }

    /** True when the hidden "website" honeypot field was filled in (only bots do that). */
    public function isBot(): bool
    {
        $trap = $this->body['website'] ?? '';
        return is_string($trap) && trim($trap) !== '';
    }
}
