<template>
  <header style="background: #fff; border-bottom-left-radius: 32px; border-bottom-right-radius: 32px; box-shadow: 0 2px 12px #0001; overflow: hidden;">
    <div style="position: relative;">
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="cover" style="width: 100%; height: 180px; object-fit: cover;">
      <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 12px; align-items: center;">
        <select v-model="locale" style="border-radius: 8px; padding: 4px 12px; border: none; background: #fff; font-weight: bold;">
          <option value="ru">Русский</option>
          <option value="uz">Oʻzbekcha</option>
        </select>
      </div>
    </div>
    <div style="padding: 20px 24px 0 24px;">
      <h1 style="margin: 0 0 8px 0; font-size: 2rem; font-weight: bold;">OddMenu Demo</h1>
      <div style="color: #888; display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px; align-items: start; font-size: 1rem; margin-bottom: 4px;">
        <span>📍 Контрактовая площадь 1, Киев, Украина</span>
        <span>📞 099 123 4567</span>
        
      </div>

      <div style="color: #888; font-size: 1rem; margin-bottom: 8px;">WiFi_Password123</div>
      <div style="color: #555; font-size: 1rem; margin-bottom: 12px;">
        {{ t('menu') }}: {{ t('main_menu') }}, {{ t('bar') }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
if (process.client && (locale.value !== 'ru' && locale.value !== 'uz')) {
  locale.value = 'ru'
}
</script>

<style scoped>
</style> 