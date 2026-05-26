<!-- src/views/HomeView/components/FeaturesSection.vue -->
<script setup lang="ts">
const features = [
  { icon: '⚡', title: '实时预览', desc: '编辑内容同步渲染，排版所见即所得' },
  { icon: '📦', title: '多格式导出', desc: '支持导出为 Word 和 PNG 图片' },
  { icon: '🎨', title: '自定义主题', desc: '自由调整主题颜色，打造个人风格' },
  { icon: '🔒', title: '本地存储', desc: '数据保存在本地，保护隐私安全' },
];
</script>

<template>
  <section class="home-features">
    <div class="home-section-inner">
      <h2 class="home-section-title">为什么选择我们？</h2>
      <div class="home-feature-list">
        <div v-for="item in features" :key="item.title" class="home-feature-item">
          <span class="home-feature-icon">{{ item.icon }}</span>
          <div>
            <h3 class="home-feature-title">{{ item.title }}</h3>
            <p class="home-feature-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
