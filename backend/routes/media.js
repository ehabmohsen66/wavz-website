const express = require('express');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { upload, UPLOADS_DIR } = require('../middleware/upload');

const router = express.Router();

// POST /api/media/upload — upload file
router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const folder = req.query.folder || 'general';
  const url = `/uploads/${folder}/${req.file.filename}`;

  const r = getDb().prepare(`INSERT INTO media (filename, original, mimetype, size, url, folder) VALUES (@filename, @original, @mimetype, @size, @url, @folder)`)
    .run({ filename: req.file.filename, original: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size, url, folder });

  res.status(201).json({ id: r.lastInsertRowid, url, filename: req.file.filename, original: req.file.originalname });
});

// GET /api/media — list all
router.get('/', requireAuth, (req, res) => {
  const { folder } = req.query;
  let sql = 'SELECT * FROM media';
  const params = [];
  if (folder) { sql += ' WHERE folder=?'; params.push(folder); }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  res.json(getDb().prepare(sql).all(...params));
});

// DELETE /api/media/:id
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM media WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  // Delete file from disk
  const filePath = path.join(UPLOADS_DIR, row.folder, row.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  db.prepare('DELETE FROM media WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;
