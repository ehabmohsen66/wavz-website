<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

try {
    $db = getDB();
    $sql = "UPDATE blog_posts SET image = CONCAT('/blog-images/', SUBSTRING_INDEX(image, '/', -1)) WHERE image LIKE '%wp-content/uploads/%'";
    $affected = $db->exec($sql);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'affected_rows' => $affected,
        'message' => "Successfully cleaned $affected blog post image paths to local /blog-images/"
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
