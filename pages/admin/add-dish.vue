<template>
  <div class="add-dish-wrap modern-admin-bg">
    <h1 class="admin-title">{{ t('admin.addDish.title') }}</h1>
    <form class="add-dish-form modern-form" @submit.prevent="addDish" enctype="multipart/form-data">
      <select v-model="category" required>
        <option value="">{{ t('admin.addDish.selectCategory') }}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <input v-model="name" type="text" :placeholder="t('admin.addDish.dishName')" required />
      <textarea v-model="description" :placeholder="t('admin.addDish.dishDescription')"></textarea>
      <input v-model="price" type="text" :placeholder="t('admin.addDish.price')" required />
      <div class="checkboxes">
        <label>
          <input v-model="isHit" type="checkbox" />
          {{ t('admin.addDish.hitSales') }}
        </label>
        <label>
          <input v-model="isVegetarian" type="checkbox" />
          {{ t('admin.addDish.vegetarian') }}
        </label>
      </div>
      <div class="photo-upload-block">
        <label class="photo-label">{{ t('admin.addDish.dishPhoto') }}</label>
        <div class="photo-dropzone" @dragover.prevent @drop.prevent="onDrop" @click="fileInput?.click()">
          <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />
          <img v-if="photoPreview" :src="photoPreview" class="photo-preview" />
          <div v-else class="photo-placeholder">
            <svg width="48" height="48" fill="#bbb"><rect width="100%" height="100%" rx="12" fill="#f5f5f5"/><text x="50%" y="55%" text-anchor="middle" fill="#bbb" font-size="16">{{ t('admin.addDish.photo') }}</text></svg>
            <div class="photo-text">{{ t('admin.addDish.dragOrClickPhoto') }}</div>
          </div>
        </div>
      </div>
      <button type="submit" class="accent-btn" :disabled="loading">{{ t('admin.addDish.add') }}</button>
    </form>
    <div v-if="success" class="add-dish-success">{{ t('admin.addDish.dishAdded') }}</div>
    <div v-if="error" class="add-dish-error">{{ t('admin.addDish.error') }}: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const name = ref('')
const category = ref('')
const description = ref('')
const price = ref('')
const isHit = ref(false)
const isVegetarian = ref(false)
const success = ref(false)
const error = ref('')
const loading = ref(false)
const categories = ref<any[]>([])
const photoFile = ref<File|null>(null)
const photoPreview = ref<string|null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    photoFile.value = files[0]
    photoPreview.value = URL.createObjectURL(files[0])
  }
}
function onDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    photoFile.value = files[0]
    photoPreview.value = URL.createObjectURL(files[0])
  }
}
async function fetchCategories() {
  try {
    const res = await apiFetch('/api/owner/categories/')
    categories.value = Array.isArray(res) ? res : (res.results || [])
  } catch (e: any) {
    error.value = e?.message || t('admin.addDish.categoryLoadingError')
  }
}
async function addDish() {
  error.value = ''
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('category', String(Number(category.value))) // строго число-строка
    formData.append('name', name.value)
    formData.append('description', description.value)
    formData.append('price', price.value)
    formData.append('is_hit', isHit.value ? 'true' : 'false')
    formData.append('is_vegetarian', isVegetarian.value ? 'true' : 'false')
    if (photoFile.value) formData.append('photo', photoFile.value)
    await apiFetch('/api/owner/items/', {
      method: 'POST',
      body: formData
    })
    name.value = ''
    category.value = ''
    description.value = ''
    price.value = ''
    isHit.value = false
    isVegetarian.value = false
    photoFile.value = null
    photoPreview.value = null
    success.value = true
    setTimeout(() => success.value = false, 2000)
  } catch (e: any) {
    // Пытаемся получить подробную ошибку из тела ответа
    if (e && e.message && e.message.startsWith('{')) {
      try {
        const errObj = JSON.parse(e.message)
        error.value = JSON.stringify(errObj)
      } catch {
        error.value = e.message || t('admin.addDish.addError')
      }
    } else {
      error.value = e?.message || t('admin.addDish.addError')
    }
  } finally {
    loading.value = false
  }
}
onMounted(fetchCategories)
</script>

<style scoped>
.modern-admin-bg {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px #1a9c6b11;
  padding: 32px 24px 28px 24px;
  max-width: 480px;
  margin: 48px auto 0 auto;
}
.add-dish-wrap {
  width: 100%;
}
.admin-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 32px;
  color: #1a9c6b;
  text-align: center;
  letter-spacing: 1px;
}
.add-dish-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.add-dish-form input,
.add-dish-form select,
.add-dish-form textarea {
  font-size: 1.08rem;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1.5px solid #e6eaf0;
  background: #f6f8fa;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #1a9c6b11;
}
.add-dish-form input:focus,
.add-dish-form select:focus,
.add-dish-form textarea:focus {
  border: 1.5px solid #1a9c6b;
  box-shadow: 0 2px 12px #1a9c6b22;
}
.add-btn {
  font-size: 1.18rem;
  padding: 18px 0;
  border-radius: 16px;
  background: linear-gradient(90deg, #1a9c6b 60%, #4fd1c5 100%);
  color: #fff;
  border: none;
  font-weight: 700;
  margin-top: 8px;
  box-shadow: 0 2px 12px #1a9c6b22;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.add-btn:active, .add-btn:hover {
  background: #178a5c;
  box-shadow: 0 4px 18px #1a9c6b22;
  transform: scale(1.04);
}
.add-dish-success {
  color: #27ae60;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
.add-dish-error {
  color: #E74C3C;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 18px;
}
.checkboxes {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}
.checkboxes label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #555;
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
  border-radius: 18px;
  background: #f6f8fa;
  min-height: 120px;
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
.photo-dropzone:hover {
  border-color: #1a9c6b;
}
.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #bbb;
  gap: 8px;
}
.photo-text {
  font-size: 1rem;
  color: #888;
  margin-top: 8px;
}
.photo-preview {
  max-width: 100%;
  max-height: 120px;
  border-radius: 12px;
  margin: 8px 0;
  object-fit: contain;
  box-shadow: 0 2px 8px #0001;
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
  margin-bottom: 8px;
  text-align: center;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.accent-btn:hover, .accent-btn:active {
  background: #178a5c !important;
  box-shadow: 0 4px 18px #1a9c6b22;
  transform: scale(1.04);
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
  .add-dish-form {
    gap: 10px;
  }
  .add-dish-form input,
  .add-dish-form select,
  .add-dish-form textarea {
    font-size: 0.98rem;
    padding: 10px 8px;
    border-radius: 10px;
  }
  .add-btn {
    font-size: 1rem;
    padding: 10px 0;
    border-radius: 10px;
    margin-top: 4px;
  }
  .add-dish-success {
    font-size: 0.98rem;
    margin-top: 8px;
  }
}
@media (max-width: 400px) {
  .modern-admin-bg {
    padding: 4px 2px 4px 2px;
    border-radius: 8px;
  }
  .add-dish-form input,
  .add-dish-form select,
  .add-dish-form textarea {
    padding: 6px 4px;
    border-radius: 6px;
  }
  .add-btn {
    padding: 6px 0;
    font-size: 0.85rem;
    border-radius: 6px;
  }
}
@media (max-width: 318px) {
  .modern-admin-bg {
    padding: 2px 1px 2px 1px;
    border-radius: 4px;
  }
  .add-dish-form input,
  .add-dish-form select,
  .add-dish-form textarea {
    padding: 2px 1px;
    border-radius: 3px;
  }
  .add-btn {
    padding: 4px 0;
    font-size: 0.7rem;
    border-radius: 3px;
  }
}
</style> 