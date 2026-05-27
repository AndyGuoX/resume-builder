<template>
  <section class="why">
    <div class="why-inner">
      <!-- 左：特点列表 -->
      <div class="why-features">
        <h2 class="why-title">为什么选择AI Interview?</h2>
        <div v-for="f in features" :key="f.title" class="feature-item">
          <div class="feature-icon">{{ f.icon }}</div>
          <div>
            <div class="feature-title">{{ f.title }}</div>
            <div class="feature-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 右：面试表现分析卡片 -->
      <div class="why-card">
        <div class="card-title">面试表现分析</div>
        <div class="card-body">
          <div class="card-score-wrap">
            <div class="card-score-circle">
              <div class="score-num">85</div>
              <div class="score-label">综合评分</div>
            </div>
          </div>
          <div class="radar-wrap">
            <svg viewBox="0 0 200 200" class="radar-svg">
              <!-- 背景网格 -->
              <polygon
                points="100,20 180,75 155,165 45,165 20,75"
                fill="none"
                stroke="#e8eaff"
                stroke-width="1.5"
              />
              <polygon
                points="100,45 157,85 138,147 62,147 43,85"
                fill="none"
                stroke="#e8eaff"
                stroke-width="1"
              />
              <polygon
                points="100,70 134,95 121,129 79,129 66,95"
                fill="none"
                stroke="#e8eaff"
                stroke-width="1"
              />
              <!-- 轴线 -->
              <line x1="100" y1="100" x2="100" y2="20" stroke="#e8eaff" stroke-width="1" />
              <line x1="100" y1="100" x2="180" y2="75" stroke="#e8eaff" stroke-width="1" />
              <line x1="100" y1="100" x2="155" y2="165" stroke="#e8eaff" stroke-width="1" />
              <line x1="100" y1="100" x2="45" y2="165" stroke="#e8eaff" stroke-width="1" />
              <line x1="100" y1="100" x2="20" y2="75" stroke="#e8eaff" stroke-width="1" />
              <!-- 数据区域 -->
              <polygon
                points="100,32 168,79 148,155 52,155 32,79"
                fill="rgba(81,95,241,0.15)"
                stroke="#515ff1"
                stroke-width="2"
              />
              <!-- 标签 -->
              <text x="100" y="14" text-anchor="middle" font-size="10" fill="#666">表达能力</text>
              <text x="190" y="73" text-anchor="start" font-size="10" fill="#666">逻辑能力</text>
              <text x="162" y="178" text-anchor="middle" font-size="10" fill="#666">自信力</text>
              <text x="38" y="178" text-anchor="middle" font-size="10" fill="#666">应变能力</text>
              <text x="10" y="73" text-anchor="end" font-size="10" fill="#666">个人素养</text>
            </svg>
          </div>
        </div>
        <div class="analysis-row">
          <div class="analysis-col">
            <div class="analysis-col-title">亮点分析</div>
            <div v-for="i in 3" :key="i" class="analysis-item positive">{{ positives[i - 1] }}</div>
          </div>
          <div class="analysis-col">
            <div class="analysis-col-title">改进建议</div>
            <div v-for="i in 3" :key="i" class="analysis-item negative">{{ negatives[i - 1] }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { icon: '📋', title: '智能生成简历', desc: '根据你的经历，自动优化内容与排版，突出亮点' },
  { icon: '🎭', title: '真实场景模拟', desc: '覆盖多种岗位与行业，AI面试官深度还原面试体验' },
  { icon: '💡', title: '个性化反馈', desc: '针对你的回答给出专业建议，帮助你持续进步' },
  { icon: '🔒', title: '隐私安全保障', desc: '数据加密存储，仅你可见，保护你的隐私安全' },
];

const positives = ['表达清晰，逻辑层次分明', '对行业理解较为深入', '有具体数据支撑的项目经历'];
const negatives = ['可进一步突出核心竞争力', '部分问题回答可更简洁', '建议补充更多跨部门协作案例'];
</script>

<style lang="less" scoped>
.why {
  padding: 80px 40px;
  background: #f8f9ff;
}

.why-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
  align-items: flex-start;
}

.why-features {
  flex: 1;
}

.why-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 36px;
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.feature-icon {
  width: 44px;
  height: 44px;
  background: #eef0ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* 分析卡片 */
.why-card {
  flex: 0 0 420px;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(81, 95, 241, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.card-body {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.card-score-wrap {
  flex-shrink: 0;
}

.card-score-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 6px solid #515ff1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-num {
  font-size: 28px;
  font-weight: 800;
  color: #515ff1;
  line-height: 1;
}

.score-label {
  font-size: 10px;
  color: #888;
}

.radar-wrap {
  flex: 1;
}

.radar-svg {
  width: 100%;
  height: auto;
}

.analysis-row {
  display: flex;
  gap: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.analysis-col {
  flex: 1;
}

.analysis-col-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.analysis-item {
  font-size: 11px;
  color: #555;
  padding: 3px 0 3px 12px;
  position: relative;
  line-height: 1.5;

  &::before {
    content: '●';
    position: absolute;
    left: 0;
    font-size: 8px;
    top: 4px;
  }

  &.positive::before {
    color: #515ff1;
  }
  &.negative::before {
    color: #ff7875;
  }
}
</style>
