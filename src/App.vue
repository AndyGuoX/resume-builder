<script setup lang="ts">
import { theme } from 'ant-design-vue';

// 全局主题配置：使用自定义品牌色 #515FF1
const themeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#515FF1',
    colorLink: '#515FF1',
  },
};
</script>

<template>
  <!-- a-config-provider 统一注入 ant-design-vue 和 ant-design-x-vue 主题 -->
  <a-config-provider :theme="themeConfig">
    <RouterView />
  </a-config-provider>
</template>
