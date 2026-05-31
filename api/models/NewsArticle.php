<?php
/**
 * WAVZ CMS — NewsArticle Model
 */

declare(strict_types=1);

class NewsArticle
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT n.*, u.name AS author_name FROM news_articles n LEFT JOIN users u ON n.author_id = u.id WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= ' AND n.status = :status';
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['category'])) {
            $sql .= ' AND n.category_en = :category';
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND (n.title_en LIKE :search OR n.title_ar LIKE :search2 OR n.excerpt_en LIKE :search3)';
            $params[':search'] = '%' . $filters['search'] . '%';
            $params[':search2'] = '%' . $filters['search'] . '%';
            $params[':search3'] = '%' . $filters['search'] . '%';
        }

        $sql .= ' ORDER BY n.published_at DESC, n.created_at DESC';

        // Pagination
        $page = max(1, (int)($filters['page'] ?? 1));
        $perPage = min(100, max(1, (int)($filters['per_page'] ?? 20)));
        $offset = ($page - 1) * $perPage;

        // Count
        $countSql = 'SELECT COUNT(*) FROM news_articles n WHERE 1=1';
        if (!empty($filters['status'])) {
            $countSql .= ' AND n.status = :status';
        }
        if (!empty($filters['category'])) {
            $countSql .= ' AND n.category_en = :category';
        }
        if (!empty($filters['search'])) {
            $countSql .= ' AND (n.title_en LIKE :search OR n.title_ar LIKE :search2 OR n.excerpt_en LIKE :search3)';
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
            'SELECT n.*, u.name AS author_name FROM news_articles n LEFT JOIN users u ON n.author_id = u.id WHERE n.id = :id'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getBySlug(string $slug): ?array
    {
        $stmt = self::db()->prepare(
            'SELECT n.*, u.name AS author_name FROM news_articles n LEFT JOIN users u ON n.author_id = u.id WHERE n.slug = :slug'
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function getPublished(int $limit = 20, int $offset = 0): array
    {
        $stmt = self::db()->prepare(
            'SELECT n.*, u.name AS author_name FROM news_articles n LEFT JOIN users u ON n.author_id = u.id
             WHERE n.status = :status AND n.published_at <= CURDATE()
             ORDER BY n.published_at DESC LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':status', 'published', PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function create(array $data): array
    {
        // Generate slug from title
        $slug = Validator::generateSlug($data['title_en']);
        $slug = Validator::uniqueSlug($slug, 'news_articles');

        $stmt = self::db()->prepare(
            'INSERT INTO news_articles (title_en, title_ar, slug, excerpt_en, excerpt_ar, content_en, content_ar, image, category_en, category_ar, source_en, source_ar, source_url, published_at, status, author_id)
             VALUES (:title_en, :title_ar, :slug, :excerpt_en, :excerpt_ar, :content_en, :content_ar, :image, :category_en, :category_ar, :source_en, :source_ar, :source_url, :published_at, :status, :author_id)'
        );
        $stmt->execute([
            ':title_en'     => $data['title_en'],
            ':title_ar'     => $data['title_ar'] ?? null,
            ':slug'         => $data['slug'] ?? $slug,
            ':excerpt_en'   => $data['excerpt_en'] ?? null,
            ':excerpt_ar'   => $data['excerpt_ar'] ?? null,
            ':content_en'   => $data['content_en'] ?? null,
            ':content_ar'   => $data['content_ar'] ?? null,
            ':image'        => $data['image'] ?? null,
            ':category_en'  => $data['category_en'] ?? null,
            ':category_ar'  => $data['category_ar'] ?? null,
            ':source_en'    => $data['source_en'] ?? null,
            ':source_ar'    => $data['source_ar'] ?? null,
            ':source_url'   => $data['source_url'] ?? null,
            ':published_at' => $data['published_at'] ?? null,
            ':status'       => $data['status'] ?? 'draft',
            ':author_id'    => $data['author_id'] ?? null,
        ]);

        $id = (int)self::db()->lastInsertId();
        return self::getById($id);
    }

    public static function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = [
            'title_en', 'title_ar', 'slug', 'excerpt_en', 'excerpt_ar',
            'content_en', 'content_ar', 'image', 'category_en', 'category_ar',
            'source_en', 'source_ar', 'source_url', 'published_at', 'status',
        ];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        // Handle slug uniqueness if provided
        if (!empty($data['slug'])) {
            $data['slug'] = Validator::uniqueSlug($data['slug'], 'news_articles', $id);
            $fields = array_filter($fields, fn($f) => !str_starts_with($f, 'slug'));
            $fields[] = 'slug = :slug';
            $params[':slug'] = $data['slug'];
        }

        if (empty($fields)) {
            return self::getById($id);
        }

        $sql = 'UPDATE news_articles SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);

        return self::getById($id);
    }

    public static function delete(int $id): bool
    {
        $stmt = self::db()->prepare('DELETE FROM news_articles WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function count(?string $status = null): int
    {
        if ($status) {
            $stmt = self::db()->prepare('SELECT COUNT(*) FROM news_articles WHERE status = :status');
            $stmt->execute([':status' => $status]);
        } else {
            $stmt = self::db()->query('SELECT COUNT(*) FROM news_articles');
        }
        return (int)$stmt->fetchColumn();
    }
}
