<template>
  <div>
    <HeaderBar />
    <BackButton />
    <main class="mt-2">
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="error" style="color:red">{{ error }}</div>
      <DishList :categoryId="categoryId" :dishes="dishes" v-else />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import HeaderBar from '~/components/HeaderBar.vue'
import DishList from '~/components/DishList.vue'
import BackButton from '~/components/BackButton.vue'
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
const route = useRoute()
const categoryId = route.params.id
const dishes = ref([])
const loading = ref(true)
const error = ref('')
onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    // Если есть публичный эндпоинт для блюд по категории:
    const res = await apiFetch(`/api/category/${categoryId}/items/`, {}, false)
    dishes.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e) {
    error.value = e?.message || 'Ошибка загрузки блюд'
  } finally {
    loading.value = false
  }
})
</script> 