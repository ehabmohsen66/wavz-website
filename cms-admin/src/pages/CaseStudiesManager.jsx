import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function CaseStudiesManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog');
      const allPosts = res.items || res.data?.items || res.data || [];
      // Filter for case studies or client stories
      const caseStudies = allPosts.filter(p => 
        (p.category_en || '').toLowerCase().includes('case') ||
        (p.category_en || '').toLowerCase().includes('client') ||
        (p.category_en || '').toLowerCase().includes('story') ||
        (p.tags || '').toLowerCase().includes('case-study')
      );
      setPosts(caseStudies.length > 0 ? caseStudies : allPosts);
    } catch (err) {
      toast.error('Failed to load case studies: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/blog/${deleteId}`);
      toast.success('Case study removed successfully');
      setPosts(prev => prev.filter(p => p.id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete case study: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'title_en',
      label: 'Case Study Title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', direction: 'rtl', textAlign: 'left' }}>
            {row.title_ar || 'No Arabic Title'}
          </div>
          {row.tags && (
            <div style={{ marginTop: 4 }}>
              {row.tags.split(',').map((t, i) => (
                <span key={i} style={{ fontSize: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px', marginRight: 4 }}>
                  {t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category_en',
      label: 'Category',
      render: (val) => (
        <span className="badge badge-info">{val || 'Case Study'}</span>
      ),
    },
    {
      key: 'published_at',
      label: 'Publish Date',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleDateString() : '—',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="case-studies-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Client Success Stories & Case Studies</h1>
          <p className="page-subtitle">Showcase enterprise achievements, architectures, and measurable results (Egypt Post, DEPI, SC-Zone).</p>
        </div>
        <div className="page-actions">
          <Link to="/blog/new" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create New Case Study
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 20, background: '#F0F7FF', border: '1px solid #BAE6FD', borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div style={{ fontSize: 13, color: '#0369A1', lineHeight: 1.5 }}>
            <strong>How Case Studies are displayed:</strong> When creating a post, set the Category to <code>Case Study</code>. These articles automatically link to the <strong>Client Stories & Case Studies</strong> hub section on the website.
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={posts}
          loading={loading}
          searchPlaceholder="Search case studies by client, title, tags..."
          onEdit={(row) => navigate(`/blog/${row.id}`)}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No case studies found"
          emptyDescription="Publish your first enterprise case study using the button above."
        />
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Case Study"
        message="Are you sure you want to remove this case study? This will also remove the published story from the website."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
