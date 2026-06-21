import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api.js';

const FOLDERS = ['general','team','board','blog','news','partners','testimonials'];
const BYTES = n => n < 1024 ? `${n}B` : n < 1048576 ? `${(n/1024).toFixed(1)}KB` : `${(n/1048576).toFixed(1)}MB`;

export default function Media() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(null);
  const inputRef = useRef();

  const load = () => {
    setLoading(true);
    api.getMedia(folder).then(d => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(load, [folder]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      await api.uploadMedia(file, folder).catch(err => alert(err.message));
    }
    load(); setUploading(false); e.target.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    await api.deleteMedia(id).catch(() => {});
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const copyUrl = (url) => {
    const full = url.startsWith('http') ? url : `http://localhost:3001${url}`;
    navigator.clipboard.writeText(full);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="animate-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Media Library</h1>
          <p style={{ color:'var(--muted)', fontSize:13.5 }}>Upload and manage images used across the website</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <select value={folder} onChange={e => setFolder(e.target.value)}
            style={{ padding:'9px 14px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--white)', fontSize:13.5, outline:'none' }}>
            {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            style={{ padding:'9px 20px', background:'var(--gold)', border:'none', borderRadius:8, color:'var(--navy)', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>
            {uploading ? 'Uploading…' : '+ Upload'}
          </button>
          <input ref={inputRef} type="file" multiple accept="image/*" style={{ display:'none' }} onChange={handleUpload} />
        </div>
      </div>

      {loading ? (
        <div style={{ color:'var(--muted)', fontSize:14 }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ background:'var(--card)', border:'2px dashed var(--border)', borderRadius:12, padding:60, textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🖼</div>
          <div style={{ color:'var(--muted)', fontSize:14, marginBottom:16 }}>No files in "{folder}" folder yet.</div>
          <button onClick={() => inputRef.current?.click()} style={{ padding:'10px 22px', background:'var(--gold)', border:'none', borderRadius:8, color:'var(--navy)', fontSize:14, fontWeight:700, cursor:'pointer' }}>Upload First Image</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:16 }}>
          {items.map(item => {
            const src = item.url.startsWith('http') ? item.url : `http://localhost:3001${item.url}`;
            return (
              <div key={item.id} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                <div style={{ height:120, background:'rgba(0,0,0,0.3)', position:'relative', overflow:'hidden' }}>
                  <img src={src} alt={item.original} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:12, color:'var(--white)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }} title={item.original}>{item.original}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:10 }}>{BYTES(item.size)}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => copyUrl(item.url)}
                      style={{ flex:1, padding:'6px', background: copied===item.url ? 'rgba(34,197,94,0.15)' : 'rgba(17,115,189,0.15)', border:'none', borderRadius:6, color: copied===item.url ? 'var(--success)' : 'var(--blueL)', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                      {copied===item.url ? '✓ Copied' : 'Copy URL'}
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      style={{ padding:'6px 10px', background:'rgba(239,68,68,0.12)', border:'none', borderRadius:6, color:'#EF4444', fontSize:11, cursor:'pointer' }}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ fontSize:12, color:'var(--muted)', marginTop:12 }}>{items.length} files in "{folder}"</div>
    </div>
  );
}
