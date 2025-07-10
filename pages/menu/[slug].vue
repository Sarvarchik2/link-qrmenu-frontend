<template>
  <div>
    <HeaderBar :restaurant="restaurant" />
    <main class="public-menu">
      <h1 class="menu-title">Меню ресторана</h1>
      <div v-if="loading" class="menu-loading">Загрузка...</div>
      <div v-else-if="error" class="menu-error">Ошибка: {{ error }}</div>
      <div v-else>
        <div v-if="!categories.length">Меню пусто</div>
        <div v-else>
          <div v-if="!selectedCategory">
            <div class="category-list">
              <div v-for="cat in categories" :key="cat.id" class="cat-card"
                   :style="`background-image: url(${getCategoryImg(cat)});`"
                   @click="selectCategory(cat)">
                <div class="cat-title">{{ cat.name }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <button class="back-btn" @click="selectedCategory = null">← Назад к категориям</button>
            <DishList :dishes="selectedCategory.items" />
          </div>
        </div>
        <form class="order-form" @submit.prevent="sendOrder" v-if="cart.length">
          <h2 class="order-title">Оформить заказ</h2>
          <input v-model="guestName" type="text" placeholder="Ваше имя" required />
          <input v-model="tableNumber" type="text" placeholder="Номер стола" required />
          <div class="order-summary">
            <div v-for="item in cart" :key="item.id" class="order-item">
              {{ item.name }} × {{ item.qty }} = {{ item.price * item.qty }} сум
            </div>
            <div class="order-total">Итого: {{ total }} сум</div>
          </div>
          <button type="submit" :disabled="orderLoading">Отправить заказ</button>
          <div v-if="orderError" class="menu-error">Ошибка: {{ orderError }}</div>
        </form>
        <div v-if="orderSuccess" class="order-success">Заказ успешно отправлен!</div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/utils/api'
import HeaderBar from '@/components/HeaderBar.vue'
import DishList from '@/components/DishList.vue'
const route = useRoute()
const slug = route.params.slug
const categories = ref<any[]>([])
const restaurant = ref<any|null>(null)
const loading = ref(true)
const error = ref('')
const selectedCategory = ref<any|null>(null)
function selectCategory(cat: any) {
  selectedCategory.value = cat
}

const cart = ref<any[]>([])
const guestName = ref('')
const tableNumber = ref('')
const orderLoading = ref(false)
const orderError = ref('')
const orderSuccess = ref(false)

function getQty(id: number) {
  const item = cart.value.find((i) => i.id === id)
  return item ? item.qty : 0
}
function addToCart(dish: any) {
  cart.value.push({ ...dish, qty: 1 })
}
function incrementDish(dish: any, e: Event) {
  e.stopPropagation()
  const item = cart.value.find((i) => i.id === dish.id)
  if (item) item.qty++
}
function decrementDish(dish: any, e: Event) {
  e.stopPropagation()
  const idx = cart.value.findIndex((i) => i.id === dish.id)
  if (idx !== -1) {
    cart.value[idx].qty--
    if (cart.value[idx].qty <= 0) cart.value.splice(idx, 1)
  }
}
const total = computed(() => cart.value.reduce((sum, i) => sum + parseFloat(i.price) * i.qty, 0))

async function sendOrder() {
  orderError.value = ''
  orderLoading.value = true
  try {
    await apiFetch(`/api/${slug}/order/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: 1, // Нужно получить ID ресторана
        guest_name: guestName.value,
        table_number: tableNumber.value,
        items: cart.value.map(i => ({ menu_item: i.id, quantity: i.qty }))
      })
    }, false)
    orderSuccess.value = true
    cart.value = []
    guestName.value = ''
    tableNumber.value = ''
    setTimeout(() => orderSuccess.value = false, 3000)
  } catch (e: any) {
    orderError.value = e?.message || 'Ошибка отправки заказа'
  } finally {
    orderLoading.value = false
  }
}

const BASE_URL = 'http://127.0.0.1:8000'
const defaultCategoryImg = 'https://via.placeholder.com/600x220?text=Category';

function getCategoryImg(cat: any) {
  const img = cat.photo || cat.img || ''
  if (img && img.startsWith('/')) return BASE_URL + img
  return img || defaultCategoryImg
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    // Загружаем меню и ресторан одним запросом
    const res = await apiFetch(`/api/${slug}/menu/`, {}, false)
    if (res.categories) {
      categories.value = res.categories
    } else {
      categories.value = Array.isArray(res) ? res : (res.results || [])
    }
    // Ресторан теперь приходит в res.restaurant
    restaurant.value = res.restaurant || null
  } catch (e: any) {
    error.value = e?.message || 'Ошибка загрузки меню'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.public-menu {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 12px 28px 12px;
}
.menu-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--oddmenu-orange);
  letter-spacing: 1px;
  text-align: center;
}
.menu-loading, .menu-error {
  color: #888;
  font-size: 1.1rem;
  margin: 24px 0;
  text-align: center;
}
.menu-error {
  color: #E74C3C;
}
.menu-category {
  margin-bottom: 32px;
}
.category-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #F39C12;
}
.category-dishes {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.dish-card {
  background: #fffbe6;
  border-radius: 14px;
  box-shadow: 0 2px 12px #F39C1240;
  padding: 16px 12px 12px 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 210px;
  max-width: 320px;
  flex: 1 1 210px;
  transition: box-shadow 0.2s, transform 0.15s;
  cursor: pointer;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
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
.dish-qty {
  position: absolute;
  top: 8px;
  right: 12px;
  background: #F39C12;
  color: #fff;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 0.98rem;
  font-weight: bold;
}
.dish-qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.dish-qty-controls button {
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.dish-qty-controls button:active {
  background: #E74C3C;
}
.add-to-cart-btn {
  margin-top: 8px;
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.add-to-cart-btn:active {
  background: #E74C3C;
}
.order-form {
  margin-top: 32px;
  background: #fffbe6;
  border-radius: 14px;
  box-shadow: 0 2px 12px #F39C1240;
  padding: 24px 18px 18px 18px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.order-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #F39C12;
  text-align: center;
}
.order-summary {
  margin-bottom: 10px;
}
.order-item {
  color: #555;
  font-size: 1rem;
  margin-bottom: 2px;
}
.order-total {
  font-weight: bold;
  color: #E74C3C;
  margin-top: 8px;
  text-align: right;
}
.order-success {
  color: #27ae60;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
.dish-description {
  color: #666;
  font-size: 0.9rem;
  margin-top: 4px;
}
.no-dishes {
  color: #888;
  font-size: 1rem;
  margin: 12px 0 18px 0;
  text-align: center;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
}
.cat-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  min-height: 180px;
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
.back-btn {
  margin-bottom: 18px;
  background: none;
  border: none;
  color: #F39C12;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
}
</style> 