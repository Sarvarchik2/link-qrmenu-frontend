import { useAuthStore } from '@/stores/authStore';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  // Если нет access токена, редиректим на /login
  if (!auth.access) {
    return navigateTo('/login');
  }
}); 