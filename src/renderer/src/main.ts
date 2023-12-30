import { createApp } from 'vue'
import App from './App.vue'
import { fluent } from './fluent'
import { router } from './router'

import 'virtual:windi.css'
import '@fontsource-variable/lexend'
import '@fontsource-variable/fira-code'

const app = createApp(App)

app.use(router)
app.use(fluent)

app.mount('#app')
