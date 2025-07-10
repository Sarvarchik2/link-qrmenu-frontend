<template>
  <header style="background: #fff; border-bottom-left-radius: 32px; border-bottom-right-radius: 32px; box-shadow: 0 2px 12px #0001; overflow: hidden;">
    <div style="position: relative;">
      <img :src="coverImg" alt="cover" style="width: 100%; height: 180px; object-fit: cover;">
      <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 12px; align-items: center;">
        <select v-model="locale" style="border-radius: 8px; padding: 4px 12px; border: none; background: #fff; font-weight: bold;">
          <option value="ru">Русский</option>
          <option value="uz">Oʻzbekcha</option>
        </select>
        <button v-if="isAdmin" @click="handleLogout" style="margin-left: 10px; padding: 6px 16px; border-radius: 8px; border: none; background: #F39C12; color: #fff; font-weight: bold; cursor: pointer;">Выйти</button>
      </div>
    </div>
    <div style="padding: 20px 24px 0 24px;">
      <h1 style="margin: 0 0 8px 0; font-size: 2rem; font-weight: bold;">{{ props.restaurant?.name || 'OddMenu Demo' }}</h1>
      <div style="color: #888; display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px; align-items: start; font-size: 1rem; margin-bottom: 4px;">
        <span v-if="props.restaurant?.address">📍 {{ props.restaurant.address }}</span>
        <span v-if="props.restaurant?.contacts">📞 {{ props.restaurant.contacts }}</span>
      </div>
      <div v-if="props.restaurant?.wifi" style="color: #888; font-size: 1rem; margin-bottom: 8px;">{{ props.restaurant.wifi }}</div>
      <div v-if="props.restaurant?.description" style="color: #888; font-size: 1rem; margin-bottom: 8px;">{{ props.restaurant.description }}</div>
      <div style="color: #555; font-size: 1rem; margin-bottom: 12px;">
        {{ t('menu') }}: <span v-if="props.restaurant?.menu">{{ props.restaurant.menu }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
const { t, locale } = useI18n()
const BASE_URL = 'http://127.0.0.1:8000'
const props = defineProps({
  restaurant: { type: Object, required: false, default: null }
})
const coverImg = computed(() => {
  if (props.restaurant?.logo) {
    if (props.restaurant.logo.startsWith('/')) return BASE_URL + props.restaurant.logo
    return props.restaurant.logo
  }
  return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
})
if (process.client && (locale.value !== 'ru' && locale.value !== 'uz')) {
  locale.value = 'ru'
}
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
</style> 