# 首页与登录功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增公开首页（落地页）、登录页和用户鉴权系统，将简历编辑器保护在登录墙后。

**Architecture:** 路由层新增 `/`（HomeView）和 `/login`（LoginView），原 `/` 迁移至 `/resume` 并加 `meta.requiresAuth`。全局路由守卫负责拦截未登录访问。Auth 状态由 `useAuthStore`（Pinia）管理，token 持久化到 localStorage。API 层当前指向 mock 实现，后续只需改 `src/api/auth.ts` 的导入来源即可切换真实后端。

**Tech Stack:** Vue 3 (Composition API)、Vue Router 4、Pinia、Ant Design Vue 4、UnoCSS、Vitest

**Spec:** `docs/superpowers/specs/2026-05-26-homepage-login-design.md`

---

## 文件清单

| 状态 | 路径                                                | 说明                                   |
| ---- | --------------------------------------------------- | -------------------------------------- |
| 新建 | `src/types/auth.ts`                                 | User / LoginParams / AuthResponse 类型 |
| 新建 | `src/api/_mock/auth.ts`                             | Mock 登录实现                          |
| 新建 | `src/api/auth.ts`                                   | API 函数（当前指向 mock）              |
| 新建 | `src/stores/useAuthStore.ts`                        | 登录态 Pinia store                     |
| 新建 | `src/tests/authMock.test.ts`                        | mock API 单元测试                      |
| 新建 | `src/tests/useAuthStore.test.ts`                    | auth store 单元测试                    |
| 改动 | `src/router/index.ts`                               | 新增路由 + 全局守卫                    |
| 新建 | `src/views/LoginView/LoginView.vue`                 | 登录页                                 |
| 新建 | `src/views/LoginView/style.less`                    | 登录页样式                             |
| 新建 | `src/views/HomeView/HomeView.vue`                   | 首页入口                               |
| 新建 | `src/views/HomeView/style.less`                     | 首页全局样式                           |
| 新建 | `src/views/HomeView/components/NavBar.vue`          | 顶部导航                               |
| 新建 | `src/views/HomeView/components/HeroSection.vue`     | 主视觉区                               |
| 新建 | `src/views/HomeView/components/HowToSection.vue`    | 使用步骤                               |
| 新建 | `src/views/HomeView/components/FeaturesSection.vue` | 产品特性                               |
| 新建 | `src/views/HomeView/components/FooterSection.vue`   | 页脚                                   |

---

## Task 1: Auth 类型定义

**Files:**

- Create: `src/types/auth.ts`

- [ ] **Step 1: 创建类型文件**

```ts
// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/auth.ts
git commit -m "feat(auth): add auth types"
```

---

## Task 2: Mock API 与 API 层

**Files:**

- Create: `src/api/_mock/auth.ts`
- Create: `src/api/auth.ts`
- Create: `src/tests/authMock.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
// src/tests/authMock.test.ts
import { describe, expect, it } from 'vitest';
import { mockLogin } from '../api/_mock/auth';

describe('mockLogin', () => {
  it('正确账号密码返回 token 和用户信息', async () => {
    const result = await mockLogin({ phone: '18800000000', password: '123456' });
    expect(result.token).toBeTruthy();
    expect(result.user.phone).toBe('18800000000');
    expect(result.user.name).toBe('测试用户');
  });

  it('错误密码抛出 401 错误', async () => {
    await expect(mockLogin({ phone: '18800000000', password: 'wrong' })).rejects.toMatchObject({
      code: 401,
      message: '手机号或密码错误',
    });
  });

  it('不存在的手机号抛出 401 错误', async () => {
    await expect(mockLogin({ phone: '13900000000', password: '123456' })).rejects.toMatchObject({
      code: 401,
      message: '手机号或密码错误',
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
pnpm test
```

预期：FAIL，提示 `Cannot find module '../api/_mock/auth'`

- [ ] **Step 3: 实现 mock API**

