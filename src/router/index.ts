import { createRouter, createWebHashHistory } from 'vue-router'
import ResumeView from '../views/ResumeView/ResumeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ResumeView,
    },
  ],
})

export default router
