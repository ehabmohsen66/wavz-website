<?php
/**
 * WAVZ CMS — BlogPost Model
 */

declare(strict_types=1);

class BlogPost
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT b.*, u.name AS author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= ' AND b.status = :status';
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['category'])) {
            $sql .= ' AND b.category_en = :category';
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND (b.title_en LIKE :search OR b.title_ar LIKE :search2 OR b.excerpt_en LIKE :search3 OR b.tags LIKE :search4)';
            $params[':search'] = '%' . $filters['search'] . '%';
            $params[':search2'] = '%' . $filters['search'] . '%';
            $params[':search3'] = '%' . $filters['search'] . '%';
            $params[':search4'] = '%' . $filters['search'] . '%';
        }

        $sql .= ' ORDER BY b.published_at DESC, b.created_at DESC';

        // Pagination
        $page = max(1, (int)($filters['page'] ?? 1));
        $perPage = min(100, max(1, (int)($filters['per_page'] ?? 20)));
        $offset = ($page - 1) * $perPage;

        // Count
        $countSql = 'SELECT COUNT(*) FROM blog_posts b WHERE 1=1';
        if (!empty($filters['status'])) {
            $countSql .= ' AND b.status = :status';
        }
        if (!empty($filters['category'])) {
            $countSql .= ' AND b.category_en = :category';
        }
        if (!empty($filters['search'])) {
            $countSql .= ' AND (b.title_en LIKE :search OR b.title_ar LIKE :search2 OR b.excerpt_en LIKE :search3 OR b.tags LIKE :search4)';
        }
        $countStmt = self::db()->prepare($countSql);
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $sql .= " LIMIT $perPage OFFSET $offset";
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll();

        return ['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage];
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare(
            'SELECT b.*, u.name AS author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.id = :id'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getBySlug(string $slug): ?array
    {
        $stmt = self::db()->prepare(
            'SELECT b.*, u.name AS author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.slug = :slug'
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getPublished(int $limit = 20, int $offset = 0): array
    {
        $stmt = self::db()->prepare(
            'SELECT b.*, u.name AS author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id
             WHERE b.status = :status AND b.published_at <= CURDATE()
             ORDER BY b.published_at DESC LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':status', 'published', PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getByCategory(string $category): array
    {
        $stmt = self::db()->prepare(
            'SELECT b.*, u.name AS author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id
             WHERE b.category_en = :category AND b.status = :status
             ORDER BY b.published_at DESC'
        );
        $stmt->execute([':category' => $category, ':status' => 'published']);
        return $stmt->fetchAll();
    }

    public static function ensureSeoColumns(): void
    {
        try {
            $cols = [
                'meta_title_en'       => 'VARCHAR(255) DEFAULT NULL',
                'meta_title_ar'       => 'VARCHAR(255) DEFAULT NULL',
                'meta_description_en' => 'TEXT DEFAULT NULL',
                'meta_description_ar' => 'TEXT DEFAULT NULL',
                'meta_keywords'       => 'VARCHAR(500) DEFAULT NULL',
            ];
            foreach ($cols as $col => $def) {
                try {
                    self::db()->exec("ALTER TABLE blog_posts ADD COLUMN $col $def");
                } catch (Throwable $e) {
                    // Column already exists or error
                }
            }
        } catch (Throwable $e) {}
    }

    public static function create(array $data): array
    {
        self::ensureSeoColumns();

        // Generate slug from title
        $slug = Validator::generateSlug($data['title_en']);
        $slug = Validator::uniqueSlug($slug, 'blog_posts');

        $stmt = self::db()->prepare(
            'INSERT INTO blog_posts (slug, title_en, title_ar, excerpt_en, excerpt_ar, blocks_en, blocks_ar, image, category_en, category_ar, tags, read_time, accent_color, published_at, status, author_id, meta_title_en, meta_title_ar, meta_description_en, meta_description_ar, meta_keywords)
             VALUES (:slug, :title_en, :title_ar, :excerpt_en, :excerpt_ar, :blocks_en, :blocks_ar, :image, :category_en, :category_ar, :tags, :read_time, :accent_color, :published_at, :status, :author_id, :meta_title_en, :meta_title_ar, :meta_description_en, :meta_description_ar, :meta_keywords)'
        );
        $stmt->execute([
            ':slug'                => $data['slug'] ?? $slug,
            ':title_en'            => $data['title_en'],
            ':title_ar'            => $data['title_ar'] ?? null,
            ':excerpt_en'          => $data['excerpt_en'] ?? null,
            ':excerpt_ar'          => $data['excerpt_ar'] ?? null,
            ':blocks_en'           => is_array($data['blocks_en'] ?? null) ? json_encode($data['blocks_en']) : ($data['blocks_en'] ?? null),
            ':blocks_ar'           => is_array($data['blocks_ar'] ?? null) ? json_encode($data['blocks_ar']) : ($data['blocks_ar'] ?? null),
            ':image'               => $data['image'] ?? null,
            ':category_en'         => $data['category_en'] ?? null,
            ':category_ar'         => $data['category_ar'] ?? null,
            ':tags'                => $data['tags'] ?? null,
            ':read_time'           => $data['read_time'] ?? 5,
            ':accent_color'        => $data['accent_color'] ?? '#1173BD',
            ':published_at'        => $data['published_at'] ?? null,
            ':status'              => $data['status'] ?? 'draft',
            ':author_id'           => $data['author_id'] ?? null,
            ':meta_title_en'       => $data['meta_title_en'] ?? ($data['title_en'] ?? null),
            ':meta_title_ar'       => $data['meta_title_ar'] ?? ($data['title_ar'] ?? null),
            ':meta_description_en' => $data['meta_description_en'] ?? ($data['excerpt_en'] ?? null),
            ':meta_description_ar' => $data['meta_description_ar'] ?? ($data['excerpt_ar'] ?? null),
            ':meta_keywords'       => $data['meta_keywords'] ?? ($data['tags'] ?? null),
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        self::ensureSeoColumns();
        $fields = [];
        $params = [':id' => $id];

        $allowed = [
            'slug', 'title_en', 'title_ar', 'excerpt_en', 'excerpt_ar',
            'blocks_en', 'blocks_ar', 'image', 'category_en', 'category_ar',
            'tags', 'read_time', 'accent_color', 'published_at', 'status',
            'meta_title_en', 'meta_title_ar', 'meta_description_en', 'meta_description_ar', 'meta_keywords',
        ];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $value = $data[$field];
                // Encode block JSON arrays
                if (in_array($field, ['blocks_en', 'blocks_ar']) && is_array($value)) {
                    $value = json_encode($value);
                }
                $fields[] = "$field = :$field";
                $params[":$field"] = $value;
            }
        }

        // Handle slug uniqueness
        if (!empty($data['slug'])) {
            $data['slug'] = Validator::uniqueSlug($data['slug'], 'blog_posts', $id);
            $params[':slug'] = $data['slug'];
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE blog_posts SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM blog_posts WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function count(?string $status = null): int
    {
        if ($status) {
            $stmt = self::db()->prepare('SELECT COUNT(*) FROM blog_posts WHERE status = :status');
            $stmt->execute([':status' => $status]);
        } else {
            $stmt = self::db()->query('SELECT COUNT(*) FROM blog_posts');
        }
        return (int)$stmt->fetchColumn();
    }
}
