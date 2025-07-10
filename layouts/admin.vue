<template>
  <div class="admin-layout">
    <button class="sidebar-toggle" @click="sidebarOpen = true" v-if="isMobile && !sidebarOpen">☰</button>
    <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="sidebarOpen = false"></div>
    <aside class="admin-sidebar" :class="{ open: sidebarOpen || !isMobile }">
      <div class="sidebar-title">Admin</div>
      <NuxtLink to="/admin/dashboard" active-class="active"><span>🏠</span> Дашборд</NuxtLink>
      <NuxtLink to="/admin/menu" active-class="active"><span>📋</span> Меню</NuxtLink>
      <NuxtLink to="/admin/add-dish" active-class="active"><span>➕</span> Добавить блюдо</NuxtLink>
      <NuxtLink to="/admin/orders" active-class="active"><span>🛒</span> Заказы</NuxtLink>
      <button class="admin-logout" @click="logout"><span>🚪</span> Выйти</button>
      <button v-if="isMobile" class="sidebar-close" @click="sidebarOpen = false">✕</button>
    </aside>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
const router = useRouter()
function logout() {
  localStorage.removeItem('admin_auth')
  router.push('/login')
}
onMounted(() => {
  if (localStorage.getItem('admin_auth') !== '1') {
    router.push('/login')
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
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #faf8f6;
  display: flex;
}
.admin-sidebar {
  width: 280px;
  background: #fff;
  border-right: 1.5px solid #f0ece8;
  box-shadow: 2px 0 12px #0001;
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
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.sidebar-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #F39C12;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 1px;
}
.admin-sidebar a {
  color: #F39C12;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.08rem;
  padding: 12px 28px;
  border-radius: 0 18px 18px 0;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}
.admin-sidebar a.active, .admin-sidebar a.router-link-exact-active {
  background: #F39C12;
  color: #fff;
}
.admin-logout {
  margin: 32px 18px 0 18px;
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
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
  padding: 15px;
  width: 100%;
  flex: 1;
  min-height: 100vh;
}
.sidebar-toggle {
  display: none;
}
.sidebar-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: #E74C3C;
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
@media (max-width: 700px) {
  .admin-sidebar {
    transform: translateX(-100%);
    padding: 18px 0 0 0;
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
    color: #F39C12;
    cursor: pointer;
  }
}
</style> 