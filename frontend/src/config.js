const configuredUrl = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim();
const fallbackUrl = `${window.location.protocol}//${window.location.hostname}:3001`;

export const API_URL = (configuredUrl || fallbackUrl).replace(/\/$/, '');
export const API_BASE_URL = `${API_URL}/api`;
