-- WAVZ Enterprise CMS Upgrade Migration
SET NAMES utf8mb4;

-- 1. Post revisions for history tracking
CREATE TABLE IF NOT EXISTS post_revisions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id INT UNSIGNED NOT NULL,
  title VARCHAR(255),
  content LONGTEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_post_rev (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Auth sessions for refresh token tracking and revocation
CREATE TABLE IF NOT EXISTS auth_sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auth_user (user_id),
  INDEX idx_auth_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Audit logs for administrative actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id INT,
  ip_address VARCHAR(64),
  user_agent TEXT,
  payload JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User security fields
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until DATETIME NULL;

-- 5. Settings description field
ALTER TABLE settings 
  ADD COLUMN IF NOT EXISTS description TEXT NULL;

-- 6. Blog workflow & SEO fields
ALTER TABLE blog_posts 
  ADD COLUMN IF NOT EXISTS review_status VARCHAR(32) DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS scheduled_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS meta_title_en VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meta_title_ar VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meta_description_ar TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meta_keywords VARCHAR(500) DEFAULT NULL;

-- 7. Normalize legacy WordPress blog image paths to local /blog-images/
UPDATE blog_posts 
  SET image = CONCAT('/blog-images/', SUBSTRING_INDEX(image, '/', -1)) 
  WHERE image LIKE '%wp-content/uploads/%';
