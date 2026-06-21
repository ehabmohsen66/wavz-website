import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font)' }}>
      <div style={{ width:'100%', maxWidth:400, padding:'0 20px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:56, height:56, background:'var(--gold)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'var(--navy)', margin:'0 auto 16px' }}>W</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--white)', marginBottom:6 }}>WAVZ Admin</h1>
          <p style={{ fontSize:13.5, color:'rgba(145,196,245,0.6)' }}>Sign in to manage your website</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:32 }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:20, color:'#EF4444', fontSize:13.5 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(145,196,245,0.7)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:8, color:'var(--white)', fontSize:14, outline:'none' }}
              placeholder="admin@wavz.com.eg" autoFocus
            />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(145,196,245,0.7)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:8, color:'var(--white)', fontSize:14, outline:'none' }}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'13px', background: loading ? 'rgba(255,184,20,0.5)' : 'var(--gold)', border:'none', borderRadius:8, color:'var(--navy)', fontSize:15, fontWeight:700, transition:'all 0.2s' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, fontSize:12, color:'rgba(145,196,245,0.4)' }}>
          WAVZ Management Console — Restricted Access
        </p>
      </div>
    </div>
  );
}
