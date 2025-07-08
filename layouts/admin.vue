<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-title">Admin</div>
      <NuxtLink to="/admin/dashboard" active-class="active"><span>🏠</span> Дашборд</NuxtLink>
      <NuxtLink to="/admin/menu" active-class="active"><span>📋</span> Меню</NuxtLink>
      <NuxtLink to="/admin/add-dish" active-class="active"><span>➕</span> Добавить блюдо</NuxtLink>
      <NuxtLink to="/admin/orders" active-class="active"><span>🛒</span> Заказы</NuxtLink>
      <button class="admin-logout" @click="logout"><span>🚪</span> Выйти</button>
    </aside>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
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
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #faf8f6;
  display: flex;
}
.admin-sidebar {
  width: 210px;
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
  z-index: 10;
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
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 32px 240px;
  flex: 1;
  min-height: 100vh;
}
@media (max-width: 700px) {
  .admin-sidebar {
    width: 100px;
    padding: 18px 0 0 0;
  }
  .admin-sidebar a, .admin-logout {
    font-size: 0.95rem;
    padding: 10px 10px;
    border-radius: 0 12px 12px 0;
    justify-content: flex-start;
  }
  .sidebar-title {
    font-size: 1rem;
    margin-bottom: 18px;
  }
  .admin-main {
    padding-left: 120px;
  }
}
</style> 