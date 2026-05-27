import { createRouter, createWebHashHistory } from 'vue-router';
import ResumeView from '../views/ResumeView/ResumeView.vue';
import HomeView from '../views/HomeView/HomeView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import { useAuthStore } from '../stores/useAuthStore';

const PUBLIC_ROUTES = ['/', '/login'];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/resume',
      component: ResumeView,
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/resume';
  }
  if (!PUBLIC_ROUTES.includes(to.path) && !authStore.isLoggedIn) {
    return '/login';
  }
});

export default router;
