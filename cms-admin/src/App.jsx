import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BlogList from './pages/BlogList';
import BlogEditor from './pages/BlogEditor';
import NewsList from './pages/NewsList';
import NewsEditor from './pages/NewsEditor';
import ServiceManager from './pages/ServiceManager';
import ServiceEditor from './pages/ServiceEditor';
import TeamManager from './pages/TeamManager';
import PartnerManager from './pages/PartnerManager';
import TimelineManager from './pages/TimelineManager';
import TestimonialsManager from './pages/TestimonialsManager';
import MediaLibrary from './pages/MediaLibrary';
import NavigationEditor from './pages/NavigationEditor';
import Settings from './pages/Settings';
import UsersManager from './pages/UsersManager';
import Profile from './pages/Profile';
import InquiriesManager from './pages/InquiriesManager';
import AnalyticsSettings from './pages/AnalyticsSettings';
import SiteTools from './pages/SiteTools';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" />
        <span style={{ marginLeft: 12 }}>Checking authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function MainRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/new" element={<BlogEditor />} />
        <Route path="blog/:id" element={<BlogEditor />} />
        
        <Route path="news" element={<NewsList />} />
        <Route path="news/new" element={<NewsEditor />} />
        <Route path="news/:id" element={<NewsEditor />} />
        
        <Route path="services" element={<ServiceManager />} />
        <Route path="services/:pageSlug" element={<ServiceEditor />} />
        
        <Route path="inquiries" element={<InquiriesManager />} />
        <Route path="team" element={<TeamManager />} />
        <Route path="partners" element={<PartnerManager />} />
        <Route path="timeline" element={<TimelineManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="navigation" element={<NavigationEditor />} />
        <Route path="analytics" element={<AnalyticsSettings />} />
        <Route path="tools" element={<SiteTools />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        
        {/* Admin only */}
        <Route
          path="users"
          element={
            <ProtectedRoute adminOnly>
              <UsersManager />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}
