// https://nuxt.com/docs/api/configuration/nuxt-config
import postcss from "./postcss.config.js"
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss,
  modules: [
    '@vueuse/nuxt',
  ],
})
