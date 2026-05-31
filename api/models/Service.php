<?php
/**
 * WAVZ CMS — Service Model
 */

declare(strict_types=1);

class Service
{
    private static function db(): PDO
    {
        return getDB();
    }

    public static function getAll(array $filters = []): array
    {
        $sql = 'SELECT * FROM services WHERE 1=1';
        $params = [];

        if (!empty($filters['page_slug'])) {
            $sql .= ' AND page_slug = :page_slug';
            $params[':page_slug'] = $filters['page_slug'];
        }

        if (isset($filters['is_visible'])) {
            $sql .= ' AND is_visible = :is_visible';
            $params[':is_visible'] = (int)$filters['is_visible'];
        }

        $sql .= ' ORDER BY sort_order ASC, id ASC';

        $stmt = self::db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function getById(int $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM services WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Get services for a page slug with nested stats, pipelines, and bullets.
     */
    public static function getByPageSlug(string $pageSlug): array
    {
        $services = self::getAll(['page_slug' => $pageSlug]);

        foreach ($services as &$service) {
            $serviceId = (int)$service['id'];
            $service['stats'] = ServiceStat::getByServiceId($serviceId);
            $service['pipelines'] = ServicePipeline::getByServiceId($serviceId);
            $service['bullets'] = ServiceBullet::getByServiceId($serviceId);
        }

        return $services;
    }

    /**
     * Get a single service with nested data.
     */
    public static function getByIdWithRelations(int $id): ?array
    {
        $service = self::getById($id);
        if (!$service) {
            return null;
        }

        $service['stats'] = ServiceStat::getByServiceId($id);
        $service['pipelines'] = ServicePipeline::getByServiceId($id);
        $service['bullets'] = ServiceBullet::getByServiceId($id);

        return $service;
    }

    public static function create(array $data): array
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare(
                'INSERT INTO services (page_slug, code, title_en, title_ar, body_en, body_ar, icon, is_visible, sort_order)
                 VALUES (:page_slug, :code, :title_en, :title_ar, :body_en, :body_ar, :icon, :is_visible, :sort_order)'
            );
            $stmt->execute([
                ':page_slug'  => $data['page_slug'],
                ':code'       => $data['code'],
                ':title_en'   => $data['title_en'],
                ':title_ar'   => $data['title_ar'] ?? null,
                ':body_en'    => $data['body_en'] ?? null,
                ':body_ar'    => $data['body_ar'] ?? null,
                ':icon'       => $data['icon'] ?? null,
                ':is_visible' => $data['is_visible'] ?? 1,
                ':sort_order' => $data['sort_order'] ?? 0,
            ]);

            $serviceId = (int)$db->lastInsertId();

            // Insert nested data
            if (!empty($data['stats'])) {
                foreach ($data['stats'] as $i => $stat) {
                    ServiceStat::create([
                        'service_id' => $serviceId,
                        'value'      => $stat['value'],
                        'label_en'   => $stat['label_en'],
                        'label_ar'   => $stat['label_ar'] ?? null,
                        'sort_order' => $stat['sort_order'] ?? $i,
                    ]);
                }
            }

            if (!empty($data['pipelines'])) {
                foreach ($data['pipelines'] as $i => $pipeline) {
                    ServicePipeline::create([
                        'service_id' => $serviceId,
                        'step_en'    => $pipeline['step_en'],
                        'step_ar'    => $pipeline['step_ar'] ?? null,
                        'sort_order' => $pipeline['sort_order'] ?? $i,
                    ]);
                }
            }

            if (!empty($data['bullets'])) {
                foreach ($data['bullets'] as $i => $bullet) {
                    ServiceBullet::create([
                        'service_id' => $serviceId,
                        'text_en'    => $bullet['text_en'],
                        'text_ar'    => $bullet['text_ar'] ?? null,
                        'sort_order' => $bullet['sort_order'] ?? $i,
                    ]);
                }
            }

            $db->commit();
            return self::getByIdWithRelations($serviceId);

        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function update(int $id, array $data): ?array
    {
        $db = self::db();
        $db->beginTransaction();

        try {
            // Update main service fields
            $fields = [];
            $params = [':id' => $id];
            $allowed = ['page_slug', 'code', 'title_en', 'title_ar', 'body_en', 'body_ar', 'icon', 'is_visible', 'sort_order'];

            foreach ($allowed as $field) {
                if (array_key_exists($field, $data)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $data[$field];
                }
            }

            if (!empty($fields)) {
                $sql = 'UPDATE services SET ' . implode(', ', $fields) . ' WHERE id = :id';
                $stmt = $db->prepare($sql);
                $stmt->execute($params);
            }

            // Replace nested data if provided
            if (array_key_exists('stats', $data)) {
                ServiceStat::deleteByServiceId($id);
                if (!empty($data['stats'])) {
                    foreach ($data['stats'] as $i => $stat) {
                        ServiceStat::create([
                            'service_id' => $id,
                            'value'      => $stat['value'],
                            'label_en'   => $stat['label_en'],
                            'label_ar'   => $stat['label_ar'] ?? null,
                            'sort_order' => $stat['sort_order'] ?? $i,
                        ]);
                    }
                }
            }

            if (array_key_exists('pipelines', $data)) {
                ServicePipeline::deleteByServiceId($id);
                if (!empty($data['pipelines'])) {
                    foreach ($data['pipelines'] as $i => $pipeline) {
                        ServicePipeline::create([
                            'service_id' => $id,
                            'step_en'    => $pipeline['step_en'],
                            'step_ar'    => $pipeline['step_ar'] ?? null,
                            'sort_order' => $pipeline['sort_order'] ?? $i,
                        ]);
                    }
                }
            }

            if (array_key_exists('bullets', $data)) {
                ServiceBullet::deleteByServiceId($id);
                if (!empty($data['bullets'])) {
                    foreach ($data['bullets'] as $i => $bullet) {
                        ServiceBullet::create([
                            'service_id' => $id,
                            'text_en'    => $bullet['text_en'],
                            'text_ar'    => $bullet['text_ar'] ?? null,
                            'sort_order' => $bullet['sort_order'] ?? $i,
                        ]);
                    }
                }
            }

            $db->commit();
            return self::getByIdWithRelations($id);

        } catch (Throwable $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function delete(int $id): bool
    {
        // Cascading delete handles stats, pipelines, bullets via FK
        $stmt = self::db()->prepare('DELETE FROM services WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public static function count(): int
    {
        $stmt = self::db()->query('SELECT COUNT(*) FROM services');
        return (int)$stmt->fetchColumn();
    }
}
