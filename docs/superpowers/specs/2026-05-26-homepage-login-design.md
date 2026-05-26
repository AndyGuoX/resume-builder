# 首页与登录功能设计文档

**日期：** 2026-05-26  
**状态：** 已批准

---

## 1. 背景与目标

当前项目（resume-builder）仅有一个路由 `/`，直接进入简历编辑器，缺少公开首页和用户身份系统。本次设计目标：

- 新增完整落地页（首页），向访客介绍产品价值
- 新增登录页，支持手机号 + 密码登录
- 所有功能页面（简历编辑器）需登录才可访问
- 首页和登录页公开可访问
- Mock API 先行，后续切换真实后端只改接口层

---

## 2. 路由架构

| 路径      | 视图组件     | 是否需要登录 | 备注                       |
| --------- | ------------ | ------------ | -------------------------- |
| `/`       | `HomeView`   | 否           | 公开落地页                 |
| `/login`  | `LoginView`  | 否           | 已登录则自动跳转 `/resume` |
| `/resume` | `ResumeView` | **是**       | 原 `/` 路由迁移至此        |

**路由守卫（`router.beforeEach`）：**

```
1. 目标路由有 meta.requiresAuth
   └── authStore.isLoggedIn 为 false → 跳转 /login?redirect=<目标路径>
2. 目标路由为 /login 且 authStore.isLoggedIn 为 true → 跳转 /resume
3. 其余情况正常放行
```

改动文件：`src/router/index.ts`（新增路由、守卫，`/resume` 加 `meta: { requiresAuth: true }`）

---

## 3. Auth 状态管理（`useAuthStore`）

**文件：** `src/stores/useAuthStore.ts`

**State：**

```ts
token: string | null; // JWT token，持久化到 localStorage
user: User | null; // { id, name, phone }
```

**Getters：**

```ts
isLoggedIn: boolean; // token !== null
```

**Actions：**

```ts
login(params: LoginParams): Promise<void>
  // 调用 api/auth.ts → 成功则写入 token + user 到 state 和 localStorage
  // 失败则抛出 Error，由调用方展示错误提示

logout(): void
  // 清空 state 和 localStorage，跳转 /login
```

**初始化：** store 创建时从 `localStorage` 读取 token，自动恢复登录态（不重新请求接口验证）。

---

## 4. API 层

### 4.1 类型定义

**文件：** `src/types/auth.ts`

```ts
interface User {
  id: string;
  name: string;
  phone: string;
}

interface LoginParams {
  phone: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}
```

### 4.2 接口函数

**文件：** `src/api/auth.ts`

```ts
export function login(params: LoginParams): Promise<AuthResponse>;
export function logout(): Promise<void>;
```

当前阶段直接导入并调用 `src/api/_mock/auth.ts` 的实现。切换真实后端时，只修改此文件的实现，上层调用不变。

### 4.3 Mock 实现

**文件：** `src/api/_mock/auth.ts`

- 预设账号：手机号 `18800000000`，密码 `123456`
- 模拟网络延迟：300ms
- 登录成功：返回 `{ token: 'mock-token-xxx', user: { id: '1', name: '测试用户', phone: '18800000000' } }`
- 手机号/密码不匹配：抛出 `{ code: 401, message: '手机号或密码错误' }`

---

## 5. 登录页（`LoginView`）

**文件：** `src/views/LoginView/LoginView.vue`

**布局：** 左右分栏（宽屏）/ 单栏居中（移动端）

- 左侧：品牌插图 + 产品 Slogan
- 右侧：登录卡片

**登录卡片内容：**

- Logo + 产品名称"简历制作"
- 手机号输入框（`a-input`，`type="tel"`）
- 密码输入框（`a-input-password`，可切换显示/隐藏）
- 登录按钮（`a-button type="primary"`，提交时进入 loading 状态）
- 行内错误提示区（非 Modal 弹窗）

**前端校验（提交前触发）：**

- 手机号：必填，11 位纯数字（`/^1\d{10}$/`）
- 密码：必填，最少 6 位

**登录成功流程：**

1. 调用 `authStore.login()`
2. 读取路由参数 `redirect`，跳转对应路径；默认跳转 `/resume`

**组件：** 使用 `a-form`、`a-form-item`、`a-input`、`a-input-password`、`a-button`（Ant Design Vue 自动导入）

---

## 6. 首页（`HomeView`）

**文件：** `src/views/HomeView/HomeView.vue`  
**子组件目录：** `src/views/HomeView/components/`

### 6.1 NavBar

- 左侧：Logo 图标 + 产品名称"简历制作"
- 右侧：
  - 未登录：`登录` 按钮（跳转 `/login`）
  - 已登录：用户名 + `退出登录` 按钮

### 6.2 HeroSection

- 主标题：**在线制作专业简历**
- 副标题：填写信息，智能排版，一键导出，快速投递
- 主 CTA 按钮：**开始制作**（已登录 → `/resume`；未登录 → `/login`）
- 次 CTA 按钮：**查看示例**（跳转 `/resume`；未登录时由路由守卫自动转至 `/login`）

### 6.3 HowToSection

三步骤横排卡片：

1. **填写信息** — 填写个人信息与项目经历
2. **实时预览** — 所见即所得，即时调整排版
3. **导出简历** — 一键导出 Word / PNG，快速投递

### 6.4 FeaturesSection

四项特性列表（图标 + 标题 + 描述）：

| 特性       | 描述                             |
| ---------- | -------------------------------- |
| 实时预览   | 编辑内容同步渲染，排版所见即所得 |
| 多格式导出 | 支持导出为 Word 和 PNG 图片      |
| 自定义主题 | 自由调整主题颜色，打造个人风格   |
| 本地存储   | 数据保存在本地，保护隐私安全     |

### 6.5 FooterSection

- 版权：`© 2026 简历制作. All rights reserved.`

**样式约定：**

- 主色沿用 `#515FF1`（已在 `App.vue` 全局配置）
- 布局工具类使用 UnoCSS，局部样式用 Less 模块

---

## 7. 新增文件清单

```
src/
  api/
    auth.ts
    _mock/
      auth.ts
  types/
    auth.ts
  stores/
    useAuthStore.ts
  views/
    HomeView/
      HomeView.vue
      style.less
      components/
        NavBar.vue
        HeroSection.vue
        HowToSection.vue
        FeaturesSection.vue
        FooterSection.vue
    LoginView/
      LoginView.vue
      style.less
docs/
  superpowers/
    specs/
      2026-05-26-homepage-login-design.md  ← 本文件
```

**改动现有文件：**

- `src/router/index.ts`：新增路由 `/`（HomeView）、`/login`（LoginView），将 `/` 改为 `/resume` 并加 `meta: { requiresAuth: true }`，添加全局守卫

---

## 8. 不在本次范围内

- 注册功能
- 忘记密码 / 重置密码
- 第三方 OAuth 登录
- 真实后端接口对接
- 简历云端保存/同步
