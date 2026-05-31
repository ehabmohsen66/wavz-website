<?php
/**
 * WAVZ CMS — ServiceBullet Model
 */

declare(strict_types=1);

class ServiceBullet
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getByServiceId(int $serviceId): array
    {
        $stmt = self::db()->prepare(
            'SELECT * FROM service_bullets WHERE service_id = :service_id ORDER BY sort_order ASC'
        );
        $stmt->execute([':service_id' => $serviceId]);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM service_bullets WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO service_bullets (service_id, text_en, text_ar, sort_order)
             VALUES (:service_id, :text_en, :text_ar, :sort_order)'
        );
        $stmt->execute([
            ':service_id' => $data['service_id'],
            ':text_en'    => $data['text_en'],
            ':text_ar'    => $data['text_ar'] ?? null,
            ':sort_order' => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['text_en', 'text_ar', 'sort_order'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE service_bullets SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM service_bullets WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function deleteByServiceId(int $serviceId): bool
    {
        $stmt = self::db()->prepare('DELETE FROM service_bullets WHERE service_id = :service_id');
        $stmt->execute([':service_id' => $serviceId]);
        return true;
    }
}
