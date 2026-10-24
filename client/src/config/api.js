/**
 * Centralized API configuration.
 * Auto-detects local development vs production Vercel backend.
 */
const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('10.')
);

export const API_BASE_URL = (
  (isLocalhost ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000') : import.meta.env.VITE_API_URL) || 
  'https://fakhama-nails.vercel.app'
).replace(/\/+$/, '');

export default API_BASE_URL;
