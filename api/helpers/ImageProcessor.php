<?php
/**
 * WAVZ CMS — Image Processor
 * Secure file upload handling and thumbnail generation via GD.
 */

declare(strict_types=1);

class ImageProcessor
{
    /**
     * Process an uploaded file: validate, rename, move to uploads dir.
     *
     * @param array $file $_FILES element
     * @return array{filename: string, original_name: string, path: string, mime_type: string, size_bytes: int, width: ?int, height: ?int}
     * @throws RuntimeException on validation failure
     */
    public static function processUpload(array $file): array
    {
        // Check for upload errors
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE   => 'File exceeds the server upload limit',
                UPLOAD_ERR_FORM_SIZE  => 'File exceeds the form upload limit',
                UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION  => 'Upload blocked by PHP extension',
            ];
            $code = $file['error'] ?? -1;
            throw new RuntimeException($errorMessages[$code] ?? 'Unknown upload error');
        }

        // Validate file size
        if ($file['size'] > MAX_UPLOAD_SIZE) {
            throw new RuntimeException('File size exceeds the maximum allowed (' . (MAX_UPLOAD_SIZE / 1024 / 1024) . 'MB)');
        }

        // Validate MIME type using finfo (not trusting browser-reported type)
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, ALLOWED_MIME_TYPES, true)) {
            throw new RuntimeException('File type not allowed: ' . $mimeType);
        }

        // Create upload directories if needed
        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }
        if (!is_dir(THUMBNAIL_DIR)) {
            mkdir(THUMBNAIL_DIR, 0755, true);
        }

        // Generate safe filename
        $originalName = basename($file['name']);
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        // Validate extension matches MIME type
        $validExtensions = [
            'image/jpeg'    => ['jpg', 'jpeg'],
            'image/jpg'     => ['jpg', 'jpeg'],
            'image/png'     => ['png'],
            'image/webp'    => ['webp'],
            'image/svg+xml' => ['svg'],
            'image/gif'     => ['gif'],
        ];

        $allowedExtensions = $validExtensions[$mimeType] ?? [];
        if (!in_array($extension, $allowedExtensions, true)) {
            // Force correct extension
            $extension = $allowedExtensions[0] ?? $extension;
        }

        $filename = bin2hex(random_bytes(16)) . '_' . time() . '.' . $extension;
        $destination = UPLOAD_DIR . $filename;

        // Move the file
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new RuntimeException('Failed to move uploaded file');
        }

        // Get image dimensions (non-SVG)
        $width = null;
        $height = null;
        if ($mimeType !== 'image/svg+xml') {
            $imageInfo = @getimagesize($destination);
            if ($imageInfo !== false) {
                $width = $imageInfo[0];
                $height = $imageInfo[1];
            }
        }

        return [
            'filename'      => $filename,
            'original_name' => $originalName,
            'path'          => UPLOAD_URL . $filename,
            'mime_type'     => $mimeType,
            'size_bytes'    => $file['size'],
            'width'         => $width,
            'height'        => $height,
        ];
    }

    /**
     * Create a thumbnail from an uploaded image.
     *
     * @return string|null Thumbnail relative URL or null if cannot process
     */
    public static function createThumbnail(string $sourcePath, int $maxWidth = 300, int $maxHeight = 200): ?string
    {
        // Only process raster images
        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($sourcePath);

        if ($mimeType === 'image/svg+xml' || $mimeType === 'image/gif') {
            return null;
        }

        $imageInfo = @getimagesize($sourcePath);
        if ($imageInfo === false) {
            return null;
        }

        [$origWidth, $origHeight, $type] = $imageInfo;

        // Load source image
        $sourceImage = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($sourcePath),
            IMAGETYPE_PNG  => @imagecreatefrompng($sourcePath),
            IMAGETYPE_WEBP => @imagecreatefromwebp($sourcePath),
            default        => false,
        };

        if ($sourceImage === false) {
            return null;
        }

        // Calculate proportional dimensions
        $ratio = min($maxWidth / $origWidth, $maxHeight / $origHeight);

        if ($ratio >= 1.0) {
            // Image is already smaller than thumbnail size
            imagedestroy($sourceImage);
            return null;
        }

        $newWidth = (int)round($origWidth * $ratio);
        $newHeight = (int)round($origHeight * $ratio);

        // Create thumbnail
        $thumbnail = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG/WebP
        if ($type === IMAGETYPE_PNG || $type === IMAGETYPE_WEBP) {
            imagealphablending($thumbnail, false);
            imagesavealpha($thumbnail, true);
            $transparent = imagecolorallocatealpha($thumbnail, 0, 0, 0, 127);
            imagefilledrectangle($thumbnail, 0, 0, $newWidth, $newHeight, $transparent);
        }

        imagecopyresampled(
            $thumbnail,
            $sourceImage,
            0, 0, 0, 0,
            $newWidth, $newHeight,
            $origWidth, $origHeight
        );

        // Save thumbnail
        $filename = 'thumb_' . basename($sourcePath);
        $thumbPath = THUMBNAIL_DIR . $filename;

        $saved = match ($type) {
            IMAGETYPE_JPEG => imagejpeg($thumbnail, $thumbPath, 85),
            IMAGETYPE_PNG  => imagepng($thumbnail, $thumbPath, 8),
            IMAGETYPE_WEBP => imagewebp($thumbnail, $thumbPath, 85),
            default        => false,
        };

        imagedestroy($sourceImage);
        imagedestroy($thumbnail);

        if (!$saved) {
            return null;
        }

        return UPLOAD_URL . 'thumbnails/' . $filename;
    }

    /**
     * Delete a file from disk.
     */
    public static function deleteFile(string $relativePath): bool
    {
        // Resolve to absolute path inside UPLOAD_DIR
        $baseName = basename($relativePath);
        $absolutePath = UPLOAD_DIR . $baseName;

        if (file_exists($absolutePath)) {
            unlink($absolutePath);
        }

        // Also remove thumbnail if exists
        $thumbPath = THUMBNAIL_DIR . 'thumb_' . $baseName;
        if (file_exists($thumbPath)) {
            unlink($thumbPath);
        }

        return true;
    }
}
