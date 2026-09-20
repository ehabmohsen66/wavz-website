<?php
/**
 * WAVZ CMS — Clients Controller
 */

declare(strict_types=1);

class ClientsController
{
    /**
     * GET /api/clients
     */
    public static function index(): void
    {
        $filters = $_GET;
        $clients = Client::getAll($filters);
        Response::success($clients);
    }

    /**
     * POST /api/clients
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
            $client = Client::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'client', (int)$client['id'], [
                'name' => $client['name']
            ]);

            Response::created($client);
        } catch (Throwable $e) {
            Response::error('Failed to create client: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/clients/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $client = Client::getById($id);
        if (!$client) {
            Response::notFound('Client not found');
        }

        try {
            $updated = Client::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'client', $id, [
                'name' => $updated['name']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update client: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/clients/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $client = Client::getById($id);
        if (!$client) {
            Response::notFound('Client not found');
        }

        try {
            Client::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'client', $id, [
                'name' => $client['name']
            ]);

            Response::success(['message' => 'Client deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete client: ' . $e->getMessage());
        }
    }
}