```ts
// src/api/_mock/auth.ts
import type { AuthResponse, LoginParams } from '../../types/auth';

const MOCK_ACCOUNT = { phone: '18800000000', password: '123456' };
const MOCK_TOKEN = 'mock-token-abcdef123456';
const MOCK_USER = { id: '1', name: '测试用户', phone: '18800000000' };

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(params: LoginParams): Promise<AuthResponse> {
  await delay(300);
  if (params.phone === MOCK_ACCOUNT.phone && params.password === MOCK_ACCOUNT.password) {
    return { token: MOCK_TOKEN, user: { ...MOCK_USER } };
  }
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw { code: 401, message: '手机号或密码错误' };
}

export async function mockLogout(): Promise<void> {
  await delay(100);
}
```

- [ ] **Step 4: 创建 API 层（指向 mock）**

```ts
// src/api/auth.ts
import type { AuthResponse, LoginParams } from '../types/auth';
import { mockLogin, mockLogout } from './_mock/auth';

export function login(params: LoginParams): Promise<AuthResponse> {
  return mockLogin(params);
}

export function logout(): Promise<void> {
  return mockLogout();
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
pnpm test
```

预期：所有 `mockLogin` 测试 PASS

- [ ] **Step 6: Commit**

```bash
git add src/api/ src/tests/authMock.test.ts
git commit -m "feat(auth): add mock API and API layer"
```

---

## Task 3: Auth Store

**Files:**

- Create: `src/stores/useAuthStore.ts`
- Create: `src/tests/useAuthStore.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
// src/tests/useAuthStore.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../stores/useAuthStore';

// mock api/auth 模块
vi.mock('../api/auth', () => ({
  login: vi.fn(async ({ phone, password }: { phone: string; password: string }) => {
    if (phone === '18800000000' && password === '123456') {
      return { token: 'mock-token', user: { id: '1', name: '测试用户', phone: '18800000000' } };
    }
    throw { code: 401, message: '手机号或密码错误' };
  }),
  logout: vi.fn(async () => {}),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('初始状态：未登录', () => {
    const store = useAuthStore();
    expect(store.isLoggedIn).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
  });

  it('登录成功后 isLoggedIn 为 true，token 和 user 被写入', async () => {
    const store = useAuthStore();
    await store.login({ phone: '18800000000', password: '123456' });
    expect(store.isLoggedIn).toBe(true);
    expect(store.token).toBe('mock-token');
    expect(store.user?.phone).toBe('18800000000');
  });

  it('登录成功后 token 持久化到 localStorage', async () => {
    const store = useAuthStore();
    await store.login({ phone: '18800000000', password: '123456' });
    expect(localStorage.getItem('resume-builder-auth-token')).toBe('mock-token');
  });

  it('登录失败时抛出错误，状态不变', async () => {
    const store = useAuthStore();
    await expect(store.login({ phone: '18800000000', password: 'wrong' })).rejects.toMatchObject({
      code: 401,
    });
    expect(store.isLoggedIn).toBe(false);
  });

  it('logout 后清空状态和 localStorage', async () => {
    const store = useAuthStore();
    await store.login({ phone: '18800000000', password: '123456' });
    store.logout();
    expect(store.isLoggedIn).toBe(false);
    expect(store.token).toBeNull();
    expect(localStorage.getItem('resume-builder-auth-token')).toBeNull();
  });

  it('从 localStorage 恢复登录状态', () => {
    localStorage.setItem('resume-builder-auth-token', 'saved-token');
    localStorage.setItem(
      'resume-builder-auth-user',
      JSON.stringify({ id: '1', name: '测试用户', phone: '18800000000' }),
    );
    const store = useAuthStore();
    expect(store.isLoggedIn).toBe(true);
    expect(store.token).toBe('saved-token');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
pnpm test
```

预期：FAIL，提示 `Cannot find module '../stores/useAuthStore'`

- [ ] **Step 3: 实现 Auth Store**

```ts
// src/stores/useAuthStore.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import type { LoginParams, User } from '../types/auth';

const TOKEN_KEY = 'resume-builder-auth-token';
const USER_KEY = 'resume-builder-auth-user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'));

  const isLoggedIn = computed(() => token.value !== null);

  async function login(params: LoginParams): Promise<void> {
    const res = await apiLogin(params);
    token.value = res.token;
    user.value = res.user;
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token, user, isLoggedIn, login, logout };
});
```

