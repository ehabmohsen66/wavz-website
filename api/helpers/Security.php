<?php
declare(strict_types=1);

class Security
{
    public static function clean($value): string
    {
        return htmlspecialchars(trim((string)$value), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public static function randomToken(int $length = 64): string
    {
        return bin2hex(random_bytes($length));
    }

    public static function validateUpload(array $file): bool
    {
        if (empty($file) || !isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return false;
        }
        if ($file['size'] > MAX_UPLOAD_SIZE) {
            return false;
        }
        $mime = mime_content_type($file['tmp_name']);
        return in_array($mime, ALLOWED_MIME_TYPES, true);
    }
}
