<template>
  <div class="admin-dashboard">
    <h1 class="admin-title">Дашборд ресторана</h1>
    <div class="admin-stats">
      <div class="admin-stat">
        <div class="admin-stat-value">12</div>
        <div class="admin-stat-label">Блюд в меню</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat-value">5</div>
        <div class="admin-stat-label">Заказов</div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
// Позже сюда добавим реальные данные из стора
</script>

<style scoped>
.admin-dashboard {
  max-width: 520px;
  margin: 48px auto 0 auto;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 4px 32px #0001;
  padding: 36px 24px 32px 24px;
  text-align: center;
}
.admin-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 32px;
  color: #F39C12;
}
.admin-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
}
.admin-stat {
  background: #faf8f6;
  border-radius: 18px;
  padding: 24px 32px;
  box-shadow: 0 2px 12px #0001;
  min-width: 120px;
}
.admin-stat-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: #E74C3C;
  margin-bottom: 8px;
}
.admin-stat-label {
  color: #888;
  font-size: 1.08rem;
}
</style> 