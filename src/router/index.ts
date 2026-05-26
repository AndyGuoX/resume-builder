import { createRouter, createWebHashHistory } from 'vue-router';
import ResumeView from '../views/ResumeView/ResumeView.vue';
import HomeView from '../views/HomeView/HomeView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import { useAuthStore } from '../stores/useAuthStore';

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
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    const redirect = to.fullPath.startsWith('/') ? to.fullPath : '/resume';
    return { path: '/login', query: { redirect } };
  }
  if (to.path === '/login' && authStore.isLoggedIn) {
    return { path: '/resume' };
  }
});

export default router;
