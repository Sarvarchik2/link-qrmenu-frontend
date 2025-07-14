<template>
  <section class="confirm-wrap">
    <div class="confirm-icon">✔️</div>
    <h2 class="confirm-title">{{ t('order.accepted', { number: 123 }) }}</h2>
    <div class="confirm-details">
      <div class="confirm-row"><span>{{ t('name') }}</span> <b>{{ name }}</b></div>
      <div class="confirm-row"><span>{{ t('table') }}</span> <b>{{ table }}</b></div>
    </div>
    <ul class="confirm-list">
      <li v-for="item in cart" :key="item.id">
        <span>{{ item.name }}</span>
        <span class="confirm-qty">×{{ item.qty }}</span>
      </li>
    </ul>
    <button class="accent confirm-btn" @click="goToMenu">{{ t('order.return_to_menu') }}</button>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
// Здесь можно получить данные заказа из стора или query/params
const name = localStorage.getItem('order_guest_name') || ''
const table = localStorage.getItem('order_table_number') || ''
const cart = JSON.parse(localStorage.getItem('order_cart') || '[]')
const restaurantSlug = localStorage.getItem('order_restaurant_slug') || ''
function goToMenu() {
  if (restaurantSlug) {
    router.push(`/menu/${restaurantSlug}`)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.confirm-wrap {
  max-width: 420px;
  margin: 48px auto 0 auto;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 4px 32px #0001;
  padding: 36px 24px 32px 24px;
  text-align: center;
}
.confirm-icon {
  font-size: 2.8rem;
  margin-bottom: 12px;
  color: #F39C12;
}
.confirm-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 18px;
  color: #E74C3C;
}
.confirm-details {
  margin-bottom: 18px;
  color: #888;
  font-size: 1.08rem;
}
.confirm-row {
  margin-bottom: 4px;
}
.confirm-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
}
.confirm-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0ece8;
  font-size: 1.08rem;
}
.confirm-qty {
  color: #F39C12;
  font-weight: bold;
}
.confirm-btn {
  width: 100%;
  font-size: 1.15rem;
  padding: 14px 0;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 2px 12px #F39C1240;
}
</style> 