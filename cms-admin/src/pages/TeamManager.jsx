import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ImageUpload from '../components/ImageUpload';
import ConfirmDialog from '../components/ConfirmDialog';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'executive'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/team');
      setMembers(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load team members: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members
    .filter(m => m.type === activeTab)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const handleOpenAdd = () => {
    setEditingMember({
      type: activeTab,
      name_en: '',
      name_ar: '',
      title_en: '',
      title_ar: '',
      bio_en: '',
      bio_ar: '',
      photo: '',
      linkedin_url: '',
      email: '',
      is_visible: 1,
      sort_order: members.filter(m => m.type === activeTab).length
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember({ ...member });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingMember.name_en) {
      toast.error('English Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingMember.id) {
        // Update
        const res = await api.put(`/team/${editingMember.id}`, editingMember);
        setMembers(prev => prev.map(m => m.id === editingMember.id ? (res.data || res) : m));
        toast.success('Team member updated successfully');
      } else {
        // Create
        const res = await api.post('/team', editingMember);
        setMembers(prev => [...prev, (res.data || res)]);
        toast.success('Team member added successfully');
      }
      setModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      toast.error('Failed to save team member: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/team/${deleteId}`);
      setMembers(prev => prev.filter(m => m.id !== deleteId));
      toast.success('Team member deleted successfully');
    } catch (err) {
      toast.error('Failed to delete team member: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const handleReorder = async (member, direction) => {
    const list = [...filteredMembers];
    const index = list.findIndex(m => m.id === member.id);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;

    // Swap sort orders
    const target = list[newIndex];
    const tempOrder = member.sort_order;
    member.sort_order = target.sort_order;
    target.sort_order = tempOrder;

    // Call reorder API
    try {
      await api.put('/team/reorder', {
        items: [
          { id: member.id, sort_order: member.sort_order },
          { id: target.id, sort_order: target.sort_order }
        ]
      });

      // Update local state
      setMembers(prev => prev.map(m => {
        if (m.id === member.id) return { ...m, sort_order: member.sort_order };
        if (m.id === target.id) return { ...m, sort_order: target.sort_order };
        return m;
      }));

      toast.success('Sort order updated');
    } catch (err) {
      toast.error('Failed to update sort order: ' + err.message);
    }
  };

  const columns = [
    {
      key: 'photo',
      label: 'Photo',
      render: (val) => val ? (
        <img src={val} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>
          ?
        </div>
      )
    },
    {
      key: 'name_en',
      label: 'Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.name_ar}</div>
        </div>
      )
    },
    {
      key: 'title_en',
      label: 'Position / Title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.title_ar}</div>
        </div>
      )
    },
    {
      key: 'sort_order',
      label: 'Sort Order',
      render: (val, row) => {
        const list = filteredMembers;
        const idx = list.findIndex(m => m.id === row.id);
        return (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }} disabled={idx === 0} onClick={() => handleReorder(row, -1)}>▲</button>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }} disabled={idx === list.length - 1} onClick={() => handleReorder(row, 1)}>▼</button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>({val})</span>
          </div>
        );
      }
    },
  ];

  return (
    <div className="team-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Executive Board & Leadership</h1>
          <p className="page-subtitle">Configure board members and corporate team profiles.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Team Member
          </button>
        </div>
      </div>

      <div className="tab-container" style={{ marginBottom: 20 }}>
        <button className={`tab-button ${activeTab === 'board' ? 'active' : ''}`} onClick={() => setActiveTab('board')}>
          Board of Directors
        </button>
        <button className={`tab-button ${activeTab === 'executive' ? 'active' : ''}`} onClick={() => setActiveTab('executive')}>
          Executive Leadership Team
        </button>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={filteredMembers}
          loading={loading}
          searchPlaceholder="Search team members by name..."
          onEdit={handleOpenEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No team members listed"
          emptyDescription="Add the headshots and profiles of your corporate leaders."
        />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal modal-full" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h3 className="modal-title">{editingMember?.id ? 'Edit Team Profile' : 'Add Team Profile'}</h3>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: 24 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <BilingualEditor
                      label="Full Name"
                      namePrefix="name"
                      valueEn={editingMember.name_en}
                      valueAr={editingMember.name_ar}
                      onChange={vals => {
                        setEditingMember(prev => ({ ...prev, ...vals }));
                      }}
                      required
                    />

                    <BilingualEditor
                      label="Corporate Position / Position Title"
                      namePrefix="title"
                      valueEn={editingMember.title_en}
                      valueAr={editingMember.title_ar}
                      onChange={vals => {
                        setEditingMember(prev => ({ ...prev, ...vals }));
                      }}
                    />

                    <BilingualEditor
                      label="Short Executive Bio"
                      namePrefix="bio"
                      type="textarea"
                      rows={4}
                      valueEn={editingMember.bio_en}
                      valueAr={editingMember.bio_ar}
                      onChange={vals => {
                        setEditingMember(prev => ({ ...prev, ...vals }));
                      }}
                    />
                  </div>

                  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <ImageUpload
                      value={editingMember.photo}
                      onChange={url => setEditingMember(prev => ({ ...prev, photo: url }))}
                      label="Profile Headshot Image"
                    />

                    <div className="form-group">
                      <label className="form-label">Classification Group</label>
                      <select
                        className="form-input"
                        value={editingMember.type}
                        onChange={e => setEditingMember(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="board">Board of Directors</option>
                        <option value="executive">Executive Leadership</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="linkedin">LinkedIn Profile Link</label>
                      <input
                        id="linkedin"
                        type="url"
                        className="form-input"
                        placeholder="https://linkedin.com/in/username"
                        value={editingMember.linkedin_url || ''}
                        onChange={e => setEditingMember(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="memberEmail">Business Email</label>
                      <input
                        id="memberEmail"
                        type="email"
                        className="form-input"
                        placeholder="name@wavz.com.eg"
                        value={editingMember.email || ''}
                        onChange={e => setEditingMember(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Visibility Status</label>
                      <select
                        className="form-input"
                        value={editingMember.is_visible}
                        onChange={e => setEditingMember(prev => ({ ...prev, is_visible: parseInt(e.target.value, 10) }))}
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
                  {saving ? <span className="spinner-border" /> : 'Save Leadership Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Leadership Profile"
        message="Are you sure you want to delete this leadership member profile? The bilingual headshot and bio will be permanently removed."
        confirmLabel="Remove Profile"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
