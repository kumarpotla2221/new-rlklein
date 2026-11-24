<?php
declare(strict_types=1);

namespace RLK;

/**
 * Plain-text email alerts to the team, sent with the hosting server's mail().
 * A failed email never fails the visitor's submission. It is only logged.
 */
final class Mailer
{
    /** @param array<string, string|int|null> $fields Label => value lines in the email body */
    public static function notifyTeam(string $subject, string $intro, array $fields, ?string $replyTo = null, ?string $adminPath = null): void
    {
        if (!Config::get('mail.enabled', false)) {
            return;
        }
        $to = array_filter((array) Config::get('mail.to', []), static fn ($a): bool => is_string($a) && filter_var($a, FILTER_VALIDATE_EMAIL) !== false);
        $from = (string) Config::get('mail.from', '');
        if (!$to || filter_var($from, FILTER_VALIDATE_EMAIL) === false) {
            Logger::error('Email alert skipped: mail.to or mail.from is not set correctly in config.php');
            return;
        }

        $lines = [$intro, ''];
        foreach ($fields as $label => $value) {
            if ($value !== null && $value !== '') {
                $lines[] = $label . ': ' . $value;
            }
        }
        if ($adminPath !== null) {
            $lines[] = '';
            $lines[] = 'Open in the admin panel: ' . rtrim((string) Config::get('app.url', ''), '/') . $adminPath;
        }
        $lines[] = '';
        $lines[] = '— Sent automatically by the R.L. Klein website';

        $fromName = self::headerSafe((string) Config::get('mail.from_name', 'Website'));
        $headers = [
            'From: ' . mb_encode_mimeheader($fromName, 'UTF-8') . " <$from>",
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'X-Mailer: RLK-Portal',
        ];
        if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL) !== false) {
            $headers[] = 'Reply-To: ' . self::headerSafe($replyTo);
        }

        try {
            $sent = mail(
                implode(', ', $to),
                mb_encode_mimeheader(self::headerSafe($subject), 'UTF-8'),
                implode("\r\n", $lines),
                implode("\r\n", $headers),
                '-f' . $from
            );
            if (!$sent) {
                Logger::error('Email alert was not accepted by the mail server', ['subject' => $subject]);
            }
        } catch (\Throwable $e) {
            Logger::exception($e, 'Email alert failed');
        }
    }

    /** Removes line breaks so visitors can't inject extra email headers. */
    private static function headerSafe(string $value): string
    {
        return trim(str_replace(["\r", "\n"], ' ', $value));
    }
}
