import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export type Lang = 'ru' | 'uz'

export const useLangStore = defineStore('lang', {
  state: () => ({
    lang: 'ru' as Lang,
  }),
  actions: {
    setLang(newLang: Lang) {
      this.lang = newLang
      // Синхронизируем с i18n
      const { locale } = useI18n()
      locale.value = newLang
      // Сохраняем в localStorage
      if (process.client) {
        localStorage.setItem('lang', newLang)
      }
    },
    initLang() {
      if (process.client) {
        const saved = localStorage.getItem('lang') as Lang | null
        if (saved === 'ru' || saved === 'uz') {
          this.lang = saved
          const { locale } = useI18n()
          locale.value = saved
        }
      }
    }
  }
}) 