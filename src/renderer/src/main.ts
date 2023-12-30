import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import 'virtual:windi.css'
import '@fontsource-variable/lexend'
import '@fontsource-variable/fira-code'

const app = createApp(App)

app.use(router)

app.mount('#app')
