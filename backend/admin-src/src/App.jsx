import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './api.js';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Team from './pages/Team.jsx';
import Board from './pages/Board.jsx';
import Blog from './pages/Blog.jsx';
import News from './pages/News.jsx';
import Partners from './pages/Partners.jsx';
import Testimonials from './pages/Testimonials.jsx';
import Timeline from './pages/Timeline.jsx';
import Contacts from './pages/Contacts.jsx';
import Settings from './pages/Settings.jsx';
import Media from './pages/Media.jsx';

// ── Auth Context ────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wavz_admin_token');
    if (token) {
      api.me()
        .then(r => { setUser(r.user); setLoading(false); })
        .catch(() => { localStorage.removeItem('wavz_admin_token'); setLoading(false); });
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login(email, password);
    localStorage.setItem('wavz_admin_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('wavz_admin_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:40, height:40, border:'3px solid var(--border)', borderTop:'3px solid var(--gold)', borderRadius:'50%' }} className="spin" />
    </div>
  );
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="team" element={<Team />} />
                  <Route path="board" element={<Board />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="news" element={<News />} />
                  <Route path="partners" element={<Partners />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="timeline" element={<Timeline />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="media" element={<Media />} />
                  <Route path="*" element={<Navigate to="/admin/" replace />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/admin/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
