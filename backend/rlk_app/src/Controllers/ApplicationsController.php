<?php
declare(strict_types=1);

namespace RLK\Controllers;

use RLK\ApiException;
use RLK\Config;
use RLK\Database;
use RLK\Logger;
use RLK\Mailer;
use RLK\RateLimiter;
use RLK\Repositories\ApplicationRepository;
use RLK\Repositories\JobRepository;
use RLK\Request;
use RLK\Storage;
use RLK\Validator;

final class ApplicationsController
{
    private const GENERAL_JOB_ID = 'GENERAL-APP';
    private const GENERAL_JOB_TITLE = 'General Healthcare Professional Application';
    private const MAX_NOTES_BYTES = 60000; // admin_notes is a TEXT column (65,535 bytes)

    /** Real file types we accept, recognised by their first bytes, not by the file name. */
    private const RESUME_TYPES = [
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // ---------------- Public ----------------

    /** POST ?action=createApplication: applicant fields + resume {name, type, data(base64)}. */
    public static function create(Request $request): array
    {
        if ($request->isBot()) {
            Logger::info('Honeypot: application ignored', ['ip' => $request->ip]);
            return ['id' => '0', 'referenceNumber' => 'RLK-APP-' . random_int(100000, 999999), 'appliedDate' => Database::iso(Database::now()), 'status' => 'New'];
        }
        RateLimiter::hit('createApplication', $request->ip);

        $in = $request->input();
        $fields = [
            'first_name' => $in->string('firstName', 'First name', 80, true),
            'last_name' => $in->string('lastName', 'Last name', 80, true),
            'email' => $in->email('email', 'email address', true),
            'phone' => $in->phone('phone', 'phone number', true),
            'city' => $in->string('city', 'City', 120),
            'state' => $in->string('state', 'State', 60),
            'profession' => $in->string('profession', 'Profession', 120, true),
            'years_experience' => $in->int('yearsExperience', 'Years of experience', 0, 80),
            'license_number' => $in->string('licenseNumber', 'License number', 60),
            'license_state' => $in->string('licenseState', 'License state', 60),
            'specialty' => $in->string('specialty', 'Specialty', 120),
            'assignment_type' => $in->string('assignmentType', 'Assignment type', 60),
            'preferred_location' => $in->string('preferredLocation', 'Preferred location', 200),
            'preferred_shift' => $in->string('preferredShift', 'Preferred shift', 40),
            'available_start_date' => $in->date('availableStartDate', 'Available start date'),
            'message' => $in->text('message', 'Message', 5000),
        ];

        // The job title is looked up here, never trusted from the browser.
        $jobId = $in->string('jobId', 'Job', 40);
        if ($jobId === null || strcasecmp($jobId, self::GENERAL_JOB_ID) === 0) {
            $fields['job_id'] = null;
            $fields['job_title'] = self::GENERAL_JOB_TITLE;
        } else {
            $job = JobRepository::findOpen($jobId);
            if ($job === null) {
                throw new ApiException('JOB_CLOSED', 'This position is no longer accepting applications. Please browse our other open jobs.');
            }
            $fields['job_id'] = $job['id'];
            $fields['job_title'] = $job['title'];
        }

        $resume = self::readResume($request->body['resume'] ?? null);

        $storedName = bin2hex(random_bytes(16)) . '.' . $resume['ext'];
        $path = Storage::resumeDir() . '/' . $storedName;
        if (file_put_contents($path, $resume['bytes'], LOCK_EX) === false) {
            throw new \RuntimeException('Could not save resume file');
        }
        @chmod($path, 0640);

        $fields += [
            'resume_original_name' => $resume['name'],
            'resume_stored_name' => $storedName,
            'resume_mime' => self::RESUME_TYPES[$resume['ext']],
            'resume_size' => strlen($resume['bytes']),
            'consent_given_at' => $in->bool('consent') ? Database::now() : null,
            'ip_address' => $request->ip,
            'user_agent' => $request->userAgent,
            'applied_at' => Database::now(),
        ];

        try {
            $id = null;
            for ($attempt = 0; $id === null && $attempt < 10; $attempt++) {
                $fields['reference_number'] = 'RLK-APP-' . random_int(100000, 999999);
                try {
                    $id = Database::insert('applications', $fields);
                } catch (\PDOException $e) {
                    if (!Database::isDuplicateKey($e)) {
                        throw $e;
                    }
                }
            }
            if ($id === null) {
                throw new \RuntimeException('Could not create a unique reference number');
            }
        } catch (\Throwable $e) {
            @unlink($path); // don't keep a resume with no application
            throw $e;
        }

        Mailer::notifyTeam(
            "New application: {$fields['first_name']} {$fields['last_name']} — {$fields['job_title']}",
            'A new job application was submitted on the website.',
            [
                'Reference' => $fields['reference_number'],
                'Position' => $fields['job_title'] . ($fields['job_id'] ? " ({$fields['job_id']})" : ''),
                'Name' => "{$fields['first_name']} {$fields['last_name']}",
                'Email' => $fields['email'],
                'Phone' => $fields['phone'],
                'Profession' => $fields['profession'],
                'Specialty' => $fields['specialty'],
                'Location' => trim(($fields['city'] ?? '') . ', ' . ($fields['state'] ?? ''), ', '),
                'Resume' => $resume['name'],
            ],
            $fields['email'],
            "/admin/applications/$id"
        );

        return [
            'id' => $id,
            'referenceNumber' => $fields['reference_number'],
            'appliedDate' => Database::iso($fields['applied_at']),
            'status' => 'New',
        ];
    }

    // ---------------- Admin ----------------

    public static function adminList(Request $request, array $admin): array
    {
        return ApplicationRepository::listAll();
    }

    public static function adminGet(Request $request, array $admin): ?array
    {
        return ApplicationRepository::find(self::applicationId($request));
    }

    public static function updateStatus(Request $request, array $admin): array
    {
        $id = self::requireExisting($request);
        $status = $request->input()->enum('status', 'Status', ApplicationRepository::STATUSES);
        if ($status === null) {
            throw ApiException::validation('Please choose a status.');
        }
        Database::update('applications', ['status' => $status], 'id = ?', [$id]);
        return ApplicationRepository::find($id) ?? throw new \RuntimeException('Application vanished');
    }

    /** Adds a note to the running log, stamped with the time and the admin's name. */
    public static function addNote(Request $request, array $admin): array
    {
        $id = self::requireExisting($request);
        $note = (string) $request->input()->text('note', 'Note', 5000, true);
        $row = ApplicationRepository::findRow($id);
        $entry = sprintf("[%s UTC — %s]\n%s", gmdate('Y-m-d H:i'), $admin['name'], $note);
        $existing = trim((string) ($row['admin_notes'] ?? ''));
        $notes = $existing === '' ? $entry : $existing . "\n\n" . $entry;
        if (strlen($notes) > self::MAX_NOTES_BYTES) {
            throw ApiException::validation('The notes for this application are full. Please keep new notes short or summarise older ones.');
        }
        Database::update('applications', ['admin_notes' => $notes], 'id = ?', [$id]);
        return ApplicationRepository::find($id) ?? throw new \RuntimeException('Application vanished');
    }

    /** Returns the resume as base64 so the admin panel can download it. Resumes are never publicly reachable. */
    public static function resume(Request $request, array $admin): array
    {
        $row = ApplicationRepository::findRow(self::applicationId($request));
        if ($row === null) {
            throw ApiException::notFound('This application no longer exists.');
        }
        $stored = basename((string) ($row['resume_stored_name'] ?? ''));
        $path = Storage::resumeDir() . '/' . $stored;
        if ($stored === '' || !is_file($path)) {
            Logger::error('Resume file missing', ['application_id' => $row['id']]);
            throw ApiException::notFound('The resume file for this application could not be found.');
        }
        $bytes = file_get_contents($path);
        if ($bytes === false) {
            throw new \RuntimeException('Could not read resume file');
        }
        return [
            'fileName' => (string) ($row['resume_original_name'] ?: 'resume.' . pathinfo($stored, PATHINFO_EXTENSION)),
            'mimeType' => (string) ($row['resume_mime'] ?: 'application/octet-stream'),
            'data' => base64_encode($bytes),
        ];
    }

    // ---------------- Helpers ----------------

    private static function applicationId(Request $request): string
    {
        $id = (string) $request->input()->string('applicationId', 'Application', 20, true);
        if (!ctype_digit($id)) {
            throw ApiException::notFound('This application no longer exists.');
        }
        return $id;
    }

    private static function requireExisting(Request $request): string
    {
        $id = self::applicationId($request);
        if (ApplicationRepository::findRow($id) === null) {
            throw ApiException::notFound('This application no longer exists.');
        }
        return $id;
    }

    /**
     * Checks the uploaded resume: size, and that the CONTENT really is a PDF / DOC / DOCX.
     * @return array{name: string, ext: string, bytes: string}
     */
    private static function readResume(mixed $resume): array
    {
        if (!is_array($resume) || !is_string($resume['data'] ?? null) || $resume['data'] === '') {
            throw ApiException::validation('Please attach your resume (PDF, DOC, or DOCX).');
        }
        $maxBytes = (int) Config::get('uploads.resume_max_bytes', 10 * 1024 * 1024);
        $maxMb = (int) round($maxBytes / 1048576);
        if (strlen($resume['data']) > (int) ceil($maxBytes / 3) * 4 + 4) {
            throw ApiException::validation("Resume must be $maxMb MB or smaller.");
        }
        $bytes = base64_decode($resume['data'], true);
        if ($bytes === false || $bytes === '') {
            throw ApiException::validation('Your resume could not be read. Please choose the file again.');
        }
        if (strlen($bytes) > $maxBytes) {
            throw ApiException::validation("Resume must be $maxMb MB or smaller.");
        }

        $name = Validator::clean(basename(str_replace('\\', '/', (string) ($resume['name'] ?? ''))), false);
        $name = mb_substr($name, 0, 200);
        $nameExt = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!isset(self::RESUME_TYPES[$nameExt])) {
            throw ApiException::validation('Please upload a PDF, DOC, or DOCX file.');
        }

        $ext = match (true) {
            str_starts_with($bytes, '%PDF-') => 'pdf',
            str_starts_with($bytes, "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1") => 'doc',
            str_starts_with($bytes, "PK\x03\x04") && str_contains($bytes, 'word/') => 'docx',
            default => null,
        };
        if ($ext === null) {
            throw ApiException::validation('Your resume does not appear to be a valid PDF, DOC, or DOCX document.');
        }
        if ($nameExt !== $ext) {
            // e.g. a Word file saved with a .pdf name: keep the real type so it opens correctly.
            $name = preg_replace('/\.[A-Za-z0-9]+$/', ".$ext", $name) ?? $name;
        }
        return ['name' => $name, 'ext' => $ext, 'bytes' => $bytes];
    }
}
