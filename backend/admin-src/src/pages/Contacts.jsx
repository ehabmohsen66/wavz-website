import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const STATUS_COLORS = { unread:'var(--gold)', read:'var(--blueL)', replied:'var(--success)', archived:'var(--muted)' };
const STATUS_BG = { unread:'rgba(255,184,20,0.12)', read:'rgba(75,163,227,0.12)', replied:'rgba(34,197,94,0.12)', archived:'rgba(255,255,255,0.06)' };

export default function Contacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.getContacts(filter === 'all' ? null : filter)
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const openContact = async (item) => {
    setSelected(item);
    if (item.status === 'unread') {
      await api.updateContactStatus(item.id, 'read').catch(() => {});
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status:'read' } : i));
    }
  };

  const changeStatus = async (id, status) => {
    await api.updateContactStatus(id, status).catch(() => {});
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    setDeleting(true);
    await api.deleteContact(id).catch(() => {});
    setItems(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(false);
  };

  const unread = items.filter(i => i.status === 'unread').length;

  return (
    <div className="animate-in" style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)' }}>
      <div style={{ marginBottom:16 }}>
        <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Contact Inbox {unread > 0 && <span style={{ fontSize:14, padding:'2px 10px', borderRadius:20, background:'rgba(255,184,20,0.15)', color:'var(--gold)', marginLeft:8 }}>{unread} unread</span>}</h1>
        <p style={{ color:'var(--muted)', fontSize:13.5 }}>Form submissions from wavz.com.eg/contact</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['all','unread','read','replied','archived'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 14px', borderRadius:20, border:'1px solid', fontSize:13, fontWeight: filter===f ? 700 : 400,
              background: filter===f ? 'rgba(17,115,189,0.18)' : 'transparent',
              borderColor: filter===f ? 'var(--blue)' : 'var(--border)',
              color: filter===f ? 'var(--blueL)' : 'var(--muted)', cursor:'pointer', textTransform:'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:16, flex:1, minHeight:0 }}>
        {/* List */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflowY:'auto' }}>
          {loading ? <div style={{ padding:24, color:'var(--muted)', fontSize:13 }}>Loading…</div>
          : items.length === 0 ? <div style={{ padding:24, color:'var(--muted)', fontSize:13, textAlign:'center' }}>No submissions found.</div>
          : items.map(item => (
            <div key={item.id} onClick={() => openContact(item)} style={{
              padding:'14px 16px', cursor:'pointer', borderBottom:'1px solid var(--border)',
              background: selected?.id === item.id ? 'rgba(17,115,189,0.1)' : 'transparent',
              borderLeft: `3px solid ${item.status==='unread' ? 'var(--gold)' : 'transparent'}`,
            }}
              onMouseEnter={e => { if (selected?.id !== item.id) e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (selected?.id !== item.id) e.currentTarget.style.background='transparent'; }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight: item.status==='unread' ? 700 : 500, color:'var(--white)' }}>{item.name}</span>
                <span style={{ fontSize:11, color:'var(--muted)', flexShrink:0, marginLeft:8 }}>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>{item.email}</div>
              <div style={{ fontSize:12, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.service || 'General'} · {item.message?.slice(0,50)}…</div>
              <div style={{ marginTop:6 }}>
                <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background: STATUS_BG[item.status], color: STATUS_COLORS[item.status] }}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflowY:'auto', padding:28 }}>
          {!selected ? (
            <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontSize:14 }}>Select a submission to view details</div>
          ) : (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <div>
                  <h2 style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} style={{ fontSize:13.5, color:'var(--blueL)' }}>{selected.email}</a>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <a href={`mailto:${selected.email}?subject=Re: Your WAVZ enquiry`}
                    style={{ padding:'8px 14px', background:'rgba(17,115,189,0.18)', border:'1px solid rgba(17,115,189,0.3)', borderRadius:7, color:'var(--blueL)', fontSize:13, fontWeight:600 }}>
                    Reply ↗
                  </a>
                  <button onClick={() => deleteContact(selected.id)} disabled={deleting}
                    style={{ padding:'8px 14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:7, color:'#EF4444', fontSize:13, fontWeight:600 }}>
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
                {[['Company', selected.company],['Phone', selected.phone],['Service', selected.service],['Date', new Date(selected.created_at).toLocaleString()]].map(([l,v]) => (
                  <div key={l}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{l}</div>
                    <div style={{ fontSize:13.5, color:'var(--white)' }}>{v || '—'}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Message</div>
                <div style={{ fontSize:14, color:'var(--white)', lineHeight:1.7, background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'14px 16px', whiteSpace:'pre-wrap' }}>{selected.message}</div>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Status</div>
                <div style={{ display:'flex', gap:8 }}>
                  {['unread','read','replied','archived'].map(s => (
                    <button key={s} onClick={() => changeStatus(selected.id, s)}
                      style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${selected.status===s ? STATUS_COLORS[s] : 'var(--border)'}`, background: selected.status===s ? STATUS_BG[s] : 'transparent', color: selected.status===s ? STATUS_COLORS[s] : 'var(--muted)', fontSize:12, fontWeight: selected.status===s ? 700 : 400, cursor:'pointer', textTransform:'capitalize' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
