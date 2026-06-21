-- WAVZ CMS Database Schema
-- SQLite with better-sqlite3

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─── USERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE,
  password    TEXT    NOT NULL,
  name        TEXT    NOT NULL DEFAULT 'Admin',
  role        TEXT    NOT NULL DEFAULT 'admin',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── SETTINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  key         TEXT    NOT NULL UNIQUE,
  value_en    TEXT    DEFAULT '',
  value_ar    TEXT    DEFAULT '',
  group_name  TEXT    NOT NULL DEFAULT 'general',
  label       TEXT    NOT NULL DEFAULT '',
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── TEAM ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en     TEXT    NOT NULL,
  name_ar     TEXT    NOT NULL DEFAULT '',
  title_en    TEXT    NOT NULL DEFAULT '',
  title_ar    TEXT    NOT NULL DEFAULT '',
  bio_en      TEXT    DEFAULT '',
  bio_ar      TEXT    DEFAULT '',
  photo       TEXT    DEFAULT '',
  linkedin    TEXT    DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── BOARD ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS board (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en     TEXT    NOT NULL,
  name_ar     TEXT    NOT NULL DEFAULT '',
  title_en    TEXT    NOT NULL DEFAULT '',
  title_ar    TEXT    NOT NULL DEFAULT '',
  bio_en      TEXT    DEFAULT '',
  bio_ar      TEXT    DEFAULT '',
  photo       TEXT    DEFAULT '',
  linkedin    TEXT    DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── BLOG POSTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title_en      TEXT    NOT NULL DEFAULT '',
  title_ar      TEXT    DEFAULT '',
  excerpt_en    TEXT    DEFAULT '',
  excerpt_ar    TEXT    DEFAULT '',
  cover_image   TEXT    DEFAULT '',
  blocks_en     TEXT    DEFAULT '[]',
  blocks_ar     TEXT    DEFAULT '[]',
  category      TEXT    DEFAULT 'insights',
  author        TEXT    DEFAULT 'WAVZ Team',
  tags          TEXT    DEFAULT '[]',
  published     INTEGER DEFAULT 0,
  published_at  TEXT    DEFAULT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── NEWS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title_en      TEXT    NOT NULL DEFAULT '',
  title_ar      TEXT    DEFAULT '',
  summary_en    TEXT    DEFAULT '',
  summary_ar    TEXT    DEFAULT '',
  body_en       TEXT    DEFAULT '',
  body_ar       TEXT    DEFAULT '',
  image         TEXT    DEFAULT '',
  category      TEXT    DEFAULT 'press-releases',
  source_url    TEXT    DEFAULT '',
  published     INTEGER DEFAULT 1,
  published_at  TEXT    DEFAULT (datetime('now')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── PARTNERS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en     TEXT    NOT NULL,
  name_ar     TEXT    DEFAULT '',
  logo        TEXT    DEFAULT '',
  website     TEXT    DEFAULT '',
  tier        TEXT    DEFAULT 'standard',
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── TESTIMONIALS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en     TEXT    NOT NULL,
  name_ar     TEXT    DEFAULT '',
  role_en     TEXT    DEFAULT '',
  role_ar     TEXT    DEFAULT '',
  company     TEXT    DEFAULT '',
  quote_en    TEXT    DEFAULT '',
  quote_ar    TEXT    DEFAULT '',
  photo       TEXT    DEFAULT '',
  type        TEXT    DEFAULT 'client',
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── TIMELINE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  year        TEXT    NOT NULL,
  title_en    TEXT    NOT NULL DEFAULT '',
  title_ar    TEXT    DEFAULT '',
  items_en    TEXT    DEFAULT '[]',
  items_ar    TEXT    DEFAULT '[]',
  icon        TEXT    DEFAULT 'star',
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── CONTACT SUBMISSIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  company     TEXT    DEFAULT '',
  email       TEXT    NOT NULL,
  phone       TEXT    DEFAULT '',
  service     TEXT    DEFAULT '',
  message     TEXT    NOT NULL,
  status      TEXT    DEFAULT 'unread',
  ip_address  TEXT    DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── MEDIA ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  filename    TEXT    NOT NULL,
  original    TEXT    NOT NULL,
  mimetype    TEXT    NOT NULL,
  size        INTEGER DEFAULT 0,
  url         TEXT    NOT NULL,
  folder      TEXT    DEFAULT 'general',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── NAVIGATION ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS navigation (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  label_en    TEXT    NOT NULL,
  label_ar    TEXT    DEFAULT '',
  href        TEXT    NOT NULL,
  parent_id   INTEGER DEFAULT NULL,
  sort_order  INTEGER DEFAULT 0,
  is_active   INTEGER DEFAULT 1
);
