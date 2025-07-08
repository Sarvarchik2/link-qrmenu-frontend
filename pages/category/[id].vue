<template>
  <div>
    <HeaderBar />
    <BackButton />
    <main class="mt-2">
      <DishList :categoryId="categoryId" />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import HeaderBar from '~/components/HeaderBar.vue'
import DishList from '~/components/DishList.vue'
import BackButton from '~/components/BackButton.vue'
const route = useRoute()
const categoryId = route.params.id
</script> 