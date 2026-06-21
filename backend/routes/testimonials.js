const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM testimonials WHERE is_active=1 ORDER BY sort_order ASC').all());
});

router.get('/all', requireAuth, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM testimonials ORDER BY sort_order ASC').all());
});

router.post('/', requireAuth, (req, res) => {
  const { name_en, name_ar, role_en, role_ar, company, quote_en, quote_ar, photo, type, sort_order } = req.body;
  if (!name_en) return res.status(400).json({ error: 'name_en required' });
  const r = getDb().prepare(`INSERT INTO testimonials (name_en,name_ar,role_en,role_ar,company,quote_en,quote_ar,photo,type,sort_order) VALUES (@name_en,@name_ar,@role_en,@role_ar,@company,@quote_en,@quote_ar,@photo,@type,@sort_order)`)
    .run({ name_en, name_ar:name_ar||'', role_en:role_en||'', role_ar:role_ar||'', company:company||'', quote_en:quote_en||'', quote_ar:quote_ar||'', photo:photo||'', type:type||'client', sort_order:sort_order||0 });
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', requireAuth, (req, res) => {
  const { name_en, name_ar, role_en, role_ar, company, quote_en, quote_ar, photo, type, sort_order, is_active } = req.body;
  getDb().prepare(`UPDATE testimonials SET name_en=@name_en,name_ar=@name_ar,role_en=@role_en,role_ar=@role_ar,company=@company,quote_en=@quote_en,quote_ar=@quote_ar,photo=@photo,type=@type,sort_order=@sort_order,is_active=@is_active,updated_at=datetime('now') WHERE id=@id`)
    .run({ name_en, name_ar:name_ar||'', role_en:role_en||'', role_ar:role_ar||'', company:company||'', quote_en:quote_en||'', quote_ar:quote_ar||'', photo:photo||'', type:type||'client', sort_order:sort_order||0, is_active:is_active===false?0:1, id:req.params.id });
  res.json({ updated: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM testimonials WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
