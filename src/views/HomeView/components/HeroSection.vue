<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function handleResumeClick() {
  if (authStore.isLoggedIn) {
    router.push('/resume');
  } else {
    router.push('/login');
  }
}
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <!-- 左侧文案 -->
      <div class="hero-content">
        <h1 class="hero-title">
          AI生成简历<br />
          模拟面试，拿下心仪<span class="hero-highlight">Offer</span>
        </h1>
        <div class="hero-actions">
          <a-button type="primary" size="large" class="hero-btn-primary" @click="handleResumeClick">
            生成我的简历 &nbsp;›
          </a-button>
          <a-button size="large" class="hero-btn-secondary" disabled>
            开始模拟面试 &nbsp;›
          </a-button>
        </div>
        <div class="hero-social-proof">
          <div class="hero-avatars">
            <span v-for="i in 3" :key="i" class="avatar-dot" />
          </div>
          <span class="hero-count"><strong>10,000+</strong> 人已成功拿到Offer</span>
        </div>
      </div>

      <!-- 右侧产品示意图 -->
      <div class="hero-visual">
        <div class="hero-card resume-card">
          <div class="mock-section-title">个人简历</div>
          <div class="mock-avatar" />
          <div class="mock-line long" />
          <div class="mock-label">教育背景</div>
          <div class="mock-line" />
          <div class="mock-label">工作经历</div>
          <div class="mock-line" />
          <div class="mock-line short" />
          <div class="mock-label">项目经历</div>
          <div class="mock-line" />
          <div class="mock-label">技能特长</div>
          <div class="mock-line short" />
        </div>
        <div class="hero-card chat-card">
          <div class="mock-section-title">模拟面试</div>
          <div class="chat-bubble ai">你准备好开始面试了吗？</div>
          <div class="chat-bubble user">准备好了，请开始吧！</div>
          <div class="chat-bubble ai">请简单介绍一下自己。</div>
          <div class="chat-bubble user">好的，这是我的介绍...</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.hero {
  padding: 120px 40px 80px;
  background: linear-gradient(160deg, #f5f6ff 0%, #eef0ff 60%, #f8f9ff 100%);
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 80px;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.25;
  color: #1a1a2e;
  margin: 0 0 36px;
}

.hero-highlight {
  color: #515ff1;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;

  .hero-btn-primary {
    background: #515ff1;
    border-color: #515ff1;
    border-radius: 8px;
    font-weight: 600;
  }

  .hero-btn-secondary {
    border-radius: 8px;
    color: #515ff1;
    border-color: #d0d4ff;
    background: transparent;
  }
}

.hero-social-proof {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #515ff1;
  font-size: 14px;
  font-weight: 600;
}

.hero-avatars {
  display: flex;
  gap: -4px;

  .avatar-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #c7cbff;
    border: 2px solid #fff;
    display: inline-block;

    &:nth-child(2) {
      background: #a5abff;
      margin-left: -6px;
    }
    &:nth-child(3) {
      background: #8490ff;
      margin-left: -6px;
    }
  }
}

/* 产品示意卡片 */
.hero-visual {
  flex: 0 0 400px;
  position: relative;
  height: 360px;
}

.hero-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(81, 95, 241, 0.1);
  position: absolute;
}

.resume-card {
  width: 200px;
  top: 0;
  left: 0;
}

.chat-card {
  width: 200px;
  bottom: 0;
  right: 0;
  top: 80px;
}

.mock-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.mock-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e8eaff;
  margin-bottom: 10px;
}

.mock-label {
  font-size: 10px;
  color: #888;
  margin: 8px 0 4px;
}

.mock-line {
  height: 6px;
  border-radius: 3px;
  background: #e8eaff;
  margin: 4px 0;

  &.long {
    width: 100%;
  }
  &.short {
    width: 60%;
  }
  &:not(.long):not(.short) {
    width: 85%;
  }
}

.chat-bubble {
  font-size: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  margin-bottom: 6px;
  max-width: 85%;

  &.ai {
    background: #f0f2ff;
    color: #333;
    align-self: flex-start;
  }

  &.user {
    background: #515ff1;
    color: #fff;
    margin-left: auto;
    text-align: right;
  }
}
</style>
