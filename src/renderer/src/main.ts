import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import { router } from './router'

import 'virtual:windi.css'
import '@fontsource-variable/lexend'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {

})

app.mount('#app')
