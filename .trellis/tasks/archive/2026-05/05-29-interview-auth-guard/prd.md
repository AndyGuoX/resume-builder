# 为模拟面试路由添加登录守卫

## Goal

`/interview` 路由需要登录才能访问，行为与 `/resume` 一致。

## Requirements

1. `src/router/index.ts` — 将 `/interview` 加入 `beforeEach` 守卫的受保护路由列表，未登录时跳转 `/login`
2. `src/views/HomeView/HomeView.vue` — "开始模拟面试"按钮点击逻辑：未登录 → `/login`，已登录 → `/interview`（与"生成我的简历"按钮保持一致）

## Acceptance Criteria

- [ ] 未登录直接访问 `/#/interview` 自动跳转到 `/login`
- [ ] 已登录访问 `/#/interview` 正常显示占位页
- [ ] 首页"开始模拟面试"按钮：未登录跳 `/login`，已登录跳 `/interview`

## Out of Scope

- 其他页面或功能改动
