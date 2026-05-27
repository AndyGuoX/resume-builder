## Context

当前项目是纯前端 Vue 3 简历编辑器，无用户体系，所有数据存储于 localStorage。计划新增品牌落地页和邮箱/密码登录功能，为后续后端对接预留接口层，当前阶段以 mock 实现。

现有技术栈：Vue 3 + TypeScript + Vite + Pinia + Vue Router + Ant Design Vue。

## Goals / Non-Goals

**Goals:**

- 新增 `/` 首页（落地页），完全还原设计图，无需登录
- 新增 `/login` 登录页，邮箱 + 密码表单
- 所有 `/resume` 等功能路由加路由守卫，未登录跳 `/login`
- 已登录访问 `/login` 自动跳 `/resume`
- 封装 axios 请求层，支持 token 自动注入
- mock 阶段：登录接口本地 mock，固定账号可登录；token 存 localStorage
- Auth 状态由 `useAuthStore` 管理，全局可用

**Non-Goals:**

- 注册功能（本期不做）
- 第三方 OAuth（本期不做）
- 后端真实 API（mock 先行，接口签名保持兼容）
- 简历数据云端持久化

## Decisions

### 1. mock 模式：函数级 mock，非 MSW

**决策**：`src/api/mock/auth.mock.ts` 与 `src/api/auth.ts` 保持相同函数签名，通过环境变量 `VITE_USE_MOCK=true` 在 `src/api/index.ts` 中切换导入。

**备选方案**：MSW（Mock Service Worker）——拦截真实 HTTP 请求，迁移零改动，但引入额外复杂度，当前阶段不值得。

**理由**：函数级 mock 配置最简，切换为真实 API 只需改一个导入或关闭环境变量，改动范围可控。

### 2. token 存储：localStorage

**决策**：登录成功后将 JWT token 存入 `localStorage('auth-token')`，刷新页面后 `useAuthStore` 初始化时读取并尝试 `getMe` 验证有效性。

**备选方案**：sessionStorage（关标签即失效，体验差）；内存（刷新丢失）。

**理由**：与现有简历数据的存储方式一致，实现最简，后续迁移 httpOnly cookie 时替换 store 层即可。

### 3. 路由守卫：全局 beforeEach

**决策**：在 `router/index.ts` 注册全局 `beforeEach`，白名单为 `['/','  /login']`，其余路由均要求 `authStore.isLoggedIn`。

**理由**：集中管理，新增功能路由无需每个单独配置 meta。

### 4. 首页不抽取独立组件库

**决策**：`HomeView` 内部按区块划分子组件（`HeroSection`、`HowToUseSection` 等），但不提取到 `src/components` 公共目录，因为这些组件仅首页使用。

**理由**：避免过度工程化，保持首页自包含。

## Risks / Trade-offs

- **mock token 无过期校验** → 可接受，上线前换真实后端时一并解决
- **localStorage XSS 风险** → 当前为 mock 阶段，生产环境切换后端时应改为 httpOnly cookie
- **首页静态内容硬编码** → 设计图文案固定，无 CMS；后续如需运营配置，需单独做
- **无刷新 token 机制** → mock 阶段不需要；接入真实后端后补充 axios 响应拦截器处理 401

## Migration Plan

1. 安装 `axios`
2. 创建请求层 + mock
3. 创建 `useAuthStore`
4. 创建 `LoginView`
5. 创建 `HomeView`（按设计图区块逐一实现）
6. 更新 `router/index.ts`（新路由 + 守卫）
7. 本地验证登录流程和路由守卫
8. 后续：替换 mock 为真实后端接口，调整 token 存储策略

## Open Questions

- 无（设计图已明确，技术选型已定）
