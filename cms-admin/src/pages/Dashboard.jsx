import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useToast } from '../contexts/ToastContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data || res);
    } catch (err) {
      toast.error('Failed to load dashboard metrics: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading dashboard metrics...</span>
      </div>
    );
  }

  const stats = data?.stats || {};
  const activities = data?.recent_activity || [];

  return (
    <div className="dashboard-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time metrics and system activity logs.</p>
        </div>
        <div className="page-actions">
          <Link to="/blog/new" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Write Blog Post
          </Link>
          <Link to="/media" className="btn btn-secondary">
            Upload Media
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-title">Blog Posts</span>
            <div className="stats-card-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
          </div>
          <div className="stats-card-value">{stats.blog_posts?.total ?? 0}</div>
          <div className="stats-card-footer">
            <span className="text-success">{stats.blog_posts?.published ?? 0} published</span>
            <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>•</span>
            <span className="text-warning">{stats.blog_posts?.draft ?? 0} drafts</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-title">News Articles</span>
            <div className="stats-card-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
            </div>
          </div>
          <div className="stats-card-value">{stats.news_articles?.total ?? 0}</div>
          <div className="stats-card-footer">
            <span className="text-success">{stats.news_articles?.published ?? 0} published</span>
            <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>•</span>
            <span className="text-warning">{stats.news_articles?.draft ?? 0} drafts</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-title">Team Members</span>
            <div className="stats-card-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div className="stats-card-value">{stats.team_members?.total ?? 0}</div>
          <div className="stats-card-footer">
            <span style={{ color: 'var(--text-secondary)' }}>{stats.team_members?.board ?? 0} Board</span>
            <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-secondary)' }}>{stats.team_members?.executive ?? 0} Executives</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-title">Media Files</span>
            <div className="stats-card-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
          </div>
          <div className="stats-card-value">{stats.media?.total ?? 0}</div>
          <div className="stats-card-footer">
            <span style={{ color: 'var(--text-muted)' }}>Images & documents library</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-header">
            <span className="stats-card-title">Inquiries & Leads</span>
            <div className="stats-card-icon" style={{ background: stats.inquiries?.unread > 0 ? '#fef3c7' : undefined, color: stats.inquiries?.unread > 0 ? '#b45309' : undefined }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
          </div>
          <div className="stats-card-value">{stats.inquiries?.total ?? 0}</div>
          <div className="stats-card-footer">
            <Link to="/inquiries" style={{ textDecoration: 'none', color: stats.inquiries?.unread > 0 ? '#d97706' : 'var(--blue)', fontWeight: 600 }}>
              {stats.inquiries?.unread > 0 ? `${stats.inquiries.unread} new unread inquiries` : 'View inquiries inbox'}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 32 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity Log</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {activities.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                No recent actions recorded.
              </div>
            ) : (
              <ul className="activity-list">
                {activities.map((act) => (
                  <li key={act.id} className="activity-item">
                    <div className="activity-avatar">
                      {act.user_avatar ? (
                        <img src={act.user_avatar} alt="" />
                      ) : (
                        <div className="avatar-placeholder">{(act.user_name || 'U').charAt(0)}</div>
                      )}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{act.user_name || 'System'}</strong> {act.action}d{' '}
                        {act.entity_type.replace('_', ' ')}
                      </div>
                      <div className="activity-time">
                        {new Date(act.created_at).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">CMS Configuration</h3>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">API Server Url:</span>
              <span className="info-value" style={{ fontFamily: 'monospace', fontSize: 13 }}>{api.baseUrl}</span>
            </div>
            <div className="info-row" style={{ marginTop: 12 }}>
              <span className="info-label">Active Database:</span>
              <span className="info-value">wavz_cms</span>
            </div>
            <div className="info-row" style={{ marginTop: 12 }}>
              <span className="info-label">Languages Supported:</span>
              <span className="info-value">
                <span className="lang-tag lang-en" style={{ marginRight: 6 }}>EN</span>
                <span className="lang-tag lang-ar">AR</span>
              </span>
            </div>
            <div className="info-row" style={{ marginTop: 12 }}>
              <span className="info-label">Hosting Type:</span>
              <span className="info-value">cPanel Shared Hosting (PHP 8.0+ & MySQL)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
