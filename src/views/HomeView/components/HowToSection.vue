<!-- src/views/HomeView/components/HowToSection.vue -->
<script setup lang="ts">
const steps = [
  { num: 1, icon: '📝', title: '填写信息', desc: '填写个人信息与项目经历，完善简历内容' },
  { num: 2, icon: '👁️', title: '实时预览', desc: '所见即所得，即时查看排版效果并调整' },
  { num: 3, icon: '📤', title: '导出简历', desc: '一键导出 Word / PNG 图片，快速投递' },
];
</script>

<template>
  <section class="home-how-to">
    <div class="home-section-inner">
      <h2 class="home-section-title">如何使用</h2>
      <div class="home-steps">
        <div v-for="step in steps" :key="step.num" class="home-step-item">
          <div class="home-step-icon">{{ step.icon }}</div>
          <h3 class="home-step-title">{{ step.num }}. {{ step.title }}</h3>
          <p class="home-step-desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