- [ ] **Step 4: 运行测试确认通过**

```bash
pnpm test
```

预期：所有 `useAuthStore` 测试 PASS

- [ ] **Step 5: Commit**

```bash
git add src/stores/useAuthStore.ts src/tests/useAuthStore.test.ts
git commit -m "feat(auth): add useAuthStore with localStorage persistence"
```

---

## Task 4: 路由改造

**Files:**

- Modify: `src/router/index.ts`（全量替换）

- [ ] **Step 1: 替换路由文件**

```ts
// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import ResumeView from '../views/ResumeView/ResumeView.vue';
import HomeView from '../views/HomeView/HomeView.vue';
import LoginView from '../views/LoginView/LoginView.vue';
import { useAuthStore } from '../stores/useAuthStore';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/resume',
      component: ResumeView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  if (to.path === '/login' && authStore.isLoggedIn) {
    return { path: '/resume' };
  }
});

export default router;
```

> **注意：** `HomeView` 和 `LoginView` 尚未创建，此时 TypeScript 会有导入错误，Task 5/8 完成后消除。路由守卫需要在 Pinia 实例激活后执行，`main.ts` 已在 `app.use(router)` 前调用 `app.use(pinia)`，顺序正确，无需改动。

- [ ] **Step 2: 验证现有测试不受影响**

```bash
pnpm test
```

预期：所有已有测试继续 PASS

- [ ] **Step 3: Commit**

```bash
git add src/router/index.ts
git commit -m "feat(router): add home/login routes and auth guard"
```

---

## Task 5: 登录页

**Files:**

- Create: `src/views/LoginView/LoginView.vue`
- Create: `src/views/LoginView/style.less`

- [ ] **Step 1: 创建登录页样式**

```less
// src/views/LoginView/style.less
.login-page {
  display: flex;
  min-height: 100vh;
  background: #f5f6ff;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(135deg, #515ff1 0%, #818cf8 100%);
  color: #fff;

  @media (max-width: 768px) {
    display: none;
  }
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
  font-size: 22px;
  font-weight: 700;

  .brand-icon {
    font-size: 28px;
  }
}

.login-slogan {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  line-height: 1.6;
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 480px;
  padding: 40px;
  background: #fff;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.login-card {
  width: 100%;
  max-width: 360px;
}

.login-card-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1a1a1a;
}

.login-error {
  color: #ff4d4f;
  font-size: 14px;
  margin-bottom: 12px;
  min-height: 22px;
}
```

- [ ] **Step 2: 创建登录页组件**

```vue
<!-- src/views/LoginView/LoginView.vue -->
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
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/resume';
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
```

- [ ] **Step 3: 手动测试登录流程**

启动开发服务器：

```bash
pnpm dev
```

验证以下场景：

1. 直接访问 `/#/resume` → 应跳转 `/#/login?redirect=%2Fresume`
2. 输入错误密码（如 `18800000000` / `wrong`）→ 显示"手机号或密码错误"
3. 输入空手机号提交 → 前端校验错误提示
4. 输入正确账号（`18800000000` / `123456`）→ 跳转 `/#/resume`
5. 已登录状态访问 `/#/login` → 自动跳转 `/#/resume`

- [ ] **Step 4: Commit**

```bash
git add src/views/LoginView/
git commit -m "feat(login): add login page with form validation"
```

---

## Task 6: 首页子组件

**Files:**

- Create: `src/views/HomeView/components/NavBar.vue`
- Create: `src/views/HomeView/components/HeroSection.vue`
- Create: `src/views/HomeView/components/HowToSection.vue`
- Create: `src/views/HomeView/components/FeaturesSection.vue`
- Create: `src/views/HomeView/components/FooterSection.vue`

- [ ] **Step 1: 创建 NavBar**

```vue
<!-- src/views/HomeView/components/NavBar.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<template>
  <nav class="home-navbar">
    <div class="home-navbar-inner">
      <a href="/#/" class="home-nav-brand">
        <span class="home-brand-icon">📄</span>
        <span class="home-brand-name">简历制作</span>
      </a>
      <div class="home-nav-actions">
        <template v-if="authStore.isLoggedIn">
          <span class="home-nav-username">{{ authStore.user?.name }}</span>
          <a-button @click="handleLogout">退出登录</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="router.push('/login')">登录</a-button>
        </template>
      </div>
    </div>
  </nav>
</template>
```

