<?php
/**
 * ONE-TIME SETUP: creates the first admin account.
 *
 * Works only when BOTH are true:
 *   1. config.php has a setup_key of at least 16 characters, and
 *   2. no admin account exists yet.
 * After creating the admin: set setup_key back to '' in config.php and delete this file from the server.
 */
declare(strict_types=1);

require __DIR__ . '/_locate.php';

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');

$appDir = rlk_locate_app();
$state = 'form';
$message = '';
$created = null;

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if ($appDir === null) {
    $state = 'closed';
    $message = 'The rlk_app folder was not found. Upload it next to public_html first.';
} else {
    require $appDir . '/bootstrap.php';
    try {
        $setupKey = RLK\Config::isLoaded() ? (string) RLK\Config::get('setup_key', '') : '';
        if (!RLK\Config::isLoaded()) {
            $state = 'closed';
            $message = 'config.php is missing in rlk_app. Copy config.example.php to config.php and fill it in.';
        } elseif (strlen($setupKey) < 16) {
            $state = 'closed';
            $message = 'Setup is turned off. To use it, set a setup_key of at least 16 characters in rlk_app/config.php.';
        } elseif ((int) RLK\Database::value('SELECT COUNT(*) FROM admins') > 0) {
            $state = 'closed';
            $message = 'An admin account already exists, so setup is closed. Set setup_key back to \'\' in config.php and delete setup.php from the server.';
        } elseif (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
            $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
            RLK\RateLimiter::hit('setup', $ip);
            $key = (string) ($_POST['setup_key'] ?? '');
            $password = (string) ($_POST['password'] ?? '');
            if (!hash_equals($setupKey, $key)) {
                RLK\Logger::info('Setup: wrong setup key', ['ip' => $ip]);
                throw RLK\ApiException::validation('The setup key is not correct.');
            }
            if ($password !== (string) ($_POST['password_confirm'] ?? '')) {
                throw RLK\ApiException::validation('The two passwords do not match.');
            }
            RLK\Auth::createAdmin((string) ($_POST['email'] ?? ''), (string) ($_POST['name'] ?? ''), $password, 'admin');
            RLK\Logger::info('Setup: first admin account created', ['ip' => $ip]);
            $state = 'done';
            $created = (string) $_POST['email'];
        }
    } catch (RLK\ApiException $e) {
        $message = $e->getMessage();
    } catch (Throwable $e) {
        RLK\Logger::exception($e, 'Setup failed');
        $message = 'Something went wrong. Check that the database settings in config.php are correct.';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin Setup: R.L. Klein</title>
<style>
  :root { --navy:#0D2240; --red:#D8232A; --line:#d6dbe3; --muted:#5b6677; --bg:#f4f6f9; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background:var(--bg); color:#1b2433; }
  main { max-width: 460px; margin: 48px auto; padding: 0 16px; }
  .card { background:#fff; border:1px solid var(--line); border-radius:12px; padding:28px; box-shadow:0 4px 16px rgba(13,34,64,.06); }
  h1 { margin:0 0 6px; font-size:22px; color:var(--navy); }
  p { line-height:1.55; color:var(--muted); margin:0 0 16px; }
  label { display:block; font-weight:600; font-size:14px; margin:14px 0 6px; color:var(--navy); }
  input { width:100%; padding:11px 12px; border:1px solid var(--line); border-radius:8px; font-size:15px; }
  input:focus { outline:2px solid var(--navy); outline-offset:1px; }
  small { color:var(--muted); font-size:12px; }
  button { margin-top:22px; width:100%; padding:12px; border:0; border-radius:8px; background:var(--navy); color:#fff; font-size:15px; font-weight:600; cursor:pointer; }
  .alert { padding:12px 14px; border-radius:8px; margin-bottom:16px; font-size:14px; line-height:1.5; }
  .alert--error { background:#fdecec; color:#8a1c1c; border:1px solid #f5c2c2; }
  .alert--ok { background:#e9f7ef; color:#16603a; border:1px solid #b9e3c9; }
  ol { padding-left:20px; color:#1b2433; line-height:1.7; }
  code { background:#eef1f5; padding:1px 5px; border-radius:4px; }
</style>
</head>
<body>
<main>
  <div class="card">
    <h1>Admin Account Setup</h1>
<?php if ($state === 'done'): ?>
    <div class="alert alert--ok">The admin account <strong><?= h((string) $created) ?></strong> was created.</div>
    <p><strong>Finish now. This is important:</strong></p>
    <ol>
      <li>In <code>rlk_app/config.php</code>, set <code>'setup_key' =&gt; ''</code>.</li>
      <li>Delete <code>api/setup.php</code> from the server.</li>
      <li>Sign in at <code>/admin/login</code>.</li>
    </ol>
<?php elseif ($state === 'closed'): ?>
    <div class="alert alert--error"><?= h($message) ?></div>
<?php else: ?>
    <p>Create the first administrator for the job portal. This page works only once.</p>
    <?php if ($message !== ''): ?><div class="alert alert--error" role="alert"><?= h($message) ?></div><?php endif; ?>
    <form method="post" autocomplete="off">
      <label for="setup_key">Setup key</label>
      <input id="setup_key" name="setup_key" type="password" required>
      <small>The setup_key value from rlk_app/config.php.</small>

      <label for="name">Full name</label>
      <input id="name" name="name" type="text" required maxlength="120" value="<?= h((string) ($_POST['name'] ?? '')) ?>">

      <label for="email">Email (used to sign in)</label>
      <input id="email" name="email" type="email" required maxlength="190" value="<?= h((string) ($_POST['email'] ?? '')) ?>">

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required minlength="12" autocomplete="new-password">
      <small>At least 12 characters. Don't reuse a password from anywhere else.</small>

      <label for="password_confirm">Repeat password</label>
      <input id="password_confirm" name="password_confirm" type="password" required minlength="12" autocomplete="new-password">

      <button type="submit">Create admin account</button>
    </form>
<?php endif; ?>
  </div>
</main>
</body>
</html>
