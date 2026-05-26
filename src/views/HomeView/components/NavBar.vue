<!-- src/views/HomeView/components/NavBar.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <nav class="home-navbar">
    <div class="home-navbar-inner">
      <a href="/#/" class="home-nav-brand">
        <span class="home-brand-icon">📄</span>
        <span class="home-brand-name">简历制作</span>
      </a>
      <div class="home-nav-actions">
        <template v-if="authStore.isLoggedIn">
          <span class="home-nav-username">{{ authStore.user?.name }}</span>
          <a-button @click="handleLogout">退出登录</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="router.push('/login')">登录</a-button>
        </template>
      </div>
    </div>
  </nav>
</template>
