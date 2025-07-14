<template>
  <section class="cart-wrap">
    <h2 class="cart-title">{{ t('my_order') }}</h2>
    <div v-if="cart.items.length === 0" class="cart-empty">{{ t('empty_cart') }}</div>
    <div v-else>
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <div class="cart-img" :style="`background-image: url(${item.img});`"></div>
        <div class="cart-item-info">
          <div class="cart-item-title">{{ item.name }}</div>
          <div class="cart-item-meta">{{ item.volume }}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" @click="cart.remove(item.id)">-</button>
          <span class="cart-item-qty">{{ item.qty }}</span>
          <button class="qty-btn" @click="cart.add(item)">+</button>
        </div>
        <!-- <div class="cart-item-price">{{item.qty }}</div> -->
      </div>
      <div class="cart-total">
        <span>{{ t('total') }}</span>
        <span class="cart-total-sum">{{ cart.total }} {{ t('sum') }}</span>
      </div>
      <form class="order-form" @submit.prevent="submitOrder">
        <input required :placeholder="t('your_name')" v-model="name" />
        <input required :placeholder="t('table_number')" v-model="table" />
        <button class="accent mt-2 order-btn" type="submit">{{ t('send_order') }}</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const cart = useCartStore()
const name = ref('')
const table = ref('')
const router = useRouter()
const BASE_URL = 'http://127.0.0.1:8000'

async function submitOrder() {
  const restaurantId = localStorage.getItem('cart_restaurant_id')
  const slug = localStorage.getItem('cart_restaurant_slug')
  const payload = {
    restaurant: restaurantId ? Number(restaurantId) : undefined,
    guest_name: name.value,
    table_number: table.value,
    items: cart.items.map(i => ({ menu_item_id: i.id, quantity: i.qty }))
  }
  console.log('Order payload:', payload)
  if (!restaurantId || !slug) {
    alert('Ошибка: не найден restaurantId или slug!')
    return
  }
  try {
    localStorage.setItem('order_guest_name', name.value)
    localStorage.setItem('order_table_number', table.value)
    const res = await fetch(`${BASE_URL}/api/${slug}/order/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.text()
      alert('Ошибка оформления заказа: ' + err)
      return
    }
    cart.clear()
    router.push('/order-confirmation')
  } catch (e) {
    alert('Ошибка отправки заказа: ' + (e?.message || e))
  }
}
</script>

<style scoped>
.cart-wrap {
  max-width: 520px;
  background: #fff;
  box-shadow: 0 4px 32px #0001, 0 1.5px 0 #f0ece8;
  padding: 32px 20px 24px 20px;
  box-sizing: border-box;
  min-height: 100vh;
  margin: 0 auto;
}
.cart-title {
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-align: center;
}
.cart-empty {
  color: #bbb;
  text-align: center;
  font-size: 1.1rem;
  margin: 48px 0 32px 0;
}
.cart-item {
  display: flex;
  align-items: center;
  background: #F8F5F2;
  border-radius: 18px;
  box-shadow: 0 2px 12px #0001;
  margin-bottom: 18px;
  padding: 10px 14px 10px 10px;
  gap: 12px;
  transition: box-shadow 0.2s;
}
.cart-item:last-child {
  margin-bottom: 0;
}
.cart-img {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 8px #0001;
  flex-shrink: 0;
}
.cart-item-info {
  flex: 2;
  min-width: 0;
}
.cart-item-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cart-item-meta {
  color: #888;
  font-size: 0.95rem;
}
.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty-btn {
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px #F39C1240;
}
.qty-btn:active {
  background: #E74C3C;
  transform: scale(1.1);
}
.cart-item-qty {
  min-width: 24px;
  text-align: center;
  font-size: 1.1rem;
}
.cart-item-price {
  font-weight: bold;
  color: #000000;
  min-width: 70px;
  text-align: right;
  font-size: 1.1rem;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 32px 0 18px 0;
  padding: 0 2px;
}
.cart-total-sum {
  color: #000000;
  letter-spacing: 0.5px;
}
.order-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 24px;
}
.order-form input {
  font-size: 1.08rem;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #f0ece8;
  background: #F8F5F2;
  outline: none;
  transition: border 0.2s;
}
.order-form input:focus {
  border: 1.5px solid #F39C12;
}
.order-btn {
  font-size: 1.15rem;
  padding: 14px 0;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 2px 12px #F39C1240;
}
</style> 