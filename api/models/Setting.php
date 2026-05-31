<?php
/**
 * WAVZ CMS — Setting Model
 */

declare(strict_types=1);

class Setting
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT id, `group`, `key`, value_en, value_ar, field_type, updated_at FROM settings WHERE 1=1';
        $params = [];

        if (!empty($filters['group'])) {
            $sql .= ' AND `group` = :group';
            $params[':group'] = $filters['group'];
        }

        $sql .= ' ORDER BY `group`, `key`';

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM settings WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByKey(string $key): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM settings WHERE `key` = :key');
        $stmt->execute([':key' => $key]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByGroup(string $group): array
    {
        $stmt = self::db()->prepare('SELECT * FROM settings WHERE `group` = :group ORDER BY `key`');
        $stmt->execute([':group' => $group]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO settings (`group`, `key`, value_en, value_ar, field_type) VALUES (:group, :key, :value_en, :value_ar, :field_type)'
        );
        $stmt->execute([
            ':group'      => $data['group'] ?? 'general',
            ':key'        => $data['key'],
            ':value_en'   => $data['value_en'] ?? null,
            ':value_ar'   => $data['value_ar'] ?? null,
            ':field_type' => $data['field_type'] ?? 'text',
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['group', 'key', 'value_en', 'value_ar', 'field_type'];
        foreach ($allowed as $field) {
            $col = $field === 'group' || $field === 'key' ? "`$field`" : $field;
            if (array_key_exists($field, $data)) {
                $fields[] = "$col = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE settings SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM settings WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Batch update settings by key.
     *
     * @param array $settings Array of ['key' => ..., 'value_en' => ..., 'value_ar' => ...]
     */
    public static function updateBatch(array $settings): array
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare(
                'UPDATE settings SET value_en = :value_en, value_ar = :value_ar WHERE `key` = :key'
            );

            foreach ($settings as $setting) {
                $stmt->execute([
                    ':key'      => $setting['key'],
                    ':value_en' => $setting['value_en'] ?? null,
                    ':value_ar' => $setting['value_ar'] ?? null,
                ]);
            }

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return self::getAll();
    }
}
