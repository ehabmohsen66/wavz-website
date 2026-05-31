<?php
/**
 * WAVZ CMS — TimelineEvent Model
 */

declare(strict_types=1);

class TimelineEvent
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT * FROM timeline_events WHERE 1=1';
        $params = [];

        $sql .= ' ORDER BY sort_order ASC, year DESC';

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM timeline_events WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO timeline_events (year, title_en, title_ar, items_en, items_ar, icon, color_scheme, sort_order)
             VALUES (:year, :title_en, :title_ar, :items_en, :items_ar, :icon, :color_scheme, :sort_order)'
        );
        $stmt->execute([
            ':year'         => $data['year'],
            ':title_en'     => $data['title_en'],
            ':title_ar'     => $data['title_ar'] ?? null,
            ':items_en'     => is_array($data['items_en'] ?? null) ? json_encode($data['items_en']) : ($data['items_en'] ?? null),
            ':items_ar'     => is_array($data['items_ar'] ?? null) ? json_encode($data['items_ar']) : ($data['items_ar'] ?? null),
            ':icon'         => $data['icon'] ?? 'Package',
            ':color_scheme' => $data['color_scheme'] ?? 'blue',
            ':sort_order'   => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['year', 'title_en', 'title_ar', 'items_en', 'items_ar', 'icon', 'color_scheme', 'sort_order'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $value = $data[$field];
                if (in_array($field, ['items_en', 'items_ar']) && is_array($value)) {
                    $value = json_encode($value);
                }
                $fields[] = "$field = :$field";
                $params[":$field"] = $value;
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE timeline_events SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM timeline_events WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function reorder(array $items): void
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE timeline_events SET sort_order = :sort_order WHERE id = :id');
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
        $stmt = self::db()->query('SELECT COUNT(*) FROM timeline_events');
        return (int)$stmt->fetchColumn();
    }
}
