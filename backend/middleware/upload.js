const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads folders exist
['team', 'board', 'blog', 'news', 'partners', 'testimonials', 'general'].forEach(folder => {
  const p = path.join(UPLOADS_DIR, folder);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = req.params.folder || req.query.folder || 'general';
    const allowed = ['team', 'board', 'blog', 'news', 'partners', 'testimonials', 'general'];
    const dest = allowed.includes(folder) ? path.join(UPLOADS_DIR, folder) : path.join(UPLOADS_DIR, 'general');
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = { upload, UPLOADS_DIR };
