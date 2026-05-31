<?php
/**
 * WAVZ CMS — Auth Middleware
 * JWT authentication and role-based authorization.
 */

declare(strict_types=1);

class Auth
{
    private static ?array $currentUser = null;

    /**
     * Role hierarchy weights: higher = more privileges.
     */
    private const ROLE_WEIGHTS = [
        'viewer' => 1,
        'editor' => 2,
        'admin'  => 3,
    ];

    /**
     * Authenticate the request by extracting and validating the JWT.
     * Returns the decoded user payload.
     *
     * @throws RuntimeException if auth fails
     */
    public static function authenticate(): array
    {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }

        $token = JWT::extractFromHeader();

        if ($token === null) {
            Response::unauthorized('Missing authentication token');
        }

        try {
            $payload = JWT::decode($token);
        } catch (RuntimeException $e) {
            Response::unauthorized($e->getMessage());
        }

        // Ensure it's an access token, not a refresh token
        if (isset($payload['type']) && $payload['type'] === 'refresh') {
            Response::unauthorized('Invalid token type');
        }

        // Verify user still exists and is active
        $db = getDB();
        $stmt = $db->prepare('SELECT id, name, email, role, avatar, is_active FROM users WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $payload['sub'] ?? 0]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::unauthorized('User not found');
        }

        if (!$user['is_active']) {
            Response::unauthorized('Account is deactivated');
        }

        self::$currentUser = $user;
        return $user;
    }

    /**
     * Require a specific role (or higher).
     *
     * @param string|array $roles Allowed roles (e.g., 'admin' or ['admin', 'editor'])
     */
    public static function requireRole(string|array $roles): array
    {
        $user = self::authenticate();

        if (is_string($roles)) {
            $roles = [$roles];
        }

        $userRole = $user['role'];

        // Check if user's role is in the allowed roles
        if (in_array($userRole, $roles, true)) {
            return $user;
        }

        // Check hierarchy: e.g., admin can do anything editor can
        $userWeight = self::ROLE_WEIGHTS[$userRole] ?? 0;
        $minRequired = PHP_INT_MAX;
        foreach ($roles as $role) {
            $weight = self::ROLE_WEIGHTS[$role] ?? PHP_INT_MAX;
            $minRequired = min($minRequired, $weight);
        }

        if ($userWeight >= $minRequired) {
            return $user;
        }

        Response::forbidden('Insufficient permissions');
        exit; // Response::forbidden already exits, but just for static analysis
    }

    /**
     * Get the currently authenticated user (or null if not authenticated).
     */
    public static function user(): ?array
    {
        return self::$currentUser;
    }

    /**
     * Get client IP address.
     */
    public static function getClientIp(): string
    {
        $headers = [
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_REAL_IP',
            'REMOTE_ADDR',
        ];

        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ip = $_SERVER[$header];
                // X-Forwarded-For may contain multiple IPs
                if (str_contains($ip, ',')) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }

        return '0.0.0.0';
    }

    /**
     * Reset cached user (for testing).
     */
    public static function reset(): void
    {
        self::$currentUser = null;
    }
}
