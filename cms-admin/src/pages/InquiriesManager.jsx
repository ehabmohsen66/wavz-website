import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const toast = useToast();

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await api.get(`/contacts${query}`);
      const items = res.items || (Array.isArray(res) ? res : []);
      setInquiries(items);
      setUnreadCount(res.unread ?? items.filter(i => i.status === 'unread').length);
    } catch (err) {
      toast.error('Failed to load inquiries: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleOpenDetail = async (inquiry) => {
    setSelectedInquiry(inquiry);
    // If unread, mark as read
    if (inquiry.status === 'unread') {
      try {
        await api.put(`/contacts/${inquiry.id}/status`, { status: 'read' });
        setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, status: 'read' } : i));
        setSelectedInquiry(prev => ({ ...prev, status: 'read' }));
        setUnreadCount(c => Math.max(0, c - 1));
      } catch (err) {
        // non-blocking
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedInquiry) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/contacts/${selectedInquiry.id}/status`, { status: newStatus });
      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, status: newStatus } : i));
      setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      toast.success(`Inquiry marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/contacts/${deleteId}`);
      setInquiries(prev => prev.filter(i => i.id !== deleteId));
      if (selectedInquiry?.id === deleteId) {
        setSelectedInquiry(null);
      }
      toast.success('Inquiry deleted successfully');
    } catch (err) {
      toast.error('Failed to delete inquiry: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const token = api.getToken();
    const exportUrl = `${api.baseUrl}/contacts/export${token ? `?token=${token}` : ''}`;
    window.open(exportUrl, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return <span className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 600 }}>Unread</span>;
      case 'read':
        return <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>Read</span>;
      case 'replied':
        return <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>Replied</span>;
      case 'archived':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Archived</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Contact',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.name}</div>
          <a href={`mailto:${row.email}`} style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
            {row.email}
          </a>
          {row.phone && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.phone}</div>}
        </div>
      )
    },
    {
      key: 'service',
      label: 'Service & Company',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.service || 'General Inquiry'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.company || '—'}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'created_at',
      label: 'Received',
      render: (row) => (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {row.created_at ? new Date(row.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
        </span>
      )
    }
  ];

  return (
    <div className="inquiries-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Inquiries & Leads Inbox</h1>
          <p className="page-subtitle">
            Manage contact form messages and consultation requests received from website visitors.
          </p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={handleExport}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginRight: 8 }}>Filter Status:</span>
          {['all', 'unread', 'read', 'replied', 'archived'].map(tab => (
            <button
              key={tab}
              type="button"
              className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab === 'unread' && unreadCount > 0 ? `${tab} (${unreadCount})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <DataTable
        columns={columns}
        data={inquiries}
        loading={loading}
        searchable
        searchPlaceholder="Search by name, email, company, service..."
        onRowClick={handleOpenDetail}
        onDelete={(row) => setDeleteId(row.id)}
        emptyTitle="No inquiries found"
        emptyDescription={statusFilter !== 'all' ? `No inquiries with status '${statusFilter}'` : 'Website contact submissions will appear here.'}
      />

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="modal-backdrop visible">
          <div className="modal-dialog" style={{ maxWidth: 650, width: '90%' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>Inquiry #{selectedInquiry.id}</span>
                  {getStatusBadge(selectedInquiry.status)}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                  Received {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleString() : ''}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedInquiry(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body" style={{ padding: 24 }}>
              {/* Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20, background: 'var(--bg)', padding: 16, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sender</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{selectedInquiry.name}</div>
                  <div style={{ fontSize: 13 }}><a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a></div>
                  {selectedInquiry.phone && (
                    <div style={{ fontSize: 13 }}><a href={`tel:${selectedInquiry.phone}`}>{selectedInquiry.phone}</a></div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Organization & Request</div>
                  <div style={{ fontWeight: 600 }}>{selectedInquiry.company || '—'}</div>
                  <div style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>{selectedInquiry.service || 'General Inquiry'}</div>
                  {selectedInquiry.ip_address && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>IP: {selectedInquiry.ip_address}</div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, textTransform: 'uppercase' }}>Message</div>
                <div style={{
                  padding: 16,
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  color: 'var(--navy)'
                }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Updater */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label htmlFor="change-status" style={{ fontSize: 13, fontWeight: 600 }}>Change Status:</label>
                  <select
                    id="change-status"
                    className="form-input"
                    style={{ width: 140, padding: '6px 10px', height: 'auto' }}
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: WAVZ Inquiry - ${encodeURIComponent(selectedInquiry.service || 'Digital Transformation')}`}
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Inquiry"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
