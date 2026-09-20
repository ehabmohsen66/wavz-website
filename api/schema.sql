-- ============================================================
-- WAVZ CMS — Database Schema
-- MySQL 8.0+ / MariaDB 10.5+
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- 1. USERS — Admin accounts with role-based access
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  role        ENUM('admin','editor','viewer') NOT NULL DEFAULT 'editor',
  avatar      VARCHAR(500) DEFAULT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  last_login  DATETIME DEFAULT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- Default admin account (password: wavz@admin2026 — MUST change on first login)
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'admin@wavz.com.eg', '$2a$10$6G7FKqLkJyY2DNF0m8NqDOhN9cTWlOd.Z9rr7T4pS6aDKixQEXYta', 'admin');

-- ============================================================
-- 2. SETTINGS — Global site configuration (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `group`     VARCHAR(50) NOT NULL DEFAULT 'general',
  `key`       VARCHAR(120) NOT NULL UNIQUE,
  value_en    TEXT DEFAULT NULL,
  value_ar    TEXT DEFAULT NULL,
  field_type  ENUM('text','textarea','url','email','tel','image','code') NOT NULL DEFAULT 'text',
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group (`group`),
  INDEX idx_key (`key`)
) ENGINE=InnoDB;

-- Seed default settings
INSERT INTO settings (`group`, `key`, value_en, value_ar, field_type) VALUES
('general',  'site_name',          'WAVZ for Digital Transformation',    'WAVZ للتحول الرقمي',          'text'),
('general',  'site_description',   'Leading IT solutions provider in MEA', 'المزود الرائد لحلول تكنولوجيا المعلومات في الشرق الأوسط وأفريقيا', 'textarea'),
('general',  'site_logo',          '/Logo.png',                          '/Logo.png',                     'image'),
('contact',  'contact_email',      'info@wavz.com.eg',                   'info@wavz.com.eg',              'email'),
('contact',  'contact_phone',      '+2 02 2120 1430',                    '+2 02 2120 1430',               'tel'),
('contact',  'contact_address',    'Maadi Technology Park, Block MB3, Building B2, Cairo, Egypt.', 'منطقة التكنولوجيا بالمعادي، مربع MB3، مبنى B2، القاهرة، مصر.', 'textarea'),
('contact',  'google_maps_embed',  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.0!2d31.3!3d29.97', NULL, 'url'),
('social',   'social_linkedin',    'https://www.linkedin.com/company/wavzfordigitaltransformation/', NULL, 'url'),
('social',   'social_facebook',    'https://www.facebook.com/WAVZfordigitaltransformation',          NULL, 'url'),
('social',   'social_instagram',   'https://www.instagram.com/wavzfordigitaltransformation/',        NULL, 'url'),
('seo',      'meta_og_image',      '/og-image.png',                      NULL,                            'image'),
('seo',      'meta_keywords_en',   'WAVZ, digital transformation, SAP, managed services, fintech, Egypt', NULL, 'text'),
('seo',      'meta_keywords_ar',   NULL,                                 'WAVZ, التحول الرقمي, SAP, الخدمات المدارة, التكنولوجيا المالية, مصر', 'text'),
('hero',     'hero_tagline',       'Technology. Reimagined.',             'التكنولوجيا. مُعاد تصوُّرها.',    'text'),
('hero',     'hero_description',   'We deliver end-to-end IT solutions across MEA.',  'نقدم حلول تكنولوجيا المعلومات المتكاملة في منطقة الشرق الأوسط وأفريقيا.', 'textarea'),
('analytics','google_analytics_id', '',                                  NULL,                            'text'),
('analytics','google_tag_manager_id', '',                                NULL,                            'text'),
('analytics','meta_pixel_id',      '',                                   NULL,                            'text'),
('analytics','linkedin_partner_id','',                                   NULL,                            'text'),
('analytics','custom_head_code',   '',                                   NULL,                            'code'),
('analytics','custom_body_code',   '',                                   NULL,                            'code'),
('analytics','custom_footer_code', '',                                   NULL,                            'code'),
('analytics','cookie_consent_enabled', '0',                              '0',                             'text'),
('smtp',     'notification_email', 'Salma.Hegazy@wavz.com.eg, info@wavz.com.eg', NULL,                   'email'),
('smtp',     'smtp_host',          'mail.wavz.com.eg',                   NULL,                            'text'),
('smtp',     'smtp_port',          '465',                                NULL,                            'text'),
('smtp',     'smtp_user',          'info@wavz.com.eg',                   NULL,                            'text'),
('smtp',     'smtp_pass',          'Wavz@2008',                          NULL,                            'text'),
('smtp',     'smtp_encryption',    'ssl',                                NULL,                            'text'),
('smtp',     'smtp_from_name',     'WAVZ Website Inquiries',             NULL,                            'text'),
('system',   'maintenance_mode',   '0',                                  '0',                             'text'),
('system',   'maintenance_message_en', 'We are currently performing scheduled system updates. We will be back shortly.', NULL, 'textarea'),
('system',   'maintenance_message_ar', 'نقوم حالياً بإجراء تحديثات مجدولة للنظام. سنعود للعمل قريباً.', NULL, 'textarea'),
('system',   'robots_txt_custom',  'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://wavz.com.eg/api/sitemap.xml', NULL, 'code');

-- ============================================================
-- 3. MEDIA — Uploaded files library
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filename     VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  path         VARCHAR(500) NOT NULL,
  thumbnail    VARCHAR(500) DEFAULT NULL,
  mime_type    VARCHAR(100) NOT NULL,
  size_bytes   INT UNSIGNED NOT NULL DEFAULT 0,
  width        INT UNSIGNED DEFAULT NULL,
  height       INT UNSIGNED DEFAULT NULL,
  alt_en       VARCHAR(255) DEFAULT NULL,
  alt_ar       VARCHAR(255) DEFAULT NULL,
  uploaded_by  INT UNSIGNED DEFAULT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mime (mime_type),
  INDEX idx_created (created_at),
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 4. PAGES — Static page content (About, Hero sections, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS pages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(120) NOT NULL UNIQUE,
  title_en        VARCHAR(255) NOT NULL,
  title_ar        VARCHAR(255) DEFAULT NULL,
  subtitle_en     VARCHAR(500) DEFAULT NULL,
  subtitle_ar     VARCHAR(500) DEFAULT NULL,
  content_en      LONGTEXT DEFAULT NULL,   -- JSON structure for complex pages
  content_ar      LONGTEXT DEFAULT NULL,
  meta_title_en   VARCHAR(255) DEFAULT NULL,
  meta_title_ar   VARCHAR(255) DEFAULT NULL,
  meta_desc_en    VARCHAR(500) DEFAULT NULL,
  meta_desc_ar    VARCHAR(500) DEFAULT NULL,
  status          ENUM('published','draft','archived') NOT NULL DEFAULT 'published',
  updated_by      INT UNSIGNED DEFAULT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 5. NAVIGATION — Menu items (supports nesting)
-- ============================================================
CREATE TABLE IF NOT EXISTS navigation (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id   INT UNSIGNED DEFAULT NULL,
  label_en    VARCHAR(120) NOT NULL,
  label_ar    VARCHAR(120) DEFAULT NULL,
  url         VARCHAR(500) NOT NULL,
  icon        VARCHAR(50) DEFAULT NULL,
  target      ENUM('_self','_blank') NOT NULL DEFAULT '_self',
  is_visible  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  menu_group  VARCHAR(50) NOT NULL DEFAULT 'main',  -- main, footer, solutions
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_parent (parent_id),
  INDEX idx_menu (menu_group),
  INDEX idx_sort (sort_order),
  FOREIGN KEY (parent_id) REFERENCES navigation(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. TEAM MEMBERS — Board of Directors + Executive Team
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type         ENUM('board','executive') NOT NULL DEFAULT 'executive',
  name_en      VARCHAR(150) NOT NULL,
  name_ar      VARCHAR(150) DEFAULT NULL,
  title_en     VARCHAR(255) NOT NULL,
  title_ar     VARCHAR(255) DEFAULT NULL,
  bio_en       TEXT DEFAULT NULL,
  bio_ar       TEXT DEFAULT NULL,
  photo        VARCHAR(500) DEFAULT NULL,
  linkedin_url VARCHAR(500) DEFAULT NULL,
  email        VARCHAR(255) DEFAULT NULL,
  is_visible   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_visible (is_visible),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 7. PARTNERS — Strategic alliances
-- ============================================================
CREATE TABLE IF NOT EXISTS partners (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  logo            VARCHAR(500) DEFAULT NULL,
  description_en  TEXT DEFAULT NULL,
  description_ar  TEXT DEFAULT NULL,
  website_url     VARCHAR(500) DEFAULT NULL,
  category        VARCHAR(80) DEFAULT 'technology',
  is_visible      TINYINT(1) NOT NULL DEFAULT 1,
  sort_order      INT UNSIGNED NOT NULL DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 8. SERVICES — Service units for each service page
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_slug   VARCHAR(80) NOT NULL,  -- managed-services, financial-services, etc.
  code        VARCHAR(20) NOT NULL,   -- MS-01, FS-T24, etc.
  title_en    VARCHAR(255) NOT NULL,
  title_ar    VARCHAR(255) DEFAULT NULL,
  body_en     TEXT DEFAULT NULL,
  body_ar     TEXT DEFAULT NULL,
  icon        VARCHAR(50) DEFAULT NULL,  -- Lucide icon name
  is_visible  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page (page_slug),
  INDEX idx_code (code),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 9. SERVICE_STATS — Telemetry stats per service unit
-- ============================================================
CREATE TABLE IF NOT EXISTS service_stats (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id  INT UNSIGNED NOT NULL,
  value       VARCHAR(50) NOT NULL,    -- e.g. "99.97%", "24/7", "450+"
  label_en    VARCHAR(150) NOT NULL,
  label_ar    VARCHAR(150) DEFAULT NULL,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service (service_id),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 10. SERVICE_PIPELINES — Process flow steps per service unit
-- ============================================================
CREATE TABLE IF NOT EXISTS service_pipelines (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id  INT UNSIGNED NOT NULL,
  step_en     VARCHAR(150) NOT NULL,
  step_ar     VARCHAR(150) DEFAULT NULL,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service (service_id),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 11. SERVICE_BULLETS — Operational specification bullets
-- ============================================================
CREATE TABLE IF NOT EXISTS service_bullets (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id  INT UNSIGNED NOT NULL,
  text_en     VARCHAR(500) NOT NULL,
  text_ar     VARCHAR(500) DEFAULT NULL,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service (service_id),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 12. NEWS ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS news_articles (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title_en     VARCHAR(500) NOT NULL,
  title_ar     VARCHAR(500) DEFAULT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  excerpt_en   TEXT DEFAULT NULL,
  excerpt_ar   TEXT DEFAULT NULL,
  content_en   LONGTEXT DEFAULT NULL,
  content_ar   LONGTEXT DEFAULT NULL,
  image        VARCHAR(500) DEFAULT NULL,
  category_en  VARCHAR(100) DEFAULT NULL,
  category_ar  VARCHAR(100) DEFAULT NULL,
  source_en    VARCHAR(255) DEFAULT NULL,
  source_ar    VARCHAR(255) DEFAULT NULL,
  source_url   VARCHAR(500) DEFAULT NULL,
  published_at DATE DEFAULT NULL,
  status       ENUM('published','draft','archived') NOT NULL DEFAULT 'draft',
  author_id    INT UNSIGNED DEFAULT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published (published_at),
  INDEX idx_category (category_en),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 13. BLOG POSTS — Structured block content
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  title_en     VARCHAR(500) NOT NULL,
  title_ar     VARCHAR(500) DEFAULT NULL,
  excerpt_en   TEXT DEFAULT NULL,
  excerpt_ar   TEXT DEFAULT NULL,
  blocks_en    LONGTEXT DEFAULT NULL,   -- JSON array of content blocks
  blocks_ar    LONGTEXT DEFAULT NULL,   -- JSON array of content blocks
  image        VARCHAR(500) DEFAULT NULL,
  category_en  VARCHAR(100) DEFAULT NULL,
  category_ar  VARCHAR(100) DEFAULT NULL,
  tags         VARCHAR(500) DEFAULT NULL,  -- comma-separated
  read_time    INT UNSIGNED DEFAULT 5,
  accent_color VARCHAR(20) DEFAULT '#1173BD',
  published_at DATE DEFAULT NULL,
  status       ENUM('published','draft','archived') NOT NULL DEFAULT 'draft',
  author_id    INT UNSIGNED DEFAULT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published (published_at),
  INDEX idx_category (category_en),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 14. TIMELINE EVENTS — Journey milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  year         VARCHAR(10) NOT NULL,
  title_en     VARCHAR(255) NOT NULL,
  title_ar     VARCHAR(255) DEFAULT NULL,
  items_en     TEXT DEFAULT NULL,        -- JSON array of milestone strings
  items_ar     TEXT DEFAULT NULL,        -- JSON array of milestone strings
  icon         VARCHAR(50) DEFAULT 'Package',
  color_scheme VARCHAR(30) DEFAULT 'blue',  -- blue, emerald, violet, etc.
  sort_order   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (year),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 15. TESTIMONIALS — Partner/client quotes
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_en    VARCHAR(150) NOT NULL,
  author_ar    VARCHAR(150) DEFAULT NULL,
  company      VARCHAR(150) DEFAULT NULL,
  title_en     VARCHAR(255) DEFAULT NULL,
  title_ar     VARCHAR(255) DEFAULT NULL,
  quote_en     TEXT NOT NULL,
  quote_ar     TEXT DEFAULT NULL,
  photo        VARCHAR(500) DEFAULT NULL,
  is_visible   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_visible (is_visible),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- ============================================================
-- 16. ACTIVITY LOG — Track admin actions
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED DEFAULT NULL,
  action      VARCHAR(50) NOT NULL,      -- create, update, delete, login
  entity_type VARCHAR(50) NOT NULL,      -- blog_post, news_article, team_member, etc.
  entity_id   INT UNSIGNED DEFAULT NULL,
  details     TEXT DEFAULT NULL,          -- JSON with changed fields
  ip_address  VARCHAR(45) DEFAULT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 17. CONTACT SUBMISSIONS — Lead & Inquiry CRM Inbox
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(50) DEFAULT NULL,
  company      VARCHAR(150) DEFAULT NULL,
  service      VARCHAR(150) DEFAULT NULL,
  message      TEXT NOT NULL,
  status       ENUM('unread','read','replied','archived') NOT NULL DEFAULT 'unread',
  ip_address   VARCHAR(45) DEFAULT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_email (email)
) ENGINE=InnoDB;
