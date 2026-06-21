const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/blog — list published posts (public)
router.get('/', (req, res) => {
  const db = getDb();
  const { category, limit = 50, offset = 0 } = req.query;
  let sql = 'SELECT id,slug,title_en,title_ar,excerpt_en,excerpt_ar,cover_image,category,author,tags,published_at FROM blog_posts WHERE published=1';
  const params = [];
  if (category) { sql += ' AND category=?'; params.push(category); }
  sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  res.json(db.prepare(sql).all(...params));
});

// GET /api/blog/all — all posts (admin)
router.get('/all', requireAuth, (req, res) => {
  res.json(getDb().prepare('SELECT id,slug,title_en,title_ar,cover_image,category,published,published_at,created_at FROM blog_posts ORDER BY created_at DESC').all());
});

// GET /api/blog/:slug — single post (public)
router.get('/:slug', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM blog_posts WHERE slug=? AND published=1').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.blocks_en = tryParse(row.blocks_en, []);
  row.blocks_ar = tryParse(row.blocks_ar, []);
  res.json(row);
});

// GET /api/blog/admin/:id — single post admin
router.get('/admin/:id', requireAuth, (req, res) => {
  const row = getDb().prepare('SELECT * FROM blog_posts WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.blocks_en = tryParse(row.blocks_en, []);
  row.blocks_ar = tryParse(row.blocks_ar, []);
  res.json(row);
});

// POST /api/blog — create
router.post('/', requireAuth, (req, res) => {
  const { slug, title_en, title_ar, excerpt_en, excerpt_ar, cover_image, blocks_en, blocks_ar, category, author, tags, published } = req.body;
  if (!slug || !title_en) return res.status(400).json({ error: 'slug and title_en required' });
  const db = getDb();
  try {
    const r = db.prepare(`INSERT INTO blog_posts (slug,title_en,title_ar,excerpt_en,excerpt_ar,cover_image,blocks_en,blocks_ar,category,author,tags,published,published_at)
      VALUES (@slug,@title_en,@title_ar,@excerpt_en,@excerpt_ar,@cover_image,@blocks_en,@blocks_ar,@category,@author,@tags,@published,@published_at)`)
      .run({ slug, title_en, title_ar:title_ar||'', excerpt_en:excerpt_en||'', excerpt_ar:excerpt_ar||'', cover_image:cover_image||'', blocks_en:JSON.stringify(blocks_en||[]), blocks_ar:JSON.stringify(blocks_ar||[]), category:category||'insights', author:author||'WAVZ Team', tags:JSON.stringify(tags||[]), published:published?1:0, published_at:published?new Date().toISOString():null });
    res.status(201).json({ id: r.lastInsertRowid });
  } catch (e) {
    res.status(409).json({ error: 'Slug already exists' });
  }
});

// PUT /api/blog/:id — update
router.put('/:id', requireAuth, (req, res) => {
  const { slug, title_en, title_ar, excerpt_en, excerpt_ar, cover_image, blocks_en, blocks_ar, category, author, tags, published } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT published FROM blog_posts WHERE id=?').get(req.params.id);
  const wasPublished = existing?.published === 1;
  db.prepare(`UPDATE blog_posts SET slug=@slug,title_en=@title_en,title_ar=@title_ar,excerpt_en=@excerpt_en,excerpt_ar=@excerpt_ar,cover_image=@cover_image,blocks_en=@blocks_en,blocks_ar=@blocks_ar,category=@category,author=@author,tags=@tags,published=@published,published_at=@published_at,updated_at=datetime('now') WHERE id=@id`)
    .run({ slug, title_en, title_ar:title_ar||'', excerpt_en:excerpt_en||'', excerpt_ar:excerpt_ar||'', cover_image:cover_image||'', blocks_en:JSON.stringify(blocks_en||[]), blocks_ar:JSON.stringify(blocks_ar||[]), category:category||'insights', author:author||'WAVZ Team', tags:JSON.stringify(tags||[]), published:published?1:0, published_at:(!wasPublished&&published)?new Date().toISOString():undefined, id:req.params.id });
  res.json({ updated: true });
});

// DELETE /api/blog/:id
router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM blog_posts WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

function tryParse(val, fallback) {
  try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return fallback; }
}

module.exports = router;
