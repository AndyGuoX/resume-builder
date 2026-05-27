<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <div class="navbar-logo" @click="router.push('/')">
        <span class="navbar-logo-icon">🤖</span>
        <span class="navbar-logo-text">AI Interview</span>
      </div>
      <a-button type="primary" class="navbar-login-btn" @click="router.push('/login')">
        登录
      </a-button>
    </div>
  </nav>
</template>

<style lang="less" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f0f0f0;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  .navbar-logo-icon {
    font-size: 22px;
  }

  .navbar-logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #515ff1;
  }
}

.navbar-login-btn {
  background: #515ff1;
  border-color: #515ff1;
}
</style>
