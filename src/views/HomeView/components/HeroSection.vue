<!-- src/views/HomeView/components/HeroSection.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function handleStart() {
  router.push(authStore.isLoggedIn ? '/resume' : '/login');
}

function handleExample() {
  router.push('/resume');
}
</script>

<template>
  <section class="home-hero">
    <div class="home-section-inner">
      <h1 class="home-hero-title">在线制作专业简历1</h1>
      <p class="home-hero-subtitle">填写信息，智能排版，一键导出，快速投递</p>
      <div class="home-hero-actions">
        <a-button type="primary" size="large" @click="handleStart">开始制作 →</a-button>
        <a-button size="large" @click="handleExample">查看示例 →</a-button>
      </div>
    </div>
  </section>
</template>
