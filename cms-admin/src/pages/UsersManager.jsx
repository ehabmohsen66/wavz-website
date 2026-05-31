import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUser({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      is_active: 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser({ ...user, password: '' }); // Don't prefill password
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) {
      toast.error('Name and Email are required');
      return;
    }
    if (!editingUser.id && !editingUser.password) {
      toast.error('Password is required for new users');
      return;
    }
    setSaving(true);
    try {
      if (editingUser.id) {
        // Update
        const payload = { ...editingUser };
        if (!payload.password) delete payload.password; // Don't send empty password updates
        const res = await api.put(`/users/${editingUser.id}`, payload);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? (res.data || res) : u));
        toast.success('User updated successfully');
      } else {
        // Create
        const res = await api.post('/users', editingUser);
        setUsers(prev => [...prev, (res.data || res)]);
        toast.success('User added successfully');
      }
      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      toast.error('Failed to save user: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    if (parseInt(deleteId, 10) === parseInt(currentUser.id, 10)) {
      toast.error('You cannot delete your own account');
      setDeleteId(null);
      return;
    }
    try {
      await api.delete(`/users/${deleteId}`);
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Full Name',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.avatar ? (
            <img src={row.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
              {val.charAt(0).toUpperCase()}
            </div>
          )}
          <strong>{val}</strong>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email Address',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role Privilege',
      sortable: true,
      render: (val) => (
        <span
          className={`badge`}
          style={{
            background: val === 'admin' ? '#EEF2FF' : val === 'editor' ? '#ECFDF5' : '#F3F4F6',
            color: val === 'admin' ? '#4F46E5' : val === 'editor' ? '#059669' : '#4B5563',
            border: `1px solid ${val === 'admin' ? '#C7D2FE' : val === 'editor' ? '#A7F3D0' : '#E5E7EB'}`
          }}
        >
          {val.toUpperCase()}
        </span>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`badge ${val === 1 ? 'badge-published' : 'badge-archived'}`}>
          {val === 1 ? 'Active' : 'Deactivated'}
        </span>
      )
    },
    {
      key: 'last_login',
      label: 'Last Login',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString() : 'Never',
    }
  ];

  // Block non-admins at routing level as well, but visual fallback helps
  if (currentUser.role !== 'admin') {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center', marginTop: 24 }}>
        <h2 style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: 8 }}>Access Restriction</h2>
        <p style={{ color: 'var(--text-muted)' }}>You do not have administrative privileges to manage user profiles.</p>
      </div>
    );
  }

  return (
    <div className="users-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">User Accounts</h1>
          <p className="page-subtitle">Configure administrative access, roles, and password locks.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Staff Account
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          searchPlaceholder="Search accounts by name or email..."
          onEdit={handleOpenEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No staff accounts listed"
          emptyDescription="Create logins for editors to help manage the WAVZ website content."
        />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h3 className="modal-title">{editingUser?.id ? 'Edit Staff Profile' : 'Add Staff Account'}</h3>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="modal-body" style={{ padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="uName">Staff Name</label>
                    <input
                      id="uName"
                      type="text"
                      className="form-input"
                      value={editingUser.name}
                      onChange={e => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="uEmail">Email Address</label>
                    <input
                      id="uEmail"
                      type="email"
                      className="form-input"
                      placeholder="name@wavz.com.eg"
                      value={editingUser.email}
                      onChange={e => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={!!editingUser.id}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="uPass">
                      {editingUser.id ? 'Change Password' : 'Password'}
                    </label>
                    <input
                      id="uPass"
                      type="password"
                      className="form-input"
                      placeholder={editingUser.id ? 'Leave blank to keep current' : '••••••••'}
                      value={editingUser.password}
                      onChange={e => setEditingUser(prev => ({ ...prev, password: e.target.value }))}
                      required={!editingUser.id}
                    />
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">System Privilege</label>
                      <select
                        className="form-input"
                        value={editingUser.role}
                        onChange={e => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="editor">Editor (Write Content)</option>
                        <option value="admin">Administrator (Full System)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Profile Status</label>
                      <select
                        className="form-input"
                        value={editingUser.is_active}
                        disabled={parseInt(editingUser.id, 10) === parseInt(currentUser.id, 10)}
                        onChange={e => setEditingUser(prev => ({ ...prev, is_active: parseInt(e.target.value, 10) }))}
                      >
                        <option value="1">Active</option>
                        <option value="0">Deactivated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border" /> : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Staff Account"
        message="Are you sure you want to delete this staff login profile? Their login access will be permanently revoked."
        confirmLabel="Revoke Login"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
