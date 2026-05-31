<?php
/**
 * WAVZ CMS — Page Model
 */

declare(strict_types=1);

class Page
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT p.*, u.name AS updated_by_name FROM pages p LEFT JOIN users u ON p.updated_by = u.id WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= ' AND p.status = :status';
            $params[':status'] = $filters['status'];
        }

        $sql .= ' ORDER BY p.slug ASC';

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM pages WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getBySlug(string $slug): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM pages WHERE slug = :slug');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO pages (slug, title_en, title_ar, subtitle_en, subtitle_ar, content_en, content_ar, meta_title_en, meta_title_ar, meta_desc_en, meta_desc_ar, status, updated_by)
             VALUES (:slug, :title_en, :title_ar, :subtitle_en, :subtitle_ar, :content_en, :content_ar, :meta_title_en, :meta_title_ar, :meta_desc_en, :meta_desc_ar, :status, :updated_by)'
        );
        $stmt->execute([
            ':slug'          => $data['slug'],
            ':title_en'      => $data['title_en'],
            ':title_ar'      => $data['title_ar'] ?? null,
            ':subtitle_en'   => $data['subtitle_en'] ?? null,
            ':subtitle_ar'   => $data['subtitle_ar'] ?? null,
            ':content_en'    => $data['content_en'] ?? null,
            ':content_ar'    => $data['content_ar'] ?? null,
            ':meta_title_en' => $data['meta_title_en'] ?? null,
            ':meta_title_ar' => $data['meta_title_ar'] ?? null,
            ':meta_desc_en'  => $data['meta_desc_en'] ?? null,
            ':meta_desc_ar'  => $data['meta_desc_ar'] ?? null,
            ':status'        => $data['status'] ?? 'published',
            ':updated_by'    => $data['updated_by'] ?? null,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = [
            'slug', 'title_en', 'title_ar', 'subtitle_en', 'subtitle_ar',
            'content_en', 'content_ar', 'meta_title_en', 'meta_title_ar',
            'meta_desc_en', 'meta_desc_ar', 'status', 'updated_by',
        ];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE pages SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function updateBySlug(string $slug, array $data): ?array
    {
        $page = self::getBySlug($slug);
        if (!$page) {
            return null;
        }
        return self::update((int)$page['id'], $data);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM pages WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
