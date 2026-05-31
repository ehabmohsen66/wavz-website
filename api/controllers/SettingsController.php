<?php
/**
 * WAVZ CMS — Settings Controller
 */

declare(strict_types=1);

class SettingsController
{
    /**
     * GET /api/settings
     */
    public static function index(): void
    {
        $group = $_GET['group'] ?? null;
        $filters = [];
        if ($group) {
            $filters['group'] = $group;
        }

        $settings = Setting::getAll($filters);
        Response::success($settings);
    }

    /**
     * PUT /api/settings
     */
    public static function update(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        if (!is_array($input)) {
            Response::validationError('Invalid input format, expected array of settings');
        }

        try {
            Setting::updateBatch($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'settings', 0, [
                'updated_keys' => array_keys($input)
            ]);

            Response::success(['message' => 'Settings updated successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to update settings: ' . $e->getMessage(), 500);
        }
    }
}
