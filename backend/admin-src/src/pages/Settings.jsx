import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const GROUPS = {
  seo:     { label: '🔍 SEO & Meta',       desc: 'Search engine meta tags' },
  analytics: { label: '📊 Analytics',        desc: 'Google Analytics & Meta Pixel' },
  hero:    { label: '🏠 Hero Section',      desc: 'Homepage hero text and CTAs' },
  contact: { label: '📞 Contact Info',      desc: 'Phone, email, address' },
  footer:  { label: '🔻 Footer',            desc: 'Copyright and footer text' },
  social:  { label: '🌐 Social Media',      desc: 'Social media profile URLs' },
  general: { label: '⚙ General',            desc: 'Other settings' },
};

export default function Settings() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeGroup, setActiveGroup] = useState('seo');

  useEffect(() => {
    api.getSettings()
      .then(d => { setGrouped(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const onChange = (key, lang, val) => setEdits(e => ({ ...e, [`${key}__${lang}`]: val }));

  const getValue = (item, lang) => {
    const k = `${item.key}__${lang}`;
    return k in edits ? edits[k] : (item[lang === 'en' ? 'value_en' : 'value_ar'] || '');
  };

  const handleSave = async () => {
    setSaving(true);
    const settingsArr = Object.entries(edits).map(([k, val]) => {
      const [key, lang] = k.split('__');
      return { key, lang, val };
    });

    // Group by key
    const byKey = {};
    settingsArr.forEach(({ key, lang, val }) => {
      if (!byKey[key]) {
        const current = Object.values(grouped).flat().find(s => s.key === key);
        byKey[key] = { key, value_en: current?.value_en || '', value_ar: current?.value_ar || '' };
      }
      if (lang === 'en') byKey[key].value_en = val;
      else byKey[key].value_ar = val;
    });

    try {
      await api.bulkUpdateSettings(Object.values(byKey));
      setSaved(true); setTimeout(() => setSaved(false), 3000);
      setEdits({});
      const d = await api.getSettings();
      setGrouped(d);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const currentItems = grouped[activeGroup] || [];
  const hasChanges = Object.keys(edits).length > 0;

  return (
    <div className="animate-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Site Settings</h1>
          <p style={{ color:'var(--muted)', fontSize:13.5 }}>Manage website text, SEO, and contact info</p>
        </div>
        {hasChanges && (
          <button onClick={handleSave} disabled={saving}
            style={{ padding:'10px 22px', background:'var(--gold)', border:'none', borderRadius:8, color:'var(--navy)', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20 }}>
        {/* Group tabs */}
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {Object.entries(GROUPS).map(([key, { label }]) => (
            (grouped[key]?.length > 0 || loading) && (
              <button key={key} onClick={() => setActiveGroup(key)}
                style={{ padding:'10px 14px', textAlign:'left', background: activeGroup===key ? 'rgba(17,115,189,0.18)' : 'transparent', border: activeGroup===key ? '1px solid rgba(17,115,189,0.3)' : '1px solid transparent', borderRadius:8, color: activeGroup===key ? 'var(--blueL)' : 'var(--muted)', fontSize:13.5, fontWeight: activeGroup===key ? 600 : 400, cursor:'pointer' }}>
                {label}
              </button>
            )
          ))}
        </div>

        {/* Fields */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
          {loading ? <div style={{ color:'var(--muted)' }}>Loading…</div> : (
            <>
              <h2 style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{GROUPS[activeGroup]?.label}</h2>
              <p style={{ fontSize:12.5, color:'var(--muted)', marginBottom:24 }}>{GROUPS[activeGroup]?.desc}</p>
              {currentItems.map(item => (
                <div key={item.key} style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>{item.label || item.key}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {['en','ar'].map(lang => (
                      <div key={lang}>
                        <div style={{ fontSize:11, color:'rgba(145,196,245,0.4)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{lang === 'en' ? '🇬🇧 English' : '🇸🇦 Arabic'}</div>
                        {getValue(item, lang).length > 80 ? (
                          <textarea value={getValue(item, lang)} onChange={e => onChange(item.key, lang, e.target.value)} rows={3} dir={lang==='ar'?'rtl':'ltr'}
                            style={{ width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:7, color:'var(--white)', fontSize:13, outline:'none', resize:'vertical', fontFamily:'var(--font)' }} />
                        ) : (
                          <input type="text" value={getValue(item, lang)} onChange={e => onChange(item.key, lang, e.target.value)} dir={lang==='ar'?'rtl':'ltr'}
                            style={{ width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:7, color:'var(--white)', fontSize:13, outline:'none' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {currentItems.length === 0 && <div style={{ color:'var(--muted)', fontSize:13 }}>No settings in this group.</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
