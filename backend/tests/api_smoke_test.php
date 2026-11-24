<?php
/**
 * End-to-end test of every API action, against a LOCAL test server and an EMPTY test database.
 * It creates test jobs/applications, so it refuses to run against anything but localhost.
 *
 *   php backend/tests/api_smoke_test.php --url=http://127.0.0.1:8080/api/index.php \
 *       --email=admin@test.local --password=... --lock-email=lock@test.local --lock-password=...
 *
 * Expects test limits in config.php: createApplication ≥ 50/hour, submitContact = 3/hour,
 * and cors_origins containing http://localhost:5173.
 */
declare(strict_types=1);

$opt = getopt('', ['url:', 'email:', 'password:', 'lock-email:', 'lock-password:']);
$url = (string) ($opt['url'] ?? '');
$host = (string) parse_url($url, PHP_URL_HOST);
if (!in_array($host, ['127.0.0.1', 'localhost'], true)) {
    fwrite(STDERR, "Refusing to run: this test writes data and only runs against localhost.\n");
    exit(2);
}

$passed = 0;
$failed = 0;

function check(bool $condition, string $name, mixed $detail = null): void
{
    global $passed, $failed;
    if ($condition) {
        $passed++;
        echo "  PASS  $name\n";
    } else {
        $failed++;
        echo "  FAIL  $name" . ($detail !== null ? ' → ' . json_encode($detail, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '') . "\n";
    }
}

/** @return array{status:int, json:mixed, headers:array<string,string>, raw:string} */
function call(string $method, string $action = '', array $query = [], mixed $body = null, array $headers = [], ?string $rawBody = null): array
{
    global $url;
    $q = $action === '' ? $query : ['action' => $action] + $query;
    $target = $url . ($q ? '?' . http_build_query($q) : '');
    $content = $rawBody ?? ($body === null ? '' : json_encode($body));
    $ctx = stream_context_create(['http' => [
        'method' => $method,
        'header' => implode("\r\n", array_merge(['Content-Type: text/plain;charset=utf-8'], $headers)),
        'content' => $method === 'POST' ? $content : '',
        'ignore_errors' => true,
        'timeout' => 60,
    ]]);
    $raw = (string) @file_get_contents($target, false, $ctx);
    $status = 0;
    $hdrs = [];
    foreach ($http_response_header ?? [] as $line) {
        if (preg_match('~^HTTP/\S+ (\d+)~', $line, $m)) {
            $status = (int) $m[1];
        } elseif (str_contains($line, ':')) {
            [$k, $v] = explode(':', $line, 2);
            $hdrs[strtolower(trim($k))] = trim($v);
        }
    }
    return ['status' => $status, 'json' => json_decode($raw, true), 'headers' => $hdrs, 'raw' => $raw];
}

function ok(array $r): mixed
{
    return ($r['json']['ok'] ?? false) === true ? $r['json']['data'] : null;
}

function errCode(array $r): ?string
{
    return $r['json']['error']['code'] ?? null;
}

function admin(string $action, array $body = []): array
{
    global $token;
    return call('POST', $action, [], $body + ['token' => $token]);
}

$pdf = "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n";
$resume = static fn (string $name = 'Résumé José.pdf', string $bytes = '') => ['name' => $name, 'type' => 'application/pdf', 'data' => base64_encode($bytes ?: $pdf)];
$applicant = [
    'firstName' => 'José', 'lastName' => 'Müller', 'email' => 'jose@example.com', 'phone' => '(562) 555-0100',
    'city' => 'Long Beach', 'state' => 'California', 'profession' => 'Registered Nurse', 'yearsExperience' => 7,
    'licenseNumber' => 'RN123456', 'licenseState' => 'California', 'specialty' => 'Med-Surg',
    'assignmentType' => 'Full-Time', 'preferredLocation' => 'Southern California', 'preferredShift' => 'Night',
    'availableStartDate' => '2027-01-15', 'message' => "Line one\nLine two 🩺", 'consent' => true,
];

echo "\n== Basics\n";
$r = call('GET');
check((ok($r)['status'] ?? null) === 'ok', 'status endpoint answers', $r['raw']);
$r = call('GET', 'health');
check((ok($r)['status'] ?? null) === 'ok' && ok($r)['database'] === 'ok' && ok($r)['storage'] === 'ok', 'health: database + storage ok', ok($r));
check(!isset(ok($r)['php']), 'health does not reveal PHP version');
check(errCode(call('GET', 'nope')) === 'NOT_FOUND', 'unknown action → NOT_FOUND');
check(errCode(call('GET', 'login')) === 'METHOD_NOT_ALLOWED', 'wrong HTTP method → METHOD_NOT_ALLOWED');
check(errCode(call('POST', 'login', [], null, [], '{not json')) === 'BAD_REQUEST', 'broken JSON → BAD_REQUEST');
check(call('GET', 'getJobs')['status'] === 200 && ok(call('GET', 'getJobs')) === [], 'getJobs on empty database → []');
$r = call('GET', 'getJobs', [], null, ['Origin: http://localhost:5173']);
check(($r['headers']['access-control-allow-origin'] ?? '') === 'http://localhost:5173', 'CORS allowed for configured dev origin');
$r = call('GET', 'getJobs', [], null, ['Origin: https://evil.example']);
check(!isset($r['headers']['access-control-allow-origin']), 'CORS not granted to other origins');
check(str_contains($r['headers']['cache-control'] ?? '', 'max-age=60'), 'public job list is cacheable for 60s');

echo "\n== Admin sign-in\n";
$r = call('POST', 'login', [], ['username' => $opt['email'], 'password' => 'wrong-password-123']);
check(errCode($r) === 'INVALID_CREDENTIALS' && str_starts_with($r['json']['error']['message'], 'Invalid credentials'), 'wrong password → INVALID_CREDENTIALS', $r['json']);
$r = call('POST', 'login', [], ['username' => 'nobody@example.com', 'password' => 'whatever-123456']);
check(errCode($r) === 'INVALID_CREDENTIALS', 'unknown email → same INVALID_CREDENTIALS message');
$r = call('POST', 'login', [], ['username' => strtoupper((string) $opt['email']), 'password' => $opt['password']]);
$login = ok($r);
$token = $login['token'] ?? '';
check(is_string($token) && strlen($token) === 64, 'correct login (email case-insensitive) → 64-char token', $r['json']);
check(is_int($login['expiresAt'] ?? null) && $login['expiresAt'] > (time() + 5 * 3600) * 1000, 'expiresAt is ~6h ahead in milliseconds');
check(($login['admin']['email'] ?? '') === strtolower((string) $opt['email']) && !isset($login['admin']['password_hash']), 'login returns admin without password hash');
check((ok(admin('getSession'))['admin']['email'] ?? '') === strtolower((string) $opt['email']), 'getSession with token → admin');
check(errCode(call('POST', 'getSession', [], [])) === 'UNAUTHORIZED', 'admin action without token → UNAUTHORIZED');
check(errCode(call('POST', 'getAdminJobs', [], ['token' => str_repeat('a', 64)])) === 'UNAUTHORIZED', 'admin action with fake token → UNAUTHORIZED');

echo "\n== Jobs (admin)\n";
check(errCode(admin('createJob', ['job' => ['profession' => 'RN']])) === 'VALIDATION', 'createJob without title → VALIDATION');
$jobInput = [
    'title' => 'Registered Nurse — Correctional Care', 'profession' => 'Registered Nurse', 'specialty' => 'Med-Surg',
    'state' => 'California', 'city' => 'Sacramento', 'country' => 'United States', 'facility' => 'CDCR Facility',
    'workSetting' => 'Correctional Healthcare', 'employmentType' => 'Full-Time', 'shift' => 'Night',
    'shiftsPerWeek' => 4, 'hoursPerWeek' => 36, 'startDate' => '2027-01-01', 'endDate' => '2027-06-30',
    'compensationType' => 'hourly', 'compensationMin' => 65.5, 'compensationMax' => 82, 'payFrequency' => 'Weekly',
    'showCompensation' => false, 'overview' => 'Café-level care. 日本語 & emoji 🩺', 'status' => 'Active', 'featured' => true,
    'visibility' => 'public', 'responsibilities' => ['Assess patients', '', 'Administer meds'], 'benefits' => ['Medical', '401k'],
];
$active = ok(admin('createJob', ['job' => $jobInput]));
check(($active['status'] ?? null) === 'Active' && preg_match('/^RLK-\d{6}-[0-9A-F]{4}$/', $active['id'] ?? ''), 'createJob → generated ID + status "Active"', $active);
check(($active['slug'] ?? '') === 'registered-nurse-correctional-care-sacramento-california', 'slug built from title/city/state', $active['slug'] ?? null);
check(($active['responsibilities'] ?? null) === ['Assess patients', 'Administer meds'], 'empty list items dropped');
check(($active['overview'] ?? '') === 'Café-level care. 日本語 & emoji 🩺', 'Unicode + emoji stored intact');
check(($active['compensationMin'] ?? null) === 65.5 && ($active['applicationCount'] ?? null) === 0, 'admin sees pay + applicationCount');
check(($active['postedDate'] ?? '') === gmdate('Y-m-d'), 'postedDate = today');

$dup = ok(admin('createJob', ['job' => $jobInput]));
check(($dup['slug'] ?? '') === 'registered-nurse-correctional-care-sacramento-california-2', 'same title again → unique slug "-2"', $dup['slug'] ?? null);
$custom = ok(admin('createJob', ['job' => ['id' => 'rlk-rn-ca-001', 'title' => 'LVN', 'profession' => 'LVN', 'state' => 'California', 'workSetting' => 'Clinic', 'overview' => 'x', 'status' => 'Draft']]));
check(($custom['id'] ?? '') === 'RLK-RN-CA-001' && ($custom['status'] ?? '') === 'Draft', 'custom job ID (uppercased) + Draft');
$r = admin('createJob', ['job' => ['id' => 'RLK-RN-CA-001', 'title' => 'X', 'profession' => 'X', 'state' => 'CA', 'workSetting' => 'X', 'overview' => 'x']]);
check(errCode($r) === 'VALIDATION' && str_contains($r['json']['error']['message'], 'already exists'), 'duplicate custom ID rejected');
check(errCode(admin('createJob', ['job' => $jobInput + ['id' => 'bad id!']])) === 'VALIDATION', 'invalid custom ID characters rejected');
check(errCode(admin('createJob', ['job' => ['compensationMin' => 90, 'compensationMax' => 50] + $jobInput])) === 'VALIDATION', 'max pay < min pay rejected');
check(errCode(admin('createJob', ['job' => ['status' => 'Published'] + $jobInput])) === 'VALIDATION', 'invalid status rejected');
check(errCode(admin('createJob', ['job' => ['startDate' => '2027-02-30'] + $jobInput])) === 'VALIDATION', 'impossible date rejected');
check(count(ok(admin('getAdminJobs')) ?? []) === 3, 'getAdminJobs lists all 3 jobs (incl. draft)');

echo "\n== Jobs (public)\n";
$public = ok(call('GET', 'getJobs'));
$ids = array_column($public ?? [], 'id');
check(in_array($active['id'], $ids, true) && !in_array('RLK-RN-CA-001', $ids, true), 'public list has active job, hides draft');
$pub = $public[0] ?? [];
check(!isset($pub['compensationMin']) && !isset($pub['applicationCount']), 'hidden pay and application counts not exposed publicly', $pub);
check((ok(call('GET', 'getJob', ['slug' => $active['slug']]))['id'] ?? null) === $active['id'], 'getJob by slug');
check((ok(call('GET', 'getJob', ['jobId' => $active['id']]))['id'] ?? null) === $active['id'], 'getJob by id');
check(ok(call('GET', 'getJob', ['jobId' => 'RLK-RN-CA-001'])) === null, 'draft job not reachable publicly');
check(ok(call('GET', 'getJob', ['slug' => "x' OR '1'='1"])) === null, 'SQL-injection-style input is harmless');

$upd = ok(admin('updateJob', ['jobId' => $dup['id'], 'updates' => ['title' => 'Renamed Title', 'showCompensation' => true]]));
check(($upd['title'] ?? '') === 'Renamed Title' && $upd['slug'] === $dup['slug'], 'updateJob changes title, keeps URL slug');
check(($upd['compensationMin'] ?? null) === 65.5 && $upd['specialty'] === 'Med-Surg', 'partial update leaves other fields untouched');
$pubDup = ok(call('GET', 'getJob', ['jobId' => $dup['id']]));
check(($pubDup['compensationMin'] ?? null) === 65.5, 'pay visible publicly once showCompensation = true');
$closed = ok(admin('updateJob', ['jobId' => $dup['id'], 'updates' => ['status' => 'closed']]));
check(($closed['status'] ?? '') === 'Closed' && ok(call('GET', 'getJob', ['jobId' => $dup['id']])) === null, 'closed job disappears from public site');
check(errCode(admin('updateJob', ['jobId' => 'NOPE', 'updates' => ['title' => 'x']])) === 'NOT_FOUND', 'update missing job → NOT_FOUND');

echo "\n== Applications (public)\n";
$r = call('POST', 'createApplication', [], $applicant + ['jobId' => $active['id'], 'jobTitle' => 'FAKE TITLE FROM BROWSER', 'resume' => $resume()]);
$app = ok($r);
check(preg_match('/^RLK-APP-\d{6}$/', $app['referenceNumber'] ?? '') === 1 && ($app['status'] ?? '') === 'New', 'application to active job → reference + New', $r['json']);
check(str_ends_with($app['appliedDate'] ?? '', 'Z'), 'appliedDate is ISO UTC');
$general = ok(call('POST', 'createApplication', [], $applicant + ['jobId' => 'GENERAL-APP', 'resume' => $resume('cv.pdf')]));
check(isset($general['referenceNumber']), 'general application (GENERAL-APP) accepted');
$r = call('POST', 'createApplication', [], $applicant + ['jobId' => $dup['id'], 'resume' => $resume()]);
check(errCode($r) === 'JOB_CLOSED', 'application to closed job → JOB_CLOSED', $r['json']);
$r = call('POST', 'createApplication', [], $applicant + ['jobId' => 'GENERAL-APP', 'resume' => $resume('virus.pdf', "MZ\x90\x00fake exe")]);
check(errCode($r) === 'VALIDATION' && str_contains($r['json']['error']['message'], 'valid PDF'), 'renamed .exe as .pdf → rejected by content check', $r['json']);
check(errCode(call('POST', 'createApplication', [], $applicant + ['resume' => $resume('run.exe')])) === 'VALIDATION', '.exe file name rejected');
check(errCode(call('POST', 'createApplication', [], $applicant)) === 'VALIDATION', 'missing resume rejected');
check(errCode(call('POST', 'createApplication', [], ['email' => 'bad'] + $applicant + ['resume' => $resume()])) === 'VALIDATION', 'invalid email rejected');
$big = $resume('big.pdf', '%PDF-' . str_repeat('A', 10 * 1024 * 1024 + 10));
$r = call('POST', 'createApplication', [], $applicant + ['resume' => $big]);
check(errCode($r) === 'VALIDATION' && str_contains($r['json']['error']['message'], '10 MB'), 'resume over 10 MB rejected with clear message', $r['json']);
$docx = "PK\x03\x04" . str_repeat("\0", 26) . '[Content_Types].xml word/document.xml';
$asDocx = ok(call('POST', 'createApplication', [], $applicant + ['resume' => $resume('cv.docx', $docx)]));
check(isset($asDocx['referenceNumber']), 'DOCX resume accepted');
$bot = ok(call('POST', 'createApplication', [], $applicant + ['website' => 'http://spam', 'resume' => $resume()]));
check(isset($bot['referenceNumber']), 'honeypot: bot gets a fake success…');

echo "\n== Applications (admin)\n";
$apps = ok(admin('getApplications')) ?? [];
check(count($apps) === 3, '…but is not stored (3 real applications)', count($apps));
$one = ok(admin('getApplication', ['applicationId' => $app['id']]));
check(($one['jobTitle'] ?? '') === $active['title'], 'job title taken from database, not from browser');
check(($one['firstName'] ?? '') === 'José' && ($one['message'] ?? '') === "Line one\nLine two 🩺" && ($one['yearsExperience'] ?? null) === 7, 'applicant fields stored intact');
check(($one['resumeFileName'] ?? '') === 'Résumé José.pdf' && ($one['status'] ?? '') === 'New', 'resume name + status shape');
$gen = ok(admin('getApplication', ['applicationId' => $general['id']]));
check(($gen['jobId'] ?? 'x') === '' && $gen['jobTitle'] === 'General Healthcare Professional Application', 'general application has empty jobId');
$s = ok(admin('updateApplicationStatus', ['applicationId' => $app['id'], 'status' => 'Shortlisted']));
check(($s['status'] ?? '') === 'Shortlisted', 'updateApplicationStatus → Shortlisted');
check(errCode(admin('updateApplicationStatus', ['applicationId' => $app['id'], 'status' => 'Approved'])) === 'VALIDATION', 'invalid application status rejected');
admin('addApplicationNote', ['applicationId' => $app['id'], 'note' => 'Called candidate.']);
$n = ok(admin('addApplicationNote', ['applicationId' => $app['id'], 'note' => 'Interview booked.']));
check(str_contains($n['adminNotes'] ?? '', 'Called candidate.') && str_contains($n['adminNotes'], 'Interview booked.') && str_contains($n['adminNotes'], 'UTC'), 'notes appended with timestamp + admin name', $n['adminNotes'] ?? null);
$file = ok(admin('getResume', ['applicationId' => $app['id']]));
check(base64_decode($file['data'] ?? '') === $pdf && $file['mimeType'] === 'application/pdf' && $file['fileName'] === 'Résumé José.pdf', 'getResume returns the exact uploaded file');
check(errCode(admin('getResume', ['applicationId' => '999999'])) === 'NOT_FOUND', 'getResume for missing application → NOT_FOUND');
check(errCode(admin('getApplication', ['applicationId' => '1 OR 1=1'])) === 'NOT_FOUND', 'non-numeric application id rejected');

echo "\n== Contact & staffing forms\n";
$contact = ['firstName' => 'Sam', 'lastName' => 'Ortiz', 'email' => 'sam@example.com', 'phone' => '562-555-0102', 'profession' => 'Dentist', 'specialty' => 'General', 'experience' => '10+ Years', 'startTime' => 'Immediately', 'emailConsent' => true, 'smsConsent' => false, 'message' => 'Hello 👋'];
check(isset(ok(call('POST', 'submitContact', [], $contact))['id']), 'submitContact stored');
check(errCode(call('POST', 'submitContact', [], ['phone' => '12'] + $contact)) === 'VALIDATION', 'contact: invalid phone rejected');
check(isset(ok(call('POST', 'submitContact', [], $contact))['id']), 'submitContact 3rd request still allowed');
$r = call('POST', 'submitContact', [], $contact);
check(errCode($r) === 'RATE_LIMITED', '4th contact request within the hour → RATE_LIMITED', $r['json']);
$staffing = ['firstName' => 'Pat', 'lastName' => 'Kim', 'title' => 'Director of Nursing', 'email' => 'pat@facility.gov', 'phone' => '562-555-0103', 'organization' => 'State Prison X', 'city' => 'Corcoran', 'state' => 'California', 'facilityType' => 'State Correctional Facility', 'professionNeeded' => 'Registered Nurse', 'numberNeeded' => '4', 'assignmentType' => 'Full-Time', 'shift' => 'Day', 'startDate' => '', 'details' => 'Need coverage', 'hasExistingAgency' => true, 'improvementGoals' => 'Faster fills'];
check(isset(ok(call('POST', 'submitStaffingRequest', [], $staffing))['id']), 'submitStaffingRequest stored (number as text, empty date ok)');
check(errCode(call('POST', 'submitStaffingRequest', [], ['organization' => ''] + $staffing)) === 'VALIDATION', 'staffing: missing organization rejected');

echo "\n== Deleting a job keeps its applications\n";
check((ok(admin('deleteJob', ['jobId' => $active['id']]))['deleted'] ?? false) === true, 'deleteJob');
$kept = ok(admin('getApplication', ['applicationId' => $app['id']]));
check(($kept['jobId'] ?? 'x') === '' && ($kept['jobTitle'] ?? '') === $active['title'], 'application kept with its job title');
check(errCode(admin('deleteJob', ['jobId' => $active['id']])) === 'NOT_FOUND', 'deleting again → NOT_FOUND');

echo "\n== Sign-out and account lockout\n";
check((ok(call('POST', 'logout', [], ['token' => $token]))['loggedOut'] ?? false) === true, 'logout');
check(errCode(admin('getSession')) === 'UNAUTHORIZED', 'token no longer works after logout');
for ($i = 1; $i <= 5; $i++) {
    call('POST', 'login', [], ['username' => $opt['lock-email'], 'password' => "wrong-$i-password"]);
}
$r = call('POST', 'login', [], ['username' => $opt['lock-email'], 'password' => $opt['lock-password']]);
check(errCode($r) === 'ACCOUNT_LOCKED', '5 wrong passwords → account locked, even the right password is refused', $r['json']);

echo "\nResult: $passed passed, $failed failed\n";
exit($failed === 0 ? 0 : 1);
