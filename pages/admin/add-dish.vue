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
.add-dish-wrap {
  max-width: 420px;
  margin: 48px auto 0 auto;
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
  text-align: center;
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
  transition: border 0.2s;
}
.add-dish-form input:focus {
  border: 1.5px solid #F39C12;
}
.add-dish-form button {
  font-size: 1.15rem;
  padding: 14px 0;
  border-radius: 12px;
  background: #F39C12;
  color: #fff;
  border: none;
  font-weight: bold;
  margin-top: 8px;
  box-shadow: 0 2px 12px #F39C1240;
  cursor: pointer;
  transition: background 0.2s;
}
.add-dish-form button:active {
  background: #E74C3C;
}
.add-dish-success {
  color: #27ae60;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
</style> 