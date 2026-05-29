# 类型安全

> 本项目 TypeScript 类型使用约定。

---

## 概览

项目使用 TypeScript（`tsconfig.app.json`，strict 模式），配合 `typescript-eslint` 强化类型安全。所有业务类型集中在一个文件中定义。

---

## 类型组织

### 唯一来源：`src/types/resume.ts`

所有业务领域的接口和类型**只在** `src/types/resume.ts` 中定义，其他文件从这里 import：

```ts
// ✅ 正确
import type { ResumeDocument, ResumeSection, BulletNode } from '../types/resume';

// ❌ 错误 - 不要在组件或工具里重新定义同名类型
interface ResumeSection { ... }
```

当前已定义的核心类型：

| 类型                | 说明                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| `ResumeSectionType` | 模块类型联合：`'education' \| 'honor' \| 'work' \| 'project' \| 'skill' \| 'custom'` |
| `BulletNode`        | 要点树节点（含 `children: BulletNode[]` 递归）                                       |
| `ResumeEntry`       | 条目（heading/subheading/period/bullets/tags）                                       |
| `ResumeSection`     | 模块（含 entries 数组）                                                              |
| `PersonalInfoField` | 个人信息一项（label + value）                                                        |
| `ResumeProfile`     | 简历头部信息（主标题/主题色/头像/个人信息字段）                                      |
| `ResumeDocument`    | 完整简历文档（profile + modulesMarkdown + sections）                                 |

### 局部类型

仅在单个文件内使用的辅助类型可以放在对应文件里（如 `InlineSegment` 在 `inlineBold.ts`），不必提升到 `types/resume.ts`。

---

## import type

导入类型时使用 `import type`，避免运行时依赖：

```ts
// ✅ 正确
import type { ResumeDocument } from '../types/resume';

// ❌ 错误（仅导类型时）
import { ResumeDocument } from '../types/resume';
```

---

## 枚举 → 联合类型

本项目用字符串联合类型替代 `enum`：

```ts
// ✅ 正确 - 联合类型
export type ResumeSectionType = 'education' | 'honor' | 'work' | 'project' | 'skill' | 'custom';

// ❌ 错误 - 不用 enum
enum ResumeSectionType { Education = 'education', ... }
```

---

## unknown 处理不可信数据

从 `localStorage` 或外部来源读取的数据必须用 `unknown` 接收，再手动校验：

```ts
// ✅ 正确 - useResumeStore.ts 的模式
function normalizeResumeDocument(raw: unknown): ResumeDocument | null {
  if (!raw || typeof raw !== 'object') return null;
  const doc = raw as Partial<ResumeDocument>;
  // 逐字段校验 + 给默认值
}

// ❌ 错误 - 直接断言
const doc = JSON.parse(raw) as ResumeDocument;
```

参考：`src/stores/useResumeStore.ts` → `normalizeResumeDocument`

---

## 组件 Props 泛型声明

见 [组件规范](./component-guidelines.md#props-约定)。务必使用 `defineProps<{...}>()` 泛型语法，Props 类型直接内联或引用 `types/resume.ts` 中的类型。

---

## 禁止模式

- **不用 `any`**（eslint `@typescript-eslint/no-explicit-any` 报错）
- **不用非空断言 `!`** 除非调用方能 100% 保证非空；优先 `?.` 或提前判断
- **不用 `// @ts-ignore`**，应该修复类型而非忽略
- **不在 Vue 模板里用 `as` 断言**，在 `<script setup>` 中做好类型推导

---

## 验证工具

本项目不使用 Zod/Yup 等运行时校验库，边界数据（localStorage）用手写校验函数处理（`normalizeResumeDocument`）。如果将来需要引入校验库，先更新此文档。
