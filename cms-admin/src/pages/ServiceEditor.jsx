import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import BilingualEditor from '../components/BilingualEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function ServiceEditor() {
  const { pageSlug } = useParams();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const toast = useToast();

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/services/${pageSlug}`);
      setUnits(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [pageSlug, toast]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleSave = async (unit) => {
    if (!unit.title_en || !unit.code) {
      toast.error('Code and English Title are required');
      return;
    }
    setSavingId(unit.id);
    try {
      if (String(unit.id).startsWith('temp_')) {
        // Create new
        const payload = { ...unit, page_slug: pageSlug };
        delete payload.id;
        const res = await api.post('/services', payload);
        toast.success('Service unit created successfully');
        // Replace temp in list
        setUnits(prev => prev.map(u => u.id === unit.id ? (res.data || res) : u));
        setExpandedId((res.data || res).id);
      } else {
        // Update existing
        const res = await api.put(`/services/${unit.id}`, unit);
        toast.success('Service unit updated successfully');
        setUnits(prev => prev.map(u => u.id === unit.id ? (res.data || res) : u));
      }
    } catch (err) {
      toast.error('Failed to save service unit: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    if (String(deleteId).startsWith('temp_')) {
      setUnits(prev => prev.filter(u => u.id !== deleteId));
      setDeleteId(null);
      toast.success('Service unit removed');
      return;
    }

    try {
      await api.delete(`/services/${deleteId}`);
      toast.success('Service unit deleted successfully');
      setUnits(prev => prev.filter(u => u.id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete service unit: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const addBlankUnit = () => {
    const tempId = 'temp_' + Date.now();
    const newUnit = {
      id: tempId,
      code: `${pageSlug.split('-').map(s => s[0].toUpperCase()).join('')}-${String(units.length + 1).padStart(2, '0')}`,
      title_en: '',
      title_ar: '',
      body_en: '',
      body_ar: '',
      icon: 'Settings',
      is_visible: 1,
      sort_order: units.length,
      stats: [],
      pipelines: [],
      bullets: []
    };
    setUnits(prev => [...prev, newUnit]);
    setExpandedId(tempId);
  };

  const updateUnitState = (id, field, value) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const updateNestedState = (unitId, key, index, field, value) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      const arr = [...(u[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...u, [key]: arr };
    }));
  };

  const addNestedRow = (unitId, key, initialRow) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      return { ...u, [key]: [...(u[key] || []), initialRow] };
    }));
  };

  const removeNestedRow = (unitId, key, index) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      return { ...u, [key]: (u[key] || []).filter((_, i) => i !== index) };
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Loading service units...</span>
      </div>
    );
  }

  const humanPageName = pageSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="service-editor-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
            <Link to="/services" style={{ color: 'var(--blue)' }}>Services</Link> &gt; {humanPageName}
          </div>
          <h1 className="page-title" style={{ marginTop: 4 }}>{humanPageName} Units</h1>
          <p className="page-subtitle">Configure separate structural items for this service vertical.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={addBlankUnit}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Service Unit
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {units.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>No units configured yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Create service units to describe specialized sub-products or services.</p>
            <button className="btn btn-primary" onClick={addBlankUnit}>Add First Unit</button>
          </div>
        ) : (
          units.map((unit, index) => {
            const isExpanded = expandedId === unit.id;
            return (
              <div key={unit.id} className="card service-accordion-card">
                <div
                  className="card-header service-accordion-header"
                  onClick={() => setExpandedId(isExpanded ? null : unit.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 24px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="lang-tag lang-en" style={{ fontSize: 11, fontWeight: 700 }}>{unit.code || `Unit #${index + 1}`}</span>
                    <strong style={{ fontSize: 16, color: 'var(--navy)' }}>{unit.title_en || '(Untitled Unit)'}</strong>
                    {unit.title_ar && (
                      <span style={{ color: 'var(--text-muted)', fontSize: 14, direction: 'rtl' }}>
                        — {unit.title_ar}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setExpandedId(isExpanded ? null : unit.id)}>
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(unit.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="card-body" style={{ padding: 24, borderTop: '1px solid var(--border)' }}>
                    <div className="grid grid-3">
                      <div className="form-group">
                        <label className="form-label">Service Code</label>
                        <input
                          type="text"
                          className="form-input"
                          value={unit.code || ''}
                          onChange={e => updateUnitState(unit.id, 'code', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Lucide Icon Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={unit.icon || ''}
                          onChange={e => updateUnitState(unit.id, 'icon', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Visibility Status</label>
                        <select
                          className="form-input"
                          value={unit.is_visible ?? 1}
                          onChange={e => updateUnitState(unit.id, 'is_visible', parseInt(e.target.value, 10))}
                        >
                          <option value="1">Visible (Active)</option>
                          <option value="0">Hidden (Disabled)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <BilingualEditor
                        label="Service Title"
                        namePrefix="title"
                        valueEn={unit.title_en}
                        valueAr={unit.title_ar}
                        onChange={vals => {
                          if (vals.title_en !== undefined) updateUnitState(unit.id, 'title_en', vals.title_en);
                          if (vals.title_ar !== undefined) updateUnitState(unit.id, 'title_ar', vals.title_ar);
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <BilingualEditor
                        label="Service Body Text"
                        namePrefix="body"
                        type="textarea"
                        rows={3}
                        valueEn={unit.body_en}
                        valueAr={unit.body_ar}
                        onChange={vals => {
                          if (vals.body_en !== undefined) updateUnitState(unit.id, 'body_en', vals.body_en);
                          if (vals.body_ar !== undefined) updateUnitState(unit.id, 'body_ar', vals.body_ar);
                        }}
                      />
                    </div>

                    {/* Stats */}
                    <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h4 style={{ fontWeight: 600 }}>Telemetry Stats / Metric Callouts</h4>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addNestedRow(unit.id, 'stats', { value: '99%', label_en: 'Stat Label', label_ar: '' })}
                        >
                          + Add Stat
                        </button>
                      </div>
                      {(unit.stats || []).length === 0 ? (
                        <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                          No numeric stats configured.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {(unit.stats || []).map((stat, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Value (e.g. 24/7)"
                                style={{ width: 140 }}
                                value={stat.value || ''}
                                onChange={e => updateNestedState(unit.id, 'stats', sIdx, 'value', e.target.value)}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Label (English)"
                                style={{ flex: 1 }}
                                value={stat.label_en || ''}
                                onChange={e => updateNestedState(unit.id, 'stats', sIdx, 'label_en', e.target.value)}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Label (Arabic)"
                                style={{ flex: 1, direction: 'rtl' }}
                                value={stat.label_ar || ''}
                                onChange={e => updateNestedState(unit.id, 'stats', sIdx, 'label_ar', e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ padding: '8px 12px' }}
                                onClick={() => removeNestedRow(unit.id, 'stats', sIdx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Workflow Process */}
                    <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h4 style={{ fontWeight: 600 }}>Workflow Steps / Process Pipeline</h4>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addNestedRow(unit.id, 'pipelines', { step_en: 'Step Description', step_ar: '' })}
                        >
                          + Add Step
                        </button>
                      </div>
                      {(unit.pipelines || []).length === 0 ? (
                        <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                          No process pipeline defined.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {(unit.pipelines || []).map((step, pIdx) => (
                            <div key={pIdx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{pIdx + 1}</span>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Step Description (English)"
                                style={{ flex: 1 }}
                                value={step.step_en || ''}
                                onChange={e => updateNestedState(unit.id, 'pipelines', pIdx, 'step_en', e.target.value)}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Step Description (Arabic)"
                                style={{ flex: 1, direction: 'rtl' }}
                                value={step.step_ar || ''}
                                onChange={e => updateNestedState(unit.id, 'pipelines', pIdx, 'step_ar', e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ padding: '8px 12px' }}
                                onClick={() => removeNestedRow(unit.id, 'pipelines', pIdx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bullets */}
                    <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h4 style={{ fontWeight: 600 }}>Key Specifications / Details Bullets</h4>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => addNestedRow(unit.id, 'bullets', { text_en: 'Bullet Description', text_ar: '' })}
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {(unit.bullets || []).length === 0 ? (
                        <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                          No bullets configured.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {(unit.bullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ color: 'var(--blue)' }}>•</span>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Bullet text (English)"
                                style={{ flex: 1 }}
                                value={bullet.text_en || ''}
                                onChange={e => updateNestedState(unit.id, 'bullets', bIdx, 'text_en', e.target.value)}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Bullet text (Arabic)"
                                style={{ flex: 1, direction: 'rtl' }}
                                value={bullet.text_ar || ''}
                                onChange={e => updateNestedState(unit.id, 'bullets', bIdx, 'text_ar', e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ padding: '8px 12px' }}
                                onClick={() => removeNestedRow(unit.id, 'bullets', bIdx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSave(unit)}
                        disabled={savingId === unit.id}
                      >
                        {savingId === unit.id ? <span className="spinner-border" /> : 'Save Unit Details'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Service Unit"
        message="Are you sure you want to delete this service unit? All nested telemetry stats, process workflow steps, and bullet descriptions will be permanently deleted."
        confirmLabel="Delete Unit"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
