<?php
/**
 * WAVZ CMS — Partner Model
 */

declare(strict_types=1);

class Partner
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT * FROM partners WHERE 1=1';
        $params = [];

        if (!empty($filters['category'])) {
            $sql .= ' AND category = :category';
            $params[':category'] = $filters['category'];
        }

        if (isset($filters['is_visible'])) {
            $sql .= ' AND is_visible = :is_visible';
            $params[':is_visible'] = (int)$filters['is_visible'];
        }

        $sql .= ' ORDER BY sort_order ASC, id ASC';

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM partners WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByCategory(string $category): array
    {
        $stmt = self::db()->prepare(
            'SELECT * FROM partners WHERE category = :category AND is_visible = 1 ORDER BY sort_order ASC'
        );
        $stmt->execute([':category' => $category]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO partners (name, logo, description_en, description_ar, website_url, category, is_visible, sort_order)
             VALUES (:name, :logo, :description_en, :description_ar, :website_url, :category, :is_visible, :sort_order)'
        );
        $stmt->execute([
            ':name'           => $data['name'],
            ':logo'           => $data['logo'] ?? null,
            ':description_en' => $data['description_en'] ?? null,
            ':description_ar' => $data['description_ar'] ?? null,
            ':website_url'    => $data['website_url'] ?? null,
            ':category'       => $data['category'] ?? 'technology',
            ':is_visible'     => $data['is_visible'] ?? 1,
            ':sort_order'     => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['name', 'logo', 'description_en', 'description_ar', 'website_url', 'category', 'is_visible', 'sort_order'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE partners SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM partners WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function reorder(array $items): void
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE partners SET sort_order = :sort_order WHERE id = :id');
            foreach ($items as $item) {
                $stmt->execute([
                    ':id'         => $item['id'],
                    ':sort_order' => $item['sort_order'],
                ]);
            }
            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function count(): int
    {
        $stmt = self::db()->query('SELECT COUNT(*) FROM partners');
        return (int)$stmt->fetchColumn();
    }
}
