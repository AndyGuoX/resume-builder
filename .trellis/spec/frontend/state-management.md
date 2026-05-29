# 状态管理

> 本项目的状态管理方案与约定。

---

## 概览

使用 **Pinia**（Composition API 风格）作为全局状态管理方案。全应用只有一个 store：`useResumeStore`。没有服务器状态（无网络请求），所有数据来自 `localStorage`。

---

## Store 定义模式

使用 Composition API 风格（`defineStore('id', () => {...})`），不使用 Options API 风格：

```ts
// ✅ 正确 - Composition API 风格
export const useResumeStore = defineStore('resume', () => {
  const resume = ref<ResumeDocument>(/* ... */);

  function addPersonalField() {
    /* ... */
  }

  return { resume, addPersonalField };
});

// ❌ 错误 - 不用 Options API 风格
export const useResumeStore = defineStore('resume', {
  state: () => ({ resume: {} }),
  actions: { addPersonalField() {} },
});
```

参考：`src/stores/useResumeStore.ts`

---

## 状态分类

| 状态类型           | 存放位置                                 | 示例                                        |
| ------------------ | ---------------------------------------- | ------------------------------------------- |
| 全局持久化业务数据 | Pinia store → localStorage               | `resume`（ResumeDocument）                  |
| 组件局部 UI 状态   | 组件内 `ref`                             | `exporting`, `previewOnly`, `avatarLoading` |
| 计算派生值         | 组件内 `computed` 或 store 内 `computed` | 无明显例子                                  |

不要把组件本地的 UI 状态（如 loading、弹窗 visible）提升到 store。

---

## 持久化

Store 中使用 `watch` 监听 `resume` 变化，自动序列化到 `localStorage`：

```ts
const STORAGE_KEY = 'resume-template-generator-v1';

watch(
  resume,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  { deep: true },
);
```

初始化时从 `localStorage` 读取，通过 `safeParseResume` + `normalizeResumeDocument` 进行安全解析和版本迁移。

---

## 数据规范化与迁移

`normalizeResumeDocument(raw)` 负责将旧版或不完整数据转换为当前 `ResumeDocument` 结构。新增字段时，**必须**在此函数中处理兜底默认值：

```ts
function normalizeResumeDocument(raw: unknown): ResumeDocument | null {
  // 用 unknown 接收，手动校验类型后再使用
  if (!raw || typeof raw !== 'object') return null;
  // 新旧结构分别处理，缺失字段给默认值
}
```

参考：`src/stores/useResumeStore.ts` → `normalizeResumeDocument`

---

## Markdown ↔ Sections 同步

`modulesMarkdown`（字符串）是编辑器的输入源，`sections` 是预览渲染使用的结构化数组。两者通过以下函数互转：

- `parseModulesMarkdown(md)` → `ResumeSection[]`（用于解析后更新 sections）
- `serializeModulesMarkdown(sections)` → `string`（用于将旧 sections 补全 markdown）

**只修改 `modulesMarkdown`，不要直接向 `sections` 追加/删除条目**（除非有重新解析触发）。

---

## 在组件中使用

```ts
import { storeToRefs } from 'pinia';
import { useResumeStore } from '../../stores/useResumeStore';

const store = useResumeStore();
const { resume } = storeToRefs(store); // 响应式 ref
const { addPersonalField } = store; // 方法直接解构
```

---

## 常见错误

- **不要**直接解构 store 的 `ref` 属性（会失去响应式），必须用 `storeToRefs`
- **不要**在 store 外直接 `JSON.parse(localStorage.getItem(...))` 读取简历数据，走 store 初始化流程
- **不要**在 store 内调用 `console.log` 之外的副作用（如 DOM 操作）
