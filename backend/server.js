require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS ────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://wavz.com.eg',
  'https://www.wavz.com.eg',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Body parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static: uploaded files ──────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// ── API Routes ──────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/team',         require('./routes/team'));
app.use('/api/board',        require('./routes/board'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/news',         require('./routes/news'));
app.use('/api/partners',     require('./routes/partners'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/timeline',     require('./routes/timeline'));
app.use('/api/settings',     require('./routes/settings'));
app.use('/api/contacts',     require('./routes/contacts'));
app.use('/api/media',        require('./routes/media'));

// ── Navigation (simple read from settings + static fallback) ──
app.get('/api/navigation', (req, res) => {
  const { getDb } = require('./db/database');
  const rows = getDb().prepare('SELECT * FROM navigation WHERE is_active=1 ORDER BY sort_order ASC').all();
  res.json(rows);
});

// ── Dashboard stats ─────────────────────────────────────
app.get('/api/dashboard', require('./middleware/auth').requireAuth, (req, res) => {
  const { getDb } = require('./db/database');
  const db = getDb();
  res.json({
    team:        db.prepare('SELECT COUNT(*) as c FROM team WHERE is_active=1').get().c,
    board:       db.prepare('SELECT COUNT(*) as c FROM board WHERE is_active=1').get().c,
    blog:        db.prepare('SELECT COUNT(*) as c FROM blog_posts WHERE published=1').get().c,
    blog_drafts: db.prepare('SELECT COUNT(*) as c FROM blog_posts WHERE published=0').get().c,
    news:        db.prepare('SELECT COUNT(*) as c FROM news WHERE published=1').get().c,
    partners:    db.prepare('SELECT COUNT(*) as c FROM partners WHERE is_active=1').get().c,
    testimonials:db.prepare('SELECT COUNT(*) as c FROM testimonials WHERE is_active=1').get().c,
    contacts_unread: db.prepare("SELECT COUNT(*) as c FROM contact_submissions WHERE status='unread'").get().c,
    contacts_total:  db.prepare('SELECT COUNT(*) as c FROM contact_submissions').get().c,
    media:       db.prepare('SELECT COUNT(*) as c FROM media').get().c,
    recent_contacts: db.prepare('SELECT id,name,email,service,status,created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5').all(),
  });
});

// ── Admin SPA ────────────────────────────────────────────
const ADMIN_BUILD = path.join(__dirname, 'admin-dist');
if (fs.existsSync(ADMIN_BUILD)) {
  app.use('/admin', express.static(ADMIN_BUILD));
  app.get('/admin/*', (_req, res) => res.sendFile(path.join(ADMIN_BUILD, 'index.html')));
} else {
  app.get('/admin', (_req, res) => res.send('<h2>Admin panel not built yet. Run: npm run build:admin</h2>'));
}

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0', time: new Date().toISOString() }));

// ── 404 handler ──────────────────────────────────────────
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// ── Error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 WAVZ Backend running on http://localhost:${PORT}`);
  console.log(`📡 API:    http://localhost:${PORT}/api/health`);
  console.log(`🛠  Admin: http://localhost:${PORT}/admin`);
  console.log(`\nDefault admin login:`);
  console.log(`  Email:    ${process.env.ADMIN_EMAIL || 'admin@wavz.com.eg'}`);
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Wavz@2024!'}\n`);
});
