<template>
  <button class="back-btn" @click="goBack">
    <img src="@/assets/back.svg" alt="alt">
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
function goBack() {
  router.back()
}
</script>

<style scoped>
.back-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  background: #fff;
  border: none;
  border-radius: 50%;
  padding: 8px ;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}
.back-btn img {
  width: 24px;
  height: 24px;
}
</style> 