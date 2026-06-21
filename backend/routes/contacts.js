const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/contacts — public form submission
router.post('/', (req, res) => {
  const { name, company, email, phone, service, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'name, email, and message required' });

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  getDb().prepare(`INSERT INTO contact_submissions (name,company,email,phone,service,message,ip_address) VALUES (@name,@company,@email,@phone,@service,@message,@ip)`)
    .run({ name, company:company||'', email, phone:phone||'', service:service||'', message, ip });

  res.status(201).json({ success: true, message: 'Submission received' });
});

// GET /api/contacts — admin list
router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM contact_submissions';
  const params = [];
  if (status) { sql += ' WHERE status=?'; params.push(status); }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  res.json(getDb().prepare(sql).all(...params));
});

// GET /api/contacts/:id — admin single
router.get('/:id', requireAuth, (req, res) => {
  const row = getDb().prepare('SELECT * FROM contact_submissions WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  // Mark as read
  getDb().prepare("UPDATE contact_submissions SET status='read' WHERE id=? AND status='unread'").run(req.params.id);
  res.json(row);
});

// PUT /api/contacts/:id/status
router.put('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ['unread', 'read', 'replied', 'archived'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  getDb().prepare('UPDATE contact_submissions SET status=? WHERE id=?').run(status, req.params.id);
  res.json({ updated: true });
});

// DELETE /api/contacts/:id
router.delete('/:id', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM contact_submissions WHERE id=?').run(req.params.id);
  res.json({ deleted: true });
});

// GET /api/contacts/stats — unread count
router.get('/stats/unread', requireAuth, (req, res) => {
  const row = getDb().prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE status='unread'").get();
  res.json({ unread: row.count });
});

module.exports = router;
