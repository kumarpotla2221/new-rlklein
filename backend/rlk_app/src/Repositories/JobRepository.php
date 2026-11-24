<?php
declare(strict_types=1);

namespace RLK\Repositories;

use RLK\Database;

/**
 * Reads/writes the jobs table and converts rows to the Job shape used by the
 * website (frontend/src/types/index.ts), e.g. work_setting → workSetting.
 */
final class JobRepository
{
    /** Website field name => database column */
    public const COLUMNS = [
        'title' => 'title',
        'profession' => 'profession',
        'specialty' => 'specialty',
        'state' => 'state',
        'city' => 'city',
        'country' => 'country',
        'facility' => 'facility',
        'facilityType' => 'facility_type',
        'workSetting' => 'work_setting',
        'employmentType' => 'employment_type',
        'shift' => 'shift',
        'shiftsPerWeek' => 'shifts_per_week',
        'shiftPattern' => 'shift_pattern',
        'hoursPerWeek' => 'hours_per_week',
        'startDate' => 'start_date',
        'endDate' => 'end_date',
        'assignmentDuration' => 'assignment_duration',
        'assignmentTerm' => 'assignment_term',
        'contractType' => 'contract_type',
        'extensionAvailable' => 'extension_available',
        'status' => 'status',
        'featured' => 'featured',
        'visibility' => 'visibility',
        'expirationDate' => 'expiration_date',
        'compensationType' => 'compensation_type',
        'compensationMin' => 'compensation_min',
        'compensationMax' => 'compensation_max',
        'payFrequency' => 'pay_frequency',
        'showCompensation' => 'show_compensation',
        'additionalCompensation' => 'additional_compensation',
        'overview' => 'overview',
        'responsibilities' => 'responsibilities',
        'qualifications' => 'qualifications',
        'preferredQualifications' => 'preferred_qualifications',
        'requiredCredentials' => 'required_credentials',
        'benefits' => 'benefits',
        'agencyName' => 'agency_name',
        'agencyLocation' => 'agency_location',
        'agencyExperience' => 'agency_experience',
        'agencySupport' => 'agency_support',
        'agencyCertifications' => 'agency_certifications',
        'jobBoardDisclaimer' => 'job_board_disclaimer',
    ];

    public const LIST_FIELDS = ['responsibilities', 'qualifications', 'preferredQualifications', 'requiredCredentials', 'benefits'];
    private const BOOL_FIELDS = ['extensionAvailable', 'featured', 'showCompensation'];
    private const INT_FIELDS = ['shiftsPerWeek'];
    private const FLOAT_FIELDS = ['hoursPerWeek', 'compensationMin', 'compensationMax'];
    private const PAY_FIELDS = ['compensationType', 'compensationMin', 'compensationMax', 'payFrequency', 'additionalCompensation'];

    /** Jobs anyone can open by link: active and not expired (public or unlisted). */
    private const OPEN = "j.status = 'active' AND (j.expiration_date IS NULL OR j.expiration_date >= UTC_DATE())";

    /** @return list<array<string, mixed>> */
    public static function listPublic(): array
    {
        $rows = Database::all(
            'SELECT j.* FROM jobs j WHERE ' . self::OPEN . " AND j.visibility = 'public'
              ORDER BY j.featured DESC, j.posted_date DESC, j.created_at DESC"
        );
        return array_map(static fn (array $r): array => self::toApi($r, false), $rows);
    }

    /** @return array<string, mixed>|null An open job, by id or slug */
    public static function findOpen(?string $id, ?string $slug = null): ?array
    {
        if ($id !== null) {
            $row = Database::one('SELECT j.* FROM jobs j WHERE j.id = ? AND ' . self::OPEN, [$id]);
        } elseif ($slug !== null) {
            $row = Database::one('SELECT j.* FROM jobs j WHERE j.slug = ? AND ' . self::OPEN, [$slug]);
        } else {
            return null;
        }
        return $row;
    }

    /** @return list<array<string, mixed>> */
    public static function listAll(): array
    {
        $rows = Database::all(
            'SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS application_count
               FROM jobs j ORDER BY j.created_at DESC'
        );
        return array_map(static fn (array $r): array => self::toApi($r, true), $rows);
    }

    /** @return array<string, mixed>|null */
    public static function find(string $id): ?array
    {
        $row = Database::one(
            'SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS application_count
               FROM jobs j WHERE j.id = ?',
            [$id]
        );
        return $row === null ? null : self::toApi($row, true);
    }

    public static function exists(string $id): bool
    {
        return Database::value('SELECT 1 FROM jobs WHERE id = ?', [$id]) !== null;
    }

    public static function slugExists(string $slug): bool
    {
        return Database::value('SELECT 1 FROM jobs WHERE slug = ?', [$slug]) !== null;
    }

    /**
     * Database row → website Job object. Empty values are left out (the website treats them as "not set").
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public static function toApi(array $row, bool $forAdmin): array
    {
        $job = ['id' => (string) $row['id'], 'slug' => (string) $row['slug']];
        foreach (self::COLUMNS as $field => $column) {
            $value = $row[$column] ?? null;
            if (in_array($field, self::LIST_FIELDS, true)) {
                $decoded = is_string($value) ? json_decode($value, true) : null;
                $job[$field] = is_array($decoded) ? array_values(array_filter($decoded, 'is_string')) : [];
                continue;
            }
            if (in_array($field, self::BOOL_FIELDS, true)) {
                $job[$field] = (int) $value === 1;
                continue;
            }
            if ($value === null || $value === '') {
                continue;
            }
            $job[$field] = match (true) {
                in_array($field, self::INT_FIELDS, true) => (int) $value,
                in_array($field, self::FLOAT_FIELDS, true) => (float) $value,
                $field === 'status' => ucfirst((string) $value), // the website expects Active / Draft / Closed
                default => (string) $value,
            };
        }
        $job['postedDate'] = (string) $row['posted_date'];
        // Required strings the website always reads
        $job['specialty'] ??= '';
        $job['city'] ??= '';

        if ($forAdmin) {
            $job['applicationCount'] = (int) ($row['application_count'] ?? 0);
        } elseif (!$job['showCompensation']) {
            // Pay details the admin chose not to show stay private.
            foreach (self::PAY_FIELDS as $field) {
                unset($job[$field]);
            }
        }
        return $job;
    }
}
