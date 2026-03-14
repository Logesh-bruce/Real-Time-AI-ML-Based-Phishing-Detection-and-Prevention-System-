export const API_BASE = import.meta.env.VITE_API_URL || '';
export const WS_BASE = import.meta.env.VITE_WS_URL || '';

// Wake up Render free tier on app load
export const wakeUpServer = () => {
  fetch(`${API_BASE}/api/health`).catch(() => {});
};