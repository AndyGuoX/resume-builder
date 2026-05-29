<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

async function handleLogin() {
  errorMsg.value = '';
  if (!username.value || !password.value) {
    errorMsg.value = '用户名和密码不能为空';
    return;
  }
  loading.value = true;
  const ok = authStore.login(username.value, password.value);
  loading.value = false;
  if (ok) {
    router.push('/resume');
  } else {
    errorMsg.value = '用户名或密码错误';
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">欢迎登录</h2>
      <p class="login-sub">简历生成器</p>

      <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="login-alert" />

      <a-form layout="vertical" @finish="handleLogin">
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="username"
            placeholder="请输入用户名"
            size="large"
            autocomplete="username"
          />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="password"
            placeholder="请输入密码"
            size="large"
            autocomplete="current-password"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          class="login-btn"
          :loading="loading"
        >
          登录
        </a-button>
      </a-form>

      <div class="login-back">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import './style.less';
</style>
