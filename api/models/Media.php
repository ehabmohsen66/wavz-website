<?php
/**
 * WAVZ CMS — Media Model
 */

declare(strict_types=1);

class Media
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT m.*, u.name AS uploaded_by_name FROM media m LEFT JOIN users u ON m.uploaded_by = u.id WHERE 1=1';
        $params = [];

        if (!empty($filters['mime_type'])) {
            $sql .= ' AND m.mime_type LIKE :mime_type';
            $params[':mime_type'] = $filters['mime_type'] . '%';
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND (m.original_name LIKE :search OR m.alt_en LIKE :search2)';
            $params[':search'] = '%' . $filters['search'] . '%';
            $params[':search2'] = '%' . $filters['search'] . '%';
        }

        $sql .= ' ORDER BY m.created_at DESC';

        // Pagination
        $page = max(1, (int)($filters['page'] ?? 1));
        $perPage = min(100, max(1, (int)($filters['per_page'] ?? 50)));
        $offset = ($page - 1) * $perPage;

        // Count total
        $countSql = preg_replace('/SELECT .+ FROM/', 'SELECT COUNT(*) FROM', $sql);
        $countSql = preg_replace('/ORDER BY .+$/', '', $countSql);
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
        $stmt = self::db()->prepare('SELECT * FROM media WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByMimeType(string $mimeType): array
    {
        $stmt = self::db()->prepare('SELECT * FROM media WHERE mime_type LIKE :mime ORDER BY created_at DESC');
        $stmt->execute([':mime' => $mimeType . '%']);
        return $stmt->fetchAll();
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO media (filename, original_name, path, thumbnail, mime_type, size_bytes, width, height, alt_en, alt_ar, uploaded_by)
             VALUES (:filename, :original_name, :path, :thumbnail, :mime_type, :size_bytes, :width, :height, :alt_en, :alt_ar, :uploaded_by)'
        );
        $stmt->execute([
            ':filename'      => $data['filename'],
            ':original_name' => $data['original_name'],
            ':path'          => $data['path'],
            ':thumbnail'     => $data['thumbnail'] ?? null,
            ':mime_type'     => $data['mime_type'],
            ':size_bytes'    => $data['size_bytes'],
            ':width'         => $data['width'] ?? null,
            ':height'        => $data['height'] ?? null,
            ':alt_en'        => $data['alt_en'] ?? null,
            ':alt_ar'        => $data['alt_ar'] ?? null,
            ':uploaded_by'   => $data['uploaded_by'] ?? null,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['alt_en', 'alt_ar'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE media SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM media WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function count(): int
    {
        $stmt = self::db()->query('SELECT COUNT(*) FROM media');
        return (int)$stmt->fetchColumn();
    }
}
