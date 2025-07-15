// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  pinia: {
    plugins: [
      'pinia-plugin-persistedstate',
    ],
  },
  i18n: {
    // Локали и файлы переводов
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'uz', name: 'Oʻzbekcha', file: 'uz.json' }
    ],
    defaultLocale: 'uz',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: false // отключено, чтобы не сбрасывался язык
    }
  },
  css: [
    '~/assets/main.css',
  ],
})
