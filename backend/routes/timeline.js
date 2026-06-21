const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function parseItems(row) {
  if (!row) return row;
  row.items_en = tryParse(row.items_en, []);
  row.items_ar = tryParse(row.items_ar, []);
  return row;
}

function tryParse(v, fb) { try { return typeof v==='string'?JSON.parse(v):v; } catch { return fb; } }

router.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM timeline ORDER BY sort_order ASC, year ASC').all().map(parseItems));
});

router.post('/', requireAuth, (req, res) => {
  const { year, title_en, title_ar, items_en, items_ar, icon, sort_order } = req.body;
  if (!year) return res.status(400).json({ error: 'year required' });
  const r = getDb().prepare(`INSERT INTO timeline (year,title_en,title_ar,items_en,items_ar,icon,sort_order) VALUES (@year,@title_en,@title_ar,@items_en,@items_ar,@icon,@sort_order)`)
    .run({ year, title_en:title_en||'', title_ar:title_ar||'', items_en:JSON.stringify(items_en||[]), items_ar:JSON.stringify(items_ar||[]), icon:icon||'star', sort_order:sort_order||0 });
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', requireAuth, (req, res) => {
  const { year, title_en, title_ar, items_en, items_ar, icon, sort_order } = req.body;
  getDb().prepare(`UPDATE timeline SET year=@year,title_en=@title_en,title_ar=@title_ar,items_en=@items_en,items_ar=@items_ar,icon=@icon,sort_order=@sort_order,updated_at=datetime('now') WHERE id=@id`)
    .run({ year, title_en:title_en||'', title_ar:title_ar||'', items_en:JSON.stringify(items_en||[]), items_ar:JSON.stringify(items_ar||[]), icon:icon||'star', sort_order:sort_order||0, id:req.params.id });
  res.json({ updated: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM timeline WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
