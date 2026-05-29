import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView/HomeView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import ResumeView from '../views/ResumeView/ResumeView.vue';
import InterviewView from '../views/InterviewView/InterviewView.vue';
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
    },
    {
      path: '/interview',
      component: InterviewView,
    },
  ],
});

router.beforeEach((to) => {
  if (to.path === '/resume' || to.path === '/interview') {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      return '/login';
    }
  }
});

export default router;
