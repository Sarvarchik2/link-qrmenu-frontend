<template>
  <div class="login-wrap">
    <form class="login-form" @submit.prevent="login">
      <h2 class="login-title">{{ t('login.title') }}</h2>
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit" :disabled="loading">{{ t('login.loginButton') }}</button>
      <div v-if="error" class="login-error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function login() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    localStorage.setItem('admin_auth', '1')
    router.push('/admin/dashboard')
  } catch (e: any) {
    error.value = 'Ошибка входа: ' + (e?.message || 'Проверьте username и пароль')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf8f6;
}
.login-form {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px #0001;
  padding: 36px 28px 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 320px;
}
.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}
.login-form input {
  font-size: 1.08rem;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #f0ece8;
  background: #F8F5F2;
  outline: none;
  transition: border 0.2s;
}
.login-form input:focus {
  border: 1.5px solid #F39C12;
}
.login-form button {
  font-size: 1.15rem;
  padding: 14px 0;
  border-radius: 12px;
  background: #F39C12;
  color: #fff;
  border: none;
  font-weight: bold;
  margin-top: 8px;
  box-shadow: 0 2px 12px #F39C1240;
  cursor: pointer;
  transition: background 0.2s;
}
.login-form button:active {
  background: #E74C3C;
}
.login-error {
  color: #E74C3C;
  text-align: center;
  font-size: 1rem;
  margin-top: 4px;
}
</style> 