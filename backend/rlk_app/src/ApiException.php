<?php
declare(strict_types=1);

namespace RLK;

/**
 * An expected error whose message is safe to show to the visitor.
 * Anything else that goes wrong is logged and answered with a generic message.
 */
final class ApiException extends \RuntimeException
{
    public function __construct(public readonly string $errorCode, string $message)
    {
        parent::__construct($message);
    }

    public static function validation(string $message): self
    {
        return new self('VALIDATION', $message);
    }

    public static function notFound(string $message): self
    {
        return new self('NOT_FOUND', $message);
    }
}
