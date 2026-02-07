import { createRouter, createWebHistory } from 'vue-router'
import CoverMaker from '../views/CoverMaker.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CoverMaker,
    },
  ],
})

export default router
