<?php
/**
 * WAVZ CMS — Auth Controller
 */

declare(strict_types=1);

class AuthController
{
    /**
     * POST /api/auth/login
     */
    public static function login(array $input): void
    {
        // Protect login endpoint from brute-force attempts
        if (class_exists('RateLimiter')) {
            RateLimiter::check('login_' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 15);
        }

        $errors = Validator::required($input, ['email', 'password']);
        if (!empty($errors)) {
            Response::validationError('Missing email or password', $errors);
        }

        $email = trim($input['email']);
        $password = $input['password'];

        $user = User::getByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            Response::unauthorized('Invalid email or password');
        }

        if (!$user['is_active']) {
            Response::unauthorized('Your account is deactivated. Please contact an administrator.');
        }

        // Generate tokens
        $payload = [
            'sub' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];

        $token = JWT::encode($payload);
        $refreshToken = JWT::encodeRefresh(['sub' => $user['id']]);

        // Record session
        if (class_exists('AuthSession')) {
            AuthSession::create((int)$user['id'], $refreshToken, JWT_REFRESH_TTL);
        }

        // Update last login
        User::updateLastLogin((int)$user['id']);

        // Log activity
        ActivityLog::log((int)$user['id'], 'login', 'user', (int)$user['id'], [
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        Response::success([
            'token' => $token,
            'refresh_token' => $refreshToken,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'avatar' => $user['avatar'],
            ]
        ]);
    }

    /**
     * POST /api/auth/refresh
     */
    public static function refresh(array $input): void
    {
        $refreshToken = $input['refresh_token'] ?? null;
        if (!$refreshToken) {
            Response::validationError('Missing refresh token');
        }

        if (class_exists('AuthSession') && !AuthSession::valid($refreshToken)) {
            Response::unauthorized('Refresh token revoked or expired');
        }

        try {
            $payload = JWT::decode($refreshToken);
        } catch (RuntimeException $e) {
            Response::unauthorized('Invalid or expired refresh token: ' . $e->getMessage());
        }

        if (!isset($payload['type']) || $payload['type'] !== 'refresh') {
            Response::unauthorized('Invalid token type');
        }

        $user = User::getById((int)$payload['sub']);

        if (!$user || !$user['is_active']) {
            Response::unauthorized('User not found or deactivated');
        }

        // Generate new access token
        $newPayload = [
            'sub' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];

        $token = JWT::encode($newPayload);

        Response::success([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'avatar' => $user['avatar'],
            ]
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public static function me(): void
    {
        $currentUser = Auth::authenticate();
        Response::success(['user' => $currentUser]);
    }

    /**
     * POST /api/auth/logout
     */
    public static function logout(): void
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = trim($matches[1]);
            if (class_exists('AuthSession')) {
                AuthSession::revoke($token);
            }
        }
        Response::success(null, 'Logged out successfully');
    }
}
