# 新增模拟面试路由与入口

## Goal

在首页 Hero 区"生成我的简历"按钮旁边新增"开始模拟面试"入口按钮，并添加对应的 `/interview` 路由（占位页，功能暂不实现）。

## What I already know

- 项目：Vue 3 + TypeScript + Pinia + Vite + Ant Design Vue（主色 `#515FF1`）
- 路由文件：`src/router/index.ts`（Hash 模式）
- 首页 Hero 区已有"生成我的简历"按钮：`src/views/HomeView/HomeView.vue`
- 现有路由：`/`（首页）、`/login`（登录）、`/resume`（编辑器）

## Requirements

1. 新增 `/interview` 路由，指向占位组件 `InterviewView`
2. 新建 `src/views/InterviewView/InterviewView.vue`，内容为极简占位页（展示"模拟面试 - 即将上线"）
3. 首页 Hero 区，在"生成我的简历"按钮右侧新增"开始模拟面试 →"按钮，点击跳转 `/interview`
4. `/interview` 路由无需登录守卫（暂不限制访问）

## Acceptance Criteria

- [ ] 访问 `/#/interview` 显示占位页
- [ ] 首页 Hero 区有"开始模拟面试"按钮，紧靠"生成我的简历"旁边
- [ ] 点击"开始模拟面试"按钮跳转到 `/interview`

## Definition of Done

- Lint / typecheck / build 通过
- 无需新增测试（纯路由/占位页）

## Out of Scope

- 面试页面的实际功能
- 登录守卫限制
