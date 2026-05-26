<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';
import './style.less';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formRef = ref();
const formState = reactive({ phone: '', password: '' });
const loading = ref(false);
const errorMsg = ref('');

const rules = {
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1\d{10}$/, message: '请输入11位有效手机号' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6位' },
  ],
};

async function handleSubmit() {
  errorMsg.value = '';
  loading.value = true;
  try {
    await authStore.login(formState);
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/resume';
    router.push(redirect);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      errorMsg.value = (err as { message: string }).message;
    } else {
      errorMsg.value = '登录失败，请稍后重试';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-brand">
        <span class="brand-icon">📄</span>
        <span>简历制作</span>
      </div>
      <h2 class="login-slogan">在线制作专业简历<br />一键导出，快速投递</h2>
    </div>
    <div class="login-right">
      <div class="login-card">
        <h2 class="login-card-title">登录</h2>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          layout="vertical"
          @finish="handleSubmit"
        >
          <a-form-item name="phone" label="手机号">
            <a-input
              v-model:value="formState.phone"
              placeholder="请输入手机号"
              type="tel"
              size="large"
              autocomplete="tel"
            />
          </a-form-item>
          <a-form-item name="password" label="密码">
            <a-input-password
              v-model:value="formState.password"
              placeholder="请输入密码（至少6位）"
              size="large"
              autocomplete="current-password"
            />
          </a-form-item>
          <div class="login-error">{{ errorMsg }}</div>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" size="large" block>
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
