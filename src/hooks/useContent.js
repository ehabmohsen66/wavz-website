import { useState, useEffect } from 'react';
import api from '../api/client';

export const useTimeline = (fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchTimeline = async () => {
      try {
        const response = await api.get('/timeline');
        if (!active) return;
        
        const rawItems = response?.data?.items || response?.data || (Array.isArray(response) ? response : []);
        // Parse items_en and items_ar if they are JSON strings
        const formatted = (Array.isArray(rawItems) ? rawItems : []).map(item => {
          let items_en = item.items_en;
          let items_ar = item.items_ar;
          if (typeof items_en === 'string') {
            try { items_en = JSON.parse(items_en); } catch (e) { items_en = []; }
          }
          if (typeof items_ar === 'string') {
            try { items_ar = JSON.parse(items_ar); } catch (e) { items_ar = []; }
          }
          return { ...item, items_en, items_ar };
        });

        setData(formatted);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchTimeline();
    return () => { active = false; };
  }, []);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};

export const useTestimonials = (fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/testimonials');
        if (!active) return;
        const rawItems = response?.data?.items || response?.data || (Array.isArray(response) ? response : []);
        setData(Array.isArray(rawItems) ? rawItems : []);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchTestimonials();
    return () => { active = false; };
  }, []);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};

export const useNavigation = (fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchNavigation = async () => {
      try {
        const response = await api.get('/navigation');
        if (!active) return;
        const rawItems = response?.data?.items || response?.data || (Array.isArray(response) ? response : []);
        setData(Array.isArray(rawItems) ? rawItems : []);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchNavigation();
    return () => { active = false; };
  }, []);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};

export const useBlog = (slug = null, fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchBlog = async () => {
      try {
        const endpoint = slug ? `/blog/${slug}` : '/blog?per_page=100';
        const response = await api.get(endpoint);
        if (!active) return;

        if (slug) {
          // Single post response, parse JSON content blocks
          const post = response?.data || response;
          if (post) {
            let blocks_en = post.blocks_en;
            let blocks_ar = post.blocks_ar;
            if (typeof blocks_en === 'string') {
              try { blocks_en = JSON.parse(blocks_en); } catch (e) { blocks_en = []; }
            }
            if (typeof blocks_ar === 'string') {
              try { blocks_ar = JSON.parse(blocks_ar); } catch (e) { blocks_ar = []; }
            }
            setData({ ...post, blocks_en, blocks_ar });
          }
        } else {
          // List of posts from API: { success: true, data: { items: [...], total: ... } }
          const rawItems = response?.data?.items || response?.items || response?.data || (Array.isArray(response) ? response : []);
          const items = Array.isArray(rawItems) ? rawItems : [];
          const formatted = items.map(post => {
            let blocks_en = post.blocks_en;
            let blocks_ar = post.blocks_ar;
            if (typeof blocks_en === 'string') {
              try { blocks_en = JSON.parse(blocks_en); } catch (e) { blocks_en = []; }
            }
            if (typeof blocks_ar === 'string') {
              try { blocks_ar = JSON.parse(blocks_ar); } catch (e) { blocks_ar = []; }
            }
            return { ...post, blocks_en, blocks_ar };
          });
          setData(formatted);
        }
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchBlog();
    return () => { active = false; };
  }, [slug]);

  return { data: (data && Array.isArray(data) && data.length > 0) ? data : (data || fallback), loading, error };
};

export const useNews = (id = null, fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchNews = async () => {
      try {
        const endpoint = id ? `/news/${id}` : '/news?per_page=100';
        const response = await api.get(endpoint);
        if (!active) return;
        if (id) {
          setData(response?.data || response);
        } else {
          const rawItems = response?.data?.items || response?.items || response?.data || (Array.isArray(response) ? response : []);
          setData(Array.isArray(rawItems) ? rawItems : []);
        }
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchNews();
    return () => { active = false; };
  }, [id]);

  return { data: (data && Array.isArray(data) && data.length > 0) ? data : (data || fallback), loading, error };
};

export const useTeam = (fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchTeam = async () => {
      try {
        const response = await api.get('/team');
        if (!active) return;
        const rawItems = response?.data?.items || response?.data || (Array.isArray(response) ? response : []);
        setData(Array.isArray(rawItems) ? rawItems : []);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchTeam();
    return () => { active = false; };
  }, []);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};

export const usePartners = (fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchPartners = async () => {
      try {
        const response = await api.get('/partners');
        if (!active) return;
        const rawItems = response?.data?.items || response?.data || (Array.isArray(response) ? response : []);
        setData(Array.isArray(rawItems) ? rawItems : []);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchPartners();
    return () => { active = false; };
  }, []);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};

export const useServices = (pageSlug, fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageSlug) return;
    let active = true;
    const fetchServices = async () => {
      try {
        const response = await api.get(`/services/${pageSlug}`);
        if (!active) return;
        const rawItems = response?.data?.items || response?.data || (Array.isArray(response) ? response : []);
        setData(Array.isArray(rawItems) ? rawItems : []);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchServices();
    return () => { active = false; };
  }, [pageSlug]);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};

export const usePages = (slug, fallback = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    const fetchPage = async () => {
      try {
        const response = await api.get(`/pages/${slug}`);
        if (!active) return;
        const pageData = response?.data || response;
        if (!pageData) return;
        let content_en = pageData.content_en;
        let content_ar = pageData.content_ar;
        if (typeof content_en === 'string') {
          try { content_en = JSON.parse(content_en); } catch (e) {}
        }
        if (typeof content_ar === 'string') {
          try { content_ar = JSON.parse(content_ar); } catch (e) {}
        }
        setData({ ...pageData, content_en, content_ar });
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchPage();
    return () => { active = false; };
  }, [slug]);

  return { data: data || fallback, loading, error };
};

export const useClients = (fallback = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients');
        if (!active) return;
        const items = Array.isArray(response) ? response : (response?.data || response?.items || []);
        setData(items);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchClients();
    return () => { active = false; };
  }, []);

  return { data: (data && data.length > 0) ? data : fallback, loading, error };
};
