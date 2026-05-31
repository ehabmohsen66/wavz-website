<?php
/**
 * WAVZ CMS — Media Controller
 */

declare(strict_types=1);

class MediaController
{
    /**
     * GET /api/media
     */
    public static function index(): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor', 'viewer']);

        $filters = $_GET;
        $media = Media::getAll($filters);
        Response::success($media);
    }

    /**
     * POST /api/media
     */
    public static function upload(): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        if (empty($_FILES['file'])) {
            Response::validationError('No file uploaded');
        }

        try {
            $fileData = ImageProcessor::processUpload($_FILES['file']);
            
            // Try to create thumbnail
            $absoluteSourcePath = UPLOAD_DIR . $fileData['filename'];
            $thumbnailUrl = ImageProcessor::createThumbnail($absoluteSourcePath);

            $media = Media::create([
                'filename'      => $fileData['filename'],
                'original_name' => $fileData['original_name'],
                'path'          => $fileData['path'],
                'thumbnail'     => $thumbnailUrl,
                'mime_type'     => $fileData['mime_type'],
                'size_bytes'    => $fileData['size_bytes'],
                'width'         => $fileData['width'],
                'height'        => $fileData['height'],
                'alt_en'        => $_POST['alt_en'] ?? null,
                'alt_ar'        => $_POST['alt_ar'] ?? null,
                'uploaded_by'   => $currentUser['id'],
            ]);

            // Log activity
            ActivityLog::log((int)$currentUser['id'], 'create', 'media', (int)$media['id'], [
                'filename' => $fileData['filename'],
                'mime_type' => $fileData['mime_type']
            ]);

            Response::created($media);
        } catch (Throwable $e) {
            Response::error('Upload failed: ' . $e->getMessage(), 400);
        }
    }

    /**
     * DELETE /api/media/{id}
     */
    public static function delete(int $id): void
    {
        $currentUser = Auth::authenticate();
        Auth::requireRole(['admin', 'editor']);

        $media = Media::getById($id);
        if (!$media) {
            Response::notFound('Media file not found');
        }

        // Delete from disk
        ImageProcessor::deleteFile($media['path']);

        // Delete from database
        Media::delete($id);

        // Log activity
        ActivityLog::log((int)$currentUser['id'], 'delete', 'media', $id, [
            'filename' => $media['filename']
        ]);

        Response::success(['message' => 'Media file deleted successfully']);
    }
}
