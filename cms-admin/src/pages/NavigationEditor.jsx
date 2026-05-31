import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function NavigationEditor() {
  const [group, setGroup] = useState('main'); // 'main' or 'footer'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const fetchNavigation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/navigation?menu_group=${group}`);
      // API already returns tree structure via getByGroup in controller!
      setItems(res.data || res || []);
    } catch (err) {
      toast.error('Failed to load navigation: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [group, toast]);

  useEffect(() => {
    fetchNavigation();
  }, [fetchNavigation]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        menu_group: group,
        items: items
      };
      const res = await api.put('/navigation', payload);
      setItems(res.data || res || []);
      toast.success('Navigation layout saved successfully!');
    } catch (err) {
      toast.error('Failed to save navigation: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item, parentPath = []) => {
    setEditingItem({ item: { ...item }, parentPath });
  };

  const saveItemEdits = () => {
    if (!editingItem) return;
    const { item, parentPath } = editingItem;
    if (!item.label_en || !item.url) {
      toast.error('English label and URL path are required');
      return;
    }

    setItems(prev => {
      const updateTree = (nodes, path) => {
        if (path.length === 0) {
          return nodes.map(n => n.id === item.id || n.tempId === item.tempId ? { ...n, ...item } : n);
        }
        const [currentId, ...rest] = path;
        return nodes.map(n => {
          if (n.id === currentId || n.tempId === currentId) {
            return { ...n, children: updateTree(n.children || [], rest) };
          }
          return n;
        });
      };
      return updateTree(prev, parentPath);
    });

    setEditingItem(null);
    toast.success('Item details updated locally');
  };

  const addNewLink = (parentId = null, parentPath = []) => {
    const tempId = 'new_' + Date.now();
    const newItem = {
      tempId,
      label_en: 'New Link',
      label_ar: 'رابط جديد',
      url: '/',
      icon: '',
      target: '_self',
      is_visible: 1,
      children: []
    };

    if (parentId === null) {
      setItems(prev => [...prev, newItem]);
    } else {
      setItems(prev => {
        const insertTree = (nodes, path) => {
          if (path.length === 0) {
            return nodes.map(n => {
              if (n.id === parentId || n.tempId === parentId) {
                return { ...n, children: [...(n.children || []), newItem] };
              }
              return n;
            });
          }
          const [currentId, ...rest] = path;
          return nodes.map(n => {
            if (n.id === currentId || n.tempId === currentId) {
              return { ...n, children: insertTree(n.children || [], rest) };
            }
            return n;
          });
        };
        return insertTree(prev, parentPath);
      });
    }
  };

  const deleteLink = (id, parentPath = []) => {
    setItems(prev => {
      const pruneTree = (nodes, path) => {
        if (path.length === 0) {
          return nodes.filter(n => n.id !== id && n.tempId !== id);
        }
        const [currentId, ...rest] = path;
        return nodes.map(n => {
          if (n.id === currentId || n.tempId === currentId) {
            return { ...n, children: pruneTree(n.children || [], rest) };
          }
          return n;
        });
      };
      return pruneTree(prev, parentPath);
    });
    toast.success('Link removed locally');
  };

  const moveItem = (index, direction, parentPath = []) => {
    setItems(prev => {
      const sortTree = (nodes, path) => {
        if (path.length === 0) {
          const next = [...nodes];
          const targetIndex = index + direction;
          if (targetIndex >= 0 && targetIndex < next.length) {
            [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
          }
          return next;
        }
        const [currentId, ...rest] = path;
        return nodes.map(n => {
          if (n.id === currentId || n.tempId === currentId) {
            return { ...n, children: sortTree(n.children || [], rest) };
          }
          return n;
        });
      };
      return sortTree(prev, parentPath);
    });
  };

  const renderNode = (node, index, parentPath = []) => {
    const nodeId = node.id || node.tempId;
    const currentPath = [...parentPath, nodeId];
    return (
      <li key={nodeId} style={{ marginTop: 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong>{node.label_en}</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: 13, direction: 'rtl' }}>— {node.label_ar}</span>
            <span style={{ fontSize: 12, background: 'var(--white)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', fontFamily: 'monospace' }}>
              {node.url}
            </span>
            {node.is_visible === 0 && <span className="badge badge-archived">Hidden</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} onClick={() => moveItem(index, -1, parentPath)}>▲</button>
            <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} onClick={() => moveItem(index, 1, parentPath)}>▼</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleEditClick(node, parentPath)}>Edit</button>
            {parentPath.length < 1 && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => addNewLink(nodeId, currentPath)}>+ Sublink</button>
            )}
            <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteLink(nodeId, parentPath)}>Remove</button>
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <ul style={{ paddingLeft: 24, borderLeft: '2px dashed var(--border)', marginLeft: 16 }}>
            {node.children.map((child, cIdx) => renderNode(child, cIdx, currentPath))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="navigation-editor-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Website Menu Constructor</h1>
          <p className="page-subtitle">Reorder and edit primary and footer links dynamically.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: 24, alignItems: 'flex-start' }}>
        {/* Links Editor Panel */}
        <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="tab-container" style={{ margin: 0 }}>
                <button type="button" className={`tab-button ${group === 'main' ? 'active' : ''}`} onClick={() => setGroup('main')}>
                  Primary Main Header
                </button>
                <button type="button" className={`tab-button ${group === 'footer' ? 'active' : ''}`} onClick={() => setGroup('footer')}>
                  Footer Site Map Links
                </button>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => addNewLink()}>
                + New Root Link
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <span className="spinner-border" />
                <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>Loading menu layouts...</div>
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                No menu items configured for this group. Click Root Link above to construct your menu hierarchy.
              </div>
            ) : (
              <ul style={{ padding: 0 }}>
                {items.map((node, index) => renderNode(node, index))}
              </ul>
            )}

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
                {saving ? <span className="spinner-border" /> : 'Save Menu Layout'}
              </button>
            </div>
          </div>
        </div>

        {/* Inline Drawer Editor */}
        <div>
          {editingItem ? (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>Link Parameters</h3>
                <button type="button" onClick={() => setEditingItem(null)} style={{ color: 'var(--text-muted)' }}>Close</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">English Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingItem.item.label_en || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, item: { ...prev.item, label_en: e.target.value } }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Arabic Label</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ direction: 'rtl' }}
                    value={editingItem.item.label_ar || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, item: { ...prev.item, label_ar: e.target.value } }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingItem.item.url || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, item: { ...prev.item, url: e.target.value } }))}
                  />
                  <div className="form-help">Use absolute path (e.g. "/services/sap-services") or external link</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Icon Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Lucide name (optional)"
                    value={editingItem.item.icon || ''}
                    onChange={e => setEditingItem(prev => ({ ...prev, item: { ...prev.item, icon: e.target.value } }))}
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Target</label>
                    <select
                      className="form-input"
                      value={editingItem.item.target || '_self'}
                      onChange={e => setEditingItem(prev => ({ ...prev, item: { ...prev.item, target: e.target.value } }))}
                    >
                      <option value="_self">Same Tab</option>
                      <option value="_blank">New Tab</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Visible</label>
                    <select
                      className="form-input"
                      value={editingItem.item.is_visible}
                      onChange={e => setEditingItem(prev => ({ ...prev, item: { ...prev.item, is_visible: parseInt(e.target.value, 10) } }))}
                    >
                      <option value="1">Show</option>
                      <option value="0">Hide</option>
                    </select>
                  </div>
                </div>

                <button type="button" className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={saveItemEdits}>
                  Apply Link Edits
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
              Select any link card to configure labels, destination URL paths, opening targets, and icons.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
