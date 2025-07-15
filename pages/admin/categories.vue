<template>
  <div class="admin-categories modern-admin-bg">
    <h1 class="admin-title">Категории</h1>
    <button class="add-category-btn accent-btn" @click="openAddCategoryModal">+ Добавить категорию</button>
    <div v-if="catError" class="admin-error">Ошибка: {{ catError }}</div>
    <div v-if="catLoading" class="admin-loading">Загрузка...</div>
    <ul class="category-list">
      <li v-for="cat in categories" :key="cat.id" class="category-item modern-card">
        <span class="category-name">{{ cat.name }}</span>
        <button class="modern-btn edit" @click="openEditCategoryModal(cat)">Редактировать</button>
        <button class="modern-btn delete" @click="deleteCategory(cat.id)" :disabled="catDeletingId === cat.id">Удалить</button>
      </li>
    </ul>

    <!-- Модальное окно для добавления категории -->
    <div v-if="addCategoryModalOpen" class="modal-overlay" @click.self="closeAddCategoryModal">
      <div class="modal-content modern-modal">
        <h2 class="modal-title">Добавить категорию</h2>
        <form class="add-category-form modern-form" @submit.prevent="submitAddCategory" enctype="multipart/form-data">
          <input v-model="addCatName" type="text" placeholder="Название категории" required />
          <textarea v-model="addCatDesc" placeholder="Описание (необязательно)"></textarea>
          <div class="photo-upload-block">
            <label class="photo-label">Фото категории</label>
            <div class="photo-dropzone" @dragover.prevent @drop.prevent="onCatDrop" @click="openCatFileDialog">
              <input ref="catFileInput" type="file" accept="image/*" style="display:none" @change="onCatFileChange" />
              <img v-if="addCatPhotoPreview" :src="addCatPhotoPreview" class="photo-preview" />
              <div v-else class="photo-placeholder">
                <svg width="48" height="48" fill="#bbb"><rect width="100%" height="100%" rx="12" fill="#f5f5f5"/><text x="50%" y="55%" text-anchor="middle" fill="#bbb" font-size="16">Фото</text></svg>
                <div class="photo-text">Перетащите фото или нажмите</div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="modern-btn cancel" @click="closeAddCategoryModal">Отмена</button>
            <button type="submit" class="modern-btn save" :disabled="addCatLoading">Добавить</button>
          </div>
        </form>
        <div v-if="addCatError" class="add-dish-error">Ошибка: {{ addCatError }}</div>
      </div>
    </div>
    <!-- Модалка редактирования -->
    <div v-if="editCategoryModalOpen" class="modal-overlay" @click.self="closeEditCategoryModal">
      <div class="modal-content modern-modal">
        <h2 class="modal-title">Редактировать категорию</h2>
        <form class="edit-category-form modern-form" @submit.prevent="submitEditCategory" enctype="multipart/form-data">
          <input v-model="editCatName" type="text" placeholder="Название категории" required />
          <textarea v-model="editCatDesc" placeholder="Описание (необязательно)"></textarea>
          <div class="photo-upload-block">
            <label class="photo-label">Фото категории</label>
            <div class="photo-dropzone" @dragover.prevent @drop.prevent="onEditCatDrop" @click="openEditCatFileDialog">
              <input ref="editCatFileInput" type="file" accept="image/*" style="display:none" @change="onEditCatFileChange" />
              <img v-if="editCatPhotoPreview" :src="editCatPhotoPreview" class="photo-preview" />
              <div v-else class="photo-placeholder">
                <svg width="48" height="48" fill="#bbb"><rect width="100%" height="100%" rx="12" fill="#f5f5f5"/><text x="50%" y="55%" text-anchor="middle" fill="#bbb" font-size="16">Фото</text></svg>
                <div class="photo-text">Перетащите фото или нажмите</div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="modern-btn cancel" @click="closeEditCategoryModal">Отмена</button>
            <button type="submit" class="modern-btn save" :disabled="editCatLoading">Сохранить</button>
          </div>
        </form>
        <div v-if="editCatError" class="add-dish-error">Ошибка: {{ editCatError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
definePageMeta({ layout: 'admin', middleware: 'auth' })
const categories = ref<any[]>([])
const catLoading = ref(false)
const catError = ref('')
const catDeletingId = ref<number|null>(null)

const addCategoryModalOpen = ref(false)
const addCatName = ref('')
const addCatDesc = ref('')
const addCatPhotoFile = ref<File|null>(null)
const addCatPhotoPreview = ref<string|null>(null)
const addCatLoading = ref(false)
const addCatError = ref('')
const catFileInput = ref<HTMLInputElement|null>(null)
const restaurantId = ref<number|null>(null)

// 1. СТЕЙТ для редактирования
const editCategoryModalOpen = ref(false)
const editCatId = ref<number|null>(null)
const editCatName = ref('')
const editCatDesc = ref('')
const editCatPhotoFile = ref<File|null>(null)
const editCatPhotoPreview = ref<string|null>(null)
const editCatLoading = ref(false)
const editCatError = ref('')
const editCatFileInput = ref<HTMLInputElement|null>(null)

async function fetchCategories() {
  catLoading.value = true
  catError.value = ''
  try {
    const res = await apiFetch('/api/owner/categories/')
    categories.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    catError.value = e?.message || 'Ошибка загрузки категорий'
  } finally {
    catLoading.value = false
  }
}

async function deleteCategory(id: number) {
  catError.value = ''
  catDeletingId.value = id
  try {
    const res = await apiFetch(`/api/owner/categories/${id}/`, { method: 'DELETE' })
    // apiFetch выбросит ошибку, если не ok
    await fetchCategories()
  } catch (e: any) {
    catError.value = e?.message || 'Ошибка удаления'
    await fetchCategories()
  } finally {
    catDeletingId.value = null
  }
}

function openAddCategoryModal() {
  addCategoryModalOpen.value = true
  addCatName.value = ''
  addCatDesc.value = ''
  addCatPhotoFile.value = null
  addCatPhotoPreview.value = null
  addCatError.value = ''
}
function closeAddCategoryModal() {
  addCategoryModalOpen.value = false
}
function onCatFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    addCatPhotoFile.value = files[0]
    addCatPhotoPreview.value = URL.createObjectURL(files[0])
  }
}
function onCatDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    addCatPhotoFile.value = files[0]
    addCatPhotoPreview.value = URL.createObjectURL(files[0])
  }
}
function openCatFileDialog() {
  catFileInput.value?.click()
}
async function fetchRestaurantId() {
  try {
    const res = await apiFetch('/api/owner/info/')
    if (res && res.id) {
      restaurantId.value = res.id
    } else {
      addCatError.value = 'Не найден ресторан для владельца'
    }
  } catch (e: any) {
    addCatError.value = 'Ошибка загрузки ресторана: ' + (e?.message || '')
  }
}

