import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials');
      setItems(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenAdd = () => {
    setEditingItem({
      author_en: '',
      author_ar: '',
      company: '',
      title_en: '',
      title_ar: '',
      quote_en: '',
      quote_ar: '',
      photo: '',
      is_visible: 1,
      sort_order: items.length
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.author_en || !editingItem.quote_en) {
      toast.error('Author Name and Quote in English are required');
      return;
    }
    setSaving(true);
    try {
      if (editingItem.id) {
        // Update
        const res = await api.put(`/testimonials/${editingItem.id}`, editingItem);
        setItems(prev => prev.map(item => item.id === editingItem.id ? (res.data || res) : item));
        toast.success('Testimonial updated successfully');
      } else {
        // Create
        const res = await api.post('/testimonials', editingItem);
        setItems(prev => [...prev, (res.data || res)]);
        toast.success('Testimonial added successfully');
      }
      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      toast.error('Failed to save testimonial: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/testimonials/${deleteId}`);
      setItems(prev => prev.filter(item => item.id !== deleteId));
      toast.success('Testimonial deleted successfully');
    } catch (err) {
      toast.error('Failed to delete testimonial: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'photo',
      label: 'Photo',
      render: (val) => val ? (
        <img src={val} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
          ”
        </div>
      )
    },
    {
      key: 'author_en',
      label: 'Author Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.author_ar}</div>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Organization',
      sortable: true,
    },
    {
      key: 'quote_en',
      label: 'Quote',
      render: (val) => <div style={{ fontSize: 12, color: 'var(--text-secondary)', maxTransform: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 320 }}>"{val}"</div>
    },
  ];

  return (
    <div className="testimonials-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Client Quotes & Testimonials</h1>
          <p className="page-subtitle">Configure testimonials, customer reviews, and quotes.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Testimonial
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          searchPlaceholder="Search quotes by author or company..."
          onEdit={handleOpenEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No testimonials found"
          emptyDescription="Announce what customers say about your digital services."
        />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal modal-full" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h3 className="modal-title">{editingItem?.id ? 'Edit Testimonial' : 'Add Testimonial Quote'}</h3>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: 24 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <BilingualEditor
                      label="Author Name"
                      namePrefix="author"
                      valueEn={editingItem.author_en}
                      valueAr={editingItem.author_ar}
                      onChange={vals => {
                        setEditingItem(prev => ({ ...prev, ...vals }));
                      }}
                      required
                    />

                    <div className="form-group">
                      <label className="form-label" htmlFor="company">Company / Organization</label>
                      <input
                        id="company"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Google DeepMind"
                        value={editingItem.company}
                        onChange={e => setEditingItem(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>

                    <BilingualEditor
                      label="Author Job Title"
                      namePrefix="title"
                      valueEn={editingItem.title_en}
                      valueAr={editingItem.title_ar}
                      onChange={vals => {
                        setEditingItem(prev => ({ ...prev, ...vals }));
                      }}
                    />

                    <BilingualEditor
                      label="Customer Quote Copy"
                      namePrefix="quote"
                      type="textarea"
                      rows={5}
                      valueEn={editingItem.quote_en}
                      valueAr={editingItem.quote_ar}
                      onChange={vals => {
                        setEditingItem(prev => ({ ...prev, ...vals }));
                      }}
                      required
                    />
                  </div>

                  <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <ImageUpload
                      value={editingItem.photo}
                      onChange={url => setEditingItem(prev => ({ ...prev, photo: url }))}
                      label="Author Portrait Image"
                    />

                    <div className="form-group">
                      <label className="form-label">Visibility Status</label>
                      <select
                        className="form-input"
                        value={editingItem.is_visible}
                        onChange={e => setEditingItem(prev => ({ ...prev, is_visible: parseInt(e.target.value, 10) }))}
                      >
                        <option value="1">Visible (Active)</option>
                        <option value="0">Hidden (Deactivated)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border" /> : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Testimonial"
        message="Are you sure you want to delete this customer quote? This will permanently remove it from the home page testimonials list."
        confirmLabel="Remove Quote"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
