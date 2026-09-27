<?php
declare(strict_types=1);

class RateLimiter
{
    public static function check(string $key, int $limit = 100): void
    {
        try {
            $dir = sys_get_temp_dir() . '/wavz_rate/';
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
            $file = $dir . md5($key);
            $data = file_exists($file) ? json_decode((string)file_get_contents($file), true) : null;
            if (!is_array($data) || (time() - ($data['time'] ?? 0)) > 60) {
                $data = ['time' => time(), 'count' => 0];
            }
            $data['count']++;
            @file_put_contents($file, json_encode($data), LOCK_EX);
            if ($data['count'] > $limit) {
                http_response_code(429);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
                exit;
            }
        } catch (Throwable $e) {
            // Fail open on rate limiter storage errors
        }
    }
}
