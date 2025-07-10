<template>
  <div class="restaurant-details">
    <div v-if="loading" class="restaurant-loading">Загрузка...</div>
    <div v-else-if="error" class="restaurant-error">Ошибка: {{ error }}</div>
    <div v-else-if="restaurant">
      <h1 class="restaurant-title">{{ restaurant.name }}</h1>
      <img v-if="restaurant.logo" :src="restaurant.logo" alt="Logo" class="restaurant-logo" />
      <div class="restaurant-info">
        <p><b>Описание:</b> {{ restaurant.description }}</p>
        <p><b>Контакты:</b> {{ restaurant.contacts }}</p>
        <p><b>Адрес:</b> {{ restaurant.address }}</p>
        <p><b>Slug:</b> {{ restaurant.slug }}</p>
        <p><b>ID владельца:</b> {{ restaurant.owner }}</p>
        <p><b>ID ресторана:</b> {{ restaurant.id }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/utils/api'
const route = useRoute()
const id = route.params.id
const restaurant = ref<any>(null)
const loading = ref(true)
const error = ref('')
onMounted(async () => {
  try {
    restaurant.value = await apiFetch(`/api/admin/restaurants/${id}/`)
  } catch (e: any) {
    error.value = e?.message || 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.restaurant-details {
  max-width: 520px;
  margin: 48px auto 0 auto;
  background: var(--oddmenu-card-bg);
  border-radius: var(--oddmenu-radius);
  box-shadow: var(--oddmenu-shadow);
  padding: 32px 16px 28px 16px;
  text-align: center;
}
.restaurant-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 18px;
  color: var(--oddmenu-orange);
}
.restaurant-logo {
  max-width: 120px;
  margin-bottom: 18px;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0001;
}
.restaurant-info {
  text-align: left;
  margin: 0 auto;
  max-width: 400px;
  font-size: 1.08rem;
  color: #444;
}
.restaurant-loading {
  color: #888;
  font-size: 1.1rem;
  margin: 24px 0;
}
.restaurant-error {
  color: #E74C3C;
  font-size: 1.1rem;
  margin: 24px 0;
}
</style> 