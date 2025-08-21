import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import UiKit from './ui-kit/index.js';

const pinia = createPinia()

createApp(App).use(pinia).use(UiKit).mount('#app')
