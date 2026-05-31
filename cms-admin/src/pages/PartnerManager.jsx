import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

export default function PartnerManager() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/partners');
      setPartners(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load partners: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleOpenAdd = () => {
    setEditingPartner({
      name: '',
      logo: '',
      description_en: '',
      description_ar: '',
      website_url: '',
      category: 'technology',
      is_visible: 1,
      sort_order: partners.length
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (partner) => {
    setEditingPartner({ ...partner });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPartner.name) {
      toast.error('Partner Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingPartner.id) {
        // Update
        const res = await api.put(`/partners/${editingPartner.id}`, editingPartner);
        setPartners(prev => prev.map(p => p.id === editingPartner.id ? (res.data || res) : p));
        toast.success('Partner updated successfully');
      } else {
        // Create
        const res = await api.post('/partners', editingPartner);
        setPartners(prev => [...prev, (res.data || res)]);
        toast.success('Partner added successfully');
      }
      setModalOpen(false);
      setEditingPartner(null);
    } catch (err) {
      toast.error('Failed to save partner: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/partners/${deleteId}`);
      setPartners(prev => prev.filter(p => p.id !== deleteId));
      toast.success('Partner deleted successfully');
    } catch (err) {
      toast.error('Failed to delete partner: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'logo',
      label: 'Logo',
      render: (val) => val ? (
        <img src={val} alt="" style={{ height: 32, objectFit: 'contain', maxWidth: 120 }} />
      ) : (
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No logo</span>
      )
    },
    {
      key: 'name',
      label: 'Partner Name',
      sortable: true,
      render: (val) => <strong style={{ color: 'var(--navy)' }}>{val}</strong>
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => <span style={{ textTransform: 'capitalize' }}>{val}</span>
    },
    {
      key: 'website_url',
      label: 'Website Link',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', fontSize: 12 }}>
          {val.replace(/^https?:\/\/(www\.)?/, '')}
        </a>
      ) : (
        <span style={{ color: 'var(--text-muted)' }}>—</span>
      )
    },
  ];

  return (
    <div className="partner-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Partners & Client Logo Grid</h1>
          <p className="page-subtitle">Configure strategic alliances and global partnerships logos.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add New Partner
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={partners}
          loading={loading}
          searchPlaceholder="Search partners..."
          onEdit={handleOpenEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No partners configured"
          emptyDescription="List technology alliances, global partners, or corporate customers."
        />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h3 className="modal-title">{editingPartner?.id ? 'Edit Partner details' : 'Add Strategic Partner'}</h3>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pName">Partner Name</label>
                    <input
                      id="pName"
                      type="text"
                      className="form-input"
                      value={editingPartner.name}
                      onChange={e => setEditingPartner(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <ImageUpload
                    value={editingPartner.logo}
                    onChange={url => setEditingPartner(prev => ({ ...prev, logo: url }))}
                    label="Partner Corporate Logo"
                  />

                  <BilingualEditor
                    label="Description"
                    namePrefix="description"
                    type="textarea"
                    rows={3}
                    valueEn={editingPartner.description_en}
                    valueAr={editingPartner.description_ar}
                    onChange={vals => {
                      setEditingPartner(prev => ({ ...prev, ...vals }));
                    }}
                  />

                  <div className="form-group">
                    <label className="form-label" htmlFor="pWebsite">Outbound Website URL</label>
                    <input
                      id="pWebsite"
                      type="url"
                      className="form-input"
                      placeholder="https://partner-company.com"
                      value={editingPartner.website_url}
                      onChange={e => setEditingPartner(prev => ({ ...prev, website_url: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Classification Category</label>
                      <select
                        className="form-input"
                        value={editingPartner.category}
                        onChange={e => setEditingPartner(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="strategic">Strategic Partner</option>
                        <option value="technology">Technology Partner</option>
                        <option value="global">Global Alliance</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Visibility Status</label>
                      <select
                        className="form-input"
                        value={editingPartner.is_visible}
                        onChange={e => setEditingPartner(prev => ({ ...prev, is_visible: parseInt(e.target.value, 10) }))}
                      >
                        <option value="1">Visible (Active)</option>
                        <option value="0">Hidden (Disabled)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border" /> : 'Save Strategic Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Strategic Partner"
        message="Are you sure you want to delete this strategic partner? The partner logo and descriptive briefs will be permanently removed from the website."
        confirmLabel="Remove Partner"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
