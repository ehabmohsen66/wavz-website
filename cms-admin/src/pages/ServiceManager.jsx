import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useToast } from '../contexts/ToastContext';

const servicePages = [
  { slug: 'managed-services', name: 'Managed Services', prefix: 'MS', icon: 'server' },
  { slug: 'financial-services', name: 'Financial Services', prefix: 'FS', icon: 'trending-up' },
  { slug: 'payment-services', name: 'Payment Services', prefix: 'PS', icon: 'credit-card' },
  { slug: 'sap-services', name: 'SAP Services', prefix: 'SAP', icon: 'cpu' },
  { slug: 'digital-transformation', name: 'Digital Transformation', prefix: 'DT', icon: 'zap' },
];

export default function ServiceManager() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    try {
      const allServices = await api.get('/services'); // gets all services
      const res = allServices.data || allServices || [];
      
      const countsMap = {};
      servicePages.forEach(p => countsMap[p.slug] = 0);
      
      res.forEach(item => {
        if (countsMap[item.page_slug] !== undefined) {
          countsMap[item.page_slug]++;
        }
      });
      setCounts(countsMap);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <div className="service-manager-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Service Modules</h1>
          <p className="page-subtitle">Configure structured sub-pages and feature modules.</p>
        </div>
      </div>

      <div className="grid grid-3">
        {servicePages.map(page => (
          <div key={page.slug} className="card service-card" onClick={() => navigate(`/services/${page.slug}`)} style={{ cursor: 'pointer' }}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="service-icon-wrapper">
                  {page.icon === 'server' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>}
                  {page.icon === 'trending-up' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
                  {page.icon === 'credit-card' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>}
                  {page.icon === 'cpu' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>}
                  {page.icon === 'zap' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{page.prefix} Prefix</div>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{page.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {loading ? 'Counting services...' : `${counts[page.slug] ?? 0} active service blocks`}
                </p>
              </div>
              <div style={{ alignSelf: 'flex-start', marginTop: 8, fontSize: 13, fontWeight: 600, color: 'var(--blue)', display: 'flex', alignItems: 'center' }}>
                Manage Sub-pages
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
