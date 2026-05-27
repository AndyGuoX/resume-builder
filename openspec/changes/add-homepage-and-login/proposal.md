## Why

当前应用直接进入简历编辑器，缺乏产品落地页与用户身份体系。为支持后续多用户云端数据、运营推广等需求，需要先建立首页入口和登录机制。

## What Changes

- 新增首页（落地页），对外展示产品功能，无需登录即可访问
- 新增独立登录页，使用邮箱 + 密码认证
- 所有功能页面（简历编辑器等）均需登录后才能访问
- 新增 HTTP 请求层（axios），以 mock 模式先行，为后端对接预留接口
- 新增全局 Auth 状态管理（Pinia store）
- 更新路由配置，加入路由守卫

## Capabilities

### New Capabilities

- `homepage`: 产品落地页，展示品牌标语、使用步骤、产品优势及页脚，无需登录
- `user-auth`: 用户身份认证，包含邮箱/密码登录、token 持久化、路由守卫、登出

### Modified Capabilities

<!-- 无现有 spec 需修改 -->

## Impact

- **新增依赖**：`axios`
- **新增文件**：`src/api/request.ts`、`src/api/auth.ts`、`src/api/mock/auth.mock.ts`、`src/stores/useAuthStore.ts`、`src/views/HomeView/`、`src/views/LoginView/`、`src/components/NavBar/`
- **修改文件**：`src/router/index.ts`（新路由 + 路由守卫）
- **无 breaking change**：现有简历编辑功能逻辑不变，仅在前置加入登录校验
