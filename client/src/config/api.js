/**
 * Centralized API configuration.
 * Reads VITE_API_URL from .env with fallback to production Vercel backend.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://fakhama-nails.vercel.app'
).replace(/\/+$/, '');

export default API_BASE_URL;
