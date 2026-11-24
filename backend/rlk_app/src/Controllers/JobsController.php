<?php
declare(strict_types=1);

namespace RLK\Controllers;

use RLK\ApiException;
use RLK\Database;
use RLK\Repositories\JobRepository;
use RLK\Request;
use RLK\Response;
use RLK\Validator;

final class JobsController
{
    private const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Per Diem', 'Contract', 'Temporary'];
    private const SHIFTS = ['Day', 'Evening', 'Night', 'Rotating', 'Flexible'];
    private const STATUSES = ['active', 'draft', 'closed'];
    private const VISIBILITIES = ['public', 'unlisted'];
    private const COMPENSATION_TYPES = ['hourly', 'weekly', 'salary', 'negotiable'];

    // ---------------- Public ----------------

    /** GET ?action=getJobs: active, unexpired, public jobs. */
    public static function publicList(Request $request): array
    {
        Response::cacheFor(60);
        return JobRepository::listPublic();
    }

    /** GET ?action=getJob&jobId=… or &slug=…: one open job, or null. */
    public static function publicGet(Request $request): ?array
    {
        $q = $request->queryInput();
        $row = JobRepository::findOpen($q->string('jobId', 'Job ID', 40), $q->string('slug', 'Job link', 190));
        return $row === null ? null : JobRepository::toApi($row, false);
    }

    // ---------------- Admin ----------------

    public static function adminList(Request $request, array $admin): array
    {
        return JobRepository::listAll();
    }

    public static function adminGet(Request $request, array $admin): ?array
    {
        return JobRepository::find(self::jobId($request));
    }

    public static function create(Request $request, array $admin): array
    {
        $job = $request->body['job'] ?? null;
        if (!is_array($job)) {
            throw ApiException::validation('Job details are missing.');
        }
        $input = new Validator($job);
        $columns = self::parseJob($input, true);

        $customId = $input->string('id', 'Job ID', 40);
        if ($customId !== null) {
            $id = strtoupper($customId);
            if (!preg_match('/^[A-Z0-9][A-Z0-9-]{1,39}$/', $id)) {
                throw ApiException::validation('Job ID may only contain letters, numbers and dashes.');
            }
            if (JobRepository::exists($id)) {
                throw ApiException::validation("A job with the ID $id already exists. Choose another ID or leave it empty.");
            }
        } else {
            $id = self::newJobId();
        }

        $columns['id'] = $id;
        $columns['slug'] = self::uniqueSlug($columns['title'], $columns['city'] ?? '', $columns['state']);
        $columns['posted_date'] = gmdate('Y-m-d');
        $columns['created_by'] = $admin['id'];
        Database::insert('jobs', $columns);

        return JobRepository::find($id) ?? throw new \RuntimeException('Created job not found');
    }

    public static function update(Request $request, array $admin): array
    {
        $id = self::jobId($request);
        if (!JobRepository::exists($id)) {
            throw ApiException::notFound('This job no longer exists. It may have been deleted.');
        }
        $updates = $request->body['updates'] ?? null;
        if (!is_array($updates)) {
            throw ApiException::validation('Job changes are missing.');
        }
        $columns = self::parseJob(new Validator($updates), false);
        // The URL (slug) stays the same after edits so shared links keep working.
        Database::update('jobs', $columns, 'id = ?', [$id]);

        return JobRepository::find($id) ?? throw new \RuntimeException('Updated job not found');
    }

    public static function delete(Request $request, array $admin): array
    {
        $id = self::jobId($request);
        // Applications for this job are kept (their job_id becomes empty; the job title is preserved).
        $deleted = Database::run('DELETE FROM jobs WHERE id = ?', [$id])->rowCount();
        if ($deleted === 0) {
            throw ApiException::notFound('This job no longer exists.');
        }
        return ['deleted' => true];
    }

    // ---------------- Helpers ----------------

    private static function jobId(Request $request): string
    {
        return (string) $request->input()->string('jobId', 'Job ID', 40, true);
    }

