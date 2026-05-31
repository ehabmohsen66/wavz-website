<?php
/**
 * WAVZ CMS — Response Helper
 * Standardised JSON responses with HTTP status codes.
 */

declare(strict_types=1);

class Response
{
    /**
     * Success response (200).
     */
    public static function success(mixed $data = null, int $code = 200): void
    {
        http_response_code($code);
        echo json_encode([
            'success' => true,
            'data'    => $data,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Error response.
     */
    public static function error(string $message, int $code = 400, mixed $errors = null): void
    {
        http_response_code($code);
        $body = [
            'success' => false,
            'message' => $message,
        ];
        if ($errors !== null) {
            $body['errors'] = $errors;
        }
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * Created response (201).
     */
    public static function created(mixed $data = null): void
    {
        self::success($data, 201);
    }

    /**
     * No content response (204).
     */
    public static function noContent(): void
    {
        http_response_code(204);
        exit;
    }

    /**
     * Unauthorized response (401).
     */
    public static function unauthorized(string $message = 'Unauthorized'): void
    {
        self::error($message, 401);
    }

    /**
     * Forbidden response (403).
     */
    public static function forbidden(string $message = 'Forbidden'): void
    {
        self::error($message, 403);
    }

    /**
     * Not found response (404).
     */
    public static function notFound(string $message = 'Resource not found'): void
    {
        self::error($message, 404);
    }

    /**
     * Validation error response (422).
     */
    public static function validationError(string $message = 'Validation failed', mixed $errors = null): void
    {
        self::error($message, 422, $errors);
    }

    /**
     * Paginated success response.
     */
    public static function paginated(array $data, int $total, int $page, int $perPage): void
    {
        http_response_code(200);
        echo json_encode([
            'success'    => true,
            'data'       => $data,
            'pagination' => [
                'total'        => $total,
                'page'         => $page,
                'per_page'     => $perPage,
                'total_pages'  => (int)ceil($total / max($perPage, 1)),
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
