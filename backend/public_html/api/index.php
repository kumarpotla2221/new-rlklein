<?php
/**
 * R.L. Klein Job Portal API: https://new.rlklein.com/api/index.php?action=…
 * All logic lives in the private rlk_app folder outside public_html.
 */
declare(strict_types=1);

require __DIR__ . '/_locate.php';

$appDir = rlk_locate_app();
if ($appDir === null) {
    error_log('RLK API: rlk_app folder not found. Upload it next to public_html.');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo '{"ok":false,"error":{"code":"CONFIG","message":"The job portal is not connected yet. Please try again later."}}';
    exit;
}

require $appDir . '/bootstrap.php';

RLK\Api::handle();
