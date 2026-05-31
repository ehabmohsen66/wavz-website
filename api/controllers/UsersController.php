<?php
/**
 * WAVZ CMS — Users Controller
 */

declare(strict_types=1);

class UsersController
{
    /**
     * GET /api/users
     */
    public static function index(): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole('admin');

        $filters = $_GET;
        $users = User::getAll($filters);
        Response::success($users);
    }

    /**
     * POST /api/users
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole('admin');

        $errors = Validator::required($input, ['name', 'email', 'password', 'role']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        if (!Validator::email($input['email'])) {
            Response::validationError('Invalid email format');
        }

        // Check if email already exists
        $existing = User::getByEmail($input['email']);
        if ($existing) {
            Response::validationError('Email already registered');
        }

        try {
            $user = User::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'user', (int)$user['id'], [
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]);

            Response::created($user);
        } catch (Throwable $e) {
            Response::error('Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/users/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole('admin');

        $user = User::getById($id);
        if (!$user) {
            Response::notFound('User not found');
        }

        if (!empty($input['email']) && $input['email'] !== $user['email']) {
            if (!Validator::email($input['email'])) {
                Response::validationError('Invalid email format');
            }
            $existing = User::getByEmail($input['email']);
            if ($existing) {
                Response::validationError('Email already registered');
            }
        }

        try {
            $updated = User::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'user', $id, [
                'name' => $updated['name'],
                'email' => $updated['email'],
                'role' => $updated['role']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/users/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole('admin');

        if ((int)$currentUser['id'] === $id) {
            Response::error('You cannot delete your own account', 400);
        }

        $user = User::getById($id);
        if (!$user) {
            Response::notFound('User not found');
        }

        try {
            User::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'user', $id, [
                'name' => $user['name'],
                'email' => $user['email']
            ]);

            Response::success(['message' => 'User deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete user: ' . $e->getMessage());
        }
    }
}
