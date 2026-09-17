<?php
/**
 * WAVZ CMS — API Entry Point & Router
 */

declare(strict_types=1);

// ---- Bootstrap ----
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers/Response.php';
require_once __DIR__ . '/helpers/JWT.php';
require_once __DIR__ . '/helpers/ImageProcessor.php';
require_once __DIR__ . '/helpers/Mailer.php';
require_once __DIR__ . '/middleware/Auth.php';
require_once __DIR__ . '/middleware/Validator.php';

// Models
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Setting.php';
require_once __DIR__ . '/models/Media.php';
require_once __DIR__ . '/models/Page.php';
require_once __DIR__ . '/models/Navigation.php';
require_once __DIR__ . '/models/TeamMember.php';
require_once __DIR__ . '/models/Partner.php';
require_once __DIR__ . '/models/Service.php';
require_once __DIR__ . '/models/ServiceStat.php';
require_once __DIR__ . '/models/ServicePipeline.php';
require_once __DIR__ . '/models/ServiceBullet.php';
require_once __DIR__ . '/models/NewsArticle.php';
require_once __DIR__ . '/models/BlogPost.php';
require_once __DIR__ . '/models/TimelineEvent.php';
require_once __DIR__ . '/models/Testimonial.php';
require_once __DIR__ . '/models/ActivityLog.php';
require_once __DIR__ . '/models/ContactSubmission.php';

// Controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/SettingsController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/PagesController.php';
require_once __DIR__ . '/controllers/NavigationController.php';
require_once __DIR__ . '/controllers/TeamController.php';
require_once __DIR__ . '/controllers/PartnersController.php';
require_once __DIR__ . '/controllers/ServicesController.php';
require_once __DIR__ . '/controllers/NewsController.php';
require_once __DIR__ . '/controllers/BlogController.php';
require_once __DIR__ . '/controllers/TimelineController.php';
require_once __DIR__ . '/controllers/TestimonialsController.php';
require_once __DIR__ . '/controllers/DashboardController.php';
require_once __DIR__ . '/controllers/ActivityController.php';
require_once __DIR__ . '/controllers/UsersController.php';
require_once __DIR__ . '/controllers/ContactsController.php';
require_once __DIR__ . '/controllers/BackupController.php';
require_once __DIR__ . '/controllers/SitemapController.php';

