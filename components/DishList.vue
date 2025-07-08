<template>
  <section style="padding: 0 16px; padding-bottom: 100px;">
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div v-for="dish in filteredDishes" :key="dish.id" class="dish-card">
        <div class="dish-img" :style="`background-image: url(${dish.img});`"></div>
        <div class="dish-info">
          <div class="flex" style="justify-content: space-between; align-items: flex-end;">
            <div>
              <div class="dish-title">{{ t(dish.name) }}</div>
              <div class="dish-meta">{{ t(dish.volume) }}</div>
            </div>
            <button class="dish-add" @click="addToCart(dish)" :class="{ bounce: bounceId === dish.id }">
              <span>+</span>
            </button>
          </div>
          <div class="dish-price">{{ dish.price }} {{ t('sum') }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
  categoryId: { type: [String, Number], required: false }
})
const dishes = [
  { id: 1, name: 'Маргарита', price: '599', volume: '120 мл', img: 'https://images.unsplash.com/photo-1514361892635-cebbd82b8bdf?auto=format&fit=crop&w=800&q=80', category: 1 },
  { id: 2, name: 'Апероль', price: '499', volume: '150 мл', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', category: 1 },
  { id: 3, name: 'Пиво светлое', price: '299', volume: '500 мл', img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80', category: 3 },
  { id: 4, name: 'Красное вино', price: '799', volume: '150 мл', img: 'https://images.unsplash.com/photo-1514361892635-cebbd82b8bdf?auto=format&fit=crop&w=800&q=80', category: 2 },
]
const filteredDishes = computed(() => {
  if (!props.categoryId) return dishes
  return dishes.filter(d => String(d.category) === String(props.categoryId))
})
const cart = useCartStore()
const bounceId = ref(null)
function addToCart(dish) {
  cart.add(dish)
  bounceId.value = dish.id
  setTimeout(() => bounceId.value = null, 400)
}
</script>

<style scoped>
.dish-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 12px #0002;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}
.dish-card:hover {
  box-shadow: 0 4px 24px #0003;
}
.dish-img {
  width: 100%;
  aspect-ratio: 16/9;
  background-size: cover;
  background-position: center;
}
.dish-info {
  padding: 18px 18px 12px 18px;
}
.dish-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 2px;
}
.dish-meta {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 6px;
}
.dish-price {
  color: #E74C3C;
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 8px;
}
.dish-add {
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #F39C1240;
  transition: background 0.2s, transform 0.15s;
  cursor: pointer;
}
.dish-add:active, .dish-add.bounce {
  background: #E74C3C;
  transform: scale(1.15);
  animation: bounce 0.4s;
}
@keyframes bounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.18); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
</style> 