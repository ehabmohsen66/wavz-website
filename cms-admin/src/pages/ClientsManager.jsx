import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function ClientsManager() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients');
      setClients(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load clients: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleOpenAdd = () => {
    setEditingClient({
      name: '',
      logo: '',
      website_url: '',
      is_visible: 1,
      sort_order: clients.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient({ ...client });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingClient.name) {
      toast.error('Client Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingClient.id) {
        const res = await api.put(`/clients/${editingClient.id}`, editingClient);
        setClients(prev => prev.map(c => c.id === editingClient.id ? (res.data || res) : c));
        toast.success('Client updated successfully');
      } else {
        const res = await api.post('/clients', editingClient);
        setClients(prev => [...prev, (res.data || res)]);
        toast.success('Client added successfully');
      }
      setModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      toast.error('Failed to save client: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/clients/${deleteId}`);
      setClients(prev => prev.filter(c => c.id !== deleteId));
      toast.success('Client deleted successfully');
    } catch (err) {
      toast.error('Failed to delete client: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'logo',
      label: 'Logo',
      render: (val) => val ? (
        <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: 6, display: 'inline-flex', alignItems: 'center' }}>
          <img src={val} alt="" style={{ height: 32, objectFit: 'contain', maxWidth: 120 }} />
        </div>
      ) : (
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No logo</span>
      ),
    },
    {
      key: 'name',
      label: 'Client / Institution Name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{val}</div>
          {row.website_url && (
            <a href={row.website_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--blue)' }}>
              {row.website_url}
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'is_visible',
      label: 'Status',
      render: (val) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Visible' : 'Hidden'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
    },
  ];

  return (
    <div className="clients-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Client Brands & Logo Strip</h1>
          <p className="page-subtitle">Manage client and partner logos shown in the rolling marquee across the homepage.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Client Logo
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search client logos..."
        onEdit={handleOpenEdit}
        onDelete={item => setDeleteId(item.id)}
      />

      {modalOpen && editingClient && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingClient.id ? 'Edit Client Logo' : 'Add New Client Logo'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Client / Institution Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Egypt Post, AAIB, Bank NXT"
                    value={editingClient.name || ''}
                    onChange={e => setEditingClient(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <ImageUpload
                  label="Client Brand Logo"
                  value={editingClient.logo || ''}
                  onChange={url => setEditingClient(prev => ({ ...prev, logo: url }))}
                />

                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={editingClient.website_url || ''}
                    onChange={e => setEditingClient(prev => ({ ...prev, website_url: e.target.value }))}
                  />
                </div>

                <div className="grid grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingClient.sort_order ?? 0}
                      onChange={e => setEditingClient(prev => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!editingClient.is_visible}
                        onChange={e => setEditingClient(prev => ({ ...prev, is_visible: e.target.checked ? 1 : 0 }))}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>Visible in Logo Strip</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border" /> : (editingClient.id ? 'Update Client' : 'Add Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Client Logo"
        message="Are you sure you want to remove this client from the logo strip?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
