<?php
declare(strict_types=1);

namespace RLK;

use RLK\Controllers\ApplicationsController;
use RLK\Controllers\AuthController;
use RLK\Controllers\FormsController;
use RLK\Controllers\JobsController;
use RLK\Controllers\SystemController;

/**
 * Entry point for every API call: ?action=<name>.
 * The action names and response format match what the website already uses.
 */
final class Api
{
    /** action => [HTTP method, who may call it, handler] */
    private const ROUTES = [
        'health'                  => ['GET',  'public', [SystemController::class, 'health']],

        // Public website
        'getJobs'                 => ['GET',  'public', [JobsController::class, 'publicList']],
        'getJob'                  => ['GET',  'public', [JobsController::class, 'publicGet']],
        'createApplication'       => ['POST', 'public', [ApplicationsController::class, 'create']],
        'submitContact'           => ['POST', 'public', [FormsController::class, 'contact']],
        'submitStaffingRequest'   => ['POST', 'public', [FormsController::class, 'staffingRequest']],

        // Admin sign-in
        'login'                   => ['POST', 'public', [AuthController::class, 'login']],
        'logout'                  => ['POST', 'public', [AuthController::class, 'logout']],
        'getSession'              => ['POST', 'admin',  [AuthController::class, 'session']],

        // Admin: jobs
        'getAdminJobs'            => ['POST', 'admin',  [JobsController::class, 'adminList']],
        'getAdminJob'             => ['POST', 'admin',  [JobsController::class, 'adminGet']],
        'createJob'               => ['POST', 'admin',  [JobsController::class, 'create']],
        'updateJob'               => ['POST', 'admin',  [JobsController::class, 'update']],
        'deleteJob'               => ['POST', 'admin',  [JobsController::class, 'delete']],

        // Admin: applications
        'getApplications'         => ['POST', 'admin',  [ApplicationsController::class, 'adminList']],
        'getApplication'          => ['POST', 'admin',  [ApplicationsController::class, 'adminGet']],
        'updateApplicationStatus' => ['POST', 'admin',  [ApplicationsController::class, 'updateStatus']],
        'addApplicationNote'      => ['POST', 'admin',  [ApplicationsController::class, 'addNote']],
        'getResume'               => ['POST', 'admin',  [ApplicationsController::class, 'resume']],
    ];

    public static function handle(): void
    {
        try {
            self::sendCorsHeaders();
            if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
                http_response_code(204);
                return;
            }
            if (!Config::isLoaded()) {
                Logger::error('config.php is missing in rlk_app/. Copy config.example.php to config.php.');
                throw new ApiException('CONFIG', 'The job portal is not connected yet. Please try again later.');
            }

            $request = Request::fromGlobals();
            if ($request->action === '') {
                Response::ok(SystemController::status($request));
                return;
            }

            $route = self::ROUTES[$request->action] ?? null;
            if ($route === null) {
                throw new ApiException('NOT_FOUND', 'Unknown request.');
            }
            [$method, $access, $handler] = $route;
            if ($request->method !== $method) {
                throw new ApiException('METHOD_NOT_ALLOWED', 'This request type is not supported.');
            }

            if ($access === 'admin') {
                // Every admin call is re-checked on the server. Nothing the browser claims is trusted.
                $admin = Auth::requireAdmin($request->body['token'] ?? null);
                $data = $handler($request, $admin);
            } else {
                $data = $handler($request);
            }
            Response::ok($data);
        } catch (ApiException $e) {
            Response::fail($e->errorCode, $e->getMessage());
        } catch (\Throwable $e) {
            Logger::exception($e, 'Unhandled error in action ' . (string) ($_GET['action'] ?? ''));
            Response::fail('SERVER', 'Something went wrong on our side. Please try again in a moment.');
        }
    }

    /**
     * The live website calls the API on the same address and needs no CORS.
     * Extra origins (e.g. the local dev server) come from config.php → cors_origins.
     */
    private static function sendCorsHeaders(): void
    {
        $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
        if ($origin === '' || !Config::isLoaded()) {
            return;
        }
        $allowed = (array) Config::get('cors_origins', []);
        if (in_array($origin, $allowed, true)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Vary: Origin');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            header('Access-Control-Max-Age: 86400');
        }
    }
}
