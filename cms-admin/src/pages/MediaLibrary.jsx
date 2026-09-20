import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../contexts/ToastContext';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'document'
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/media');
      setMedia(res.data || res.media || res.items || (Array.isArray(res) ? res : []));
    } catch (err) {
      toast.error('Failed to load media assets: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 15, 90));
    }, 150);

    try {
      const res = await api.upload('/media', file);
      toast.success('Asset uploaded successfully');
      const newItem = res.media || res;
      setMedia(prev => [newItem, ...prev]);
      setSelectedItem(newItem);
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleUploadFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleUploadFile(file);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/media/${deleteId}`);
      toast.success('Asset deleted successfully');
      setMedia(prev => prev.filter(m => m.id !== deleteId));
      if (selectedItem?.id === deleteId) {
        setSelectedItem(null);
      }
    } catch (err) {
      toast.error('Failed to delete asset: ' + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const handleCopyLink = (item) => {
    const url = item.path.startsWith('http') ? item.path : `${window.location.origin}${item.path}`;
    navigator.clipboard.writeText(url);
    toast.success('Asset link copied to clipboard!');
  };

  const filtered = media.filter(item => {
    const matchesSearch = (item.original_name || item.filename || '').toLowerCase().includes(search.toLowerCase());
    const isImg = (item.mime_type || '').startsWith('image/');
    if (filterType === 'image') return matchesSearch && isImg;
    if (filterType === 'document') return matchesSearch && !isImg;
    return matchesSearch;
  });

  return (
    <div className="media-library-page" onDragOver={e => e.preventDefault()} onDrop={e => e.preventDefault()}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Media & Asset Library</h1>
          <p className="page-subtitle">Manage files, images, PDFs, and corporate presentations.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: 24, alignItems: 'flex-start' }}>
        <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Upload Drop Zone */}
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 8,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--blue-light)' : 'var(--white)',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <span className="spinner-border" />
                <div style={{ fontWeight: 600 }}>Uploading file... {Math.round(uploadProgress)}%</div>
                <div style={{ width: '200px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--blue)' }} />
                </div>
              </div>
            ) : (
              <div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ marginBottom: 12 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Drag & drop files here to upload</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Or click to browse from your computer (Max size: 5MB)</div>
              </div>
            )}
          </div>

          {/* Filters and List */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search files by original name..."
                style={{ maxWidth: 300 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="tab-container" style={{ margin: 0, padding: 0 }}>
                <button className={`tab-button btn-sm ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All</button>
                <button className={`tab-button btn-sm ${filterType === 'image' ? 'active' : ''}`} onClick={() => setFilterType('image')}>Images</button>
                <button className={`tab-button btn-sm ${filterType === 'document' ? 'active' : ''}`} onClick={() => setFilterType('document')}>Docs/Other</button>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <span className="spinner-border" />
                <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>Loading media library...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                No assets found matching the criteria.
              </div>
            ) : (
              <div className="media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
                {filtered.map(item => {
                  const isImg = (item.mime_type || '').startsWith('image/');
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`media-grid-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedItem(item)}
                      style={{
                        border: isSelected ? '2px solid var(--blue)' : '1px solid var(--border)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'var(--white)',
                        position: 'relative',
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 8
                      }}
                    >
                      {isImg ? (
                        <img
                          src={item.thumbnail || item.path}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          <span style={{ fontSize: 10, textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>
                            {item.original_name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Side Info Drawer */}
        <div style={{ position: 'sticky', top: 20 }}>
          {selectedItem ? (
            <div className="card" style={{ padding: 20 }}>
              <div className="card-header" style={{ padding: '0 0 12px 0', borderBottom: '1px solid var(--border)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title" style={{ fontSize: 15 }}>Asset Metadata</h3>
                <button
                  type="button"
                  style={{ color: 'var(--text-muted)', fontSize: 13 }}
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  style={{
                    height: 160,
                    background: 'var(--bg)',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid var(--border)'
                  }}
                >
                  {selectedItem.mime_type.startsWith('image/') ? (
                    <img src={selectedItem.path} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, wordBreak: 'break-all', color: 'var(--navy)' }}>
                    {selectedItem.original_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'monospace' }}>
                    {selectedItem.filename}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Mime Type:</span>
                    <strong>{selectedItem.mime_type}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>File Size:</span>
                    <strong>{Math.round((selectedItem.size_bytes / 1024) * 10) / 10} KB</strong>
                  </div>
                  {selectedItem.width && selectedItem.height && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Dimensions:</span>
                      <strong>{selectedItem.width} × {selectedItem.height} px</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Uploaded At:</span>
                    <strong>{new Date(selectedItem.created_at).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleCopyLink(selectedItem)}>
                    Copy Link URL
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(selectedItem.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
              Select any file thumbnail to inspect full dimensions, size parameters, or copy the direct CDN URL link.
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Media File"
        message="Are you sure you want to delete this asset? The file will be permanently deleted from the cPanel disk storage and all image components using this URL will break."
        confirmLabel="Delete Asset"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