    /**
     * Validates job fields and returns database columns.
     * Creating: required fields must be present. Updating: only the fields that were sent are changed.
     * @return array<string, mixed>
     */
    private static function parseJob(Validator $in, bool $creating): array
    {
        $rules = [
            // field => [label, kind, extra]
            'title' => ['Job title', 'str', 200, true],
            'profession' => ['Profession', 'str', 120, true],
            'specialty' => ['Specialty', 'str', 120],
            'state' => ['State', 'str', 60, true],
            'city' => ['City', 'str', 120],
            'country' => ['Country', 'str', 60],
            'facility' => ['Facility', 'str', 200],
            'facilityType' => ['Facility type', 'str', 120],
            'workSetting' => ['Work setting', 'str', 120, true],
            'employmentType' => ['Employment type', 'enum', self::EMPLOYMENT_TYPES, 'Full-Time'],
            'shift' => ['Shift', 'enum', self::SHIFTS, 'Day'],
            'shiftsPerWeek' => ['Shifts per week', 'int', [0, 14]],
            'shiftPattern' => ['Shift pattern', 'str', 120],
            'hoursPerWeek' => ['Hours per week', 'num', [0, 168]],
            'startDate' => ['Start date', 'date'],
            'endDate' => ['End date', 'date'],
            'assignmentDuration' => ['Assignment duration', 'str', 120],
            'assignmentTerm' => ['Assignment term', 'str', 120],
            'contractType' => ['Contract type', 'str', 120],
            'extensionAvailable' => ['Extension available', 'bool'],
            'status' => ['Status', 'enum', self::STATUSES, 'draft'],
            'featured' => ['Featured', 'bool'],
            'visibility' => ['Visibility', 'enum', self::VISIBILITIES, 'public'],
            'expirationDate' => ['Expiration date', 'date'],
            'compensationType' => ['Compensation type', 'enum', self::COMPENSATION_TYPES, null],
            'compensationMin' => ['Minimum pay', 'num', [0, 10000000]],
            'compensationMax' => ['Maximum pay', 'num', [0, 10000000]],
            'payFrequency' => ['Pay frequency', 'str', 60],
            'showCompensation' => ['Show compensation', 'bool'],
            'additionalCompensation' => ['Additional compensation', 'text', 2000],
            'overview' => ['Job overview', 'text', 15000, true],
            'responsibilities' => ['Responsibilities', 'list'],
            'qualifications' => ['Qualifications', 'list'],
            'preferredQualifications' => ['Preferred qualifications', 'list'],
            'requiredCredentials' => ['Required credentials', 'list'],
            'benefits' => ['Benefits', 'list'],
            'agencyName' => ['Agency name', 'str', 200],
            'agencyLocation' => ['Agency location', 'str', 200],
            'agencyExperience' => ['Agency experience', 'text', 5000],
            'agencySupport' => ['Agency support', 'text', 5000],
            'agencyCertifications' => ['Agency certifications', 'text', 5000],
            'jobBoardDisclaimer' => ['Job board disclaimer', 'text', 5000],
        ];
        // Columns that can't be NULL get these values when left empty.
        $emptyDefaults = ['specialty' => '', 'city' => '', 'country' => 'United States'];

        $columns = [];
        foreach ($rules as $field => $rule) {
            if (!$creating && !$in->has($field)) {
                continue;
            }
            [$label, $kind] = $rule;
            $required = ($rule[3] ?? false) === true;
            $value = match ($kind) {
                'str' => $in->string($field, $label, $rule[2], $required),
                'text' => $in->text($field, $label, $rule[2], $required),
                'int' => $in->int($field, $label, $rule[2][0], $rule[2][1]),
                'num' => $in->number($field, $label, $rule[2][0], $rule[2][1]),
                'date' => $in->date($field, $label),
                'bool' => $in->bool($field) ? 1 : 0,
                'enum' => $in->enum($field, $label, $rule[2], $rule[3]),
                'list' => json_encode($in->list($field, $label), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            };
            if ($value === null && array_key_exists($field, $emptyDefaults)) {
                $value = $emptyDefaults[$field];
            }
            if ($value === null && $kind === 'enum' && $rule[3] !== null) {
                $value = $rule[3];
            }
            $columns[JobRepository::COLUMNS[$field]] = $value;
        }

        $min = $columns['compensation_min'] ?? null;
        $max = $columns['compensation_max'] ?? null;
        if ($min !== null && $max !== null && $max < $min) {
            throw ApiException::validation('Maximum pay cannot be lower than minimum pay.');
        }
        $start = $columns['start_date'] ?? null;
        $end = $columns['end_date'] ?? null;
        if ($start !== null && $end !== null && $end < $start) {
            throw ApiException::validation('End date cannot be before the start date.');
        }
        return $columns;
    }

    /** e.g. RLK-261124-4F2A */
    private static function newJobId(): string
    {
        do {
            $id = 'RLK-' . gmdate('ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));
        } while (JobRepository::exists($id));
        return $id;
    }

    /** e.g. registered-nurse-sacramento-california, with -2, -3 … added if already used */
    private static function uniqueSlug(string $title, string $city, string $state): string
    {
        $base = strtolower(trim("$title $city $state"));
        $base = trim(preg_replace('/[^a-z0-9]+/', '-', $base) ?? '', '-');
        $base = rtrim(substr($base, 0, 150), '-') ?: 'job';
        $slug = $base;
        for ($n = 2; JobRepository::slugExists($slug); $n++) {
            $slug = "$base-$n";
        }
        return $slug;
    }
}
