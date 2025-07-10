<template>
  <div class="admin-menu">
    <h1 class="admin-title">Меню ресторана</h1>
    <NuxtLink to="/admin/add-dish" class="add-dish-btn">+ Добавить блюдо</NuxtLink>
    <div v-if="loading" class="admin-loading">Загрузка...</div>
    <div v-else-if="error" class="admin-error">Ошибка: {{ error }}</div>
    <div class="dish-list">
      <div v-for="dish in dishes" :key="dish.id" class="dish-card">
        <img :src="dish.photo || 'https://via.placeholder.com/54x54?text=No+Image'" class="dish-img" />
        <div class="dish-info">
          <div class="dish-title">{{ dish.name }}</div>
          <div class="dish-meta">{{ dish.price }} сум</div>
          <div v-if="dish.description" class="dish-description">{{ dish.description }}</div>
          <div class="dish-flags">
            <span v-if="dish.is_hit" class="flag hit">Хит</span>
            <span v-if="dish.is_vegetarian" class="flag veg">Вег</span>
          </div>
        </div>
        <button class="dish-delete" @click="deleteDish(dish.id)" :disabled="deletingId === dish.id">
          <span v-if="deletingId === dish.id">...</span>
          <span v-else>Удалить</span>
        </button>
      </div>
    </div>
    <div v-if="deleteError" class="admin-error">Ошибка удаления: {{ deleteError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
definePageMeta({ layout: 'admin', middleware: 'auth' })
const dishes = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const deletingId = ref<number|null>(null)
const deleteError = ref('')
async function fetchDishes() {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/owner/items/')
    dishes.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
}
onMounted(fetchDishes)
async function deleteDish(id: number) {
  deleteError.value = ''
  deletingId.value = id
  try {
    await apiFetch(`/api/owner/items/${id}/`, { method: 'DELETE' })
    await fetchDishes()
  } catch (e: any) {
    deleteError.value = e?.message || 'Ошибка удаления'
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.admin-menu {
  max-width: 700px;
  margin: 0 auto;
  background: var(--oddmenu-card-bg);
  border-radius: var(--oddmenu-radius);
  box-shadow: var(--oddmenu-shadow);
  padding: 32px 12px 28px 12px;
  transition: box-shadow 0.2s;
}
.admin-menu:hover {
  box-shadow: var(--oddmenu-shadow-hover);
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--oddmenu-orange);
  letter-spacing: 1px;
}
.add-dish-btn {
  display: inline-block;
  margin-bottom: 22px;
  background: linear-gradient(90deg, var(--oddmenu-orange) 60%, #f7b731 100%);
  color: #fff;
  font-weight: 700;
  padding: 10px 22px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px #F39C1240;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.add-dish-btn:active, .add-dish-btn:hover {
  background: var(--oddmenu-red);
  box-shadow: 0 4px 18px #F39C1240;
  transform: scale(1.04);
}
.dish-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
}
.dish-card {
  background: linear-gradient(135deg, #fffbe6 60%, #f9e7c4 100%);
  border-radius: 18px;
  box-shadow: 0 2px 12px #F39C1240;
  padding: 16px 12px 12px 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 210px;
  max-width: 320px;
  flex: 1 1 210px;
  transition: box-shadow 0.2s, transform 0.15s;
}
.dish-card:hover {
  box-shadow: 0 6px 24px #F39C1240;
  transform: translateY(-2px) scale(1.03);
}
.dish-img {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 2px 8px #0001;
}
.dish-title {
  font-size: 1.12rem;
  font-weight: 700;
  margin-bottom: 2px;
}
.dish-meta {
  color: #888;
  font-size: 0.98rem;
}
.dish-description {
  color: #666;
  font-size: 0.9rem;
  margin-top: 4px;
}
.dish-flags {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.flag {
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
.flag.hit {
  background: #F39C12;
  color: #fff;
}
.flag.veg {
  background: #27ae60;
  color: #fff;
}
.dish-delete {
  margin-left: auto;
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.dish-delete:active, .dish-delete:disabled {
  background: #c0392b;
  opacity: 0.7;
}
@media (max-width: 500px) {
  .admin-menu {
    max-width: 99vw;
    padding: 10px 1vw 10px 1vw;
    border-radius: 14px;
  }
  .admin-title {
    font-size: 1.15rem;
    margin-bottom: 10px;
  }
  .add-dish-btn {
    font-size: 0.95rem;
    padding: 8px 12px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .dish-list {
    flex-direction: column;
    gap: 8px;
  }
  .dish-card {
    min-width: 0;
    max-width: 99vw;
    padding: 8px 4px 6px 4px;
    border-radius: 10px;
    gap: 7px;
  }
  .dish-img {
    width: 36px;
    height: 36px;
    border-radius: 6px;
  }
  .dish-title {
    font-size: 0.98rem;
  }
  .dish-meta {
    font-size: 0.85rem;
  }
}
</style> 