<?php
/**
 * WAVZ CMS — Dashboard Controller
 */

declare(strict_types=1);

class DashboardController
{
    /**
     * GET /api/dashboard/stats
     */
    public static function stats(): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor', 'viewer']);

        $db = getDB();

        try {
            $stats = [
                'blog_posts' => [
                    'total' => (int)$db->query('SELECT COUNT(*) FROM blog_posts')->fetchColumn(),
                    'published' => (int)$db->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'published'")->fetchColumn(),
                    'draft' => (int)$db->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'draft'")->fetchColumn(),
                ],
                'news_articles' => [
                    'total' => (int)$db->query('SELECT COUNT(*) FROM news_articles')->fetchColumn(),
                    'published' => (int)$db->query("SELECT COUNT(*) FROM news_articles WHERE status = 'published'")->fetchColumn(),
                    'draft' => (int)$db->query("SELECT COUNT(*) FROM news_articles WHERE status = 'draft'")->fetchColumn(),
                ],
                'team_members' => [
                    'total' => (int)$db->query('SELECT COUNT(*) FROM team_members')->fetchColumn(),
                    'board' => (int)$db->query("SELECT COUNT(*) FROM team_members WHERE type = 'board'")->fetchColumn(),
                    'executive' => (int)$db->query("SELECT COUNT(*) FROM team_members WHERE type = 'executive'")->fetchColumn(),
                ],
                'partners' => [
                    'total' => (int)$db->query('SELECT COUNT(*) FROM partners')->fetchColumn(),
                ],
                'media' => [
                    'total' => (int)$db->query('SELECT COUNT(*) FROM media')->fetchColumn(),
                ],
                'services' => [
                    'total' => (int)$db->query('SELECT COUNT(*) FROM services')->fetchColumn(),
                ]
            ];

            // Get recent activity log (last 5 entries)
            $recentActivity = ActivityLog::getAll(['page' => 1, 'per_page' => 5]);

            Response::success([
                'stats' => $stats,
                'recent_activity' => $recentActivity['items'] ?? $recentActivity
            ]);
        } catch (Throwable $e) {
            Response::error('Failed to retrieve dashboard stats: ' . $e->getMessage(), 500);
        }
    }
}
