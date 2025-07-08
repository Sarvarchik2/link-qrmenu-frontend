<template>
  <div style="padding: 0 16px;">
    <div class="flex" style="gap: 12px; overflow-x: auto; padding: 8px 0 0 0; margin-bottom: 12px;">
      <button :class="['tab-btn', {active: activeTab === 'main'}]" @click="activeTab = 'main'">{{ t('main_menu') }}</button>
      <button :class="['tab-btn', {active: activeTab === 'bar'}]" @click="activeTab = 'bar'">{{ t('bar') }}</button>
    </div>
    <div class="search-wrap">
      <input type="text" v-model="search" :placeholder="t('search')" class="search-input">
      <span class="search-icon">🔍</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div v-for="cat in categories" :key="cat.id" class="cat-card" :style="`background-image: url(${cat.img});`" @click="goToCategory(cat.id)">
        <div class="cat-title">{{ t(cat.name) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
const activeTab = ref('main')
const search = ref('')
const categories = [
  { id: 1, name: 'main_menu', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'bar', img: 'https://images.unsplash.com/photo-1514361892635-cebbd82b8bdf?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'beer', img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80' },
]
function goToCategory(id) {
  router.push(`/category/${id}`)
}
</script>

<style scoped>
.tab-btn {
  background: none;
  border: 2px solid #F39C12;
  color: #F39C12;
  border-radius: 24px;
  padding: 10px 28px;
  font-size: 1.1rem;
  font-weight: bold;
  margin-right: 8px;
  transition: background 0.2s, color 0.2s;
}
.tab-btn.active {
  background: #F39C12;
  color: #fff;
}
.search-wrap {
  position: relative;
  margin: 18px 0 24px 0;
}
.search-input {
  width: 100%;
  padding: 14px 48px 14px 18px;
  border-radius: 16px;
  border: 1.5px solid #eee;
  font-size: 1.08rem;
  background: #fff;
  outline: none;
  transition: border 0.2s;
  box-shadow: 0 2px 8px #0001;
  box-sizing: border-box;
}
.search-input:focus {
  border: 1.5px solid #F39C12;
}
.search-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 1.4rem;
  pointer-events: none;
}
.cat-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  min-height: 220px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 12px #0002;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}
.cat-card:hover {
  box-shadow: 0 4px 24px #0003;
  transform: scale(1.02);
}
.cat-title {
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 2px 8px #000a;
  padding: 24px 0 18px 0;
  background: linear-gradient(0deg, #0008 60%, #0000 100%);
}
</style> 