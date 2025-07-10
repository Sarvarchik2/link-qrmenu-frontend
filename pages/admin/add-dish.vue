<template>
  <div class="add-dish-wrap">
    <h1 class="admin-title">Добавить блюдо</h1>
    <form class="add-dish-form" @submit.prevent="addDish">
      <select v-model="category" required>
        <option value="">Выберите категорию</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <input v-model="name" type="text" placeholder="Название блюда" required />
      <textarea v-model="description" placeholder="Описание блюда"></textarea>
      <input v-model="price" type="text" placeholder="Цена (например: 1500.00)" required />
      <div class="checkboxes">
        <label>
          <input v-model="isHit" type="checkbox" />
          Хит продаж
        </label>
        <label>
          <input v-model="isVegetarian" type="checkbox" />
          Вегетарианское
        </label>
      </div>
      <button type="submit" :disabled="loading">Добавить</button>
    </form>
    <div v-if="success" class="add-dish-success">Блюдо добавлено!</div>
    <div v-if="error" class="add-dish-error">Ошибка: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
const name = ref('')
const category = ref('')
const description = ref('')
const price = ref('')
const isHit = ref(false)
const isVegetarian = ref(false)
const success = ref(false)
const error = ref('')
const loading = ref(false)
const categories = ref<any[]>([])

async function fetchCategories() {
  try {
    const res = await apiFetch('/api/owner/categories/')
    categories.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || 'Ошибка загрузки категорий'
  }
}

async function addDish() {
  error.value = ''
  loading.value = true
  try {
    await apiFetch('/api/owner/items/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: parseInt(category.value),
        name: name.value,
        description: description.value,
        price: price.value,
        is_hit: isHit.value,
        is_vegetarian: isVegetarian.value
      })
    })
    name.value = ''
    category.value = ''
    description.value = ''
    price.value = ''
    isHit.value = false
    isVegetarian.value = false
    success.value = true
    setTimeout(() => success.value = false, 2000)
  } catch (e: any) {
    error.value = e?.message || 'Ошибка добавления'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.add-dish-wrap {
  max-width: 420px;
  margin: 48px auto 0 auto;
  background: var(--oddmenu-card-bg);
  border-radius: var(--oddmenu-radius);
  box-shadow: var(--oddmenu-shadow);
  padding: 32px 12px 28px 12px;
  transition: box-shadow 0.2s;
}
.add-dish-wrap:hover {
  box-shadow: var(--oddmenu-shadow-hover);
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--oddmenu-orange);
  text-align: center;
  letter-spacing: 1px;
}
.add-dish-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.add-dish-form input {
  font-size: 1.08rem;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #f0ece8;
  background: #F8F5F2;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #F39C1220;
}
.add-dish-form input:focus {
  border: 1.5px solid var(--oddmenu-orange);
  box-shadow: 0 2px 12px #F39C1240;
}
.add-dish-form button {
  font-size: 1.15rem;
  padding: 14px 0;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--oddmenu-orange) 60%, #f7b731 100%);
  color: #fff;
  border: none;
  font-weight: 700;
  margin-top: 8px;
  box-shadow: 0 2px 12px #F39C1240;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.add-dish-form button:active, .add-dish-form button:hover {
  background: var(--oddmenu-red);
  box-shadow: 0 4px 18px #F39C1240;
  transform: scale(1.04);
}
.add-dish-success {
  color: #27ae60;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
.add-dish-error {
  color: #E74C3C;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
.add-dish-form select {
  font-size: 1.08rem;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #f0ece8;
  background: #F8F5F2;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #F39C1220;
}
.add-dish-form textarea {
  font-size: 1.08rem;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #f0ece8;
  background: #F8F5F2;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #F39C1220;
  resize: vertical;
  min-height: 80px;
}
.checkboxes {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}
.checkboxes label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #555;
}
@media (max-width: 500px) {
  .add-dish-wrap {
    max-width: 99vw;
    padding: 10px 1vw 10px 1vw;
    border-radius: 14px;
    margin-top: 12px;
  }
  .admin-title {
    font-size: 1.15rem;
    margin-bottom: 10px;
  }
  .add-dish-form {
    gap: 8px;
  }
  .add-dish-form input {
    font-size: 0.98rem;
    padding: 8px 8px;
    border-radius: 7px;
  }
  .add-dish-form button {
    font-size: 1rem;
    padding: 8px 0;
    border-radius: 8px;
    margin-top: 4px;
  }
  .add-dish-success {
    font-size: 0.98rem;
    margin-top: 8px;
  }
}
</style> 