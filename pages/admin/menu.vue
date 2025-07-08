<template>
  <div class="admin-menu">
    <h1 class="admin-title">Меню ресторана</h1>
    <NuxtLink to="/admin/add-dish" class="add-dish-btn">+ Добавить блюдо</NuxtLink>
    <div class="dish-list">
      <div v-for="dish in dishes" :key="dish.id" class="dish-card">
        <img :src="dish.img" class="dish-img" />
        <div class="dish-info">
          <div class="dish-title">{{ dish.name }}</div>
          <div class="dish-meta">{{ dish.price }} сум</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
// Заглушка для блюд
const dishes = [
  { id: 1, name: 'Маргарита', price: '599', img: 'https://images.unsplash.com/photo-1514361892635-cebbd82b8bdf?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Апероль', price: '499', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
]
</script>

<style scoped>
.admin-menu {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 4px 32px #0001;
  padding: 36px 24px 32px 24px;
}
.admin-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #F39C12;
}
.add-dish-btn {
  display: inline-block;
  margin-bottom: 24px;
  background: #F39C12;
  color: #fff;
  font-weight: bold;
  padding: 10px 22px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px #F39C1240;
  transition: background 0.2s;
}
.add-dish-btn:active {
  background: #E74C3C;
}
.dish-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.dish-card {
  background: #faf8f6;
  border-radius: 18px;
  box-shadow: 0 2px 12px #0001;
  padding: 18px 18px 12px 18px;
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 260px;
  flex: 1 1 260px;
}
.dish-img {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 2px 8px #0001;
}
.dish-title {
  font-size: 1.15rem;
  font-weight: bold;
  margin-bottom: 2px;
}
.dish-meta {
  color: #888;
  font-size: 1rem;
}
</style> 