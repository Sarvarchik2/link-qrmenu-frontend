<template>
  <div class="admin-menu modern-admin-bg">
    <h1 class="admin-title">{{ t('admin.menu.title') }}</h1>
    <NuxtLink to="/admin/add-dish" class="add-dish-btn accent-btn">➕ {{ t('admin.menu.addDish') }}</NuxtLink>
    <div v-if="loading" class="admin-loading">{{ t('admin.menu.loading') }}...</div>
    <div v-else-if="error" class="admin-error">{{ t('admin.menu.error') }}: {{ error }}</div>
    <div class="dish-list">
      <div v-for="dish in dishes" :key="dish.id" class="dish-card modern-card">
        <img :src="dish.photo && dish.photo.startsWith('/') ? 'http://127.0.0.1:8000' + dish.photo : (dish.photo || 'https://via.placeholder.com/54x54?text=No+Image')" class="dish-img" />
        <div class="dish-info">
          <div class="dish-title">{{ t('admin.menu.dishName') }}: {{ dish.name }}</div>
          <div class="dish-meta">{{ t('admin.menu.price') }}: {{ dish.price }} {{ t('admin.menu.sum') }}</div>
          <div v-if="dish.description" class="dish-description">{{ t('admin.menu.dishDescription') }}: {{ dish.description }}</div>
          <div class="dish-flags">
            <span v-if="dish.is_hit" class="flag hit">{{ t('admin.menu.hit') }}</span>
            <span v-if="dish.is_vegetarian" class="flag veg">{{ t('admin.menu.veg') }}</span>
          </div>
        </div>
        <div class="dish-actions">
          <button class="modern-btn edit" @click="openEditModal(dish)">{{ t('admin.menu.edit') }}</button>
          <button class="modern-btn delete" @click="deleteDish(dish.id)" :disabled="deletingId === dish.id">
            <span v-if="deletingId === dish.id">...</span>
            <span v-else>{{ t('admin.menu.delete') }}</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="deleteError" class="admin-error">{{ t('admin.menu.deleteError') }}: {{ deleteError }}</div>

    <!-- Модальное окно для редактирования блюда -->
    <div v-if="editModalOpen" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content modern-modal">
        <h2 class="modal-title">{{ t('admin.menu.editDish') }}</h2>
        <form class="edit-dish-form modern-form" @submit.prevent="saveEditDish" enctype="multipart/form-data">
          <input v-model="editDishData.name" type="text" :placeholder="t('admin.menu.dishName')" required />
          <textarea v-model="editDishData.description" :placeholder="t('admin.menu.dishDescription')"></textarea>
          <input v-model="editDishData.price" type="text" :placeholder="t('admin.menu.price')" required />
          <div class="checkboxes">
            <label>
              <input v-model="editDishData.is_hit" type="checkbox" />
              {{ t('admin.menu.hitSales') }}
            </label>
            <label>
              <input v-model="editDishData.is_vegetarian" type="checkbox" />
              {{ t('admin.menu.vegetarian') }}
            </label>
          </div>
          <div class="photo-upload-block">
            <label class="photo-label">{{ t('admin.menu.dishPhoto') }}</label>
            <div class="photo-dropzone" @dragover.prevent @drop.prevent="onEditDrop" @click="openEditFileDialog">
              <input ref="editFileInput" type="file" accept="image/*" style="display:none" @change="onEditFileChange" />
              <img v-if="editPhotoPreview" :src="editPhotoPreview" class="photo-preview" />
              <div v-else class="photo-placeholder">
                <svg width="48" height="48" fill="#bbb"><rect width="100%" height="100%" rx="12" fill="#f5f5f5"/><text x="50%" y="55%" text-anchor="middle" fill="#bbb" font-size="16">{{ t('admin.menu.photo') }}</text></svg>
                <div class="photo-text">{{ t('admin.menu.dragOrClick') }}</div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="modern-btn cancel" @click="closeEditModal">{{ t('admin.menu.cancel') }}</button>
            <button type="submit" class="modern-btn save" :disabled="editLoading">{{ t('admin.menu.save') }}</button>
          </div>
        </form>
        <div v-if="editError" class="add-dish-error">{{ t('admin.menu.error') }}: {{ editError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
definePageMeta({ layout: 'admin', middleware: 'auth' })
const dishes = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const deletingId = ref<number|null>(null)
const deleteError = ref('')
async function fetchDishes() {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/owner/items/')
    dishes.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || t('admin.menu.loadError')
  } finally {
    loading.value = false
  }
}
onMounted(fetchDishes)
async function deleteDish(id: number) {
  deleteError.value = ''
  deletingId.value = id
  try {
    await apiFetch(`/api/owner/items/${id}/`, { method: 'DELETE' })
    await fetchDishes()
  } catch (e: any) {
    deleteError.value = e?.message || t('admin.menu.deleteError')
  } finally {
    deletingId.value = null
  }
}
const editModalOpen = ref(false)
const editDishData = ref<any>({})
const editPhotoFile = ref<File|null>(null)
const editPhotoPreview = ref<string|null>(null)
const editLoading = ref(false)
const editError = ref('')
const editFileInput = ref<HTMLInputElement|null>(null)
function openEditModal(dish: any) {
  editDishData.value = { ...dish }
  editPhotoFile.value = null
  editPhotoPreview.value = dish.photo && dish.photo.startsWith('/') ? 'http://127.0.0.1:8000' + dish.photo : dish.photo || null
  editModalOpen.value = true
}
function closeEditModal() {
  editModalOpen.value = false
  editDishData.value = {}
  editPhotoFile.value = null
  editPhotoPreview.value = null
  editError.value = ''
}
function onEditFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    editPhotoFile.value = files[0]
    editPhotoPreview.value = URL.createObjectURL(files[0])
  }
}
function onEditDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    editPhotoFile.value = files[0]
    editPhotoPreview.value = URL.createObjectURL(files[0])
  }
}
function openEditFileDialog() {
  editFileInput.value?.click()
}
async function saveEditDish() {
  editError.value = ''
  editLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', editDishData.value.name)
    formData.append('description', editDishData.value.description)
    formData.append('price', editDishData.value.price)
    formData.append('is_hit', editDishData.value.is_hit ? 'true' : 'false')
    formData.append('is_vegetarian', editDishData.value.is_vegetarian ? 'true' : 'false')
    if (editPhotoFile.value) formData.append('photo', editPhotoFile.value)
    await apiFetch(`/api/owner/items/${editDishData.value.id}/`, {
      method: 'PATCH',
      body: formData
    })
    closeEditModal()
    await fetchDishes()
  } catch (e: any) {
    editError.value = e?.message || t('admin.menu.saveError')
  } finally {
    editLoading.value = false
  }
}
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
.add-dish-btn {
  display: inline-block;
  margin-bottom: 22px;
  background: linear-gradient(90deg, #1a9c6b 60%, #4fd1c5 100%);
  color: #fff;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px #1a9c6b22;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  width: 100%;
  text-align: center;
}
.add-dish-btn:active, .add-dish-btn:hover {
  background: #178a5c;
  box-shadow: 0 4px 18px #1a9c6b22;
  transform: scale(1.04);
}
.dish-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
}
.dish-card {
  background: #f8fafd;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 16px 12px 12px 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 210px;
  max-width: 320px;
  flex: 1 1 210px;
  transition: box-shadow 0.2s, transform 0.15s;
  position: relative;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 30px;
}
.dish-card:hover {
  box-shadow: 0 6px 24px #1a9c6b22;
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
.dish-description {
  color: #666;
  font-size: 0.9rem;
  margin-top: 4px;
}
.dish-flags {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.flag {
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
.flag.hit {
  background: #1a9c6b;
  color: #fff;
}
.flag.veg {
  background: #27ae60;
  color: #fff;
}
.dish-delete {
  margin-left: auto;
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.dish-delete:active, .dish-delete:disabled {
  background: #c0392b;
  opacity: 0.7;
}
.dish-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.dish-edit {
  background: #1a9c6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.dish-edit:active, .dish-edit:hover {
  background: #178a5c;
}
/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 2000;
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
}
.modal-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1a9c6b;
  margin-bottom: 18px;
  text-align: center;
}
.edit-dish-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.edit-dish-form input,
.edit-dish-form textarea {
  font-size: 1.08rem;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1.5px solid #e6eaf0;
  background: #f6f8fa;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #1a9c6b11;
}
.edit-dish-form input:focus,
.edit-dish-form textarea:focus {
  border: 1.5px solid #1a9c6b;
  box-shadow: 0 2px 12px #1a9c6b22;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
}
.modal-cancel {
  background: #eee;
  color: #888;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-cancel:active, .modal-cancel:hover {
  background: #e6eaf0;
}
.modal-save {
  background: #1a9c6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-save:active, .modal-save:hover {
  background: #178a5c;
}
.photo-upload-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.photo-label {
  font-size: 0.98rem;
  color: #555;
  font-weight: 600;
}
.photo-dropzone {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border 0.2s;
  background: #f5f5f5;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.photo-dropzone:hover {
  border-color: #1a9c6b;
}
.photo-dropzone.dragover {
  border-color: #1a9c6b;
  background: #e0f7fa;
}
.photo-preview {
  max-width: 100%;
  max-height: 150px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
}
.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 1rem;
}
.photo-text {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #888;
}
.add-dish-error {
  color: #E74C3C;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}
.accent-btn {
  background: linear-gradient(90deg, #1a9c6b 60%, #4fd1c5 100%) !important;
  color: #fff !important;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  padding: 14px 0;
  font-size: 1.12rem;
  box-shadow: 0 2px 12px #1a9c6b22;
  width: 100%;
  margin-bottom: 22px;
  text-align: center;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.accent-btn:hover, .accent-btn:active {
  background: #178a5c !important;
  box-shadow: 0 4px 18px #1a9c6b22;
  transform: scale(1.04);
}
.modern-card {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 22px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 210px;
  max-width: 320px;
  flex: 1 1 210px;
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
.modern-btn.edit {
  background: #1a9c6b;
  color: #fff;
}
.modern-btn.edit:hover {
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
.modern-btn.save {
  background: #1a9c6b;
  color: #fff;
}
.modern-btn.save:hover {
  background: #4fd1c5;
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
.modern-form input,
.modern-form select,
.modern-form textarea {
  font-size: 1.08rem;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1.5px solid #e6eaf0;
  background: #f6f8fa;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #1a9c6b11;
  margin-bottom: 12px;
}
.modern-form input:focus,
.modern-form select:focus,
.modern-form textarea:focus {
  border: 1.5px solid #1a9c6b;
  box-shadow: 0 2px 12px #1a9c6b22;
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
  .add-dish-btn {
    font-size: 0.95rem;
    padding: 8px 12px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .dish-list {
    flex-direction: column;
    gap: 8px;
  }
  .dish-card {
    min-width: 0;
    max-width: 99vw;
    padding: 8px 4px 6px 4px;
    border-radius: 10px;
    gap: 7px;
  }
  .dish-img {
    width: 36px;
    height: 36px;
    border-radius: 6px;
  }
  .dish-title {
    font-size: 0.98rem;
  }
  .dish-meta {
    font-size: 0.85rem;
  }
}
@media (max-width: 400px) {
  .modern-admin-bg {
    padding: 4px 2px 4px 2px;
    border-radius: 8px;
  }
  .dish-card {
    padding: 4px 2px 4px 2px;
    border-radius: 6px;
  }
  .add-dish-btn {
    padding: 6px 6px;
    font-size: 0.85rem;
  }
}
@media (max-width: 318px) {
  .modern-admin-bg {
    padding: 2px 1px 2px 1px;
    border-radius: 4px;
  }
  .dish-card {
    padding: 2px 1px 2px 1px;
    border-radius: 4px;
  }
  .add-dish-btn {
    padding: 4px 2px;
    font-size: 0.7rem;
  }
}
@media (max-width: 500px) {
  .modal-content {
    padding: 10px 2vw 10px 2vw;
    min-width: 0;
  }
  .modal-title {
    font-size: 1.05rem;
  }
  .edit-dish-form input,
  .edit-dish-form textarea {
    font-size: 0.95rem;
    padding: 8px 8px;
    border-radius: 8px;
  }
  .modal-actions button {
    font-size: 0.95rem;
    padding: 6px 10px;
    border-radius: 6px;
  }
}
@media (max-width: 318px) {
  .modal-content {
    padding: 2px 1px 2px 1px;
    border-radius: 4px;
  }
  .edit-dish-form input,
  .edit-dish-form textarea {
    padding: 2px 1px;
    border-radius: 3px;
  }
  .modal-actions button {
    padding: 4px 2px;
    font-size: 0.7rem;
    border-radius: 3px;
  }
}
</style> 