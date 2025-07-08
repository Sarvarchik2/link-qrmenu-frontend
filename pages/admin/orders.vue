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
* {
  box-sizing: border-box;
}
.admin-orders {
  max-width: 700px;
  margin: 0 auto;
  background: var(--oddmenu-card-bg);
  border-radius: var(--oddmenu-radius);
  box-shadow: var(--oddmenu-shadow);
  padding: 32px 12px 28px 12px;
  transition: box-shadow 0.2s;
}
.admin-orders:hover {
  box-shadow: var(--oddmenu-shadow-hover);
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--oddmenu-orange);
  letter-spacing: 1px;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.order-card {
  background: linear-gradient(135deg, #fffbe6 60%, #f9e7c4 100%);
  border-radius: 18px;
  box-shadow: 0 2px 12px #F39C1240;
  padding: 16px 12px 12px 12px;
  transition: box-shadow 0.2s, transform 0.15s;
}
.order-card:hover {
  box-shadow: 0 6px 24px #F39C1240;
  transform: translateY(-2px) scale(1.03);
}
.order-id {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--oddmenu-red);
}
.order-info {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 6px;
}
.order-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.order-item {
  background: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.98rem;
  color: #333;
  box-shadow: 0 1px 4px #0001;
}
@media (max-width: 500px) {
  .admin-orders {
    max-width: 99vw;
    padding: 10px 1vw 10px 1vw;
    border-radius: 14px;
  }
  .admin-title {
    font-size: 1.15rem;
    margin-bottom: 10px;
  }
  .order-list {
    gap: 8px;
  }
  .order-card {
    padding: 8px 4px 6px 4px;
    border-radius: 10px;
  }
  .order-id {
    font-size: 0.98rem;
    margin-bottom: 2px;
  }
  .order-info {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }
  .order-items {
    gap: 5px;
  }
  .order-item {
    font-size: 0.85rem;
    padding: 4px 6px;
    border-radius: 5px;
  }
}
</style> 