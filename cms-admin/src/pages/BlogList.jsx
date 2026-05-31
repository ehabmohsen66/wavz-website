import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog');
      setPosts(res.items || res.data?.items || res.data || []);
    } catch (err) {
      toast.error('Failed to load blog posts: ' + err.message);
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
      toast.success('Blog post deleted successfully');
      setPosts(prev => prev.filter(p => p.id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete blog post: ' + err.message);
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
          <div>{val || 'Uncategorized'}</div>
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
    <div className="blog-list-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Blog Posts</h1>
          <p className="page-subtitle">Manage bilingual articles and news insights.</p>
        </div>
        <div className="page-actions">
          <Link to="/blog/new" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add New Post
          </Link>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={posts}
          loading={loading}
          searchPlaceholder="Search by title, tags or excerpt..."
          onEdit={(row) => navigate(`/blog/${row.id}`)}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No blog posts found"
          emptyDescription="Write your first blog post to share updates with your audience."
        />
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? All bilingual content blocks and metadata will be permanently removed."
        confirmLabel="Delete Post"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
