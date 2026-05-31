<?php
/**
 * WAVZ CMS — User Model
 */

declare(strict_types=1);

class User
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT id, name, email, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE 1=1';
        $params = [];

        if (!empty($filters['role'])) {
            $sql .= ' AND role = :role';
            $params[':role'] = $filters['role'];
        }

        if (isset($filters['is_active'])) {
            $sql .= ' AND is_active = :is_active';
            $params[':is_active'] = (int)$filters['is_active'];
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND (name LIKE :search OR email LIKE :search2)';
            $params[':search'] = '%' . $filters['search'] . '%';
            $params[':search2'] = '%' . $filters['search'] . '%';
        }

        $sql .= ' ORDER BY created_at DESC';

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare(
            'SELECT id, name, email, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByEmail(string $email): ?array
    {
        $stmt = self::db()->prepare(
            'SELECT id, name, email, password, role, avatar, is_active, last_login, created_at, updated_at FROM users WHERE email = :email'
        );
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO users (name, email, password, role, avatar, is_active) VALUES (:name, :email, :password, :role, :avatar, :is_active)'
        );
        $stmt->execute([
            ':name'      => $data['name'],
            ':email'     => $data['email'],
            ':password'  => password_hash($data['password'], PASSWORD_BCRYPT),
            ':role'      => $data['role'] ?? 'editor',
            ':avatar'    => $data['avatar'] ?? null,
            ':is_active' => $data['is_active'] ?? 1,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['name', 'email', 'role', 'avatar', 'is_active'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        // Handle password separately
        if (!empty($data['password'])) {
            $fields[] = 'password = :password';
            $params[':password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM users WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function updateLastLogin(int $id): void
    {
        $stmt = self::db()->prepare('UPDATE users SET last_login = NOW() WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    public static function count(): int
    {
        $stmt = self::db()->query('SELECT COUNT(*) FROM users');
        return (int)$stmt->fetchColumn();
    }
}
