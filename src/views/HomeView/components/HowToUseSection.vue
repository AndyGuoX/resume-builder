<template>
  <section class="how-to">
    <div class="how-to-inner">
      <h2 class="how-to-title">如何使用</h2>
      <div class="how-to-divider" />
      <div class="how-to-steps">
        <div v-for="step in steps" :key="step.num" class="step-item">
          <div class="step-icon">{{ step.icon }}</div>
          <div v-if="step.num < 3" class="step-connector" />
          <h3 class="step-title">{{ step.num }}. {{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    num: 1,
    icon: '📄',
    title: '完善信息，生成简历',
    desc: '填写个人信息与经历，\nAI智能生成专业简历，\n一键导出，快速投递。',
  },
  {
    num: 2,
    icon: '💬',
    title: '选择岗位，模拟面试',
    desc: '选择目标岗位与面试场景，\nAI模拟真实面试官提问，\n沉浸式练习，提升表达力。',
  },
  {
    num: 3,
    icon: '✅',
    title: '获取反馈，提升自己',
    desc: 'AI即时点评你的回答，\n指出亮点与改进建议，\n持续优化，增强面试竞争力。',
  },
];
</script>

<style lang="less" scoped>
.how-to {
  padding: 80px 40px;
  background: #fff;
}

.how-to-inner {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.how-to-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px;
}

.how-to-divider {
  width: 40px;
  height: 3px;
  background: #515ff1;
  margin: 0 auto 56px;
  border-radius: 2px;
}

.how-to-steps {
  display: flex;
  justify-content: center;
  gap: 0;
  align-items: flex-start;
  position: relative;
}

.step-item {
  flex: 1;
  max-width: 260px;
  position: relative;
  padding: 0 24px;
}

.step-icon {
  width: 72px;
  height: 72px;
  background: #f0f2ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
}

.step-connector {
  position: absolute;
  top: 36px;
  right: -20%;
  width: 40%;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    #c7cbff 0,
    #c7cbff 6px,
    transparent 6px,
    transparent 12px
  );
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 12px;
}

.step-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  white-space: pre-line;
  margin: 0;
}
</style>
