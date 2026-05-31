<?php
/**
 * WAVZ CMS — Pages Controller
 */

declare(strict_types=1);

class PagesController
{
    /**
     * GET /api/pages/{slug}
     */
    public static function show(string $slug): void
    {
        $page = Page::getBySlug($slug);
        if (!$page) {
            // Check if page should be auto-created for routing purposes
            // Let's just return 404
            Response::notFound("Page '$slug' not found");
        }

        Response::success($page);
    }

    /**
     * PUT /api/pages/{slug}
     */
    public static function update(string $slug, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $page = Page::getBySlug($slug);
        if (!$page) {
            // Auto-create on first save
            $input['slug'] = $slug;
            $input['updated_by'] = $currentUser['id'];
            $input['status'] = $input['status'] ?? 'published';
            try {
                $page = Page::create($input);
                ActivityLog::log((int)$currentUser['id'], 'create', 'page', (int)$page['id'], [
                    'slug' => $slug,
                    'title_en' => $input['title_en'] ?? ''
                ]);
                Response::success($page);
            } catch (Throwable $e) {
                Response::error('Failed to create page: ' . $e->getMessage());
            }
        }

        $input['updated_by'] = $currentUser['id'];
        $updatedPage = Page::update((int)$page['id'], $input);

        // Log activity
        ActivityLog::log((int)$currentUser['id'], 'update', 'page', (int)$page['id'], [
            'slug' => $slug,
            'title_en' => $updatedPage['title_en'] ?? ''
        ]);

        Response::success($updatedPage);
    }
}
