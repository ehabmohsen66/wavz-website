const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM partners WHERE is_active=1 ORDER BY sort_order ASC, id ASC').all());
});

router.get('/all', requireAuth, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM partners ORDER BY sort_order ASC').all());
});

router.post('/', requireAuth, (req, res) => {
  const { name_en, name_ar, logo, website, tier, description_en, description_ar, sort_order } = req.body;
  if (!name_en) return res.status(400).json({ error: 'name_en required' });
  const r = getDb().prepare(`INSERT INTO partners (name_en,name_ar,logo,website,tier,description_en,description_ar,sort_order) VALUES (@name_en,@name_ar,@logo,@website,@tier,@description_en,@description_ar,@sort_order)`)
    .run({ name_en, name_ar:name_ar||'', logo:logo||'', website:website||'', tier:tier||'standard', description_en:description_en||'', description_ar:description_ar||'', sort_order:sort_order||0 });
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', requireAuth, (req, res) => {
  const { name_en, name_ar, logo, website, tier, description_en, description_ar, sort_order, is_active } = req.body;
  getDb().prepare(`UPDATE partners SET name_en=@name_en,name_ar=@name_ar,logo=@logo,website=@website,tier=@tier,description_en=@description_en,description_ar=@description_ar,sort_order=@sort_order,is_active=@is_active,updated_at=datetime('now') WHERE id=@id`)
    .run({ name_en, name_ar:name_ar||'', logo:logo||'', website:website||'', tier:tier||'standard', description_en:description_en||'', description_ar:description_ar||'', sort_order:sort_order||0, is_active:is_active===false?0:1, id:req.params.id });
  res.json({ updated: true });
});

router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM partners WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
