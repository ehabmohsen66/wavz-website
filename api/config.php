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

// ---- Load Local Configuration Override if present ----
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

// ---- Database (Defaults or Env/Local overrides) ----
if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'wavz_cms');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'root');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

// ---- JWT ----
if (!defined('JWT_SECRET')) {
    $secret = getenv('JWT_SECRET');
    if (!$secret && file_exists(__DIR__ . '/.jwt_secret')) {
        $secret = trim((string)file_get_contents(__DIR__ . '/.jwt_secret'));
    }
    if (!$secret) {
        $secret = 'wavz_production_secure_secret_key_2026_default_fallback';
    }
    define('JWT_SECRET', $secret);
}
if (!defined('JWT_ALGO')) define('JWT_ALGO', 'HS256');
if (!defined('JWT_ACCESS_TTL')) define('JWT_ACCESS_TTL', 86400);       // 24 hours
if (!defined('JWT_REFRESH_TTL')) define('JWT_REFRESH_TTL', 604800);     // 7 days
if (!defined('JWT_ISSUER')) define('JWT_ISSUER', 'wavz-cms-api');

// ---- Uploads ----
if (!defined('UPLOAD_DIR')) define('UPLOAD_DIR', __DIR__ . '/uploads/');
if (!defined('UPLOAD_URL')) define('UPLOAD_URL', '/api/uploads/');
if (!defined('THUMBNAIL_DIR')) define('THUMBNAIL_DIR', __DIR__ . '/uploads/thumbnails/');
if (!defined('MAX_UPLOAD_SIZE')) define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10 MB
if (!defined('ALLOWED_MIME_TYPES')) define('ALLOWED_MIME_TYPES', [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
]);

// ---- CORS ----
if (!defined('CORS_ALLOWED_ORIGINS')) define('CORS_ALLOWED_ORIGINS', ['*']);
if (!defined('CORS_ALLOWED_METHODS')) define('CORS_ALLOWED_METHODS', 'GET, POST, PUT, DELETE, OPTIONS');
if (!defined('CORS_ALLOWED_HEADERS')) define('CORS_ALLOWED_HEADERS', 'Content-Type, Authorization, X-Requested-With');

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
