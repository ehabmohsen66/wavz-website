<?php
/**
 * WAVZ CMS — BlogCategory Model
 */

declare(strict_types=1);

class BlogCategory
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(): array
    {
        $sql = 'SELECT * FROM blog_categories ORDER BY sort_order ASC, name_en ASC';
        $stmt = self::db()->query($sql);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM blog_categories WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getBySlug(string $slug): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM blog_categories WHERE slug = :slug');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $slug = $data['slug'] ?? '';
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name_en'] ?? ''), '-'));
        }

        $stmt = self::db()->prepare(
            'INSERT INTO blog_categories (name_en, name_ar, slug, sort_order)
             VALUES (:name_en, :name_ar, :slug, :sort_order)'
        );
        $stmt->execute([
            ':name_en'    => $data['name_en'],
            ':name_ar'    => $data['name_ar'] ?? $data['name_en'],
            ':slug'       => $slug,
            ':sort_order' => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        if (isset($data['name_en'])) {
            $fields[] = 'name_en = :name_en';
            $params[':name_en'] = $data['name_en'];
        }
        if (isset($data['name_ar'])) {
            $fields[] = 'name_ar = :name_ar';
            $params[':name_ar'] = $data['name_ar'];
        }
        if (isset($data['slug'])) {
            $fields[] = 'slug = :slug';
            $params[':slug'] = $data['slug'];
        }
        if (isset($data['sort_order'])) {
            $fields[] = 'sort_order = :sort_order';
            $params[':sort_order'] = (int)$data['sort_order'];
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE blog_categories SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM blog_categories WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }
}
