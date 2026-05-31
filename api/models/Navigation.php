<?php
/**
 * WAVZ CMS — Navigation Model
 */

declare(strict_types=1);

class Navigation
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT * FROM navigation WHERE 1=1';
        $params = [];

        if (!empty($filters['menu_group'])) {
            $sql .= ' AND menu_group = :menu_group';
            $params[':menu_group'] = $filters['menu_group'];
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
        $stmt = self::db()->prepare('SELECT * FROM navigation WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getByGroup(string $group): array
    {
        $stmt = self::db()->prepare(
            'SELECT * FROM navigation WHERE menu_group = :group ORDER BY sort_order ASC, id ASC'
        );
        $stmt->execute([':group' => $group]);
        $items = $stmt->fetchAll();

        // Build nested tree
        return self::buildTree($items);
    }

    /**
     * Build a parent-child tree from flat rows.
     */
    private static function buildTree(array $items, ?int $parentId = null): array
    {
        $tree = [];
        foreach ($items as $item) {
            if ((int)($item['parent_id'] ?? 0) === ($parentId ?? 0)
                || ($parentId === null && $item['parent_id'] === null)) {
                $children = self::buildTree($items, (int)$item['id']);
                if (!empty($children)) {
                    $item['children'] = $children;
                } else {
                    $item['children'] = [];
                }
                $tree[] = $item;
            }
        }
        return $tree;
    }

    public static function create(array $data): array
    {
        $stmt = self::db()->prepare(
            'INSERT INTO navigation (parent_id, label_en, label_ar, url, icon, target, is_visible, sort_order, menu_group)
             VALUES (:parent_id, :label_en, :label_ar, :url, :icon, :target, :is_visible, :sort_order, :menu_group)'
        );
        $stmt->execute([
            ':parent_id'  => $data['parent_id'] ?? null,
            ':label_en'   => $data['label_en'],
            ':label_ar'   => $data['label_ar'] ?? null,
            ':url'        => $data['url'],
            ':icon'       => $data['icon'] ?? null,
            ':target'     => $data['target'] ?? '_self',
            ':is_visible' => $data['is_visible'] ?? 1,
            ':sort_order' => $data['sort_order'] ?? 0,
            ':menu_group' => $data['menu_group'] ?? 'main',
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['parent_id', 'label_en', 'label_ar', 'url', 'icon', 'target', 'is_visible', 'sort_order', 'menu_group'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE navigation SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM navigation WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Reorder navigation items.
     *
     * @param array $items Array of ['id' => int, 'sort_order' => int, 'parent_id' => ?int]
     */
    public static function reorder(array $items): void
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE navigation SET sort_order = :sort_order, parent_id = :parent_id WHERE id = :id');

            foreach ($items as $item) {
                $stmt->execute([
                    ':id'         => $item['id'],
                    ':sort_order' => $item['sort_order'],
                    ':parent_id'  => $item['parent_id'] ?? null,
                ]);
            }

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }

    /**
     * Replace entire menu group structure.
     */
    public static function replaceGroup(string $group, array $items): array
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            // Delete existing items for this group
            $stmt = $db->prepare('DELETE FROM navigation WHERE menu_group = :group');
            $stmt->execute([':group' => $group]);

            // Insert new items
            $insertStmt = $db->prepare(
                'INSERT INTO navigation (parent_id, label_en, label_ar, url, icon, target, is_visible, sort_order, menu_group)
                 VALUES (:parent_id, :label_en, :label_ar, :url, :icon, :target, :is_visible, :sort_order, :menu_group)'
            );

            self::insertItems($insertStmt, $items, $group, null);

            $db->commit();
        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }

        return self::getByGroup($group);
    }

    /**
     * Recursively insert navigation items with parent relationships.
     */
    private static function insertItems(PDOStatement $stmt, array $items, string $group, ?int $parentId): void
    {
        foreach ($items as $index => $item) {
            $stmt->execute([
                ':parent_id'  => $parentId,
                ':label_en'   => $item['label_en'],
                ':label_ar'   => $item['label_ar'] ?? null,
                ':url'        => $item['url'],
                ':icon'       => $item['icon'] ?? null,
                ':target'     => $item['target'] ?? '_self',
                ':is_visible' => $item['is_visible'] ?? 1,
                ':sort_order' => $item['sort_order'] ?? $index,
                ':menu_group' => $group,
            ]);

            $newId = (int)self::db()->lastInsertId();

            if (!empty($item['children'])) {
                self::insertItems($stmt, $item['children'], $group, $newId);
            }
        }
    }
}
