<?php
/**
 * WAVZ CMS — Blog Controller
 */

declare(strict_types=1);

class BlogController
{
    /**
     * GET /api/blog
     */
    public static function index(): void
    {
        $filters = $_GET;
        $blog = BlogPost::getAll($filters);
        Response::success($blog);
    }

    /**
     * GET /api/blog/{slug}
     */
    public static function showBySlug(string $slug): void
    {
        $post = BlogPost::getBySlug($slug);
        if (!$post) {
            Response::notFound('Blog post not found');
        }
        Response::success($post);
    }

    /**
     * POST /api/blog
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['title_en', 'blocks_en']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $input['author_id'] = $currentUser['id'];
            $post = BlogPost::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'blog_post', (int)$post['id'], [
                'title_en' => $post['title_en']
            ]);

            Response::created($post);
        } catch (Throwable $e) {
            Response::error('Failed to create blog post: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/blog/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $post = BlogPost::getById($id);
        if (!$post) {
            Response::notFound('Blog post not found');
        }

        try {
            $updated = BlogPost::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'blog_post', $id, [
                'title_en' => $updated['title_en']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update blog post: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/blog/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $post = BlogPost::getById($id);
        if (!$post) {
            Response::notFound('Blog post not found');
        }

        try {
            BlogPost::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'blog_post', $id, [
                'title_en' => $post['title_en']
            ]);

            Response::success(['message' => 'Blog post deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete blog post: ' . $e->getMessage());
        }
    }
}
