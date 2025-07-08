<template>
  <div class="admin-orders">
    <h1 class="admin-title">Заказы</h1>
    <div class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-id">Заказ #{{ order.id }}</div>
        <div class="order-info">Имя: {{ order.name }}, Стол: {{ order.table }}</div>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.name" class="order-item">
            {{ item.name }} × {{ item.qty }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
// Заглушка для заказов
const orders = [
  { id: 1, name: 'Гость', table: '1', items: [ { name: 'Маргарита', qty: 2 }, { name: 'Пиво', qty: 1 } ] },
  { id: 2, name: 'Иван', table: '2', items: [ { name: 'Апероль', qty: 1 } ] },
]
</script>

<style scoped>
.admin-orders {
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
.order-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.order-card {
  background: #faf8f6;
  border-radius: 18px;
  box-shadow: 0 2px 12px #0001;
  padding: 18px 18px 12px 18px;
}
.order-id {
  font-size: 1.15rem;
  font-weight: bold;
  margin-bottom: 6px;
  color: #E74C3C;
}
.order-info {
  color: #888;
  font-size: 1rem;
  margin-bottom: 8px;
}
.order-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.order-item {
  background: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 1px 4px #0001;
}
</style> 