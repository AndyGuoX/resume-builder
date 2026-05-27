## ADDED Requirements

### Requirement: 首页可在未登录状态下访问

系统 SHALL 允许任何用户（未登录）访问 `/` 首页，无需身份验证。

#### Scenario: 未登录用户访问首页

- **WHEN** 用户在未登录状态下访问 `/`
- **THEN** 系统正常渲染首页，不跳转到登录页

### Requirement: 首页展示品牌 Hero 区块

系统 SHALL 在首页展示包含主标语、CTA 按钮和用户数统计的 Hero 区块。

#### Scenario: 渲染 Hero 区块

- **WHEN** 用户访问首页
- **THEN** 页面展示主标语、"生成我的简历"按钮、"开始模拟面试"按钮及用户数量

#### Scenario: 点击"生成我的简历"（未登录）

- **WHEN** 未登录用户点击"生成我的简历"按钮
- **THEN** 系统跳转至 `/login` 登录页

#### Scenario: 点击"生成我的简历"（已登录）

- **WHEN** 已登录用户点击"生成我的简历"按钮
- **THEN** 系统跳转至 `/resume` 编辑器页

### Requirement: 首页展示使用步骤区块

系统 SHALL 在首页展示"如何使用"区块，包含三个步骤说明。

#### Scenario: 渲染使用步骤

- **WHEN** 用户访问首页
- **THEN** 页面展示"如何使用"标题及三步骤内容

### Requirement: 首页展示产品特点区块

系统 SHALL 在首页展示"为什么选择"区块，包含四项产品特点。

#### Scenario: 渲染产品特点

- **WHEN** 用户访问首页
- **THEN** 页面展示四项特点条目

### Requirement: 首页顶部导航栏

系统 SHALL 在首页顶部展示导航栏，包含 Logo 和登录按钮。

#### Scenario: 未登录时导航栏显示登录按钮

- **WHEN** 未登录用户访问首页
- **THEN** 导航栏右侧显示"登录"按钮

#### Scenario: 点击导航栏登录按钮

- **WHEN** 用户点击导航栏"登录"按钮
- **THEN** 系统跳转至 `/login` 页面

### Requirement: 首页展示页脚

系统 SHALL 在首页底部展示包含导航链接和版权信息的页脚。

#### Scenario: 渲染页脚

- **WHEN** 用户访问首页
- **THEN** 页面底部显示页脚区块，包含版权文字
