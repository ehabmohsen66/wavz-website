<?php
/**
 * WAVZ CMS — Validator Middleware
 * Input sanitization and validation utilities.
 */

declare(strict_types=1);

class Validator
{
    /**
     * Sanitize an associative array: strip tags, trim whitespace.
     */
    public static function sanitize(array $data): array
    {
        $cleaned = [];
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $cleaned[$key] = trim(strip_tags($value));
            } elseif (is_array($value)) {
                $cleaned[$key] = self::sanitize($value);
            } else {
                $cleaned[$key] = $value;
            }
        }
        return $cleaned;
    }

    /**
     * Check that required fields exist and are non-empty.
     *
     * @param array $data Input data
     * @param array $fields List of required field names
     * @return array List of missing field names (empty if all present)
     */
    public static function required(array $data, array $fields): array
    {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    /**
     * Validate email format.
     */
    public static function email(string $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Check string max length.
     */
    public static function maxLength(string $value, int $max): bool
    {
        return mb_strlen($value, 'UTF-8') <= $max;
    }

    /**
     * Check string min length.
     */
    public static function minLength(string $value, int $min): bool
    {
        return mb_strlen($value, 'UTF-8') >= $min;
    }

    /**
     * Validate URL-safe slug.
     */
    public static function slug(string $value): bool
    {
        return (bool)preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $value);
    }

    /**
     * Generate a slug from a string.
     */
    public static function generateSlug(string $value): string
    {
        $slug = strtolower($value);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');

        if (empty($slug)) {
            $slug = bin2hex(random_bytes(6));
        }

        return $slug;
    }

    /**
     * Ensure a slug is unique in a table.
     */
    public static function uniqueSlug(string $slug, string $table, ?int $excludeId = null): string
    {
        $db = getDB();
        $baseSlug = $slug;
        $counter = 1;

        while (true) {
            $sql = "SELECT id FROM `$table` WHERE slug = :slug";
            $params = [':slug' => $slug];

            if ($excludeId !== null) {
                $sql .= ' AND id != :id';
                $params[':id'] = $excludeId;
            }

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            if (!$stmt->fetch()) {
                return $slug;
            }

            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
    }

    /**
     * Validate value is a positive integer.
     */
    public static function positiveInt(mixed $value): bool
    {
        return is_numeric($value) && (int)$value > 0;
    }

    /**
     * Validate value is in an allowed set.
     */
    public static function inArray(mixed $value, array $allowed): bool
    {
        return in_array($value, $allowed, true);
    }

    /**
     * Validate a URL.
     */
    public static function url(string $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Validate a date string (Y-m-d).
     */
    public static function date(string $value): bool
    {
        $d = DateTime::createFromFormat('Y-m-d', $value);
        return $d && $d->format('Y-m-d') === $value;
    }

    /**
     * Require and validate input, returning a cleaned copy.
     * Responds with 422 error if validation fails.
     */
    public static function validateOrFail(array $data, array $rules): array
    {
        $data = self::sanitize($data);
        $errors = [];

        foreach ($rules as $field => $ruleList) {
            $ruleItems = is_string($ruleList) ? explode('|', $ruleList) : $ruleList;

            foreach ($ruleItems as $rule) {
                $params = [];
                if (str_contains($rule, ':')) {
                    [$rule, $paramStr] = explode(':', $rule, 2);
                    $params = explode(',', $paramStr);
                }

                switch ($rule) {
                    case 'required':
                        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                            $errors[$field][] = "$field is required";
                        }
                        break;

                    case 'email':
                        if (isset($data[$field]) && !empty($data[$field]) && !self::email($data[$field])) {
                            $errors[$field][] = "$field must be a valid email";
                        }
                        break;

                    case 'max':
                        if (isset($data[$field]) && is_string($data[$field]) && !self::maxLength($data[$field], (int)$params[0])) {
                            $errors[$field][] = "$field must not exceed {$params[0]} characters";
                        }
                        break;

                    case 'min':
                        if (isset($data[$field]) && is_string($data[$field]) && !self::minLength($data[$field], (int)$params[0])) {
                            $errors[$field][] = "$field must be at least {$params[0]} characters";
                        }
                        break;

                    case 'slug':
                        if (isset($data[$field]) && !empty($data[$field]) && !self::slug($data[$field])) {
                            $errors[$field][] = "$field must be a valid URL slug";
                        }
                        break;

                    case 'url':
                        if (isset($data[$field]) && !empty($data[$field]) && !self::url($data[$field])) {
                            $errors[$field][] = "$field must be a valid URL";
                        }
                        break;

                    case 'in':
                        if (isset($data[$field]) && !self::inArray($data[$field], $params)) {
                            $errors[$field][] = "$field must be one of: " . implode(', ', $params);
                        }
                        break;

                    case 'date':
                        if (isset($data[$field]) && !empty($data[$field]) && !self::date($data[$field])) {
                            $errors[$field][] = "$field must be a valid date (Y-m-d)";
                        }
                        break;

                    case 'integer':
                        if (isset($data[$field]) && !is_numeric($data[$field])) {
                            $errors[$field][] = "$field must be an integer";
                        }
                        break;
                }
            }
        }

        if (!empty($errors)) {
            Response::validationError('Validation failed', $errors);
        }

        return $data;
    }
}
