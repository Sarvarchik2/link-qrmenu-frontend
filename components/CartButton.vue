<template>
  <transition name="fade">
    <button v-if="showButton" class="cart-fab" @click="handleClick">
      {{ isCartPage ? t('return_to_menu') : t('view_cart') }}
    </button>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const cart = useCartStore()
const cartCount = computed(() => cart.count)
const router = useRouter()
const route = useRoute()
const isCartPage = computed(() => route.path === '/cart')
const showButton = computed(() => isCartPage.value || cartCount.value > 0)
function handleClick() {
  router.push('/')
  if (!isCartPage.value && cartCount.value > 0) {
    router.push('/cart')
  }
}
</script>

<style scoped>
.cart-fab {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 18px;
  margin: 0 auto;
  max-width: 420px;
  width: calc(100vw - 32px);
  background: #F39C12;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 18px 0;
  box-shadow: 0 4px 24px #F39C1240;
  z-index: 1000;
  transition: background 0.2s, transform 0.15s;
  cursor: pointer;
}
.cart-fab:active {
  background: #E74C3C;
  transform: scale(1.03);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 