const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT * FROM board WHERE is_active=1 ORDER BY sort_order ASC, id ASC').all());
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM board WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.post('/', requireAuth, (req, res) => {
  const { name_en, name_ar, title_en, title_ar, bio_en, bio_ar, photo, linkedin, sort_order } = req.body;
  if (!name_en) return res.status(400).json({ error: 'name_en required' });
  const db = getDb();
  const r = db.prepare(`INSERT INTO board (name_en,name_ar,title_en,title_ar,bio_en,bio_ar,photo,linkedin,sort_order) VALUES (@name_en,@name_ar,@title_en,@title_ar,@bio_en,@bio_ar,@photo,@linkedin,@sort_order)`)
    .run({ name_en, name_ar:name_ar||'', title_en:title_en||'', title_ar:title_ar||'', bio_en:bio_en||'', bio_ar:bio_ar||'', photo:photo||'', linkedin:linkedin||'', sort_order:sort_order||0 });
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', requireAuth, (req, res) => {
  const { name_en, name_ar, title_en, title_ar, bio_en, bio_ar, photo, linkedin, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare(`UPDATE board SET name_en=@name_en,name_ar=@name_ar,title_en=@title_en,title_ar=@title_ar,bio_en=@bio_en,bio_ar=@bio_ar,photo=@photo,linkedin=@linkedin,sort_order=@sort_order,is_active=@is_active,updated_at=datetime('now') WHERE id=@id`)
    .run({ name_en, name_ar:name_ar||'', title_en:title_en||'', title_ar:title_ar||'', bio_en:bio_en||'', bio_ar:bio_ar||'', photo:photo||'', linkedin:linkedin||'', sort_order:sort_order||0, is_active:is_active===false?0:1, id:req.params.id });
  res.json({ updated: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM board WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
