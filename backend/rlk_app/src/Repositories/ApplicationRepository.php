<?php
declare(strict_types=1);

namespace RLK\Repositories;

use RLK\Database;

/** Reads the applications table and converts rows to the Application shape the website uses. */
final class ApplicationRepository
{
    public const STATUSES = ['new', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected'];

    /** @return list<array<string, mixed>> */
    public static function listAll(): array
    {
        $rows = Database::all('SELECT * FROM applications ORDER BY applied_at DESC, id DESC');
        return array_map([self::class, 'toApi'], $rows);
    }

    /** @return array<string, mixed>|null Raw database row */
    public static function findRow(string $id): ?array
    {
        return Database::one('SELECT * FROM applications WHERE id = ?', [$id]);
    }

    /** @return array<string, mixed>|null */
    public static function find(string $id): ?array
    {
        $row = self::findRow($id);
        return $row === null ? null : self::toApi($row);
    }

    public static function referenceExists(string $reference): bool
    {
        return Database::value('SELECT 1 FROM applications WHERE reference_number = ?', [$reference]) !== null;
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public static function toApi(array $row): array
    {
        $app = [
            'id' => (string) $row['id'],
            'referenceNumber' => (string) $row['reference_number'],
            'jobId' => (string) ($row['job_id'] ?? ''),
            'jobTitle' => (string) $row['job_title'],
            'firstName' => (string) $row['first_name'],
            'lastName' => (string) $row['last_name'],
            'email' => (string) $row['email'],
            'phone' => (string) $row['phone'],
            'city' => $row['city'],
            'state' => $row['state'],
            'profession' => (string) $row['profession'],
            'yearsExperience' => $row['years_experience'] === null ? null : (int) $row['years_experience'],
            'licenseNumber' => $row['license_number'],
            'licenseState' => $row['license_state'],
            'specialty' => $row['specialty'],
            'assignmentType' => $row['assignment_type'],
            'preferredLocation' => $row['preferred_location'],
            'preferredShift' => $row['preferred_shift'],
            'availableStartDate' => $row['available_start_date'],
            'message' => $row['message'],
            'resumeFileName' => $row['resume_original_name'],
            'appliedDate' => Database::iso($row['applied_at']),
            'status' => ucfirst((string) $row['status']), // New / Reviewed / … as the website expects
            'adminNotes' => (string) ($row['admin_notes'] ?? ''),
        ];
        return array_filter($app, static fn ($v): bool => $v !== null);
    }
}
