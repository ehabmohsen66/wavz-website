<?php
/**
 * WAVZ CMS — Partners Controller
 */

declare(strict_types=1);

class PartnersController
{
    /**
     * GET /api/partners
     */
    public static function index(): void
    {
        $filters = $_GET;
        $partners = Partner::getAll($filters);
        Response::success($partners);
    }

    /**
     * POST /api/partners
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['name', 'logo']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $partner = Partner::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'partner', (int)$partner['id'], [
                'name' => $partner['name']
            ]);

            Response::created($partner);
        } catch (Throwable $e) {
            Response::error('Failed to create partner: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/partners/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $partner = Partner::getById($id);
        if (!$partner) {
            Response::notFound('Partner not found');
        }

        try {
            $updated = Partner::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'partner', $id, [
                'name' => $updated['name']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update partner: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/partners/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $partner = Partner::getById($id);
        if (!$partner) {
            Response::notFound('Partner not found');
        }

        try {
            Partner::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'partner', $id, [
                'name' => $partner['name']
            ]);

            Response::success(['message' => 'Partner deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete partner: ' . $e->getMessage());
        }
    }
}
