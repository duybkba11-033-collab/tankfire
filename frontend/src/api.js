import { API_BASE_URL } from './config.js';

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('tf_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.dispatchEvent(new Event('auth_expired'));
    }
    const error = new Error(body.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return body;
}
