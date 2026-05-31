<?php
/**
 * WAVZ CMS — Configuration
 * Update these values for your environment.
 */

// ---- Error Reporting ----
// Set to false in production
define('APP_DEBUG', true);

if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '0'); // Never display in API responses
    ini_set('log_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
}

// ---- Database ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'wavz_cms');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// ---- JWT ----
define('JWT_SECRET', 'CHANGE_THIS_TO_A_RANDOM_64_CHAR_STRING');
define('JWT_ALGO', 'HS256');
define('JWT_ACCESS_TTL', 86400);       // 24 hours
define('JWT_REFRESH_TTL', 604800);     // 7 days
define('JWT_ISSUER', 'wavz-cms-api');

// ---- Uploads ----
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', '/api/uploads/');
define('THUMBNAIL_DIR', __DIR__ . '/uploads/thumbnails/');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5 MB
define('ALLOWED_MIME_TYPES', [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
]);

// ---- CORS ----
define('CORS_ALLOWED_ORIGINS', ['*']);
define('CORS_ALLOWED_METHODS', 'GET, POST, PUT, DELETE, OPTIONS');
define('CORS_ALLOWED_HEADERS', 'Content-Type, Authorization, X-Requested-With');

// ---- PDO Connection ----
function getDB(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => APP_DEBUG ? 'Database connection failed: ' . $e->getMessage() : 'Internal server error',
            ]);
            exit;
        }
    }

    return $pdo;
}
