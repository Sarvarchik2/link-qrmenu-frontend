export default defineI18nConfig(() => ({
  locales: [
    { code: 'ru', name: 'Русский', file: 'ru.json' },
    { code: 'uz', name: 'Oʻzbekcha', file: 'uz.json' }
  ],
  defaultLocale: 'uz',
  fallbackLocale: 'uz',
  lazy: true,
  langDir: 'locales/',  
  vueI18n: {
    legacy: false,
    locale: 'uz',
    fallbackLocale: 'uz',
  },
  strategy: 'no_prefix',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    alwaysRedirect: true,
    fallbackLocale: 'uz'
  },
})) 