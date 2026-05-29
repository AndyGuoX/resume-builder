<script setup lang="ts">
import './style.less';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="interview-page">
    <div class="interview-inner">
      <h1 class="interview-title">模拟面试 - 即将上线</h1>
      <p class="interview-subtitle">我们正在努力开发中，敬请期待</p>
      <a-button type="primary" size="large" @click="() => router.push('/')">返回首页</a-button>
    </div>
  </div>
</template>

<style lang="less">
@import './style.less';
</style>
