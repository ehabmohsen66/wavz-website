<?php
/**
 * WAVZ CMS — Services Controller
 */

declare(strict_types=1);

class ServicesController
{
    /**
     * GET /api/services/{pageSlug}
     */
    public static function getByPage(string $pageSlug): void
    {
        $services = Service::getByPageSlug($pageSlug);
        Response::success($services);
    }

    /**
     * POST /api/services
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['page_slug', 'code', 'title_en']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $service = Service::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'service', (int)$service['id'], [
                'code' => $service['code'],
                'page_slug' => $service['page_slug']
            ]);

            Response::created($service);
        } catch (Throwable $e) {
            Response::error('Failed to create service unit: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/services/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $service = Service::getById($id);
        if (!$service) {
            Response::notFound('Service unit not found');
        }

        try {
            $updated = Service::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'service', $id, [
                'code' => $updated['code'],
                'page_slug' => $updated['page_slug']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update service unit: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/services/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $service = Service::getById($id);
        if (!$service) {
            Response::notFound('Service unit not found');
        }

        try {
            Service::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'service', $id, [
                'code' => $service['code'],
                'page_slug' => $service['page_slug']
            ]);

            Response::success(['message' => 'Service unit deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete service unit: ' . $e->getMessage());
        }
    }
}
