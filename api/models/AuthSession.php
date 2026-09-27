<?php
declare(strict_types=1);

class AuthSession
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function create(int $userId, string $token, int $ttl): void
    {
        try {
            $stmt = self::db()->prepare(
                'INSERT INTO auth_sessions (user_id, token_hash, expires_at, ip_address, user_agent) 
                 VALUES (:u, :t, DATE_ADD(NOW(), INTERVAL :ttl SECOND), :ip, :ua)'
            );
            $stmt->bindValue(':u', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':t', hash('sha256', $token));
            $stmt->bindValue(':ttl', $ttl, PDO::PARAM_INT);
            $stmt->bindValue(':ip', $_SERVER['REMOTE_ADDR'] ?? null);
            $stmt->bindValue(':ua', substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500));
            $stmt->execute();
        } catch (Throwable $e) {
            // Silently continue if auth_sessions table has not been created yet
        }
    }

    public static function valid(string $token): bool
    {
        try {
            $stmt = self::db()->prepare(
                'SELECT id FROM auth_sessions WHERE token_hash = :t AND revoked_at IS NULL AND expires_at > NOW()'
            );
            $stmt->execute([':t' => hash('sha256', $token)]);
            $res = $stmt->fetchColumn();
            return $res !== false;
        } catch (Throwable $e) {
            return true; // Fallback gracefully if table not yet migrated
        }
    }

    public static function revoke(string $token): void
    {
        try {
            $stmt = self::db()->prepare('UPDATE auth_sessions SET revoked_at = NOW() WHERE token_hash = :t');
            $stmt->execute([':t' => hash('sha256', $token)]);
        } catch (Throwable $e) {
            // Silently ignore
        }
    }
}
