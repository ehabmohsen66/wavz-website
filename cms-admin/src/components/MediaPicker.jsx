import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

export default function MediaPicker({ isOpen, onClose, onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/media');
      setMedia(data.media || data || []);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelected(null);
      setSearch('');
    }
  }, [isOpen, fetchMedia]);

  const filtered = search.trim()
    ? media.filter(m => (m.filename || m.name || '').toLowerCase().includes(search.toLowerCase()))
    : media;

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await api.upload('/media', file);
      const newItem = data.media || data;
      setMedia(prev => [newItem, ...prev]);
      setSelected(newItem);
    } catch {
      // handled silently
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-full" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Select Media</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div className="data-table-search" style={{ flex: 1 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No media found</div>
              <div className="empty-state-desc">Upload some files to get started.</div>
            </div>
          ) : (
            <div className="media-grid">
              {filtered.map(item => (
                <div
                  key={item.id || item.filename}
                  className={`media-item ${selected?.id === item.id ? 'selected' : ''}`}
                  onClick={() => setSelected(item)}
                >
                  <div className="media-item-thumb">
                    <img
                      src={item.url || item.thumbnail_url || `/uploads/${item.filename}`}
                      alt={item.alt_en || item.filename}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="media-item-info">
                    <div className="media-item-name">{item.filename || item.name}</div>
                    {item.size && <div className="media-item-size">{formatFileSize(item.size)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSelect} disabled={!selected}>Select</button>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
