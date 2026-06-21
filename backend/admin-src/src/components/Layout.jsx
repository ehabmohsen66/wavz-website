import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';

const NAV = [
  { to: '/admin/',           icon: '⊞', label: 'Dashboard' },
  { to: '/admin/contacts',   icon: '✉', label: 'Inbox',        badge: true },
  { to: '/admin/team',       icon: '👥', label: 'Team' },
  { to: '/admin/board',      icon: '🏛', label: 'Board' },
  { to: '/admin/blog',       icon: '📝', label: 'Blog' },
  { to: '/admin/news',       icon: '📰', label: 'News' },
  { to: '/admin/partners',   icon: '🤝', label: 'Partners' },
  { to: '/admin/testimonials',icon:'⭐', label: 'Testimonials' },
  { to: '/admin/timeline',   icon: '📅', label: 'Timeline' },
  { to: '/admin/media',      icon: '🖼', label: 'Media' },
  { to: '/admin/settings',   icon: '⚙', label: 'Settings' },
];

const s = {
  wrap: { display:'flex', height:'100vh', overflow:'hidden' },
  sidebar: { width:220, background:'var(--sidebar)', display:'flex', flexDirection:'column', borderRight:'1px solid var(--border)', flexShrink:0 },
  logo: { padding:'20px 20px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 },
  logoIcon: { width:32, height:32, background:'var(--gold)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'var(--navy)' },
  logoText: { fontSize:14, fontWeight:700, color:'var(--white)' },
  nav: { flex:1, overflowY:'auto', padding:'8px 0' },
  navItem: (active) => ({
    display:'flex', alignItems:'center', gap:10, padding:'9px 16px',
    margin:'2px 8px', borderRadius:8,
    background: active ? 'rgba(17,115,189,0.18)' : 'transparent',
    color: active ? 'var(--blue)' : 'var(--muted)',
    fontSize:13.5, fontWeight: active ? 600 : 400,
    transition:'all 0.15s', cursor:'pointer',
    borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
  }),
  navIcon: { fontSize:15, width:20, textAlign:'center' },
  footer: { padding:'12px 16px', borderTop:'1px solid var(--border)' },
  user: { fontSize:12, color:'var(--muted)', marginBottom:8 },
  logoutBtn: { width:'100%', padding:'8px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, color:'#EF4444', fontSize:13, fontWeight:600 },
  main: { flex:1, overflowY:'auto', display:'flex', flexDirection:'column' },
  topbar: { padding:'16px 28px', borderBottom:'1px solid var(--border)', background:'var(--card)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  content: { padding:'28px', flex:1 },
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>W</div>
          <div>
            <div style={s.logoText}>WAVZ Admin</div>
            <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:'0.1em' }}>CMS PANEL</div>
          </div>
        </div>

        <nav style={s.nav}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin/'} style={({ isActive }) => s.navItem(isActive)}>
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={s.footer}>
          <div style={s.user}>Logged in as<br/><b style={{ color:'var(--white)' }}>{user?.email}</b></div>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <div style={s.topbar}>
          <div style={{ fontSize:13, color:'var(--muted)' }}>
            <span style={{ color:'var(--gold)', fontWeight:700 }}>WAVZ</span> Management Console
          </div>
          <a href="/" target="_blank" rel="noopener" style={{ fontSize:12.5, color:'var(--blueL)', padding:'6px 14px', border:'1px solid rgba(75,163,227,0.3)', borderRadius:6 }}>
            ↗ View Website
          </a>
        </div>
        <div style={s.content}>{children}</div>
      </main>
    </div>
  );
}
