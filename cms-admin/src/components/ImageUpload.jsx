import { useState, useRef } from 'react';
import api from '../api/client';

export default function ImageUpload({ value, onChange, label }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 85));
    }, 200);

    try {
      const data = await api.upload('/media', file);
      const url = data.url || data.media?.url || `/uploads/${data.filename || data.media?.filename}`;
      onChange(url);
      setProgress(100);
    } catch {
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
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
    if (fileRef.current) fileRef.current.value = '';
  };

  if (value) {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <div className="upload-preview">
          <img src={value} alt="Preview" />
          <button type="button" className="upload-preview-remove" onClick={handleRemove}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileRef.current?.click()}
      >
        <div className="upload-zone-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div className="upload-zone-text">
          {uploading ? 'Uploading...' : 'Drop an image here or click to browse'}
        </div>
        <div className="upload-zone-hint">PNG, JPG, WebP up to 5MB</div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>
      {uploading && (
        <div className="upload-progress">
          <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
