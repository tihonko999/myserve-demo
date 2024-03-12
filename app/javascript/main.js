import { createApp } from 'vue'
import { router } from '~/router'
import MainApp from './main-app.vue'

createApp(MainApp).use(router).mount('#main-app')
