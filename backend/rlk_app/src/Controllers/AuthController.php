<?php
declare(strict_types=1);

namespace RLK\Controllers;

use RLK\Auth;
use RLK\Request;

final class AuthController
{
    /** POST ?action=login {username, password} → {token, expiresAt, admin} */
    public static function login(Request $request): array
    {
        return Auth::login($request);
    }

    /** POST ?action=logout {token}. Always succeeds. */
    public static function logout(Request $request): array
    {
        Auth::logout($request->body['token'] ?? null);
        return ['loggedOut' => true];
    }

    /** POST ?action=getSession {token} → {admin}. The token was already checked by the router. */
    public static function session(Request $request, array $admin): array
    {
        return ['admin' => $admin];
    }
}
