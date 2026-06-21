const bcrypt = require('bcryptjs');
const { getDb } = require('./database');

async function seed() {
  const db = getDb();
  console.log('🌱 Seeding database...');

  // ── Admin user ──
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL || 'admin@wavz.com.eg');
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Wavz@2024!', 12);
    db.prepare(`INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`).run(
      process.env.ADMIN_EMAIL || 'admin@wavz.com.eg',
      hash,
      'WAVZ Admin',
      'admin'
    );
    console.log('✅ Admin user created:', process.env.ADMIN_EMAIL || 'admin@wavz.com.eg');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // ── Default settings ──
  const defaults = [
    { key: 'site_title',        value_en: 'WAVZ for Digital Transformation', value_ar: 'وافز للتحول الرقمي',   group_name: 'seo',     label: 'Site Title' },
    { key: 'meta_description',  value_en: 'WAVZ is the trusted IT managed services and digital transformation partner for banks, ministries, and large enterprises across the Middle East and Africa.', value_ar: 'وافز هي شريك خدمات تكنولوجيا المعلومات الموثوق والتحول الرقمي للبنوك والوزارات والمؤسسات الكبرى.', group_name: 'seo', label: 'Meta Description' },
    { key: 'meta_keywords',     value_en: 'digital transformation, IT managed services, enterprise IT, Middle East, Africa', value_ar: 'التحول الرقمي، خدمات تكنولوجيا المعلومات، الشرق الأوسط، أفريقيا', group_name: 'seo', label: 'Meta Keywords' },
    { key: 'contact_phone',     value_en: '+20 (0) 2 2690 3555', value_ar: '+20 (0) 2 2690 3555', group_name: 'contact', label: 'Phone Number' },
    { key: 'contact_email',     value_en: 'info@wavz.com.eg',   value_ar: 'info@wavz.com.eg',   group_name: 'contact', label: 'Email Address' },
    { key: 'contact_address',   value_en: 'Smart Village, Building B2, Cairo, Egypt', value_ar: 'القرية الذكية، مبنى B2، القاهرة، مصر', group_name: 'contact', label: 'Address' },
    { key: 'footer_copy',       value_en: '© 2024 WAVZ for Digital Transformation. All rights reserved.', value_ar: '© 2024 وافز للتحول الرقمي. جميع الحقوق محفوظة.', group_name: 'footer', label: 'Footer Copyright' },
    { key: 'hero_tagline',      value_en: 'MANAGED SERVICES',   value_ar: 'الخدمات المُدارة',   group_name: 'hero',    label: 'Hero Tagline' },
    { key: 'hero_title_1',      value_en: 'Digital',            value_ar: 'التحول',              group_name: 'hero',    label: 'Hero Title Word 1' },
    { key: 'hero_title_accent', value_en: 'Transformation',     value_ar: 'الرقمي',              group_name: 'hero',    label: 'Hero Title Accent' },
    { key: 'hero_cta_consult',  value_en: 'Book a consultation',value_ar: 'احجز استشارة',        group_name: 'hero',    label: 'Hero CTA 1' },
    { key: 'hero_cta_savings',  value_en: 'Calculate savings',  value_ar: 'احسب وفوراتك',       group_name: 'hero',    label: 'Hero CTA 2' },
    { key: 'social_linkedin',   value_en: 'https://linkedin.com/company/wavz', value_ar: 'https://linkedin.com/company/wavz', group_name: 'social', label: 'LinkedIn URL' },
    { key: 'social_facebook',   value_en: '', value_ar: '', group_name: 'social', label: 'Facebook URL' },
    { key: 'social_instagram',  value_en: '', value_ar: '', group_name: 'social', label: 'Instagram URL' },
  ];

  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value_en, value_ar, group_name, label)
    VALUES (@key, @value_en, @value_ar, @group_name, @label)
  `);
  defaults.forEach(s => insertSetting.run(s));
  console.log(`✅ ${defaults.length} default settings inserted`);

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

require('dotenv').config();
seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
