## ADDED Requirements

### Requirement: 登录页面独立路由

系统 SHALL 在 `/login` 路径下提供独立登录页面。

#### Scenario: 访问登录页

- **WHEN** 用户访问 `/login`
- **THEN** 系统渲染登录表单页面

#### Scenario: 已登录用户访问登录页

- **WHEN** 已登录用户访问 `/login`
- **THEN** 系统自动跳转至 `/resume`

### Requirement: 邮箱密码登录表单

系统 SHALL 提供邮箱 + 密码登录表单，并在提交前进行基础格式校验。

#### Scenario: 表单字段齐全时提交登录

- **WHEN** 用户填写合法邮箱和密码后点击"登录"
- **THEN** 系统调用登录接口，成功后跳转至 `/resume`

#### Scenario: 邮箱格式不合法

- **WHEN** 用户填写非邮箱格式的内容并点击"登录"
- **THEN** 表单显示邮箱格式错误提示，不发起请求

#### Scenario: 密码为空

- **WHEN** 用户未填写密码并点击"登录"
- **THEN** 表单显示密码不能为空提示，不发起请求

### Requirement: 登录失败错误提示

系统 SHALL 在登录接口返回错误时向用户展示错误信息。

#### Scenario: 账号或密码错误

- **WHEN** 用户提交的邮箱/密码与系统不匹配
- **THEN** 页面显示"邮箱或密码错误"提示，不跳转

### Requirement: 登录成功持久化 token

系统 SHALL 在登录成功后将 token 存入 localStorage，并在后续请求中自动附带。

#### Scenario: 登录成功后刷新页面

- **WHEN** 用户登录成功后刷新页面
- **THEN** 系统读取 localStorage 中的 token，保持登录状态，不跳转至登录页

### Requirement: 路由守卫保护功能页

系统 SHALL 拦截未登录用户访问功能路由（`/resume` 等）并跳转至登录页。

#### Scenario: 未登录访问受保护路由

- **WHEN** 未登录用户直接访问 `/resume`
- **THEN** 系统跳转至 `/login`

#### Scenario: 登录后访问原目标路由

- **WHEN** 未登录用户被跳转至 `/login` 后完成登录
- **THEN** 系统跳转至 `/resume`

### Requirement: 登出功能

系统 SHALL 提供登出操作，清除本地 token 和用户状态并跳转至首页。

#### Scenario: 用户执行登出

- **WHEN** 用户触发登出操作
- **THEN** 系统清除 localStorage 中的 token，重置 auth store，跳转至 `/`
