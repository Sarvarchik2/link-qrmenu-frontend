<template>
  <div class="admin-orders modern-admin-bg">
    <h1 class="admin-title">{{ t('admin.orders.title') }}</h1>
    <div class="orders-filter-row">
      <label for="statusFilter">{{ t('admin.orders.filter_by_status') }}:</label>
      <select id="statusFilter" v-model="statusFilter" class="modern-select">
        <option value="">{{ t('admin.orders.all') }}</option>
        <option value="new">{{ t('admin.orders.new') }}</option>
        <option value="in_progress">{{ t('admin.orders.in_progress') }}</option>
        <option value="done">{{ t('admin.orders.done') }}</option>
        <option value="cancelled">{{ t('admin.orders.cancelled') }}</option>
      </select>
    </div>
    <div v-if="loading" class="admin-loading">{{ $t('loading') }}...</div>
    <div v-else-if="error" class="admin-error">{{ $t('error') }}: {{ error }}</div>
    <div class="order-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card modern-card" :class="'status-'+order.status" @click="openOrderModal(order)">
        <div class="order-id">{{ t('admin.orders.order') }} #{{ order.id }}</div>
        <div class="order-info">{{ t('admin.orders.name') }}: {{ order.guest_name }}, {{ t('admin.orders.table') }}: {{ order.table_number }}</div>
        <div class="order-status-row">
          <span class="order-status-label" :class="'status-label-'+order.status">{{ getStatusText(order.status) }}</span>
        </div>
        <div class="order-date">{{ t('admin.orders.date') }}: {{ formatDate(order.created_at) }}</div>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            {{ item.menu_item?.name || t('admin.orders.dish') }} × {{ item.quantity }}
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка заказа -->
    <div v-if="orderModalOpen" class="modal-overlay" @click.self="closeOrderModal">
      <div class="modal-content modern-modal">
        <h2 class="modal-title">{{ t('admin.orders.order') }} #{{ selectedOrder?.id }}</h2>
        <div class="modal-row"><b>{{ t('admin.orders.name') }}:</b> {{ selectedOrder?.guest_name }}</div>
        <div class="modal-row"><b>{{ t('admin.orders.table') }}:</b> {{ selectedOrder?.table_number }}</div>
        <div class="modal-row"><b>{{ t('admin.orders.status') }}:</b>
          <select v-model="orderStatus" :disabled="statusLoading" class="modern-select">
            <option value="new">{{ t('admin.orders.new') }}</option>
            <option value="in_progress">{{ t('admin.orders.in_progress') }}</option>
            <option value="done">{{ t('admin.orders.done') }}</option>
            <option value="cancelled">{{ t('admin.orders.cancelled') }}</option>
          </select>
          <button class="modern-btn save" @click="saveStatus" :disabled="statusLoading || !selectedOrder">{{ t('admin.orders.save') }}</button>
        </div>
        <div class="modal-row"><b>{{ t('admin.orders.date') }}:</b> {{ formatDate(selectedOrder?.created_at) }}</div>
        <div class="modal-row"><b>{{ t('admin.orders.dishes') }}:</b>
          <ul>
            <li v-for="item in selectedOrder?.items" :key="item.id">
              {{ item.menu_item?.name || t('admin.orders.dish') }} × {{ item.quantity }}
            </li>
          </ul>
        </div>
        <div class="modal-actions">
          <button class="modern-btn cancel" @click="closeOrderModal">{{ t('admin.orders.close') }}</button>
          <button class="modern-btn delete" @click="deleteOrder" :disabled="deleteLoading">{{ t('admin.orders.delete') }}</button>
        </div>
        <div v-if="modalError" class="add-dish-error">{{ t('admin.orders.error') }}: {{ modalError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiFetch } from '@/utils/api'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
definePageMeta({ layout: 'admin', middleware: 'auth' })
const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')
// Получаем id ресторана владельца
const restaurantId = ref(null)
onMounted(async () => {
  try {
    const res = await apiFetch('/api/owner/info/')
    restaurantId.value = res?.id || null
  } catch {}
})

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'new': t('admin.orders.new'),
    'in_progress': t('admin.orders.in_progress'),
    'done': t('admin.orders.done'),
    'cancelled': t('admin.orders.cancelled')
  }
  return statusMap[status] || status
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU')
}