- [ ] **Step 2: 创建 HeroSection**

```vue
<!-- src/views/HomeView/components/HeroSection.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

function handleStart() {
  router.push(authStore.isLoggedIn ? '/resume' : '/login');
}

function handleExample() {
  router.push('/resume');
}
</script>

<template>
  <section class="home-hero">
    <div class="home-section-inner">
      <h1 class="home-hero-title">在线制作专业简历</h1>
      <p class="home-hero-subtitle">填写信息，智能排版，一键导出，快速投递</p>
      <div class="home-hero-actions">
        <a-button type="primary" size="large" @click="handleStart">开始制作 →</a-button>
        <a-button size="large" @click="handleExample">查看示例 →</a-button>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: 创建 HowToSection**

```vue
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
```

- [ ] **Step 4: 创建 FeaturesSection**

```vue
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
```

- [ ] **Step 5: 创建 FooterSection**

```vue
<!-- src/views/HomeView/components/FooterSection.vue -->
<template>
  <footer class="home-footer">
    <p>© 2026 简历制作. All rights reserved.</p>
  </footer>
</template>
```

- [ ] **Step 6: Commit**

```bash
git add src/views/HomeView/components/
git commit -m "feat(home): add home page sub-components"
```

---

## Task 7: 首页入口与样式

**Files:**

- Create: `src/views/HomeView/HomeView.vue`
- Create: `src/views/HomeView/style.less`

- [ ] **Step 1: 创建首页样式**

```less
// src/views/HomeView/style.less
.home-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.home-navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 700;
}

.home-brand-icon {
  font-size: 22px;
}

.home-nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-nav-username {
  color: #666;
  font-size: 14px;
}

// 公共 section 布局
.home-section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
}

.home-section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 48px;
}

// Hero
.home-hero {
  background: linear-gradient(160deg, #f5f6ff 0%, #eef0ff 100%);
  text-align: center;
}

.home-hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.home-hero-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.home-hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

// How To
.home-how-to {
  background: #fff;
}

.home-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.home-step-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.home-step-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.home-step-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

// Features
.home-features {
  background: #f5f6ff;
}

.home-feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.home-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.home-feature-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.home-feature-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.home-feature-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

// Footer
.home-footer {
  background: #1a1a1a;
  color: #999;
  text-align: center;
  padding: 32px 24px;
  font-size: 14px;
}
```

- [ ] **Step 2: 创建首页入口组件**

```vue
<!-- src/views/HomeView/HomeView.vue -->
<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import HowToSection from './components/HowToSection.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import FooterSection from './components/FooterSection.vue';
import './style.less';
</script>

<template>
  <div>
    <NavBar />
    <HeroSection />
    <HowToSection />
    <FeaturesSection />
    <FooterSection />
  </div>
</template>
```

- [ ] **Step 3: 运行所有测试**

```bash
pnpm test
```

预期：全部 PASS

- [ ] **Step 4: 手动完整验证**

启动开发服务器：

```bash
pnpm dev
```

验证以下场景：

1. 访问 `/#/` → 显示首页（导航栏、Hero、步骤、特性、页脚）
2. 未登录状态，导航栏显示"登录"按钮
3. 点击"开始制作"→ 跳转 `/#/login`
4. 登录成功后回到首页 → 导航栏显示用户名 + 退出登录按钮
5. 点击退出登录 → 回到首页，导航栏恢复"登录"按钮
6. 刷新页面 → 登录状态保持（从 localStorage 恢复）

- [ ] **Step 5: Commit**

```bash
git add src/views/HomeView/
git commit -m "feat(home): add home page with all sections and styles"
```

---

## 完成检查

- [ ] `pnpm test` 全部通过
- [ ] `pnpm build` 无报错（`pnpm build` 包含 TypeScript 类型检查）
- [ ] 手动验证 Task 5 Step 3 和 Task 7 Step 4 中的所有场景
