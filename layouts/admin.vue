.admin-main<template>
  <div class="admin-layout">
    <button class="sidebar-toggle" @click="sidebarOpen = true" v-if="isMobile && !sidebarOpen">☰</button>
    <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="sidebarOpen = false"></div>
    <aside class="admin-sidebar" :class="{ open: sidebarOpen || !isMobile }">
      <div class="sidebar-title">{{ t('admin.sidebar.title') }}</div>
      <div class="sidebar-lang-switch">
        <select :value="locale" @change="onLangChange" class="lang-select">
          <option value="ru">Русский</option>
          <option value="uz">Oʻzbekcha</option>
        </select>
      </div>
      <NuxtLink to="/admin/dashboard" active-class="active" @click="handleSidebarLinkClick"><span>🏠</span> {{ t('admin.sidebar.dashboard') }}</NuxtLink>
      <NuxtLink to="/admin/menu" active-class="active" @click="handleSidebarLinkClick"><span>📋</span> {{ t('admin.sidebar.menu') }}</NuxtLink>
      <NuxtLink to="/admin/categories" active-class="active" @click="handleSidebarLinkClick"><span>📂</span> {{ t('admin.sidebar.categories') }}</NuxtLink>
      <NuxtLink to="/admin/add-dish" active-class="active" @click="handleSidebarLinkClick"><span>➕</span> {{ t('admin.sidebar.addDish') }}</NuxtLink>
      <NuxtLink to="/admin/orders" active-class="active" @click="handleSidebarLinkClick"><span>🛒</span> {{ t('admin.sidebar.orders') }}</NuxtLink>
      <NuxtLink v-if="restaurantSlug" :to="`/menu/${restaurantSlug}`" target="_blank" @click="handleSidebarLinkClick"><span>🌐</span> {{ t('admin.sidebar.myRestaurant') }}</NuxtLink>
      <button class="admin-logout" @click="logout"><span>🚪</span> {{ t('admin.sidebar.logout') }}</button>
      <button v-if="isMobile" class="sidebar-close" @click="sidebarOpen = false">✕</button>
    </aside>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { apiFetch } from '@/utils/api'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
function onLangChange(e) {
  locale.value = e.target.value
}
// JWT decode helper
function parseJwt (token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}
const auth = useAuthStore()
const restaurantSlug = ref(null)
// Получаем slug через /api/owner/info/
onMounted(async () => {
  if (auth.access) {
    try {
      const res = await apiFetch('/api/owner/info/')
      restaurantSlug.value = res?.slug || null
    } catch {}
  }
})
function logout() {
  localStorage.removeItem('admin_auth')
  auth.logout()
  router.push('/login')
}
onMounted(() => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const access = localStorage.getItem('access')
      if (access && !auth.access) {
        auth.access = access
      }
      if (!auth.access) {
        router.push('/login')
      }
    }, 150)
  }
})
const sidebarOpen = ref(false)
const isMobile = ref(false)
function handleResize() {
  isMobile.value = window.innerWidth <= 700
  if (!isMobile.value) sidebarOpen.value = false
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
function handleSidebarLinkClick() {
  if (isMobile.value) sidebarOpen.value = false;
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f8fafd;
  display: flex;
}
.admin-sidebar {
  width: 250px;
  background: #fff;
  border-right: 1.5px solid #e6eaf0;
  box-shadow: 2px 0 16px #1a9c6b11;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px 0 0 0;
  align-items: stretch;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1100;
  border-radius: 0 24px 24px 0;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.sidebar-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1a9c6b;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 1px;
}
.admin-sidebar a {
  color: #1a9c6b;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.08rem;
  padding: 14px 28px;
  border-radius: 0 18px 18px 0;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}
.admin-sidebar a.active, .admin-sidebar a.router-link-exact-active {
  background: #1a9c6b;
  color: #fff;
}
.admin-logout {
  margin: 32px 18px 0 18px;
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}
.admin-logout:active {
  background: #c0392b;
}
.admin-main {
  margin: 0 auto;
  width: 100%;
  flex: 1;
  min-height: 100vh;
  background: #fff;
}
.sidebar-toggle {
  display: none;
}
.sidebar-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: #1a9c6b;
  padding: none!important;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  z-index: 1200;
}
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 1099;
  transition: opacity 0.2s;
}
.sidebar-lang-switch {
  margin: 0 0 18px 0;
  text-align: center;
}
.lang-select {
  border-radius: 8px;
  padding: 4px 12px;
  border: none;
  background: #f8fafd;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 8px;
}
@media (max-width: 700px) {
  .admin-sidebar {
    transform: translateX(-100%);
    padding: 18px 0 0 0;
    border-radius: 0 18px 18px 0;
  }
  .admin-sidebar.open {
    transform: translateX(0);
  }
  .sidebar-toggle {
    display: block;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1201;
    background: #fff;
    border: none;
    border-radius: 8px;
    font-size: 24px;
    line-height: 21px;
    padding: 12px;
    box-shadow: 0 2px 12px #0001;
    color: #1a9c6b;
    cursor: pointer;
  }
}
</style> 