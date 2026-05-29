# 前端开发规范

> 本项目前端开发最佳实践与约定。

---

## 概览

这是一个 Vue 3 + TypeScript + Pinia + Vite 的简历生成器 SPA。所有开发规范基于实际代码结构编写。

---

## 规范索引

| 文档                                    | 说明                                           | 状态 |
| --------------------------------------- | ---------------------------------------------- | ---- |
| [目录结构](./directory-structure.md)    | 模块组织、文件与目录命名规则                   | ✅   |
| [组件规范](./component-guidelines.md)   | 组件结构、Props 声明、样式、递归组件           | ✅   |
| [Composable 规范](./hook-guidelines.md) | Pinia store 使用、纯函数 vs composable         | ✅   |
| [状态管理](./state-management.md)       | Pinia store、持久化、数据规范化、Markdown 同步 | ✅   |
| [质量规范](./quality-guidelines.md)     | 工具链、禁止模式、测试要求、commit 规范        | ✅   |
| [类型安全](./type-safety.md)            | 类型组织、unknown 处理、禁止模式               | ✅   |

---

## 开发前检查清单

进入任何模块开发前，先阅读以下文档：

1. **目录结构** — 确认新文件放在正确位置
2. **组件规范** — 确认 Props 声明方式、样式写法
3. **状态管理** — 确认哪些数据走 store、哪些是组件局部状态
4. **类型安全** — 确认新类型加在 `src/types/resume.ts`，不重复定义
5. **质量规范** — 确认 lint / test / commit message 格式

---

## 快速命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 构建（含类型检查）
pnpm test         # 单元测试
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm stylelint    # Less 样式检查
```

---

**语言**：所有文档使用**中文**编写。
