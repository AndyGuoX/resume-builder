<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function handleCta() {
  if (authStore.isLoggedIn) {
    router.push('/resume');
  } else {
    router.push('/login');
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<template>
  <div class="home-page">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar-inner">
        <span class="navbar-logo">简历生成器</span>
        <div class="navbar-actions">
          <a-button v-if="authStore.isLoggedIn" @click="handleLogout">退出</a-button>
          <a-button v-else type="primary" @click="() => router.push('/login')">登录</a-button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">AI 驱动的简历生成器</h1>
          <p class="hero-subtitle">填写信息，一键生成专业简历，快速导出 Word / PNG</p>
          <a-button type="primary" size="large" class="hero-cta" @click="handleCta">
            生成我的简历
          </a-button>
        </div>
        <div class="hero-preview">
          <div class="resume-card-placeholder">
            <div class="resume-card-header" />
            <div class="resume-card-line" />
            <div class="resume-card-line short" />
            <div class="resume-card-line" />
            <div class="resume-card-line short" />
            <div class="resume-card-line" />
          </div>
        </div>
      </div>
    </section>

    <!-- How to use -->
    <section class="steps-section">
      <div class="section-inner">
        <h2 class="section-title">如何使用</h2>
        <div class="steps-list">
          <div class="step-item">
            <div class="step-icon">📝</div>
            <div class="step-num">01</div>
            <h3 class="step-name">完善信息</h3>
            <p class="step-desc">填写个人信息、工作经历、教育背景等内容</p>
          </div>
          <div class="step-item">
            <div class="step-icon">📄</div>
            <div class="step-num">02</div>
            <h3 class="step-name">导出简历</h3>
            <p class="step-desc">一键导出 Word 或 PNG，随时下载使用</p>
          </div>
          <div class="step-item">
            <div class="step-icon">🚀</div>
            <div class="step-num">03</div>
            <h3 class="step-name">投递岗位</h3>
            <p class="step-desc">将精美简历发送给意向公司，开启求职之旅</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why choose us -->
    <section class="features-section">
      <div class="section-inner">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="features-grid">
          <a-card class="feature-card">
            <div class="feature-icon">✨</div>
            <h3 class="feature-name">智能生成</h3>
            <p class="feature-desc">AI 辅助优化简历内容，让你的简历更专业</p>
          </a-card>
          <a-card class="feature-card">
            <div class="feature-icon">📦</div>
            <h3 class="feature-name">一键导出 Word/PNG</h3>
            <p class="feature-desc">支持多种格式导出，满足不同投递需求</p>
          </a-card>
          <a-card class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-name">主题自定义</h3>
            <p class="feature-desc">灵活调整主题色与样式，打造个性化简历</p>
          </a-card>
          <a-card class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-name">数据本地存储</h3>
            <p class="feature-desc">所有数据保存在本地，安全可靠，无需担心隐私泄露</p>
          </a-card>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2024 简历生成器. 保留所有权利.</p>
    </footer>
  </div>
</template>

<style lang="less">
@import './style.less';
</style>
