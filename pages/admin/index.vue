<template>
  <div class="admin-restaurants">
    <h1 class="admin-title">Рестораны</h1>
    <div v-if="loading" class="admin-loading">Загрузка...</div>
    <div v-else-if="error" class="admin-error">Ошибка: {{ error }}</div>
    <div v-else>
      <div v-if="restaurants.length === 0">Нет ресторанов</div>
      <ul v-else class="restaurant-list">
        <li v-for="r in restaurants" :key="r.id" class="restaurant-item">
          <div class="restaurant-name">{{ r.name }}</div>
          <div class="restaurant-address">{{ r.address }}</div>
        </li>
      </ul>
    </div>

    <h2 class="admin-title" style="margin-top:40px;">Категории</h2>
    <form class="category-form" @submit.prevent="addCategory">
      <input v-model="newCategory" type="text" placeholder="Название категории" required />
      <button type="submit" :disabled="catLoading">Добавить</button>
    </form>
    <div v-if="catError" class="admin-error">Ошибка: {{ catError }}</div>
    <div v-if="catLoading" class="admin-loading">Загрузка...</div>
    <ul class="category-list">
      <li v-for="cat in categories" :key="cat.id" class="category-item">
        <span>{{ cat.name }}</span>
        <button @click="deleteCategory(cat.id)" :disabled="catDeletingId === cat.id">Удалить</button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
definePageMeta({ layout: 'admin', middleware: 'auth' })
const restaurants = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const categories = ref<any[]>([])
const catLoading = ref(false)
const catError = ref('')
const newCategory = ref('')
const catDeletingId = ref<number|null>(null)

async function fetchCategories() {
  catLoading.value = true
  catError.value = ''
  try {
    const res = await apiFetch('/api/owner/categories/')
    categories.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    catError.value = e?.message || 'Ошибка загрузки категорий'
  } finally {
    catLoading.value = false
  }
}

async function addCategory() {
  catError.value = ''
  catLoading.value = true
  try {
    await apiFetch('/api/owner/categories/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.value })
    })
    newCategory.value = ''
    await fetchCategories()
  } catch (e: any) {
    catError.value = e?.message || 'Ошибка добавления'
  } finally {
    catLoading.value = false
  }
}

async function deleteCategory(id: number) {
  catError.value = ''
  catDeletingId.value = id
  try {
    await apiFetch(`/api/owner/categories/${id}/`, { method: 'DELETE' })
    await fetchCategories()
  } catch (e: any) {
    catError.value = e?.message || 'Ошибка удаления'
  } finally {
    catDeletingId.value = null
  }
}

onMounted(async () => {
  try {
    const res = await apiFetch('/api/admin/restaurants/')
    restaurants.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
  await fetchCategories()
})
</script>

<style scoped>
.admin-restaurants {
  max-width: 600px;
  margin: 48px auto 0 auto;
  background: var(--oddmenu-card-bg);
  border-radius: var(--oddmenu-radius);
  box-shadow: var(--oddmenu-shadow);
  padding: 32px 16px 28px 16px;
  text-align: center;
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 28px;
  color: var(--oddmenu-orange);
  letter-spacing: 1px;
}
.admin-loading {
  color: #888;
  font-size: 1.1rem;
  margin: 24px 0;
}
.admin-error {
  color: #E74C3C;
  font-size: 1.1rem;
  margin: 24px 0;
}
.restaurant-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.restaurant-item {
  background: linear-gradient(135deg, #fffbe6 60%, #f9e7c4 100%);
  border-radius: 14px;
  box-shadow: 0 2px 12px #F39C1240;
  padding: 18px 16px;
  text-align: left;
}
.restaurant-name {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.restaurant-address {
  color: #888;
  font-size: 1rem;
}
.category-form {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  justify-content: center;
}
.category-form input {
  font-size: 1.08rem;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1.5px solid #f0ece8;
  background: #F8F5F2;
  outline: none;
}
.category-form button {
  font-size: 1.08rem;
  padding: 8px 18px;
  border-radius: 8px;
  background: #F39C12;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.category-form button:active {
  background: #E74C3C;
}
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.category-item {
  background: #fffbe6;
  border-radius: 10px;
  box-shadow: 0 1px 6px #F39C1220;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 18px;
}
.category-item button {
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.category-item button:active, .category-item button:disabled {
  background: #c0392b;
  opacity: 0.7;
}
</style>