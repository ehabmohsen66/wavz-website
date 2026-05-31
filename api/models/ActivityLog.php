<?php
/**
 * WAVZ CMS — ActivityLog Model
 */

declare(strict_types=1);

class ActivityLog
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT a.*, u.name AS user_name, u.email AS user_email, u.avatar AS user_avatar
                FROM activity_log a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= ' AND a.user_id = :user_id';
            $params[':user_id'] = $filters['user_id'];
        }

        if (!empty($filters['entity_type'])) {
            $sql .= ' AND a.entity_type = :entity_type';
            $params[':entity_type'] = $filters['entity_type'];
        }

        if (!empty($filters['action'])) {
            $sql .= ' AND a.action = :action';
            $params[':action'] = $filters['action'];
        }

        $sql .= ' ORDER BY a.created_at DESC';

        // Pagination
        $page = max(1, (int)($filters['page'] ?? 1));
        $perPage = min(100, max(1, (int)($filters['per_page'] ?? 50)));
        $offset = ($page - 1) * $perPage;

        // Count
        $countSql = 'SELECT COUNT(*) FROM activity_log a WHERE 1=1';
        if (!empty($filters['user_id'])) {
            $countSql .= ' AND a.user_id = :user_id';
        }
        if (!empty($filters['entity_type'])) {
            $countSql .= ' AND a.entity_type = :entity_type';
        }
        if (!empty($filters['action'])) {
            $countSql .= ' AND a.action = :action';
        }
        $countStmt = self::db()->prepare($countSql);
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $sql .= " LIMIT $perPage OFFSET $offset";
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll();

        return ['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage];
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM activity_log WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getRecent(int $limit = 20): array
    {
        $stmt = self::db()->prepare(
            'SELECT a.*, u.name AS user_name, u.email AS user_email, u.avatar AS user_avatar
             FROM activity_log a
             LEFT JOIN users u ON a.user_id = u.id
             ORDER BY a.created_at DESC
             LIMIT :limit'
        );
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Log an activity.
     */
    public static function log(
        string $action,
        string $entityType,
        ?int $entityId = null,
        ?array $details = null,
        ?int $userId = null
    ): void {
        // Get current user if not provided
        if ($userId === null) {
            $user = Auth::user();
            $userId = $user ? (int)$user['id'] : null;
        }

        $stmt = self::db()->prepare(
            'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address)
             VALUES (:user_id, :action, :entity_type, :entity_id, :details, :ip_address)'
        );
        $stmt->execute([
            ':user_id'     => $userId,
            ':action'      => $action,
            ':entity_type' => $entityType,
            ':entity_id'   => $entityId,
            ':details'     => $details ? json_encode($details) : null,
            ':ip_address'  => Auth::getClientIp(),
        ]);
    }

    public static function create(array $data): array
    {
        self::log(
            $data['action'],
            $data['entity_type'],
            $data['entity_id'] ?? null,
            $data['details'] ?? null,
            $data['user_id'] ?? null
        );

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM activity_log WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function update(int $id, array $data): ?array
    {
        // Activity logs are generally immutable; returning as-is
        return self::getById($id);
    }
}
