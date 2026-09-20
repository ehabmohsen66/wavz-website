<?php
/**
 * WAVZ CMS — Client Model (Logo Strip / Client Brands)
 */

declare(strict_types=1);

class Client
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT * FROM clients WHERE 1=1';
        $params = [];

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
        $stmt = self::db()->prepare('SELECT * FROM clients WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO clients (name, logo, website_url, is_visible, sort_order)
             VALUES (:name, :logo, :website_url, :is_visible, :sort_order)'
        );
        $stmt->execute([
            ':name'        => $data['name'],
            ':logo'        => $data['logo'] ?? null,
            ':website_url' => $data['website_url'] ?? null,
            ':is_visible'  => $data['is_visible'] ?? 1,
            ':sort_order'  => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['name', 'logo', 'website_url', 'is_visible', 'sort_order'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE clients SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM clients WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function reorder(array $items): void
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE clients SET sort_order = :sort_order WHERE id = :id');
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
        $stmt = self::db()->query('SELECT COUNT(*) FROM clients');
        return (int)$stmt->fetchColumn();
    }
}
