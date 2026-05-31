<?php
/**
 * WAVZ CMS — Timeline Controller
 */

declare(strict_types=1);

class TimelineController
{
    /**
     * GET /api/timeline
     */
    public static function index(): void
    {
        $filters = $_GET;
        $events = TimelineEvent::getAll($filters);
        
        // Decode JSON items for easier client consumption
        foreach ($events as &$event) {
            if (!empty($event['items_en'])) {
                $event['items_en'] = json_decode($event['items_en'], true) ?? [];
            }
            if (!empty($event['items_ar'])) {
                $event['items_ar'] = json_decode($event['items_ar'], true) ?? [];
            }
        }
        
        Response::success($events);
    }

    /**
     * POST /api/timeline
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['year', 'title_en']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $event = TimelineEvent::create($input);
            
            if (!empty($event['items_en'])) {
                $event['items_en'] = json_decode($event['items_en'], true) ?? [];
            }
            if (!empty($event['items_ar'])) {
                $event['items_ar'] = json_decode($event['items_ar'], true) ?? [];
            }

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'timeline_event', (int)$event['id'], [
                'year' => $event['year'],
                'title_en' => $event['title_en']
            ]);

            Response::created($event);
        } catch (Throwable $e) {
            Response::error('Failed to create timeline event: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/timeline/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $event = TimelineEvent::getById($id);
        if (!$event) {
            Response::notFound('Timeline event not found');
        }

        try {
            $updated = TimelineEvent::update($id, $input);
            
            if (!empty($updated['items_en'])) {
                $updated['items_en'] = json_decode($updated['items_en'], true) ?? [];
            }
            if (!empty($updated['items_ar'])) {
                $updated['items_ar'] = json_decode($updated['items_ar'], true) ?? [];
            }

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'timeline_event', $id, [
                'year' => $updated['year'],
                'title_en' => $updated['title_en']
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update timeline event: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/timeline/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $event = TimelineEvent::getById($id);
        if (!$event) {
            Response::notFound('Timeline event not found');
        }

        try {
            TimelineEvent::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'timeline_event', $id, [
                'year' => $event['year'],
                'title_en' => $event['title_en']
            ]);

            Response::success(['message' => 'Timeline event deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete timeline event: ' . $e->getMessage());
        }
    }
}
