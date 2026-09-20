const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL.replace(/\/+$/, '');
  }

  getToken() {
    return localStorage.getItem('wavz_cms_token');
  }

  setToken(token) {
    localStorage.setItem('wavz_cms_token', token);
  }

  removeToken() {
    localStorage.removeItem('wavz_cms_token');
  }

  async request(method, endpoint, body = null, isFormData = false) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData && body) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.removeToken();
        window.location.href = '/admin/login';
        throw new Error('Session expired. Please log in again.');
      }

      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const message = (data && typeof data === 'object' && data.error)
          ? data.error
          : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, body, isFormData = false) {
    return this.request('POST', endpoint, body, isFormData);
  }

  async put(endpoint, body, isFormData = false) {
    return this.request('PUT', endpoint, body, isFormData);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.post(endpoint, formData, true);
  }
}

const api = new ApiClient();
export default api;
