<?php
/**
 * WAVZ CMS — JWT Helper
 * Minimal JWT implementation using HS256 (HMAC-SHA256).
 */

declare(strict_types=1);

class JWT
{
    /**
     * Encode a payload into a JWT token.
     */
    public static function encode(array $payload): string
    {
        $header = self::base64UrlEncode(json_encode([
            'typ' => 'JWT',
            'alg' => JWT_ALGO,
        ]));

        $payload['iss'] = JWT_ISSUER;
        $payload['iat'] = time();

        if (!isset($payload['exp'])) {
            $payload['exp'] = time() + JWT_ACCESS_TTL;
        }

        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true)
        );

        return "$header.$payloadEncoded.$signature";
    }

    /**
     * Create a refresh token with longer TTL.
     */
    public static function encodeRefresh(array $payload): string
    {
        $payload['exp'] = time() + JWT_REFRESH_TTL;
        $payload['type'] = 'refresh';
        return self::encode($payload);
    }

    /**
     * Decode and validate a JWT token.
     *
     * @throws RuntimeException on invalid/expired token
     */
    public static function decode(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new RuntimeException('Invalid token format');
        }

        [$headerB64, $payloadB64, $signatureB64] = $parts;

        // Verify signature
        $expectedSignature = self::base64UrlEncode(
            hash_hmac('sha256', "$headerB64.$payloadB64", JWT_SECRET, true)
        );

        if (!hash_equals($expectedSignature, $signatureB64)) {
            throw new RuntimeException('Invalid token signature');
        }

        // Decode payload
        $payload = json_decode(self::base64UrlDecode($payloadB64), true);

        if ($payload === null) {
            throw new RuntimeException('Invalid token payload');
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new RuntimeException('Token has expired');
        }

        // Check issuer
        if (isset($payload['iss']) && $payload['iss'] !== JWT_ISSUER) {
            throw new RuntimeException('Invalid token issuer');
        }

        return $payload;
    }

    /**
     * Extract bearer token from Authorization header.
     */
    public static function extractFromHeader(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if (empty($header)) {
            // Try Apache-specific
            if (function_exists('apache_request_headers')) {
                $headers = apache_request_headers();
                $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
            }
        }

        if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
