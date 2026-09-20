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

    public static function ensureTable(): void
    {
        try {
            self::db()->exec("
                CREATE TABLE IF NOT EXISTS blog_categories (
                  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                  name_en     VARCHAR(100) NOT NULL UNIQUE,
                  name_ar     VARCHAR(100) NOT NULL,
                  slug        VARCHAR(100) NOT NULL UNIQUE,
                  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
                  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  INDEX idx_slug (slug),
                  INDEX idx_sort (sort_order)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
            self::seedDefaultsIfEmpty();
        } catch (Throwable $e) {
            // Ignore table check errors
        }
    }

    private static function seedDefaultsIfEmpty(): void
    {
        try {
            $countStmt = self::db()->query('SELECT COUNT(*) FROM blog_categories');
            if ($countStmt && (int)$countStmt->fetchColumn() === 0) {
                $defaultCategories = [
                    ['name_en' => 'AI & Innovation', 'name_ar' => 'الذكاء الاصطناعي', 'slug' => 'ai-innovation', 'sort_order' => 1],
                    ['name_en' => 'Cybersecurity', 'name_ar' => 'الأمن الإلكتروني', 'slug' => 'cybersecurity', 'sort_order' => 2],
                    ['name_en' => 'SAP Services', 'name_ar' => 'خدمات SAP', 'slug' => 'sap-services', 'sort_order' => 3],
                    ['name_en' => 'Digital Transformation', 'name_ar' => 'التحول الرقمي', 'slug' => 'digital-transformation', 'sort_order' => 4],
                    ['name_en' => 'Managed Services', 'name_ar' => 'الخدمات المُدارة', 'slug' => 'managed-services', 'sort_order' => 5],
                    ['name_en' => 'Financial Services', 'name_ar' => 'الخدمات المالية', 'slug' => 'financial-services', 'sort_order' => 6],
                    ['name_en' => 'Cloud', 'name_ar' => 'السحابة الإلكترونية', 'slug' => 'cloud', 'sort_order' => 7],
                    ['name_en' => 'FinTech', 'name_ar' => 'التكنولوجيا المالية', 'slug' => 'fintech', 'sort_order' => 8],
                    ['name_en' => 'IT Testing', 'name_ar' => 'اختبار IT', 'slug' => 'it-testing', 'sort_order' => 9],
                ];
                $stmt = self::db()->prepare("
                    INSERT IGNORE INTO blog_categories (name_en, name_ar, slug, sort_order)
                    VALUES (:name_en, :name_ar, :slug, :sort_order)
                ");
                foreach ($defaultCategories as $cat) {
                    $stmt->execute($cat);
                }
            }
        } catch (Throwable $e) {
            // Ignore
        }
    }

    public static function getAll(): array
    {
        try {
            $sql = 'SELECT * FROM blog_categories ORDER BY sort_order ASC, name_en ASC';
            $stmt = self::db()->query($sql);
            $rows = $stmt->fetchAll();
            if (empty($rows)) {
                self::ensureTable();
                $stmt = self::db()->query($sql);
                $rows = $stmt->fetchAll();
            }
            return $rows ?: [];
        } catch (Throwable $e) {
            self::ensureTable();
            try {
                $sql = 'SELECT * FROM blog_categories ORDER BY sort_order ASC, name_en ASC';
                $stmt = self::db()->query($sql);
                return $stmt->fetchAll() ?: [];
            } catch (Throwable $e2) {
                return [];
            }
        }
    }

    public static function getById(int $id): ?array
    {
        self::ensureTable();
        $stmt = self::db()->prepare('SELECT * FROM blog_categories WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getBySlug(string $slug): ?array
    {
        self::ensureTable();
        $stmt = self::db()->prepare('SELECT * FROM blog_categories WHERE slug = :slug');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): array
    {
        self::ensureTable();
        $slug = $data['slug'] ?? '';
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name_en'] ?? ''), '-'));
        }

        $stmt = self::db()->prepare(
            'INSERT INTO blog_categories (name_en, name_ar, slug, sort_order)
             VALUES (:name_en, :name_ar, :slug, :sort_order)
             ON DUPLICATE KEY UPDATE name_ar = VALUES(name_ar)'
        );
        $stmt->execute([
            ':name_en'    => $data['name_en'],
            ':name_ar'    => $data['name_ar'] ?? $data['name_en'],
            ':slug'       => $slug,
            ':sort_order' => $data['sort_order'] ?? 0,
        ]);

        $id = (int)self::db()->lastInsertId();
        if ($id === 0) {
            $existing = self::getBySlug($slug);
            if ($existing) return $existing;
        }
        return self::getById($id) ?: ['name_en' => $data['name_en'], 'name_ar' => $data['name_ar'] ?? $data['name_en']];
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
