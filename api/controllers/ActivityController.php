<?php
/**
 * WAVZ CMS — Activity Controller
 */

declare(strict_types=1);

class ActivityController
{
    /**
     * GET /api/activity
     */
    public static function index(): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $filters = $_GET;
        $activities = ActivityLog::getAll($filters);
        
        // Decode details JSON field for cleaner client response
        if (isset($activities['items']) && is_array($activities['items'])) {
            foreach ($activities['items'] as &$item) {
                if (!empty($item['details'])) {
                    $item['details'] = json_decode($item['details'], true) ?? $item['details'];
                }
            }
        }

        Response::success($activities);
    }
}
