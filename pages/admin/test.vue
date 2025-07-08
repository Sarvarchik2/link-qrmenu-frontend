<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <CartButton v-if="!hideCartButton" />
  </ClientOnly>
</template>

<script setup>
import CartButton from '~/components/CartButton.vue'
import { useRoute } from 'vue-router'
import { useLangStore } from '~/stores/langStore'
import { onMounted } from 'vue'

const route = useRoute()
const hideCartButton = route.path === '/cart' || route.path === '/order-confirmation'

// Глобальная инициализация языка
const langStore = useLangStore()
onMounted(() => {
  langStore.initLang()
})
</script>

<style src="~/assets/main.css"></style>