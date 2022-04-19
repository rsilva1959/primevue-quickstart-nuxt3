import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    css: [
        'primevue/resources/themes/bootstrap4-dark-blue/theme.css',
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css'
    ],
    build: {
        transpile: ['primevue']
    },
    buildModules: [
        "@pinia/nuxt",
        '@intlify/nuxt3'
    ],
})