<?php
/**
 * WAVZ CMS — Blog Categories Controller
 */

declare(strict_types=1);

class BlogCategoriesController
{
    /**
     * GET /api/blog/categories
     */
    public static function index(): void
    {
        $categories = BlogCategory::getAll();
        Response::success($categories);
    }

    /**
     * POST /api/blog/categories
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['name_en']);
        if (!empty($errors)) {
            Response::validationError('Missing required field: name_en', $errors);
        }

        try {
            $cat = BlogCategory::create($input);
            ActivityLog::log((int)$currentUser['id'], 'create', 'blog_category', (int)$cat['id'], [
                'name_en' => $cat['name_en']
            ]);
            Response::created($cat);
        } catch (Throwable $e) {
            Response::error('Failed to create category: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/blog/categories/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $existing = BlogCategory::getById($id);
        if (!$existing) {
            Response::notFound('Category not found');
        }

        try {
            $updated = BlogCategory::update($id, $input);
            ActivityLog::log((int)$currentUser['id'], 'update', 'blog_category', $id, [
                'name_en' => $updated['name_en'] ?? $existing['name_en']
            ]);
            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update category: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/blog/categories/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $existing = BlogCategory::getById($id);
        if (!$existing) {
            Response::notFound('Category not found');
        }

        try {
            BlogCategory::delete($id);
            ActivityLog::log((int)$currentUser['id'], 'delete', 'blog_category', $id, [
                'name_en' => $existing['name_en']
            ]);
            Response::success(['message' => 'Category deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete category: ' . $e->getMessage());
        }
    }
}