async function submitAddCategory() {
  addCatError.value = ''
  addCatLoading.value = true
  try {
    if (!restaurantId.value) {
      addCatError.value = 'Не найден ресторан для владельца'
      addCatLoading.value = false
      return
    }
    const formData = new FormData()
    formData.append('name', addCatName.value)
    formData.append('description', addCatDesc.value)
    formData.append('restaurant', String(restaurantId.value))
    if (addCatPhotoFile.value) formData.append('photo', addCatPhotoFile.value)
    await apiFetch('/api/owner/categories/', {
      method: 'POST',
      body: formData
    })
    closeAddCategoryModal()
    await fetchCategories()
  } catch (e: any) {
    addCatError.value = e?.message || 'Ошибка добавления'
  } finally {
    addCatLoading.value = false
  }
}

// 2. Открытие модалки редактирования
function openEditCategoryModal(cat: any) {
  editCatId.value = cat.id
  editCatName.value = cat.name
  editCatDesc.value = cat.description || ''
  editCatPhotoFile.value = null
  editCatPhotoPreview.value = cat.photo || null
  editCatError.value = ''
  editCategoryModalOpen.value = true
}
function closeEditCategoryModal() {
  editCategoryModalOpen.value = false
}
function onEditCatFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    editCatPhotoFile.value = files[0]
    editCatPhotoPreview.value = URL.createObjectURL(files[0])
  }
}
function onEditCatDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    editCatPhotoFile.value = files[0]
    editCatPhotoPreview.value = URL.createObjectURL(files[0])
  }
}
function openEditCatFileDialog() {
  editCatFileInput.value?.click()
}
// 3. PATCH-запрос
async function submitEditCategory() {
  if (!editCatId.value) return
  editCatError.value = ''
  editCatLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', editCatName.value)
    formData.append('description', editCatDesc.value)
    if (editCatPhotoFile.value) formData.append('photo', editCatPhotoFile.value)
    await apiFetch(`/api/owner/categories/${editCatId.value}/`, {
      method: 'PATCH',
      body: formData
    })
    closeEditCategoryModal()
    await fetchCategories()
  } catch (e: any) {
    editCatError.value = e?.message || 'Ошибка редактирования'
  } finally {
    editCatLoading.value = false
  }
}

