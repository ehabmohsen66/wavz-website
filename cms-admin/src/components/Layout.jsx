import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoWhite from '../assets/Logo-white.png';
import ErrorBoundary from './ErrorBoundary';

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'grid' },
  { section: 'Content' },
  { label: 'Blog Posts', path: '/blog', icon: 'edit' },
  { label: 'News Articles', path: '/news', icon: 'newspaper' },
  { label: 'Case Studies', path: '/case-studies', icon: 'book-open' },
  { label: 'Services', path: '/services', icon: 'layers' },
  { section: 'Website Pages' },
  { label: 'Homepage Editor', path: '/homepage', icon: 'home' },
  { label: 'Static Pages', path: '/pages', icon: 'file-text' },
  { label: 'Clients (Logo Strip)', path: '/clients', icon: 'award' },
  { section: 'Inquiries & Leads' },
  { label: 'Inquiries Inbox', path: '/inquiries', icon: 'inbox' },
  { section: 'Data' },
  { label: 'Team', path: '/team', icon: 'users' },
  { label: 'Partners', path: '/partners', icon: 'handshake' },
  { label: 'Timeline', path: '/timeline', icon: 'clock' },
  { label: 'Testimonials', path: '/testimonials', icon: 'message-square' },
  { section: 'System' },
  { label: 'Media Library', path: '/media', icon: 'image' },
  { label: 'Navigation', path: '/navigation', icon: 'menu' },
  { label: 'Analytics & Tags', path: '/analytics', icon: 'bar-chart' },
  { label: 'Site Tools', path: '/tools', icon: 'tool' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];

const adminOnlyItems = [
  { label: 'Users', path: '/users', icon: 'user-plus' },
];

function SvgIcon({ name }) {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    newspaper: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></>,
    'book-open': <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    handshake: <><path d="M11 17a1 1 0 0 1-1 1H6l-4 4V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/><path d="M14 9h6a2 2 0 0 1 2 2v9l-4-4h-4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    'message-square': <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    'bar-chart': <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    tool: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    'user-plus': <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>,
    'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || icons.grid}
    </svg>
  );
}

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'WZ';

  const allNavItems = user?.role === 'admin'
    ? [...navItems.slice(0, -1), ...adminOnlyItems, navItems[navItems.length - 1]]
    : navItems;

  const getHeaderTitle = () => {
    if (title) return title;
    const path = location.pathname.replace(/^\/admin/, '') || '/';
    if (path === '/' || path === '') return 'Dashboard';
    const cleanPath = path.split('?')[0];
    const match = [...navItems, ...adminOnlyItems].find(item => item.path === cleanPath);
    if (match) return match.label;
    if (cleanPath.startsWith('/blog')) return 'Blog Posts';
    if (cleanPath.startsWith('/news')) return 'News Articles';
    if (cleanPath.startsWith('/case-studies')) return 'Case Studies';
    if (cleanPath.startsWith('/services')) return 'Services';
    if (cleanPath.startsWith('/homepage')) return 'Homepage Editor';
    if (cleanPath.startsWith('/pages')) return 'Static Pages Content';
    if (cleanPath.startsWith('/clients')) return 'Client Brands & Logo Strip';
    if (cleanPath.startsWith('/team')) return 'Team & Leadership';
    if (cleanPath.startsWith('/partners')) return 'Strategic Partners';
    if (cleanPath.startsWith('/timeline')) return 'Company Timeline';
    if (cleanPath.startsWith('/testimonials')) return 'Client Testimonials';
    if (cleanPath.startsWith('/media')) return 'Media Library';
    if (cleanPath.startsWith('/inquiries')) return 'Inquiries Inbox';
    if (cleanPath.startsWith('/analytics')) return 'Analytics & Tags';
    if (cleanPath.startsWith('/tools')) return 'Site Tools';
    if (cleanPath.startsWith('/users')) return 'User Management';
    if (cleanPath.startsWith('/settings')) return 'System Settings';
    if (cleanPath.startsWith('/profile')) return 'My Profile';
    return 'Dashboard';
  };

  return (
    <div className="admin-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-logo-link" title="WAVZ CMS Dashboard">
            <img 
              src={logoWhite} 
              alt="WAVZ for Digital Transformation" 
              className="sidebar-logo-img" 
            />
          </Link>
          <span className="sidebar-logo-badge">CMS</span>
        </div>

        <nav className="sidebar-nav">
          {allNavItems.map((item, i) => {
            if (item.section) {
              return <div key={`section-${i}`} className="sidebar-section-label">{item.section}</div>;
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <SvgIcon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{userInitials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
              <div className="sidebar-user-role">{user?.role || 'admin'}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
              <SvgIcon name="log-out" />
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <h1 className="admin-header-title">{getHeaderTitle()}</h1>
          </div>
          <div className="admin-header-right">
            <div
              className="header-avatar"
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              {userInitials}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <ErrorBoundary>
            {children || <Outlet />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
