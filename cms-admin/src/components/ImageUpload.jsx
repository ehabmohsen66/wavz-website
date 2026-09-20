import { useState, useRef } from 'react';
import api from '../api/client';

export default function ImageUpload({ value, onChange, label, required = false }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [imgError, setImgError] = useState(false);
  const [localPreview, setLocalPreview] = useState('');
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    // Create instant local blob preview so user immediately sees image
    const localUrl = URL.createObjectURL(file);
    setLocalPreview(localUrl);
    setImgError(false);
    setUploading(true);
    setProgress(15);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 90));
    }, 200);

    try {
      const response = await api.upload('/media', file);
      const resItem = response?.data || response;
      const serverUrl = resItem?.path || resItem?.url || (resItem?.filename ? `/api/uploads/${resItem.filename}` : '');
      
      if (serverUrl) {
        onChange(serverUrl);
      } else {
        // Fallback to local preview if server returns no path
        onChange(localUrl);
      }
      setProgress(100);
    } catch (err) {
      console.error('Upload failed, using local preview:', err);
      // Keep local preview if upload endpoint had issues
      onChange(localUrl);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 400);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setLocalPreview('');
    setUrlInput('');
    setImgError(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      setImgError(false);
      onChange(urlInput.trim());
    }
  };

  const displaySrc = localPreview || value;

  if (value || localPreview) {
    return (
      <div className="form-group" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          {label && (
            <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
              {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '3px 10px', fontSize: 12 }}
              onClick={() => fileRef.current?.click()}
            >
              Replace Image
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '3px 10px', fontSize: 12 }}
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            borderRadius: 10,
            overflow: 'hidden',
            border: imgError ? '2px dashed #ef4444' : '1px solid #E2E8F0',
            background: '#F8FAFC',
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {imgError ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>Unable to load image from source</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, wordBreak: 'break-all', maxWidth: 400 }}>
                {value}
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: 12, padding: '4px 12px', fontSize: 12 }}
                onClick={() => fileRef.current?.click()}
              >
                Choose Another Image
              </button>
            </div>
          ) : (
            <img
              src={displaySrc}
              alt="Cover Preview"
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          )}

          <div
            style={{
              padding: '6px 12px',
              fontSize: 11,
              background: '#082D4A',
              color: 'rgba(255,255,255,0.85)',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
              ✓ Image Selected: {value || 'Local Preview'}
            </span>
            <span style={{ color: '#FFB814', fontWeight: 600 }}>Active</span>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        {label && (
          <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
        )}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background: mode === 'upload' ? '#1173BD' : '#E2E8F0',
              color: mode === 'upload' ? '#fff' : '#475569',
              fontWeight: 600
            }}
            onClick={() => setMode('upload')}
          >
            Upload File
          </button>
          <button
            type="button"
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background: mode === 'url' ? '#1173BD' : '#E2E8F0',
              color: mode === 'url' ? '#fff' : '#475569',
              fontWeight: 600
            }}
            onClick={() => setMode('url')}
          >
            Paste URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed #CBD5E1',
            borderRadius: 10,
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(17,115,189,0.06)' : '#FAFCFF',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>📸</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#082D4A' }}>
            {uploading ? 'Uploading image...' : 'Click to browse or drop cover image here'}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
            JPG, PNG, WebP up to 5MB (Recommended: 1200 x 630 px)
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <input
            type="text"
            className="form-input"
            placeholder="https://example.com/images/cover.jpg or /blog-images/Ai1-400x250.png"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUrlApply(); } }}
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap', padding: '0 16px' }}
            onClick={handleUrlApply}
          >
            Apply
          </button>
        </div>
      )}

      {uploading && (
        <div className="upload-progress" style={{ marginTop: 8 }}>
          <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