const orderModalOpen = ref(false)
const selectedOrder = ref<any|null>(null)
const orderStatus = ref('new')
const statusLoading = ref(false)
const deleteLoading = ref(false)
const modalError = ref('')
const statusFilter = ref('')
const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value
  return orders.value.filter(o => o.status === statusFilter.value)
})
function openOrderModal(order: any) {
  selectedOrder.value = { ...order }
  orderStatus.value = order.status
  orderModalOpen.value = true
  modalError.value = ''
}
function closeOrderModal() {
  orderModalOpen.value = false
  selectedOrder.value = null
  modalError.value = ''
}
async function saveStatus() {
  if (!selectedOrder.value || !restaurantId.value) return
  statusLoading.value = true
  modalError.value = ''
  try {
    await apiFetch(`/api/owner/orders/${selectedOrder.value.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: restaurantId.value,
        guest_name: selectedOrder.value.guest_name,
        table_number: selectedOrder.value.table_number,
        status: orderStatus.value
      })
    })
    await fetchOrders()
    closeOrderModal()
  } catch (e: any) {
    modalError.value = e?.message || t('status_change_error')
  } finally {
    statusLoading.value = false
  }
}
async function deleteOrder() {
  if (!selectedOrder.value) return
  deleteLoading.value = true
  modalError.value = ''
  try {
    await apiFetch(`/api/owner/orders/${selectedOrder.value.id}/`, { method: 'DELETE' })
    await fetchOrders()
    closeOrderModal()
  } catch (e: any) {
    modalError.value = e?.message || t('delete_error')
  } finally {
    deleteLoading.value = false
  }
}
async function fetchOrders() {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/owner/orders/')
    orders.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || t('orders_load_error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/owner/orders/')
    orders.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || t('orders_load_error')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.modern-admin-bg {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px #1a9c6b11;
  padding: 32px 24px 28px 24px;
  max-width: 900px;
  margin: 48px auto 0 auto;
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 32px;
  color: #1a9c6b;
  text-align: center;
  letter-spacing: 1px;
}
.order-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
}
.order-card {
  background: #f8fafd;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 22px;
  min-width: 210px;
  max-width: 320px;
  flex: 1 1 210px;
  transition: box-shadow 0.2s, transform 0.15s;
  margin-bottom: 12px;
}
.order-card:hover {
  box-shadow: 0 6px 24px #1a9c6b22;
  transform: translateY(-2px) scale(1.03);
}
.order-id {
  font-size: 1.15rem;
  font-weight: bold;
  color: #1a9c6b;
  margin-bottom: 6px;
}
.order-info, .order-status, .order-date {
  color: #888;
  font-size: 1rem;
  margin-bottom: 4px;
}
.order-items {
  margin-top: 8px;
}
.order-item {
  color: #555;
  font-size: 1rem;
  margin-bottom: 2px;
}
.admin-loading {
  color: #888;
  font-size: 1.1rem;
  margin: 24px 0;
}
.admin-error {
  color: #E74C3C;
  font-size: 1.1rem;
  margin: 24px 0;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #0006;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px #1a9c6b22;
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  max-width: 98vw;
  width: 100%;
  position: relative;
}
.modal-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 22px;
  color: #1a9c6b;
  text-align: center;
}
.modal-row {
  margin-bottom: 12px;
  font-size: 1.08rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 18px;
}
.modal-cancel {
  background: #888;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-cancel:active, .modal-cancel:hover {
  background: #555;
}
.modal-delete {
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-delete:active, .modal-delete:hover {
  background: #c0392b;
}
.add-dish-error {
  color: #E74C3C;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
.modern-card {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 22px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 210px;
  max-width: 420px;
  width: 100%;
  margin-bottom: 8px;
  transition: box-shadow 0.2s, transform 0.15s;
}
.modern-card:hover {
  box-shadow: 0 6px 24px #1a9c6b22;
  transform: translateY(-2px) scale(1.03);
}
.modern-btn {
  border: none;
  border-radius: 14px;
  padding: 10px 22px;
  font-size: 1.05rem;
  font-weight: 600;
  margin: 4px 6px 0 0;
  box-shadow: 0 2px 8px #1a9c6b11;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, transform 0.13s;
}
.modern-btn.save {
  background: #1a9c6b;
  color: #fff;
}
.modern-btn.save:hover {
  background: #4fd1c5;
  color: #fff;
}
.modern-btn.delete {
  background: #E74C3C;
  color: #fff;
}
.modern-btn.delete:hover {
  background: #F39C12;
  color: #fff;
}
.modern-btn.cancel {
  background: #bbb;
  color: #fff;
}
.modern-modal {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 4px 32px #1a9c6b22;
  padding: 36px 24px 32px 24px;
  max-width: 420px;
  margin: 48px auto 0 auto;
}
.modern-select {
  font-size: 1.08rem;
  padding: 10px 18px;
  border-radius: 14px;
  border: 1.5px solid #e6eaf0;
  background: #f6f8fa;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #1a9c6b11;
  margin-right: 12px;
}
.modern-select:focus {
  border: 1.5px solid #1a9c6b;
  box-shadow: 0 2px 12px #1a9c6b22;
}
.orders-filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.order-card.status-new {
  border-left: 6px solid #1a9c6b;
}
.order-card.status-in_progress {
  border-left: 6px solid #4fd1c5;
}
.order-card.status-done {
  border-left: 6px solid #888;
}
.order-card.status-cancelled {
  border-left: 6px solid #E74C3C;
}
.order-status-row {
  margin-bottom: 4px;
}
.order-status-label {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.98rem;
  font-weight: 700;
  color: #fff;
}
.status-label-new {
  background: #1a9c6b;
}
.status-label-in_progress {
  background: #4fd1c5;
}
.status-label-done {
  background: #888;
}
.status-label-cancelled {
  background: #E74C3C;
}
@media (max-width: 700px) {
  .modern-admin-bg {
    max-width: 99vw;
    padding: 10px 1vw 10px 1vw;
    border-radius: 14px;
    margin-top: 12px;
  }
  .admin-title {
    font-size: 1.15rem;
    margin-bottom: 10px;
  }
  .order-list {
    flex-direction: column;
    gap: 8px;
  }
  .order-card {
    min-width: 0;
    max-width: 99vw;
    border-radius: 10px;
    gap: 7px;
  }
}
@media (max-width: 400px) {
  .modern-admin-bg {
    padding: 4px 2px 4px 2px;
    border-radius: 8px;
  }
  .order-card {
    border-radius: 6px;
  }
}
@media (max-width: 318px) {
  .modern-admin-bg {
    padding: 2px 1px 2px 1px;
    border-radius: 4px;
  }
  .order-card {
    border-radius: 4px;
  }
}
</style> 