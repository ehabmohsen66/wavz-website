<?php
/**
 * WAVZ CMS — TeamMember Model
 */

declare(strict_types=1);

class TeamMember
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT * FROM team_members WHERE 1=1';
        $params = [];

        if (!empty($filters['type'])) {
            $sql .= ' AND type = :type';
            $params[':type'] = $filters['type'];
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
        $stmt = self::db()->prepare('SELECT * FROM team_members WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByType(string $type): array
    {
        $stmt = self::db()->prepare(
            'SELECT * FROM team_members WHERE type = :type AND is_visible = 1 ORDER BY sort_order ASC'
        );
        $stmt->execute([':type' => $type]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO team_members (type, name_en, name_ar, title_en, title_ar, bio_en, bio_ar, photo, linkedin_url, email, is_visible, sort_order)
             VALUES (:type, :name_en, :name_ar, :title_en, :title_ar, :bio_en, :bio_ar, :photo, :linkedin_url, :email, :is_visible, :sort_order)'
        );
        $stmt->execute([
            ':type'         => $data['type'] ?? 'executive',
            ':name_en'      => $data['name_en'],
            ':name_ar'      => $data['name_ar'] ?? null,
            ':title_en'     => $data['title_en'],
            ':title_ar'     => $data['title_ar'] ?? null,
            ':bio_en'       => $data['bio_en'] ?? null,
            ':bio_ar'       => $data['bio_ar'] ?? null,
            ':photo'        => $data['photo'] ?? null,
            ':linkedin_url' => $data['linkedin_url'] ?? null,
            ':email'        => $data['email'] ?? null,
            ':is_visible'   => $data['is_visible'] ?? 1,
            ':sort_order'   => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = [
            'type', 'name_en', 'name_ar', 'title_en', 'title_ar',
            'bio_en', 'bio_ar', 'photo', 'linkedin_url', 'email',
            'is_visible', 'sort_order',
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

        $sql = 'UPDATE team_members SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM team_members WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Reorder team members.
     *
     * @param array $items Array of ['id' => int, 'sort_order' => int]
     */
    public static function reorder(array $items): void
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE team_members SET sort_order = :sort_order WHERE id = :id');

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
        $stmt = self::db()->query('SELECT COUNT(*) FROM team_members');
        return (int)$stmt->fetchColumn();
    }
}
