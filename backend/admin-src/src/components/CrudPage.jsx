import React, { useEffect, useState } from 'react';

/* Generic CRUD table page
   Props:
   - title, subtitle
   - fetchFn: async () => items[]
   - columns: [{ key, label, render? }]
   - renderForm: (item, onChange, onImageUpload) => JSX
   - createFn: async (data) => {}
   - updateFn: async (id, data) => {}
   - deleteFn: async (id) => {}
   - emptyForm: {}
   - idKey: 'id'
*/
export default function CrudPage({ title, subtitle, fetchFn, columns, renderForm, createFn, updateFn, deleteFn, emptyForm, idKey = 'id' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    fetchFn().then(d => { setItems(d || []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm({ ...emptyForm }); setModal('create'); setError(''); };
  const openEdit = (item) => { setForm({ ...item }); setModal(item); setError(''); };
  const closeModal = () => { setModal(null); setForm({}); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (modal === 'create') await createFn(form);
      else await updateFn(form[idKey], form);
      load(); closeModal();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try { await deleteFn(deleteId); load(); setDeleteId(null); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const onChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const filtered = items.filter(item =>
    !search || columns.some(c => String(item[c.key] || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, gap:16, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{title}</h1>
          {subtitle && <p style={{ color:'var(--muted)', fontSize:13.5 }}>{subtitle}</p>}
        </div>
        <button onClick={openCreate} style={btnStyle('var(--gold)', 'var(--navy)')}>+ Add New</button>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
        style={{ width:'100%', maxWidth:320, padding:'9px 14px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--white)', fontSize:13.5, marginBottom:16, outline:'none' }} />

      {/* Table */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>No items found.</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {columns.map(c => (
                  <th key={c.key} style={{ padding:'12px 16px', textAlign:'left', fontSize:11.5, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{c.label}</th>
                ))}
                <th style={{ padding:'12px 16px', textAlign:'right', fontSize:11.5, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item[idKey] ?? i} style={{ borderBottom:'1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(17,115,189,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  {columns.map(c => (
                    <td key={c.key} style={{ padding:'12px 16px', fontSize:13.5, color:'var(--white)', maxWidth:260, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {c.render ? c.render(item[c.key], item) : (item[c.key] ?? '—')}
                    </td>
                  ))}
                  <td style={{ padding:'12px 16px', textAlign:'right', whiteSpace:'nowrap' }}>
                    <button onClick={() => openEdit(item)} style={btnStyle('rgba(17,115,189,0.18)', 'var(--blueL)', 12)}>Edit</button>
                    <button onClick={() => setDeleteId(item[idKey])} style={{ ...btnStyle('rgba(239,68,68,0.12)', '#EF4444', 12), marginLeft:6 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ fontSize:12, color:'var(--muted)', marginTop:8 }}>{filtered.length} of {items.length} items</div>

      {/* Edit / Create Modal */}
      {modal && (
        <Overlay onClick={closeModal}>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto', padding:32 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>{modal === 'create' ? `New ${title}` : `Edit`}</h2>
            {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#EF4444', fontSize:13 }}>{error}</div>}
            {renderForm(form, onChange)}
            <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
              <button onClick={closeModal} style={btnStyle('rgba(255,255,255,0.06)', 'var(--muted)')}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btnStyle('var(--gold)', 'var(--navy)')}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Overlay onClick={() => setDeleteId(null)}>
          <div style={{ background:'var(--card)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:14, padding:32, maxWidth:400, width:'100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize:17, fontWeight:700, marginBottom:10 }}>Confirm Delete</h3>
            <p style={{ color:'var(--muted)', fontSize:14, marginBottom:24 }}>This action cannot be undone.</p>
            {error && <div style={{ color:'#EF4444', fontSize:13, marginBottom:12 }}>{error}</div>}
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={btnStyle('rgba(255,255,255,0.06)', 'var(--muted)')}>Cancel</button>
              <button onClick={handleDelete} disabled={saving} style={btnStyle('rgba(239,68,68,0.2)', '#EF4444')}>{saving ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:11.5, fontWeight:700, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder = '', type = 'text', ...rest }) {
  return <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width:'100%', padding:'10px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:7, color:'var(--white)', fontSize:13.5, outline:'none' }} {...rest} />;
}

export function Textarea({ value, onChange, rows = 4, placeholder = '' }) {
  return <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
    style={{ width:'100%', padding:'10px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:7, color:'var(--white)', fontSize:13.5, outline:'none', resize:'vertical' }} />;
}

export function Select({ value, onChange, options }) {
  return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)}
      style={{ width:'100%', padding:'10px 12px', background:'var(--sidebar)', border:'1px solid var(--border)', borderRadius:7, color:'var(--white)', fontSize:13.5, outline:'none' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Toggle({ label, value, onChange }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
      <div onClick={() => onChange(!value)} style={{ width:40, height:22, borderRadius:11, background: value ? 'var(--blue)' : 'rgba(255,255,255,0.1)', position:'relative', transition:'background 0.2s', cursor:'pointer' }}>
        <div style={{ position:'absolute', top:3, left: value ? 20 : 3, width:16, height:16, borderRadius:'50%', background:'white', transition:'left 0.2s' }} />
      </div>
      <span style={{ fontSize:13.5, color:'var(--white)' }}>{label}</span>
    </label>
  );
}

function Overlay({ onClick, children }) {
  return (
    <div onClick={onClick} style={{ position:'fixed', inset:0, background:'rgba(6,30,49,0.85)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      {children}
    </div>
  );
}

function btnStyle(bg, color, fontSize = 13.5) {
  return { padding:'9px 18px', background:bg, border:'none', borderRadius:7, color, fontSize, fontWeight:600, cursor:'pointer', transition:'opacity 0.15s' };
}
