# Composable 规范

> 本项目 Vue 3 Composable（可组合函数）的使用约定。

---

## 概览

本项目目前只有一个全局 Pinia store（`useResumeStore`）作为主要的状态共享手段。工具逻辑以纯函数的形式放在 `utils/`，不抽取成独立的 composable 文件，除非有明确的复用需求。

---

## 使用 Store（主要 Composable）

在视图和组件中通过 `useResumeStore()` 获取响应式状态：

```ts
import { storeToRefs } from 'pinia';
import { useResumeStore } from '../../stores/useResumeStore';

const store = useResumeStore();
// ✅ 响应式属性用 storeToRefs 解构，保留响应式
const { resume } = storeToRefs(store);
// ✅ 方法直接从 store 解构
const { addPersonalField, removePersonalField, resetToDefault } = store;
```

**不要**直接解构 store 的响应式属性，会失去响应式：

```ts
// ❌ 错误 - resume 失去响应式
const { resume } = useResumeStore();
```

参考：`src/views/ResumeView/ResumeView.vue`

---

## 纯函数工具 vs Composable

| 场景                                          | 放哪里                                          |
| --------------------------------------------- | ----------------------------------------------- |
| 无 Vue 依赖的业务逻辑（解析、转换、工厂函数） | `src/utils/*.ts`                                |
| 包含响应式状态、跨组件共享                    | `src/stores/useResumeStore.ts`                  |
| 仅当前组件用的局部状态                        | 组件的 `<script setup>` 内直接写 `ref/computed` |

---

## 数据处理模式

本项目的核心数据流：`modulesMarkdown`（字符串）→ 解析 → `sections`（ResumeSection[]）

相关工具函数：

- `parseModulesMarkdown(md)` → `ResumeSection[]`
- `serializeModulesMarkdown(sections)` → `string`

这些是纯函数，在 `src/utils/modulesMarkdown.ts` 中，**不要**在 store 外部直接修改 `sections`，而是修改 `modulesMarkdown` 后触发重新解析，或调用 store 方法。

---

## 命名约定

- Store 文件以 `use` 开头，文件名 camelCase：`useResumeStore.ts`
- 如将来新增独立 composable，同样用 `use` 前缀，放在 `src/composables/` 目录（当前项目尚无此目录，需要时再创建）

---

## 常见错误

- **不要**在 `utils/` 中调用 `ref()`、`computed()` 等响应式 API，工具函数必须是纯函数，无副作用
- **不要**在组件的 `<template>` 里直接调用 `useResumeStore()`，必须在 `<script setup>` 顶层调用
