import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function NewsList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/news');
      setArticles(res.items || res.data?.items || res.data || []);
    } catch (err) {
      toast.error('Failed to load news articles: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/news/${deleteId}`);
      toast.success('News article deleted successfully');
      setArticles(prev => prev.filter(a => a.id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete news article: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'title_en',
      label: 'Title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', direction: 'rtl', textAlign: 'left' }}>
            {row.title_ar || 'No Arabic Title'}
          </div>
        </div>
      ),
    },
    {
      key: 'category_en',
      label: 'Category',
      sortable: true,
      render: (val, row) => (
        <div>
          <div>{val || 'General'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.category_ar}</div>
        </div>
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
    <div className="news-list-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">News Articles</h1>
          <p className="page-subtitle">Manage corporate announcements and press releases.</p>
        </div>
        <div className="page-actions">
          <Link to="/news/new" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Publish Announcement
          </Link>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={articles}
          loading={loading}
          searchPlaceholder="Search by news title or excerpt..."
          onEdit={(row) => navigate(`/news/${row.id}`)}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No news articles found"
          emptyDescription="Announce your company's latest achievements or partnerships."
        />
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete News Article"
        message="Are you sure you want to delete this press release? All bilingual copy will be permanently removed."
        confirmLabel="Delete Article"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
