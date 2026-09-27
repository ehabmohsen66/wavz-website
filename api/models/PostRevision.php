<?php
declare(strict_types=1);

class PostRevision
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function create(int $postId, array $post, ?int $userId = null): bool
    {
        try {
            $stmt = self::db()->prepare(
                "INSERT INTO post_revisions (post_id, title, content, seo_title, seo_description, created_by) 
                 VALUES (:p, :t, :c, :st, :sd, :u)"
            );
            return $stmt->execute([
                ":p"  => $postId,
                ":t"  => $post["title_en"] ?? '',
                ":c"  => is_array($post["blocks_en"] ?? null) ? json_encode($post["blocks_en"]) : ($post["blocks_en"] ?? ''),
                ":st" => $post["meta_title_en"] ?? '',
                ":sd" => $post["meta_description_en"] ?? '',
                ":u"  => $userId
            ]);
        } catch (Throwable $e) {
            return false;
        }
    }

    public static function list(int $postId): array
    {
        try {
            $s = self::db()->prepare("SELECT * FROM post_revisions WHERE post_id = :id ORDER BY id DESC");
            $s->execute([':id' => $postId]);
            return $s->fetchAll();
        } catch (Throwable $e) {
            return [];
        }
    }
}
