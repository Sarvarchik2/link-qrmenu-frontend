<template>
  <section style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 12px #0001; padding: 24px;">
    <div style="background: #eee; border-radius: 12px; width: 100%; aspect-ratio: 16/9; margin-bottom: 16px;"></div>
    <h2 style="margin-bottom: 8px;">{{ t('dish.caesar') }}</h2>
    <div style="color: #888; margin-bottom: 8px;">{{ t('dish.caesar_desc') }}</div>
    <div style="font-size: 1.2rem; color: #E74C3C; font-weight: bold; margin-bottom: 16px;">390 {{ t('sum') }}</div>
    <div class="flex" style="gap: 8px; align-items: center;">
      <button class="accent">-</button>
      <span>1</span>
      <button class="accent">+</button>
      <button class="accent" style="margin-left: 16px;">{{ t('dish.add_to_cart') }}</button>
    </div>
    <button class="mt-2" style="background: none; color: #E74C3C;">{{ t('back') }}</button>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// TODO: Получать данные блюда по id
</script> 