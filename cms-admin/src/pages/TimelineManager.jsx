import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import BilingualEditor from '../components/BilingualEditor';
import { useToast } from '../contexts/ToastContext';

export default function TimelineManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/timeline');
      // API response might have already decoded it or not, we handle both
      const data = res.data || res || [];
      const normalized = data.map(ev => ({
        ...ev,
        items_en: Array.isArray(ev.items_en) ? ev.items_en : (typeof ev.items_en === 'string' ? JSON.parse(ev.items_en) : []),
        items_ar: Array.isArray(ev.items_ar) ? ev.items_ar : (typeof ev.items_ar === 'string' ? JSON.parse(ev.items_ar) : []),
      }));
      setEvents(normalized);
    } catch (err) {
      toast.error('Failed to load timeline milestones: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenAdd = () => {
    setEditingEvent({
      year: new Date().getFullYear().toString(),
      title_en: '',
      title_ar: '',
      items_en: [''],
      items_ar: [''],
      icon: 'Calendar',
      color_scheme: 'blue',
      sort_order: events.length
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent({
      ...event,
      items_en: event.items_en || [''],
      items_ar: event.items_ar || ['']
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingEvent.year || !editingEvent.title_en) {
      toast.error('Year and English Title are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editingEvent,
        // Filter out empty lines
        items_en: (editingEvent.items_en || []).filter(item => item.trim() !== ''),
        items_ar: (editingEvent.items_ar || []).filter(item => item.trim() !== ''),
      };

      if (editingEvent.id) {
        // Update
        const res = await api.put(`/timeline/${editingEvent.id}`, payload);
        const saved = res.data || res;
        const normalized = {
          ...saved,
          items_en: Array.isArray(saved.items_en) ? saved.items_en : (typeof saved.items_en === 'string' ? JSON.parse(saved.items_en) : []),
          items_ar: Array.isArray(saved.items_ar) ? saved.items_ar : (typeof saved.items_ar === 'string' ? JSON.parse(saved.items_ar) : []),
        };
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? normalized : ev));
        toast.success('Milestone updated successfully');
      } else {
        // Create
        const res = await api.post('/timeline', payload);
        const saved = res.data || res;
        const normalized = {
          ...saved,
          items_en: Array.isArray(saved.items_en) ? saved.items_en : (typeof saved.items_en === 'string' ? JSON.parse(saved.items_en) : []),
          items_ar: Array.isArray(saved.items_ar) ? saved.items_ar : (typeof saved.items_ar === 'string' ? JSON.parse(saved.items_ar) : []),
        };
        setEvents(prev => [...prev, normalized]);
        toast.success('Milestone created successfully');
      }
      setModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      toast.error('Failed to save milestone: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/timeline/${deleteId}`);
      setEvents(prev => prev.filter(ev => ev.id !== deleteId));
      toast.success('Milestone deleted successfully');
    } catch (err) {
      toast.error('Failed to delete milestone: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const handleItemChange = (lang, index, val) => {
    setEditingEvent(prev => {
      const list = [...(prev[lang === 'en' ? 'items_en' : 'items_ar'] || [])];
      list[index] = val;
      return { ...prev, [lang === 'en' ? 'items_en' : 'items_ar']: list };
    });
  };

  const addLineItem = (lang) => {
    setEditingEvent(prev => {
      const list = [...(prev[lang === 'en' ? 'items_en' : 'items_ar'] || []), ''];
      return { ...prev, [lang === 'en' ? 'items_en' : 'items_ar']: list };
    });
  };

  const removeLineItem = (lang, index) => {
    setEditingEvent(prev => {
      const list = (prev[lang === 'en' ? 'items_en' : 'items_ar'] || []).filter((_, i) => i !== index);
      return { ...prev, [lang === 'en' ? 'items_en' : 'items_ar']: list.length > 0 ? list : [''] };
    });
  };

  const columns = [
    {
      key: 'year',
      label: 'Year',
      sortable: true,
      render: (val) => <span className="lang-tag lang-en" style={{ fontSize: 13, fontWeight: 700 }}>{val}</span>
    },
    {
      key: 'title_en',
      label: 'Milestone Title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.title_ar}</div>
        </div>
      )
    },
    {
      key: 'items_en',
      label: 'Bullet Milestones',
      render: (val) => (val && val.length > 0) ? (
        <ul style={{ listStyleType: 'disc', paddingLeft: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          {val.slice(0, 2).map((item, idx) => <li key={idx}>{item}</li>)}
          {val.length > 2 && <li>+ {val.length - 2} more items</li>}
        </ul>
      ) : (
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>No items</span>
      )
    },
    {
      key: 'color_scheme',
      label: 'Color scheme',
      render: (val) => <span className={`badge badge-draft`} style={{ background: `var(--${val || 'blue'}-light)`, color: `var(--${val || 'blue'})`, border: `1px solid var(--${val || 'blue'})` }}>{val}</span>
    }
  ];

  return (
    <div className="timeline-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Corporate Journey Milestones</h1>
          <p className="page-subtitle">Configure year-by-year history events and achievements.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Milestone
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={events}
          loading={loading}
          searchPlaceholder="Search milestones..."
          onEdit={handleOpenEdit}
          onDelete={(row) => setDeleteId(row.id)}
          emptyTitle="No milestones listed"
          emptyDescription="Tell the story of how your organization was founded and grew."
        />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal modal-full" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h3 className="modal-title">{editingEvent?.id ? 'Edit Milestone' : 'Add History Milestone'}</h3>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: 24 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="evYear">Milestone Year / Timeframe</label>
                      <input
                        id="evYear"
                        type="text"
                        className="form-input"
                        placeholder="e.g. 2026"
                        value={editingEvent.year}
                        onChange={e => setEditingEvent(prev => ({ ...prev, year: e.target.value }))}
                        required
                      />
                    </div>

                    <BilingualEditor
                      label="Milestone Headline Title"
                      namePrefix="title"
                      valueEn={editingEvent.title_en}
                      valueAr={editingEvent.title_ar}
                      onChange={vals => {
                        setEditingEvent(prev => ({ ...prev, ...vals }));
                      }}
                      required
                    />

                    {/* Bilingual Line Items */}
                    <div className="grid grid-2" style={{ gap: 20, marginTop: 12 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <h4 style={{ fontWeight: 600 }}><span className="lang-tag lang-en">EN</span> English Achievements</h4>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => addLineItem('en')}>+ Add Line</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(editingEvent.items_en || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 8 }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Milestone description..."
                                value={item}
                                onChange={e => handleItemChange('en', idx, e.target.value)}
                              />
                              <button type="button" className="btn btn-danger btn-sm" style={{ padding: '8px 12px' }} onClick={() => removeLineItem('en', idx)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <h4 style={{ fontWeight: 600 }}><span className="lang-tag lang-ar">AR</span> Arabic Achievements</h4>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => addLineItem('ar')}>+ Add Line</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(editingEvent.items_ar || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 8 }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ direction: 'rtl' }}
                                placeholder="إنجازات العام..."
                                value={item}
                                onChange={e => handleItemChange('ar', idx, e.target.value)}
                              />
                              <button type="button" className="btn btn-danger btn-sm" style={{ padding: '8px 12px' }} onClick={() => removeLineItem('ar', idx)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="evIcon">Milestone Icon Name</label>
                      <input
                        id="evIcon"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Award, Users, Shield, Calendar"
                        value={editingEvent.icon}
                        onChange={e => setEditingEvent(prev => ({ ...prev, icon: e.target.value }))}
                      />
                      <div className="form-help">Lucide-react icon identifier</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Theme Color Style</label>
                      <select
                        className="form-input"
                        value={editingEvent.color_scheme}
                        onChange={e => setEditingEvent(prev => ({ ...prev, color_scheme: e.target.value }))}
                      >
                        <option value="blue">Blue</option>
                        <option value="gold">Gold</option>
                        <option value="navy">Navy</option>
                        <option value="success">Green (Success)</option>
                        <option value="danger">Red (Danger)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner-border" /> : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Milestone"
        message="Are you sure you want to delete this historical milestone? The year and all associated achievements will be permanently removed."
        confirmLabel="Remove Milestone"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
