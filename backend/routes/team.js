const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/team — public
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM team WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

// GET /api/team/:id — public
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM team WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// POST /api/team — admin only
router.post('/', requireAuth, (req, res) => {
  const { name_en, name_ar, title_en, title_ar, bio_en, bio_ar, photo, linkedin, sort_order } = req.body;
  if (!name_en) return res.status(400).json({ error: 'name_en required' });
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO team (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, photo, linkedin, sort_order)
    VALUES (@name_en, @name_ar, @title_en, @title_ar, @bio_en, @bio_ar, @photo, @linkedin, @sort_order)
  `).run({ name_en, name_ar: name_ar||'', title_en: title_en||'', title_ar: title_ar||'', bio_en: bio_en||'', bio_ar: bio_ar||'', photo: photo||'', linkedin: linkedin||'', sort_order: sort_order||0 });
  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/team/:id — admin only
router.put('/:id', requireAuth, (req, res) => {
  const { name_en, name_ar, title_en, title_ar, bio_en, bio_ar, photo, linkedin, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare(`
    UPDATE team SET name_en=@name_en, name_ar=@name_ar, title_en=@title_en, title_ar=@title_ar,
    bio_en=@bio_en, bio_ar=@bio_ar, photo=@photo, linkedin=@linkedin, sort_order=@sort_order,
    is_active=@is_active, updated_at=datetime('now') WHERE id=@id
  `).run({ name_en, name_ar: name_ar||'', title_en: title_en||'', title_ar: title_ar||'', bio_en: bio_en||'', bio_ar: bio_ar||'', photo: photo||'', linkedin: linkedin||'', sort_order: sort_order||0, is_active: is_active===false?0:1, id: req.params.id });
  res.json({ updated: true });
});

// DELETE /api/team/:id — admin only
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM team WHERE id = ?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