onMounted(async () => {
  await fetchRestaurantId()
  await fetchCategories()
})
</script>

<style scoped>
.modern-admin-bg {
  border-radius: 24px;
  padding: 32px 24px 28px 24px;
  max-width: 700px;
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
.add-category-btn {
  display: inline-block;
  margin-bottom: 18px;
  background: linear-gradient(90deg, #1a9c6b 60%, #4fd1c5 100%);
  color: #fff;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px #1a9c6b22;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  border: none;
  cursor: pointer;
}
.add-category-btn:active, .add-category-btn:hover {
  background: #178a5c;
  box-shadow: 0 4px 18px #1a9c6b22;
  transform: scale(1.04);
}
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.category-item {
  background: #f8fafd;
  border-radius: 10px;
  box-shadow: 0 1px 6px #1a9c6b11;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 18px;
}
.category-item button {
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.98rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.category-item button:active, .category-item button:disabled {
  background: #c0392b;
  opacity: 0.7;
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
.add-category-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.add-category-form input,
.add-category-form textarea {
  font-size: 1.08rem;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #e6eaf0;
  background: #f6f8fa;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #1a9c6b11;
}
.add-category-form input:focus,
.add-category-form textarea:focus {
  border: 1.5px solid #1a9c6b;
  box-shadow: 0 2px 12px #1a9c6b22;
}
.photo-upload-block {
  margin-bottom: 8px;
}
.photo-label {
  font-size: 1.08rem;
  color: #555;
  margin-bottom: 6px;
  display: block;
}
.photo-dropzone {
  border: 2px dashed #cfd8dc;
  border-radius: 14px;
  background: #f6f8fa;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border 0.2s;
  margin-bottom: 4px;
  position: relative;
  box-shadow: 0 1px 6px #1a9c6b11;
}
.photo-preview {
  max-width: 120px;
  max-height: 90px;
  border-radius: 10px;
  margin-bottom: 6px;
}
.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #bbb;
  font-size: 1.1rem;
  gap: 4px;
}
.photo-text {
  font-size: 0.98rem;
  color: #888;
  margin-top: 2px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 18px;
}
.modal-cancel {
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
.modal-cancel:active, .modal-cancel:hover {
  background: #c0392b;
}
.modal-save {
  background: #1a9c6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-save:active, .modal-save:hover {
  background: #178a5c;
}
.add-dish-error {
  color: #E74C3C;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
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
  flex-direction: row;
  align-items: center;
  min-width: 210px;
  max-width: 420px;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 8px;
  transition: box-shadow 0.2s, transform 0.15s;
}
.modern-card:hover {
  box-shadow: 0 6px 24px #1a9c6b22;
  transform: translateY(-2px) scale(1.03);
}
.category-name {
  font-size: 1.08rem;
  font-weight: 600;
  color: #1a9c6b;
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
  margin: 18px;
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
</style> 