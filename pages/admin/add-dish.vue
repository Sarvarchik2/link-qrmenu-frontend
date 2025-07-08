<template>
  <div class="add-dish-wrap">
    <h1 class="admin-title">Добавить блюдо</h1>
    <form class="add-dish-form" @submit.prevent="addDish">
      <input v-model="name" type="text" placeholder="Название блюда" required />
      <input v-model="price" type="number" placeholder="Цена" required />
      <input v-model="img" type="url" placeholder="Ссылка на картинку" required />
      <button type="submit">Добавить</button>
    </form>
    <div v-if="success" class="add-dish-success">Блюдо добавлено!</div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
import { ref } from 'vue'
const name = ref('')
const price = ref('')
const img = ref('')
const success = ref(false)
function addDish() {
  // Здесь будет логика добавления блюда в хранилище
  name.value = ''
  price.value = ''
  img.value = ''
  success.value = true
  setTimeout(() => success.value = false, 2000)
}
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