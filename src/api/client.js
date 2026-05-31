const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL.replace(/\/+$/, '');
  }

  async request(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/json'
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
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
      console.warn(`CMS API Error at ${endpoint}:`, error.message);
      throw error; // Rethrow to let hook handle fallback
    }
  }

  async get(endpoint) {
    return this.request('GET', endpoint);
  }
}

const api = new ApiClient();
export default api;
