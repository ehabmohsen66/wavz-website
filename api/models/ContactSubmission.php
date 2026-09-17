<?php
/**
 * WAVZ CMS — Contact Submission Model
 */

declare(strict_types=1);

class ContactSubmission
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = [], int $limit = 100, int $offset = 0): array
    {
        $sql = 'SELECT * FROM contact_submissions WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= ' AND status = :status';
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND (name LIKE :s1 OR email LIKE :s2 OR company LIKE :s3 OR message LIKE :s4)';
            $term = '%' . $filters['search'] . '%';
            $params[':s1'] = $term;
            $params[':s2'] = $term;
            $params[':s3'] = $term;
            $params[':s4'] = $term;
        }

        $sql .= ' ORDER BY created_at DESC LIMIT ' . (int)$limit . ' OFFSET ' . (int)$offset;

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM contact_submissions WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO contact_submissions (name, email, phone, company, service, message, status, ip_address)
             VALUES (:name, :email, :phone, :company, :service, :message, :status, :ip_address)'
        );
        $stmt->execute([
            ':name'       => $data['name'],
            ':email'      => $data['email'],
            ':phone'      => $data['phone'] ?? null,
            ':company'    => $data['company'] ?? null,
            ':service'    => $data['service'] ?? null,
            ':message'    => $data['message'],
            ':status'     => $data['status'] ?? 'unread',
            ':ip_address' => $data['ip_address'] ?? null,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id) ?? ['id' => $id];
    }

    public static function updateStatus(int $id, string $status): ?array
    {
        $allowed = ['unread', 'read', 'replied', 'archived'];
        if (!in_array($status, $allowed, true)) {
            throw new InvalidArgumentException("Invalid status: $status");
        }

        $stmt = self::db()->prepare('UPDATE contact_submissions SET status = :status WHERE id = :id');
        $stmt->execute([':status' => $status, ':id' => $id]);
        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM contact_submissions WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function countUnread(): int
    {
        $stmt = self::db()->query("SELECT COUNT(*) FROM contact_submissions WHERE status = 'unread'");
        return (int)$stmt->fetchColumn();
    }

    public static function countTotal(): int
    {
        $stmt = self::db()->query('SELECT COUNT(*) FROM contact_submissions');
        return (int)$stmt->fetchColumn();
    }

    public static function getAllForExport(): array
    {
        $stmt = self::db()->query('SELECT id, name, email, phone, company, service, message, status, ip_address, created_at FROM contact_submissions ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }
}
