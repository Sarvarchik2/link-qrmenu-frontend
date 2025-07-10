import { useAuthStore } from '@/stores/authStore';

const BASE_URL = 'http://127.0.0.1:8000';

export async function apiFetch(endpoint: string, options: RequestInit = {}, auth: boolean = true) {
  const authStore = useAuthStore();
  let headers: any = options.headers || {};
  if (auth && authStore.access) {
    headers['Authorization'] = `Bearer ${authStore.access}`;
  }
  let res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  // Если access истёк, пробуем refresh
  if (auth && res.status === 401 && authStore.refresh) {
    try {
      const newAccess = await authStore.refreshToken();
      headers['Authorization'] = `Bearer ${newAccess}`;
      res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      authStore.logout();
      throw new Error('Session expired. Please login again.');
    }
  }
  if (!res.ok) throw new Error('API error');
  return res.json();
} 