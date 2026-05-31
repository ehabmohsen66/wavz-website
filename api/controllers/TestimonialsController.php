<?php
/**
 * WAVZ CMS — Testimonials Controller
 */

declare(strict_types=1);

class TestimonialsController
{
    /**
     * GET /api/testimonials
     */
    public static function index(): void
    {
        $filters = $_GET;
        $testimonials = Testimonial::getAll($filters);
        Response::success($testimonials);
    }

    /**
     * POST /api/testimonials
     */
    public static function create(array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $errors = Validator::required($input, ['author_en', 'quote_en']);
        if (!empty($errors)) {
            Response::validationError('Missing required fields', $errors);
        }

        try {
            $testimonial = Testimonial::create($input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'testimonial', (int)$testimonial['id'], [
                'author_en' => $testimonial['author_en'],
                'company' => $testimonial['company'] ?? ''
            ]);

            Response::created($testimonial);
        } catch (Throwable $e) {
            Response::error('Failed to create testimonial: ' . $e->getMessage());
        }
    }

    /**
     * PUT /api/testimonials/{id}
     */
    public static function update(int $id, array $input): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $testimonial = Testimonial::getById($id);
        if (!$testimonial) {
            Response::notFound('Testimonial not found');
        }

        try {
            $updated = Testimonial::update($id, $input);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'update', 'testimonial', $id, [
                'author_en' => $updated['author_en'],
                'company' => $updated['company'] ?? ''
            ]);

            Response::success($updated);
        } catch (Throwable $e) {
            Response::error('Failed to update testimonial: ' . $e->getMessage());
        }
    }

    /**
     * DELETE /api/testimonials/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $testimonial = Testimonial::getById($id);
        if (!$testimonial) {
            Response::notFound('Testimonial not found');
        }

        try {
            Testimonial::delete($id);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'delete', 'testimonial', $id, [
                'author_en' => $testimonial['author_en']
            ]);

            Response::success(['message' => 'Testimonial deleted successfully']);
        } catch (Throwable $e) {
            Response::error('Failed to delete testimonial: ' . $e->getMessage());
        }
    }
}
