<template>
  <div class="dashboard-root beautiful-ui">
    <h1 class="dashboard-title">Дашборд ресторана</h1>
    <div class="date-range-filter">
      <label>Период:</label>
      <input type="date" v-model="dateFrom" class="date-input" />
      <span style="margin: 0 6px;">—</span>
      <input type="date" v-model="dateTo" class="date-input" />
    </div>
    <div class="quick-actions-row">
      <button class="quick-action" @click="goTo('/admin/add-dish')">
        <span class="qa-svg"> <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="12" fill="#1a9c6b"/><path d="M16 10v12M10 16h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg> </span>
        <span>Добавить блюдо</span>
      </button>
      <button class="quick-action" @click="goTo('/admin/categories')">
        <span class="qa-svg"> <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="12" fill="#4fd1c5"/><path d="M10 12h12M10 16h12M10 20h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg> </span>
        <span>Категории</span>
      </button>
      <button class="quick-action" @click="goTo('/admin/orders')">
        <span class="qa-svg"> <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="12" fill="#1a9c6b"/><path d="M10 12h12M10 16h12M10 20h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg> </span>
        <span>Заказы</span>
      </button>
    </div>
    <div class="dashboard-widgets beautiful-widgets">
      <div class="dashboard-widget">
        <div class="widget-icon">🍽️</div>
        <div class="widget-value">{{ itemsCount }}</div>
        <div class="widget-label">Блюд в меню</div>
      </div>
      <div class="dashboard-widget">
        <div class="widget-icon">🛒</div>
        <div class="widget-value">{{ ordersCount }}</div>
        <div class="widget-label">Заказов</div>
      </div>
      <div class="dashboard-widget">
        <div class="widget-icon">💰</div>
        <div class="widget-value">{{ formatSum(todayRevenue) }}</div>
        <div class="widget-label">Выручка, сум</div>
      </div>
    </div>
    <div class="dashboard-graph beautiful-graph">
      <canvas v-if="ordersByDay.length" ref="ordersChart"></canvas>
      <div v-else class="graph-placeholder">Нет данных для графика</div>
    </div>
    <div v-if="topDishes.length" class="popular-dishes-block beautiful-block">
      <h3 class="popular-title">Популярные блюда</h3>
      <div class="popular-list">
        <div v-for="dish in topDishes" :key="dish.id" class="popular-dish beautiful-card">
          <img v-if="dish.photo" :src="dish.photo" class="popular-dish-img" />
          <div class="popular-dish-name">{{ dish.name }}</div>
          <div class="popular-dish-count">×{{ dish.count }}</div>
        </div>
      </div>
    </div>
    <div v-if="todayRevenue !== null" class="finance-summary-block beautiful-block">
      <div class="finance-row"><span>Выручка за сегодня:</span> <b>{{ formatSum(todayRevenue) }} сум</b></div>
      <div class="finance-row"><span>Средний чек:</span> <b>{{ formatSum(todayAvgCheck) }} сум</b></div>
    </div>
    <div v-if="todayOrders.length" class="today-orders-block beautiful-block">
      <h3 class="today-title">Сегодняшние заказы</h3>
      <div class="today-list">
        <div v-for="order in todayOrders" :key="order.id" class="today-order beautiful-card">
          <div class="today-order-row"><b>#{{ order.id }}</b> — {{ order.guest_name || 'Гость' }}, стол {{ order.table_number }}</div>
          <div class="today-order-row">Сумма: <b>{{ formatSum(order.total) }} сум</b></div>
          <div class="today-order-row">Статус: <span :class="'status-label status-'+order.status">{{ getStatusText(order.status) }}</span></div>
          <div class="today-order-row">Время: {{ formatTime(order.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { apiFetch } from '@/utils/api';
import Chart from 'chart.js/auto';
import { useRouter } from 'vue-router';
definePageMeta({ layout: 'admin', middleware: 'auth' })

const itemsCount = ref(0);
const ordersCount = ref(0);
const ordersByDay = ref<{date:string, count:number}[]>([]);
const topDishes = ref<{id:number, name:string, count:number, photo?:string}[]>([]);
const ordersChart = ref<HTMLCanvasElement|null>(null);
let chartInstance: Chart | null = null;
const BASE_URL = 'http://127.0.0.1:8000';
const itemsList = ref<any[]>([]);
const todayOrders = ref<any[]>([]);
const todayRevenue = ref<number|null>(null);
const todayAvgCheck = ref<number|null>(null);
const dateFrom = ref('');
const dateTo = ref('');

function groupOrdersByDay(orders: any[]) {
  const map: Record<string, number> = {};
  orders.forEach(o => {
    const d = o.created_at ? o.created_at.slice(0, 10) : '';
    if (d) map[d] = (map[d] || 0) + 1;
  });
  return Object.entries(map).sort().map(([date, count]) => ({ date, count }));
}
function getTopDishes(orders: any[], items: any[]) {
  const dishMap: Record<number, {name:string, count:number, photo?:string}> = {};
  orders.forEach(o => {
    (o.items || []).forEach((item: any) => {
      const id = item.menu_item?.id || item.menu_item;
      const name = item.menu_item?.name || 'Блюдо';
      if (!id) return;
      if (!dishMap[id]) dishMap[id] = { name, count: 0 };
      dishMap[id].count += item.quantity || 1;
    });
  });
  // Добавляем фото из items
  Object.keys(dishMap).forEach(id => {
    const found = items.find((i: any) => i.id == id);
    let photo = found?.photo || found?.img || '';
    if (photo && photo.startsWith('/')) photo = BASE_URL + photo;
    if (!photo) photo = 'https://via.placeholder.com/54x54?text=No+Image';
    dishMap[Number(id)].photo = photo;
  });
  return Object.entries(dishMap)
    .map(([id, v]) => ({ id: Number(id), ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'new': 'Новый',
    'in_progress': 'В работе',
    'done': 'Выполнен',
    'cancelled': 'Отменен',
    'pending': 'Ожидает',
    'preparing': 'Готовится',
    'ready': 'Готов',
    'delivered': 'Доставлен'
  };
  return statusMap[status] || status;
}
function formatTime(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
function calcOrderTotal(order: any) {
  return (order.items || []).reduce((sum: number, i: any) => {
    const price = i.menu_item?.price || i.price || 0;
    return sum + Number(price) * (i.quantity || 1);
  }, 0);
}
function isInRange(dateString: string) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}
function formatSum(val: number | null) {
  if (val === null || val === undefined) return '0';
  return val.toLocaleString('ru-RU');
}
const router = useRouter();
function goTo(path: string) {
  router.push(path);
}
onMounted(async () => {
  try {
    // Получаем блюда
    const items = await apiFetch('/api/owner/items/');
    itemsList.value = Array.isArray(items) ? items : (items.results || []);
    itemsCount.value = itemsList.value.length;
    // Получаем заказы
    const orders = await apiFetch('/api/owner/orders/');
    const ordersArr = Array.isArray(orders) ? orders : (orders.results || []);
    ordersCount.value = ordersArr.length;
    ordersByDay.value = groupOrdersByDay(ordersArr);
    topDishes.value = getTopDishes(ordersArr, itemsList.value);
    todayOrders.value = ordersArr
      .filter((o: any) => isInRange(o.created_at))
      .map((o: any) => ({ ...o, total: calcOrderTotal(o) }))
      .sort((a: any, b: any) => b.id - a.id)
      .slice(0, 5);
    // Финансовая сводка
    const todayAllOrders = ordersArr.filter((o: any) => isInRange(o.created_at)).map((o: any) => ({ ...o, total: calcOrderTotal(o) }));
    const revenue = todayAllOrders.reduce((sum: number, o: any) => sum + o.total, 0);
    todayRevenue.value = revenue;
    todayAvgCheck.value = todayAllOrders.length ? Math.round(revenue / todayAllOrders.length) : 0;
    await nextTick();
    if (ordersChart.value && ordersByDay.value.length) {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      chartInstance = new Chart(ordersChart.value, {
        type: 'line',
        data: {
          labels: ordersByDay.value.map(o => o.date),
          datasets: [{
            label: 'Заказов',
            data: ordersByDay.value.map(o => o.count),
            borderColor: '#1a9c6b',
            backgroundColor: 'rgba(26,156,107,0.08)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#1a9c6b',
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: 'Дата' } },
            y: { beginAtZero: true, title: { display: true, text: 'Заказов' }, ticks: { stepSize: 1 } }
          }
        }
      });
    }
  } catch (e) {
    itemsCount.value = 0;
    ordersCount.value = 0;
  }
});
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<style scoped>
.dashboard-root.beautiful-ui {
  max-width: 600px;
  margin: 0 auto;
  padding: 22px 10px 28px 10px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 8px 40px #1a9c6b18, 0 1.5px 0 #f0ece8;
  animation: fadeIn 0.7s cubic-bezier(.4,1.4,.6,1) both;
}
.dashboard-title {
  font-size: 1.7rem;
  font-weight: 900;
  color: #1a9c6b;
  text-align: center;
  margin-bottom: 22px;
  letter-spacing: 1.5px;
}
.quick-actions-row {
  display: flex;
  flex-direction: row;
  gap: 18px;
  justify-content: center;
  margin-bottom: 22px;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #1a9c6b #f8fafd;
}
.quick-action {
  background: linear-gradient(120deg, #1a9c6b 60%, #4fd1c5 100%);
  color: #fff;
  border: none;
  border-radius: 18px;
  box-shadow: 0 4px 18px #1a9c6b22;
  padding: 18px 10px 14px 10px;
  min-width: 120px;
  min-height: 90px;
  max-width: 160px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.08rem;
  font-weight: 800;
  cursor: pointer;
  transition: box-shadow 0.22s, transform 0.18s, background 0.22s;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  flex: 0 0 120px;
  animation: fadeIn 0.7s cubic-bezier(.4,1.4,.6,1) both;
}
.quick-action:hover {
  box-shadow: 0 12px 36px #1a9c6b33;
  transform: translateY(-6px) scale(1.045);
  background: linear-gradient(120deg, #4fd1c5 60%, #1a9c6b 100%);
}
.qa-svg {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.beautiful-widgets {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 22px;
  flex-wrap: wrap;
}
.dashboard-widget {
  background: linear-gradient(120deg, #f8fafd 60%, #e6fff6 100%);
  border-radius: 18px;
  box-shadow: 0 4px 18px #1a9c6b18;
  padding: 18px 14px 14px 14px;
  min-width: 90px;
  text-align: center;
  transition: box-shadow 0.22s, transform 0.18s, background 0.22s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.7s cubic-bezier(.4,1.4,.6,1) both;
}
.dashboard-widget:hover {
  box-shadow: 0 12px 36px #1a9c6b33;
  transform: translateY(-4px) scale(1.04);
  background: linear-gradient(120deg, #e6fff6 60%, #f8fafd 100%);
}
.widget-icon {
  font-size: 2.1rem;
  margin-bottom: 8px;
  color: #1a9c6b;
  filter: drop-shadow(0 2px 8px #1a9c6b22);
}
.widget-value {
  font-size: 2.1rem;
  font-weight: bold;
  color: #1a9c6b;
  margin-bottom: 6px;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #1a9c6b11;
}
.widget-label {
  color: #888;
  font-size: 1.13rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}
.beautiful-graph {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  background: #f8fafd;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 18px 8px 8px 8px;
  margin-bottom: 18px;
}
.dashboard-graph canvas {
  max-width: 100%;
  max-height: 140px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 6px #1a9c6b11;
}
.graph-placeholder {
  background: #f8fafd;
  border-radius: 10px;
  box-shadow: 0 1px 6px #1a9c6b11;
  padding: 14px 8px;
  color: #bbb;
  font-size: 1.08rem;
  text-align: center;
}
.beautiful-block {
  margin-top: 18px;
  background: #f8fafd;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 18px 12px 12px 12px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 0.7s cubic-bezier(.4,1.4,.6,1) both;
}
.popular-title, .today-title {
  font-size: 1.18rem;
  font-weight: bold;
  color: #1a9c6b;
  margin-bottom: 12px;
  text-align: center;
}
.popular-list {
  display: flex;
  gap: 14px;
  justify-content: center;
}
.popular-dish.beautiful-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #1a9c6b11;
  padding: 10px 8px 10px 8px;
  min-width: 70px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #e6fff6;
  transition: box-shadow 0.18s, transform 0.13s;
}
.popular-dish.beautiful-card:hover {
  box-shadow: 0 6px 18px #1a9c6b22;
  transform: translateY(-2px) scale(1.04);
}
.popular-dish-img {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px #0001;
}
.popular-dish-name {
  font-weight: 600;
  margin-bottom: 6px;
  color: #1a9c6b;
  font-size: 1.08rem;
}
.popular-dish-count {
  color: #4fd1c5;
  font-size: 1.13rem;
  font-weight: bold;
}
.today-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.today-order.beautiful-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #1a9c6b11;
  padding: 10px 12px;
  font-size: 1.08rem;
  border-left: 5px solid #1a9c6b;
  transition: box-shadow 0.18s, transform 0.13s;
}
.today-order.beautiful-card:hover {
  box-shadow: 0 6px 18px #1a9c6b22;
  transform: translateY(-2px) scale(1.04);
}
.today-order-row {
  margin-bottom: 2px;
}
.status-label {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 14px;
  font-size: 1.08rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}
.status-new { background: #1a9c6b; }
.status-in_progress { background: #4fd1c5; }
.status-done { background: #888; }
.status-cancelled { background: #E74C3C; }
.finance-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.13rem;
  color: #1a9c6b;
  margin-bottom: 6px;
}
.finance-row b {
  color: #1a9c6b;
  font-weight: bold;
  font-size: 1.18rem;
}
.date-range-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  justify-content: center;
}
.date-input {
  border: 1.5px solid #e6eaf0;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 1.08rem;
  background: #f8fafd;
  color: #1a9c6b;
  outline: none;
  transition: border 0.2s;
}
.date-input:focus {
  border: 1.5px solid #1a9c6b;
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(30px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
@media (max-width: 700px) {
  .dashboard-root.beautiful-ui {
    max-width: 99vw;
    padding: 8px 1vw 8px 1vw;
    border-radius: 14px;
    margin-top: 6px;
  }
  .dashboard-title {
    font-size: 1.08rem;
    margin-bottom: 8px;
  }
  .quick-actions-row {
    gap: 8px;
  }
  .beautiful-widgets {
    gap: 8px;
    margin-bottom: 10px;
  }
  .dashboard-widget {
    padding: 10px 4px 8px 4px;
    min-width: 60px;
  }
  .widget-icon {
    font-size: 1.2rem;
    margin-bottom: 2px;
  }
  .widget-value {
    font-size: 1.2rem;
    margin-bottom: 2px;
  }
  .widget-label {
    font-size: 0.85rem;
  }
  .beautiful-graph {
    margin-top: 8px;
    padding: 8px 2px 2px 2px;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .beautiful-block {
    margin-top: 8px;
    border-radius: 10px;
    padding: 8px 4px 4px 4px;
    max-width: 99vw;
  }
  .popular-title, .today-title {
    font-size: 0.98rem;
    margin-bottom: 6px;
  }
  .popular-list {
    gap: 6px;
  }
  .popular-dish.beautiful-card {
    padding: 4px 2px 4px 2px;
    min-width: 40px;
  }
  .popular-dish-img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  .popular-dish-name {
    font-size: 0.9rem;
    margin-bottom: 2px;
  }
  .popular-dish-count {
    font-size: 0.95rem;
  }
  .today-list {
    gap: 6px;
  }
  .today-order.beautiful-card {
    padding: 6px 6px;
    font-size: 0.95rem;
    border-left: 3px solid #1a9c6b;
  }
  .today-order-row {
    margin-bottom: 1px;
  }
  .status-label {
    padding: 2px 8px;
    font-size: 0.95rem;
  }
  .finance-row {
    font-size: 0.98rem;
    margin-bottom: 2px;
  }
  .finance-row b {
    font-size: 1.05rem;
  }
}
</style> 