import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const Stat = ({ label, value, sub, color = 'var(--blue)', onClick }) => (
  <div onClick={onClick} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 24px', cursor: onClick ? 'pointer' : 'default', transition:'border-color 0.2s' }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = color)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = 'var(--border)')}>
    <div style={{ fontSize:30, fontWeight:800, color }}>{value ?? '—'}</div>
    <div style={{ fontSize:14, fontWeight:600, color:'var(--white)', marginTop:4 }}>{label}</div>
    {sub && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.dashboard().then(s => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color:'var(--muted)', fontSize:14 }}>Loading dashboard…</div>;

  return (
    <div className="animate-in">
      <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Dashboard</h1>
      <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>WAVZ website management overview</p>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:16, marginBottom:36 }}>
        <Stat label="Unread Contacts" value={stats?.contacts_unread} color="var(--gold)" onClick={() => navigate('/admin/contacts')} />
        <Stat label="Team Members" value={stats?.team} onClick={() => navigate('/admin/team')} />
        <Stat label="Board Members" value={stats?.board} onClick={() => navigate('/admin/board')} />
        <Stat label="Blog Posts" value={stats?.blog} sub={`${stats?.blog_drafts} drafts`} onClick={() => navigate('/admin/blog')} />
        <Stat label="News Articles" value={stats?.news} onClick={() => navigate('/admin/news')} />
        <Stat label="Partners" value={stats?.partners} onClick={() => navigate('/admin/partners')} />
        <Stat label="Testimonials" value={stats?.testimonials} onClick={() => navigate('/admin/testimonials')} />
        <Stat label="Media Files" value={stats?.media} onClick={() => navigate('/admin/media')} />
        <Stat label="Total Contacts" value={stats?.contacts_total} color="var(--muted)" />
      </div>

      {/* Recent contacts */}
      {stats?.recent_contacts?.length > 0 && (
        <div>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14, color:'var(--white)' }}>Recent Contact Submissions</h2>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            {stats.recent_contacts.map((c, i) => (
              <div key={c.id} onClick={() => navigate('/admin/contacts')}
                style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:16, cursor:'pointer', borderBottom: i < stats.recent_contacts.length-1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(17,115,189,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:8, height:8, borderRadius:'50%', background: c.status==='unread' ? 'var(--gold)' : 'var(--border)', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--white)' }}>{c.name}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{c.email} · {c.service || 'General'}</div>
                </div>
                <div style={{ fontSize:11, color:'var(--muted)', flexShrink:0 }}>{new Date(c.created_at).toLocaleDateString()}</div>
                <div style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background: c.status==='unread' ? 'rgba(255,184,20,0.15)' : 'rgba(255,255,255,0.06)', color: c.status==='unread' ? 'var(--gold)' : 'var(--muted)' }}>
                  {c.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
