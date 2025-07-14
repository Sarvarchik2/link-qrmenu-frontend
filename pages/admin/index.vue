<template>
  <div class="admin-restaurants modern-admin-bg">
    <h1 class="admin-title">{{ t('admin.index.restaurants') }}</h1>
    <div v-if="loading" class="admin-loading">{{ t('admin.index.loading') }}...</div>
    <div v-else-if="error" class="admin-error">{{ t('admin.index.error') }}: {{ error }}</div>
    <div v-else>
      <div v-if="restaurants.length === 0">{{ t('admin.index.no_restaurants') }}</div>
      <ul v-else class="restaurant-list">
        <li v-for="r in restaurants" :key="r.id" class="restaurant-item">
          <div class="restaurant-name">{{ r.name }}</div>
          <div class="restaurant-address">{{ r.address }}</div>
        </li>
      </ul>
    </div>
    <h2 class="admin-title" style="margin-top:40px;">{{ t('admin.index.categories') }}</h2>
    <button class="add-category-btn" @click="openAddCategoryModal">+ {{ t('admin.index.add_category') }}</button>
    <form class="category-form" @submit.prevent="addCategory" v-if="false">
      <input v-model="newCategory" type="text" :placeholder="t('admin.index.category_name')" required />
      <button type="submit" :disabled="catLoading">{{ t('admin.index.add') }}</button>
    </form>
    <div v-if="catError" class="admin-error">{{ t('admin.index.error') }}: {{ catError }}</div>
    <div v-if="catLoading" class="admin-loading">{{ t('admin.index.loading') }}...</div>
    <ul class="category-list">
      <li v-for="cat in categories" :key="cat.id" class="category-item">
        <span>{{ cat.name }}</span>
        <button @click="deleteCategory(cat.id)" :disabled="catDeletingId === cat.id">{{ t('admin.index.delete') }}</button>
      </li>
    </ul>

    <!-- Модальное окно для добавления категории -->
    <div v-if="addCategoryModalOpen" class="modal-overlay" @click.self="closeAddCategoryModal">
      <div class="modal-content">
        <h2 class="modal-title">{{ t('admin.index.add_category') }}</h2>
        <form class="add-category-form" @submit.prevent="submitAddCategory" enctype="multipart/form-data">
          <input v-model="addCatName" type="text" :placeholder="t('admin.index.category_name')" required />
          <textarea v-model="addCatDesc" :placeholder="t('admin.index.description')"></textarea>
          <div class="photo-upload-block">
            <label class="photo-label">{{ t('admin.index.category_photo') }}</label>
            <div class="photo-dropzone" @dragover.prevent @drop.prevent="onCatDrop" @click="openCatFileDialog">
              <input ref="catFileInput" type="file" accept="image/*" style="display:none" @change="onCatFileChange" />
              <img v-if="addCatPhotoPreview" :src="addCatPhotoPreview" class="photo-preview" />
              <div v-else class="photo-placeholder">
                <svg width="48" height="48" fill="#bbb"><rect width="100%" height="100%" rx="12" fill="#f5f5f5"/><text x="50%" y="55%" text-anchor="middle" fill="#bbb" font-size="16">{{ t('admin.index.photo') }}</text></svg>
                <div class="photo-text">{{ t('admin.index.drag_or_click') }}</div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="modal-cancel" @click="closeAddCategoryModal">{{ t('admin.index.cancel') }}</button>
            <button type="submit" class="modal-save" :disabled="addCatLoading">{{ t('admin.index.add') }}</button>
          </div>
        </form>
        <div v-if="addCatError" class="add-dish-error">{{ t('admin.index.error') }}: {{ addCatError }}</div>
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
const restaurants = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const categories = ref<any[]>([])
const catLoading = ref(false)
const catError = ref('')
const newCategory = ref('')
const catDeletingId = ref<number|null>(null)

const addCategoryModalOpen = ref(false)
const addCatName = ref('')
const addCatDesc = ref('')
const addCatPhotoFile = ref<File|null>(null)
const addCatPhotoPreview = ref<string|null>(null)
const addCatLoading = ref(false)
const addCatError = ref('')
const catFileInput = ref<HTMLInputElement|null>(null)

async function fetchCategories() {
  catLoading.value = true
  catError.value = ''
  try {
    const res = await apiFetch('/api/owner/categories/')
    categories.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    catError.value = e?.message || t('error_loading_categories')
  } finally {
    catLoading.value = false
  }
}

async function addCategory() {
  catError.value = ''
  catLoading.value = true
  try {
    await apiFetch('/api/owner/categories/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.value })
    })
    newCategory.value = ''
    await fetchCategories()
  } catch (e: any) {
    catError.value = e?.message || t('error_adding')
  } finally {
    catLoading.value = false
  }
}

async function deleteCategory(id: number) {
  catError.value = ''
  catDeletingId.value = id
  try {
    await apiFetch(`/api/owner/categories/${id}/`, { method: 'DELETE' })
    await fetchCategories()
  } catch (e: any) {
    catError.value = e?.message || t('error_deleting')
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
async function submitAddCategory() {
  addCatError.value = ''
  addCatLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', addCatName.value)
    formData.append('description', addCatDesc.value)
    if (addCatPhotoFile.value) formData.append('photo', addCatPhotoFile.value)
    await apiFetch('/api/owner/categories/', {
      method: 'POST',
      body: formData
    })
    closeAddCategoryModal()
    await fetchCategories()
  } catch (e: any) {
    addCatError.value = e?.message || t('error_adding')
  } finally {
    addCatLoading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await apiFetch('/api/admin/restaurants/')
    restaurants.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || t('error_loading')
  } finally {
    loading.value = false
  }
  await fetchCategories()
})
</script>

<style scoped>
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
.restaurant-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.restaurant-item {
  background: #f8fafd;
  border-radius: 14px;
  box-shadow: 0 2px 12px #1a9c6b11;
  padding: 18px 16px;
  text-align: left;
  margin-bottom: 8px;
}
.restaurant-name {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.restaurant-address {
  color: #888;
  font-size: 1rem;
}
.category-form {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  justify-content: center;
}
.category-form input {
  font-size: 1.08rem;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1.5px solid #e6eaf0;
  background: #f6f8fa;
  outline: none;
}
.category-form button {
  font-size: 1.08rem;
  padding: 8px 18px;
  border-radius: 8px;
  background: #1a9c6b;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.category-form button:active {
  background: #178a5c;
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
  .restaurant-item {
    padding: 10px 8px;
    border-radius: 8px;
  }
  .category-form input {
    font-size: 0.95rem;
    padding: 6px 8px;
    border-radius: 6px;
  }
  .category-form button {
    font-size: 0.95rem;
    padding: 6px 10px;
    border-radius: 6px;
  }
  .category-item {
    padding: 6px 10px;
    border-radius: 6px;
    gap: 8px;
  }
}
@media (max-width: 400px) {
  .modern-admin-bg {
    padding: 4px 2px 4px 2px;
    border-radius: 8px;
  }
  .restaurant-item, .category-item {
    padding: 4px 2px;
    border-radius: 4px;
  }
}
@media (max-width: 318px) {
  .modern-admin-bg {
    padding: 2px 1px 2px 1px;
    border-radius: 4px;
  }
  .restaurant-item, .category-item {
    padding: 2px 1px;
    border-radius: 2px;
  }
}
</style>