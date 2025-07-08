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
* {
  box-sizing: border-box;
}
.admin-dashboard {
  max-width: 520px;
  margin: 48px auto 0 auto;
  background: var(--oddmenu-card-bg);
  border-radius: var(--oddmenu-radius);
  box-shadow: var(--oddmenu-shadow);
  padding: 32px 16px 28px 16px;
  text-align: center;
  transition: box-shadow 0.2s;
}
.admin-dashboard:hover {
  box-shadow: var(--oddmenu-shadow-hover);
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 28px;
  color: var(--oddmenu-orange);
  letter-spacing: 1px;
}
.admin-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.admin-stat {
  background: linear-gradient(135deg, #fffbe6 60%, #f9e7c4 100%);
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 2px 12px #F39C1240;
  min-width: 110px;
  transition: box-shadow 0.2s, transform 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.admin-stat:hover {
  box-shadow: 0 6px 24px #F39C1240;
  transform: translateY(-2px) scale(1.04);
}
.admin-stat-value {
  font-size: 2.3rem;
  font-weight: 900;
  color: var(--oddmenu-red);
  margin-bottom: 6px;
  letter-spacing: 1px;
}
.admin-stat-label {
  color: #888;
  font-size: 1.08rem;
  font-weight: 500;
}
@media (max-width: 500px) {
  .admin-dashboard {
    max-width: 99vw;
    padding: 14px 2vw 14px 2vw;
    border-radius: 14px;
  }
  .admin-title {
    font-size: 1.2rem;
    margin-bottom: 14px;
  }
  .admin-stats {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .admin-stat {
    padding: 12px 6px;
    min-width: 0;
    font-size: 0.98rem;
  }
  .admin-stat-value {
    font-size: 1.15rem;
    margin-bottom: 2px;
  }
  .admin-stat-label {
    font-size: 0.92rem;
  }
}
</style> 