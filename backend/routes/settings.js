const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/settings — all settings (public, for frontend)
router.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM settings ORDER BY group_name, key').all());
});

// GET /api/settings/grouped — grouped (admin)
router.get('/grouped', requireAuth, (req, res) => {
  const rows = getDb().prepare('SELECT * FROM settings ORDER BY group_name, key').all();
  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.group_name]) acc[row.group_name] = [];
    acc[row.group_name].push(row);
    return acc;
  }, {});
  res.json(grouped);
});

// PUT /api/settings/:key — update one setting
router.put('/:key', requireAuth, (req, res) => {
  const { value_en, value_ar } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM settings WHERE key=?').get(req.params.key);
  if (existing) {
    db.prepare(`UPDATE settings SET value_en=@value_en, value_ar=@value_ar, updated_at=datetime('now') WHERE key=@key`)
      .run({ value_en: value_en||'', value_ar: value_ar||'', key: req.params.key });
  } else {
    db.prepare(`INSERT INTO settings (key, value_en, value_ar) VALUES (@key, @value_en, @value_ar)`)
      .run({ key: req.params.key, value_en: value_en||'', value_ar: value_ar||'' });
  }
  res.json({ updated: true });
});

// PUT /api/settings — bulk update
router.put('/', requireAuth, (req, res) => {
  const { settings } = req.body; // array of { key, value_en, value_ar }
  if (!Array.isArray(settings)) return res.status(400).json({ error: 'settings array required' });
  const db = getDb();
  const upsert = db.prepare(`INSERT INTO settings (key,value_en,value_ar) VALUES (@key,@value_en,@value_ar)
    ON CONFLICT(key) DO UPDATE SET value_en=excluded.value_en, value_ar=excluded.value_ar, updated_at=datetime('now')`);
  const tx = db.transaction(items => items.forEach(s => upsert.run({ key:s.key, value_en:s.value_en||'', value_ar:s.value_ar||'' })));
  tx(settings);
  res.json({ updated: settings.length });
});

module.exports = router;
