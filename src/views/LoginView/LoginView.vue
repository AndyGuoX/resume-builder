<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const errorMsg = ref('');

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
};

const formRef = ref();

async function handleSubmit() {
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  loading.value = true;
  errorMsg.value = '';
  try {
    await authStore.login(form.email, form.password);
    router.push('/resume');
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    errorMsg.value = e?.response?.data?.message ?? '邮箱或密码错误';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <span class="logo-icon">🤖</span>
        <span class="logo-text">AI Interview</span>
      </div>
      <h2 class="login-title">欢迎回来</h2>
      <p class="login-subtitle">登录以继续使用简历生成器</p>

      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @finish="handleSubmit">
        <a-form-item name="email" label="邮箱">
          <a-input v-model:value="form.email" placeholder="请输入邮箱" size="large" />
        </a-form-item>
        <a-form-item name="password" label="密码">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            size="large"
            @press-enter="handleSubmit"
          />
        </a-form-item>
        <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="login-error" />
        <a-button
          type="primary"
          html-type="submit"
          block
          size="large"
          :loading="loading"
          class="login-btn"
        >
          登录
        </a-button>
      </a-form>

      <div class="login-hint">测试账号：<code>test@example.com</code> / <code>123456</code></div>
    </div>
  </div>
</template>

<style lang="less" src="./style.less" />
