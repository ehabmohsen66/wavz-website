<?php
/**
 * WAVZ CMS — Navigation Controller
 */

declare(strict_types=1);

class NavigationController
{
    /**
     * GET /api/navigation
     */
    public static function index(): void
    {
        $group = $_GET['menu_group'] ?? null;
        $filters = $_GET;

        if ($group) {
            $navigation = Navigation::getByGroup($group);
        } else {
            $navigation = Navigation::getAll($filters);
        }

        Response::success($navigation);
    }

    /**
     * PUT /api/navigation
     */
    public static function update(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $group = $input['menu_group'] ?? 'main';
        $items = $input['items'] ?? null;

        if ($items === null || !is_array($items)) {
            Response::validationError('Missing navigation items array');
        }

        try {
            $updatedTree = Navigation::replaceGroup($group, $items);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'navigation', 0, [
                'menu_group' => $group
            ]);

            Response::success($updatedTree);
        } catch (Throwable $e) {
            Response::error('Failed to update navigation structure: ' . $e->getMessage(), 500);
        }
    }
}
