const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('wavz_admin_token');
}

async function req(method, endpoint, body = null, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('wavz_admin_token');
    window.location.href = '/admin/';
    throw new Error('Session expired');
  }

  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login: (email, password) => req('POST', '/auth/login', { email, password }),
  me: () => req('GET', '/auth/me'),
  changePassword: (currentPassword, newPassword) => req('PUT', '/auth/password', { currentPassword, newPassword }),

  // Dashboard
  dashboard: () => req('GET', '/dashboard'),

  // Team
  getTeam: () => req('GET', '/team/all' ).catch(() => req('GET', '/team')),
  createTeamMember: (data) => req('POST', '/team', data),
  updateTeamMember: (id, data) => req('PUT', `/team/${id}`, data),
  deleteTeamMember: (id) => req('DELETE', `/team/${id}`),

  // Board
  getBoard: () => req('GET', '/board/all').catch(() => req('GET', '/board')),
  createBoardMember: (data) => req('POST', '/board', data),
  updateBoardMember: (id, data) => req('PUT', `/board/${id}`, data),
  deleteBoardMember: (id) => req('DELETE', `/board/${id}`),

  // Blog
  getBlogPosts: () => req('GET', '/blog/all'),
  getBlogPost: (id) => req('GET', `/blog/admin/${id}`),
  createBlogPost: (data) => req('POST', '/blog', data),
  updateBlogPost: (id, data) => req('PUT', `/blog/${id}`, data),
  deleteBlogPost: (id) => req('DELETE', `/blog/${id}`),

  // News
  getNews: () => req('GET', '/news/all'),
  createNews: (data) => req('POST', '/news', data),
  updateNews: (id, data) => req('PUT', `/news/${id}`, data),
  deleteNews: (id) => req('DELETE', `/news/${id}`),

  // Partners
  getPartners: () => req('GET', '/partners/all'),
  createPartner: (data) => req('POST', '/partners', data),
  updatePartner: (id, data) => req('PUT', `/partners/${id}`, data),
  deletePartner: (id) => req('DELETE', `/partners/${id}`),

  // Testimonials
  getTestimonials: () => req('GET', '/testimonials/all'),
  createTestimonial: (data) => req('POST', '/testimonials', data),
  updateTestimonial: (id, data) => req('PUT', `/testimonials/${id}`, data),
  deleteTestimonial: (id) => req('DELETE', `/testimonials/${id}`),

  // Timeline
  getTimeline: () => req('GET', '/timeline'),
  createTimelineEntry: (data) => req('POST', '/timeline', data),
  updateTimelineEntry: (id, data) => req('PUT', `/timeline/${id}`, data),
  deleteTimelineEntry: (id) => req('DELETE', `/timeline/${id}`),

  // Settings
  getSettings: () => req('GET', '/settings/grouped'),
  updateSetting: (key, value_en, value_ar) => req('PUT', `/settings/${key}`, { value_en, value_ar }),
  bulkUpdateSettings: (settings) => req('PUT', '/settings', { settings }),

  // Contacts
  getContacts: (status) => req('GET', `/contacts${status ? `?status=${status}` : ''}`),
  getContact: (id) => req('GET', `/contacts/${id}`),
  updateContactStatus: (id, status) => req('PUT', `/contacts/${id}/status`, { status }),
  deleteContact: (id) => req('DELETE', `/contacts/${id}`),

  // Media
  getMedia: (folder) => req('GET', `/media${folder ? `?folder=${folder}` : ''}`),
  uploadMedia: (file, folder = 'general') => {
    const fd = new FormData();
    fd.append('file', file);
    return req('POST', `/media/upload?folder=${folder}`, fd, true);
  },
  deleteMedia: (id) => req('DELETE', `/media/${id}`),
};
