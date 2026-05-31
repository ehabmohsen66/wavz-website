<?php
/**
 * WAVZ CMS — News Controller
 */

declare(strict_types=1);

class NewsController
{
    /**
     * GET /api/news
     */
    public static function index(): void
    {
        $filters = $_GET;
        $news = NewsArticle::getAll($filters);
        Response::success($news);
    }

    /**
     * GET /api/news/{id}
     */
    public static function show(int $id): void
    {
        $article = NewsArticle::getById($id);
        if (!$article) {
            Response::notFound('News article not found');
        }
        Response::success($article);
    }

    /**
     * POST /api/news
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['title_en', 'content_en']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $input['author_id'] = $currentUser['id'];
            $article = NewsArticle::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'news_article', (int)$article['id'], [
                'title_en' => $article['title_en']
            ]);

            Response::created($article);
        } catch (Throwable $e) {
            Response::error('Failed to create news article: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/news/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $article = NewsArticle::getById($id);
        if (!$article) {
            Response::notFound('News article not found');
        }

        try {
            $updated = NewsArticle::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'news_article', $id, [
                'title_en' => $updated['title_en']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update news article: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/news/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $article = NewsArticle::getById($id);
        if (!$article) {
            Response::notFound('News article not found');
        }

        try {
            NewsArticle::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'news_article', $id, [
                'title_en' => $article['title_en']
            ]);

            Response::success(['message' => 'News article deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete news article: ' . $e->getMessage());
        }
    }
}
