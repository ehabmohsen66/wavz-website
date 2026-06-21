const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM news WHERE published=1';
  const params = [];
  if (category) { sql += ' AND category=?'; params.push(category); }
  sql += ' ORDER BY published_at DESC LIMIT 100';
  res.json(getDb().prepare(sql).all(...params));
});

router.get('/all', requireAuth, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM news ORDER BY created_at DESC').all());
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM news WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.post('/', requireAuth, (req, res) => {
  const { title_en, title_ar, summary_en, summary_ar, body_en, body_ar, image, category, source_url, published } = req.body;
  if (!title_en) return res.status(400).json({ error: 'title_en required' });
  const r = getDb().prepare(`INSERT INTO news (title_en,title_ar,summary_en,summary_ar,body_en,body_ar,image,category,source_url,published)
    VALUES (@title_en,@title_ar,@summary_en,@summary_ar,@body_en,@body_ar,@image,@category,@source_url,@published)`)
    .run({ title_en, title_ar:title_ar||'', summary_en:summary_en||'', summary_ar:summary_ar||'', body_en:body_en||'', body_ar:body_ar||'', image:image||'', category:category||'press-releases', source_url:source_url||'', published:published?1:1 });
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', requireAuth, (req, res) => {
  const { title_en, title_ar, summary_en, summary_ar, body_en, body_ar, image, category, source_url, published } = req.body;
  getDb().prepare(`UPDATE news SET title_en=@title_en,title_ar=@title_ar,summary_en=@summary_en,summary_ar=@summary_ar,body_en=@body_en,body_ar=@body_ar,image=@image,category=@category,source_url=@source_url,published=@published,updated_at=datetime('now') WHERE id=@id`)
    .run({ title_en, title_ar:title_ar||'', summary_en:summary_en||'', summary_ar:summary_ar||'', body_en:body_en||'', body_ar:body_ar||'', image:image||'', category:category||'press-releases', source_url:source_url||'', published:published?1:0, id:req.params.id });
  res.json({ updated: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM news WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
