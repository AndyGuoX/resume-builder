## 1. 依赖与基础配置

- [x] 1.1 安装 axios 依赖（`pnpm add axios`）
- [x] 1.2 创建 `src/api/request.ts`：axios 实例，配置 baseURL（读 `VITE_API_BASE_URL`），请求拦截器自动附带 localStorage token，响应拦截器处理 401
- [x] 1.3 创建 `src/api/auth.ts`：定义 `login(email, password)` 和 `getMe()` 接口函数（调用真实 axios）
- [x] 1.4 创建 `src/api/mock/auth.mock.ts`：与 `auth.ts` 相同签名的 mock 实现，固定账号 `test@example.com` / `123456` 可登录，返回模拟 token 和用户信息
- [x] 1.5 创建 `src/api/index.ts`：根据 `import.meta.env.VITE_USE_MOCK` 导出真实或 mock 的 auth API

## 2. Auth 状态管理

- [x] 2.1 创建 `src/stores/useAuthStore.ts`：定义 `user`、`token`、`isLoggedIn`，实现 `login()`、`logout()`、`initAuth()`（读 localStorage 初始化）
- [x] 2.2 在 `src/main.ts` 应用启动时调用 `authStore.initAuth()`

## 3. 路由更新

- [ ] 3.1 在 `src/router/index.ts` 新增 `/login` → `LoginView` 和 `/resume` → `ResumeView` 路由，原 `/` 改为 `HomeView`
- [x] 3.2 添加全局 `beforeEach` 路由守卫：白名单 `['/','  /login']`，其余需登录；已登录访问 `/login` 跳 `/resume`

## 4. 登录页

- [x] 4.1 创建 `src/views/LoginView/LoginView.vue`：邮箱 + 密码表单，使用 Ant Design Vue Form 组件，含邮箱格式校验和密码非空校验
- [x] 4.2 创建 `src/views/LoginView/style.less`：登录页样式（居中卡片布局）
- [x] 4.3 接入 `useAuthStore.login()`，成功后跳转 `/resume`，失败显示错误提示

## 5. 首页 — NavBar

- [x] 5.1 创建 `src/views/HomeView/components/NavBar.vue`：Logo + 右侧"登录"按钮，点击跳转 `/login`

## 6. 首页 — Hero 区块

- [x] 6.1 创建 `src/views/HomeView/components/HeroSection.vue`：主标语、两个 CTA 按钮（"生成我的简历"根据登录状态跳不同路由）、用户数统计文案、产品截图示意

## 7. 首页 — 使用步骤区块

- [x] 7.1 创建 `src/views/HomeView/components/HowToUseSection.vue`：三步骤图标 + 说明文案，还原设计图布局

## 8. 首页 — 产品特点区块

- [x] 8.1 创建 `src/views/HomeView/components/WhyChooseSection.vue`：四项特点列表 + 面试表现分析卡片（含雷达图区域），还原设计图

## 9. 首页 — 页脚

- [x] 9.1 创建 `src/views/HomeView/components/FooterSection.vue`：Logo、导航链接、联系方式、版权文字

## 10. 首页组合与样式

- [x] 10.1 创建 `src/views/HomeView/HomeView.vue`：组合所有子组件
- [x] 10.2 创建 `src/views/HomeView/style.less`：首页整体样式，主色 `#515FF1`，背景浅蓝灰
