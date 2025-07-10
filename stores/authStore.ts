import { defineStore } from 'pinia';

const API_URL = 'http://127.0.0.1:8000';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access: typeof window !== 'undefined' ? localStorage.getItem('access') || '' : '',
    refresh: typeof window !== 'undefined' ? localStorage.getItem('refresh') || '' : '',
  }),
  actions: {
    setTokens(access: string, refresh: string) {
      this.access = access;
      this.refresh = refresh;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
      }
    },
    logout() {
      this.access = '';
      this.refresh = '';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    },
    async login(username: string, password: string) {
      const res = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      this.setTokens(data.access, data.refresh);
    },
    async refreshToken() {
      if (!this.refresh) throw new Error('No refresh token');
      const res = await fetch(`${API_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: this.refresh }),
      });
      if (!res.ok) throw new Error('Refresh failed');
      const data = await res.json();
      this.setTokens(data.access, this.refresh);
      return data.access;
    },
  },
}); 