// ---- CORS ----
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: ' . CORS_ALLOWED_METHODS);
header('Access-Control-Allow-Headers: ' . CORS_ALLOWED_HEADERS);
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---- Parse URI ----
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestUri = parse_url($requestUri, PHP_URL_PATH);
$requestUri = rtrim($requestUri, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Remove /api prefix if present
$basePath = '/api';
if (str_starts_with($requestUri, $basePath)) {
    $requestUri = substr($requestUri, strlen($basePath));
}

// Ensure leading slash
if ($requestUri === '' || $requestUri === false) {
    $requestUri = '/';
}

// ---- Request Body ----
$input = [];
if (in_array($method, ['POST', 'PUT'])) {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (str_contains($contentType, 'application/json')) {
        $rawBody = file_get_contents('php://input');
        $input = json_decode($rawBody, true) ?? [];
    } elseif (str_contains($contentType, 'multipart/form-data')) {
        $input = $_POST;
    }
}

// ---- Router ----
try {
    // Initialize DB in models
    $db = getDB();

    // Auth routes (public)
    if ($requestUri === '/auth/login' && $method === 'POST') {
        AuthController::login($input);
        exit;
    }

    if ($requestUri === '/auth/refresh' && $method === 'POST') {
        AuthController::refresh($input);
        exit;
    }

    if ($requestUri === '/auth/me' && $method === 'GET') {
        AuthController::me();
        exit;
    }

    // Public SEO & Feed routes
    if ($requestUri === '/sitemap.xml' && $method === 'GET') {
        SitemapController::sitemap();
        exit;
    }

    if ($requestUri === '/robots.txt' && $method === 'GET') {
        SitemapController::robots();
        exit;
    }

    // Public Contact Form Submission
    if ($requestUri === '/contacts' && $method === 'POST') {
        ContactsController::submit($input);
        exit;
    }

    // ---- Protected Routes ----

    // Settings
    if ($requestUri === '/settings' && $method === 'GET') {
        SettingsController::index();
        exit;
    }
    if ($requestUri === '/settings' && $method === 'PUT') {
        SettingsController::update($input);
        exit;
    }

    // Media
    if ($requestUri === '/media' && $method === 'GET') {
        MediaController::index();
        exit;
    }
    if ($requestUri === '/media' && $method === 'POST') {
        MediaController::upload();
        exit;
    }
    if (preg_match('#^/media/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        MediaController::delete((int)$m[1]);
        exit;
    }

    // Pages
    if (preg_match('#^/pages/([a-z0-9\-]+)$#', $requestUri, $m) && $method === 'GET') {
        PagesController::show($m[1]);
        exit;
    }
    if (preg_match('#^/pages/([a-z0-9\-]+)$#', $requestUri, $m) && $method === 'PUT') {
        PagesController::update($m[1], $input);
        exit;
    }

    // Navigation
    if ($requestUri === '/navigation' && $method === 'GET') {
        NavigationController::index();
        exit;
    }
    if ($requestUri === '/navigation' && $method === 'PUT') {
        NavigationController::update($input);
        exit;
    }

    // Team
    if ($requestUri === '/team/reorder' && $method === 'PUT') {
        TeamController::reorder($input);
        exit;
    }
    if ($requestUri === '/team' && $method === 'GET') {
        TeamController::index();
        exit;
    }
    if ($requestUri === '/team' && $method === 'POST') {
        TeamController::create($input);
        exit;
    }
    if (preg_match('#^/team/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        TeamController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/team/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        TeamController::delete((int)$m[1]);
        exit;
    }

    // Partners
    if ($requestUri === '/partners' && $method === 'GET') {
        PartnersController::index();
        exit;
    }
    if ($requestUri === '/partners' && $method === 'POST') {
        PartnersController::create($input);
        exit;
    }
    if (preg_match('#^/partners/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        PartnersController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/partners/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        PartnersController::delete((int)$m[1]);
        exit;
    }

    // Services
    if ($requestUri === '/services' && $method === 'POST') {
        ServicesController::create($input);
        exit;
    }
    if (preg_match('#^/services/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        ServicesController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/services/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        ServicesController::delete((int)$m[1]);
        exit;
    }
    if (preg_match('#^/services/([a-z0-9\-]+)$#', $requestUri, $m) && $method === 'GET') {
        ServicesController::getByPage($m[1]);
        exit;
    }

    // News
    if ($requestUri === '/news' && $method === 'GET') {
        NewsController::index();
        exit;
    }
    if ($requestUri === '/news' && $method === 'POST') {
        NewsController::create($input);
        exit;
    }
    if (preg_match('#^/news/(\d+)$#', $requestUri, $m) && $method === 'GET') {
        NewsController::show((int)$m[1]);
        exit;
    }
    if (preg_match('#^/news/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        NewsController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/news/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        NewsController::delete((int)$m[1]);
        exit;
    }

    // Blog
    if ($requestUri === '/blog' && $method === 'GET') {
        BlogController::index();
        exit;
    }
    if ($requestUri === '/blog' && $method === 'POST') {
        BlogController::create($input);
        exit;
    }
    if (preg_match('#^/blog/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        BlogController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/blog/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        BlogController::delete((int)$m[1]);
        exit;
    }
    if (preg_match('#^/blog/([a-z0-9\-]+)$#', $requestUri, $m) && $method === 'GET') {
        BlogController::showBySlug($m[1]);
        exit;
    }

    // Timeline
    if ($requestUri === '/timeline' && $method === 'GET') {
        TimelineController::index();
        exit;
    }
    if ($requestUri === '/timeline' && $method === 'POST') {
        TimelineController::create($input);
        exit;
    }
    if (preg_match('#^/timeline/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        TimelineController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/timeline/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        TimelineController::delete((int)$m[1]);
        exit;
    }

    // Testimonials
    if ($requestUri === '/testimonials' && $method === 'GET') {
        TestimonialsController::index();
        exit;
    }
    if ($requestUri === '/testimonials' && $method === 'POST') {
        TestimonialsController::create($input);
        exit;
    }
    if (preg_match('#^/testimonials/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        TestimonialsController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/testimonials/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        TestimonialsController::delete((int)$m[1]);
        exit;
    }

    // Dashboard
    if ($requestUri === '/dashboard/stats' && $method === 'GET') {
        DashboardController::stats();
        exit;
    }

    // Activity
    if ($requestUri === '/activity' && $method === 'GET') {
        ActivityController::index();
        exit;
    }

    // Users
    if ($requestUri === '/users' && $method === 'GET') {
        UsersController::index();
        exit;
    }
    if ($requestUri === '/users' && $method === 'POST') {
        UsersController::create($input);
        exit;
    }
    if (preg_match('#^/users/(\d+)$#', $requestUri, $m) && $method === 'PUT') {
        UsersController::update((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/users/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        UsersController::delete((int)$m[1]);
        exit;
    }

    // Contacts & Inquiries (Protected)
    if ($requestUri === '/contacts/unread-count' && $method === 'GET') {
        ContactsController::unreadCount();
        exit;
    }
    if ($requestUri === '/contacts/export' && $method === 'GET') {
        ContactsController::export();
        exit;
    }
    if ($requestUri === '/contacts/test-email' && $method === 'POST') {
        ContactsController::testEmail($input);
        exit;
    }
    if ($requestUri === '/contacts' && $method === 'GET') {
        ContactsController::index();
        exit;
    }
    if (preg_match('#^/contacts/(\d+)$#', $requestUri, $m) && $method === 'GET') {
        ContactsController::show((int)$m[1]);
        exit;
    }
    if (preg_match('#^/contacts/(\d+)/status$#', $requestUri, $m) && $method === 'PUT') {
        ContactsController::updateStatus((int)$m[1], $input);
        exit;
    }
    if (preg_match('#^/contacts/(\d+)$#', $requestUri, $m) && $method === 'DELETE') {
        ContactsController::delete((int)$m[1]);
        exit;
    }

    // Database Backup (Admin only)
    if ($requestUri === '/backup' && $method === 'GET') {
        BackupController::download();
        exit;
    }

    // ---- 404 ----
    Response::notFound('Endpoint not found');

} catch (Throwable $e) {
    $message = APP_DEBUG ? $e->getMessage() : 'Internal server error';
    Response::error($message, 500);
}
