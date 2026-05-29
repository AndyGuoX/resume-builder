# 新增首页与登录功能

## Goal

为简历生成器项目新增一个营销首页（Landing Page）和登录功能，提升产品形象，并在进入编辑器前进行身份验证。

## What I already know

- 项目：Vue 3 + TypeScript + Pinia + Vite + Ant Design Vue（主色 `#515FF1`）
- 路由：`vue-router`，Hash 模式，当前只有 `/` → `ResumeView`
- 状态管理：Pinia，已有 `useResumeStore`
- 无后端 → 登录采用纯前端 mock（用户名/密码硬编码或 localStorage 存储）
- 用户提供了 AI Interview 产品截图作为首页设计风格参考

## Assumptions (temporary)

- 登录后才能进入简历编辑器（路由守卫）
- 不需要注册功能（只有登录）
- 首页风格参考附图，内容调整为简历生成器的主题

## Open Questions

（无）

## Requirements

- 新增 `/` 首页（Landing Page），包含以下区块：
  1. **导航栏**：Logo（"简历生成器"）+ 右侧登录按钮
  2. **Hero 区**：大标题 + 副标题 + "生成我的简历"CTA 按钮 + 右侧简历示意图（用卡片占位）
  3. **如何使用**：3 步流程（完善信息 → 导出简历 → 投递岗位），含图标、步骤编号
  4. **产品优势**：4 个特性卡片（智能生成、一键导出 Word/PNG、主题自定义、数据本地存储）
  5. **Footer**：版权信息
- 新增 `/login` 登录页，表单含用户名 + 密码，mock 账号：`admin` / `123456`
- 简历编辑器迁移到 `/resume` 路由
- 登录状态：`useAuthStore`（Pinia）+ localStorage 持久化
- 登录成功跳转到 `/resume`
- 路由守卫：未登录访问 `/resume` 自动跳转到 `/login`
- 整体风格：品牌色 `#515FF1`，参考提供的 AI Interview 截图

## Acceptance Criteria

- [ ] 访问 `/` 显示首页，含导航栏、Hero、如何使用、产品优势、Footer
- [ ] 未登录时点击"生成我的简历"或导航栏"登录"按钮，跳转到 `/login`
- [ ] 已登录时点击"生成我的简历"直接跳转到 `/resume`
- [ ] `/login` 登录表单验证：字段不能为空，账号错误时显示错误提示
- [ ] mock 账号 `admin` / `123456` 登录成功跳转 `/resume`
- [ ] 未登录直接访问 `/resume` 自动跳转到 `/login`
- [ ] 刷新页面后登录状态保持（localStorage）
- [ ] 导航栏登录后显示"退出"按钮，点击退出清除状态并跳回首页

## Definition of Done

- Lint / typecheck 通过
- 首页、登录页、编辑器页面正常切换

## Out of Scope

- 真实后端 API 对接
- 注册功能
- 忘记密码

## Technical Notes

- 路由文件：`src/router/index.ts`
- 新增 store：`src/stores/useAuthStore.ts`
- 新增视图：`src/views/HomeView/`、`src/views/LoginView/`
