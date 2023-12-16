import { createRouter, createWebHashHistory } from 'vue-router'

import Index from '@renderer/pages/Index.vue'

export const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Index,
    },
  ],
})
