import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import { router } from './router'

import 'virtual:windi.css'


// TODO: If we want to switch themes, we need to have all themes already imported.
import 'primevue/resources/themes/lara-light-purple/theme.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)

app.mount('#app')
