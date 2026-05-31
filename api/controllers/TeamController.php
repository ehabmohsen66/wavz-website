<?php
/**
 * WAVZ CMS — Team Controller
 */

declare(strict_types=1);

class TeamController
{
    /**
     * GET /api/team
     */
    public static function index(): void
    {
        $filters = $_GET;
        $team = TeamMember::getAll($filters);
        Response::success($team);
    }

    /**
     * POST /api/team
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['name_en', 'type']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $member = TeamMember::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'team_member', (int)$member['id'], [
                'name_en' => $member['name_en'],
                'type' => $member['type']
            ]);

            Response::created($member);
        } catch (Throwable $e) {
            Response::error('Failed to create team member: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/team/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $member = TeamMember::getById($id);
        if (!$member) {
            Response::notFound('Team member not found');
        }

        try {
            $updated = TeamMember::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'team_member', $id, [
                'name_en' => $updated['name_en'],
                'type' => $updated['type']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update team member: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/team/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $member = TeamMember::getById($id);
        if (!$member) {
            Response::notFound('Team member not found');
        }

        try {
            TeamMember::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'team_member', $id, [
                'name_en' => $member['name_en']
            ]);

            Response::success(['message' => 'Team member deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete team member: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/team/reorder
     */
    public static function reorder(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $items = $input['items'] ?? null;
        if ($items === null || !is_array($items)) {
            Response::validationError('Missing items array for reordering');
        }

        try {
            TeamMember::reorder($items);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'team_member', 0, [
                'action' => 'reorder'
            ]);

            Response::success(['message' => 'Team members reordered successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to reorder team members: ' . $e->getMessage(), 500);
        }
    }
}
