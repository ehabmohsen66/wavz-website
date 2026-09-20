import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import logoNavy from '../assets/Logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back to WAVZ CMS!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img 
            src={logoNavy} 
            alt="WAVZ for Digital Transformation" 
            className="login-logo-img" 
          />
          <div className="login-logo-sub">Content Management System</div>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@wavz.com.eg"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? (
              <span className="spinner-border" />
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
