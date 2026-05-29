# 质量规范

> 本项目的代码质量标准与工程约束。

---

## 工具链

| 工具                | 用途                | 配置文件               |
| ------------------- | ------------------- | ---------------------- |
| ESLint              | JS/TS/Vue 代码规范  | `eslint.config.js`     |
| Prettier            | 代码格式化          | `.prettierrc`（默认）  |
| Stylelint           | Less 样式规范       | `stylelint.config.*`   |
| Vitest              | 单元测试            | `vite.config.ts`       |
| husky + lint-staged | 提交前自动 lint     | `.husky/`              |
| commitlint          | commit message 规范 | `commitlint.config.js` |

---

## 运行质量检查

```bash
# Lint（含 Vue、TS）
pnpm lint

# 自动修复
pnpm lint:fix

# Less 样式检查
pnpm stylelint

# 单元测试
pnpm test

# 类型检查（构建时自动运行）
pnpm build
```

---

## 禁止模式

### TypeScript

- **不要用 `any`**（`@typescript-eslint/no-explicit-any` 规则启用）
- **不要用非空断言 `!`** 除非确实安全，优先使用可选链 `?.`

### Vue 组件

- **不要用运行时 props 对象写法**（用泛型 `defineProps<{...}>()`）
- **不要在组件内直接操作 localStorage**，走 store

### 工具函数

- **不要在 `utils/` 中引入 Vue 响应式 API**（`ref`, `computed`, `watch` 等）

### 构建

- **只允许 pnpm**（由 `only-allow` enforcer 强制）；不要用 npm 或 yarn

---

## 必须遵守的模式

### 输入框防行首空白

所有文本输入框必须使用 `src/utils/inputTrim.ts` 中的工具函数防止用户输入行首空白：

```vue
<input
  @beforeinput="blockLeadingSpaceBeforeInput"
  @keydown="blockLeadingSpaceKeydown"
  @input="props.resume.profile.resumeTitle = inputTrimLeading($event)"
  @blur="props.resume.profile.resumeTitle = inputTrimOnBlur($event)"
  @paste="pasteTrim((v) => (props.resume.profile.resumeTitle = v))"
/>
```

参考：`src/components/ResumeEditorPanel/ResumeEditorPanel.vue`

### ID 生成

创建新的 `BulletNode`、`ResumeEntry`、`ResumeSection`、`PersonalInfoField` 时，用 `generateResumeId(prefix)` 生成 ID：

```ts
import { generateResumeId } from '../utils/bulletNodes';
const id = generateResumeId('entry'); // "entry-abc12345"
```

### 导出错误处理

导出功能（PNG/Word/PDF）必须包在 try/catch 中，用 `window.alert` 给用户反馈。

---

## 测试要求

- 测试文件放在 `src/tests/`，文件名为 `*.test.ts`
- 使用 Vitest 的 `describe` / `it` / `expect`
- 纯函数工具（`inlineBold`, `modulesMarkdown`）的关键逻辑必须有单元测试
- 新增解析/转换工具时，参照 `src/tests/modulesMarkdown.test.ts` 补充测试

---

## Commit 规范

使用 Conventional Commits 格式（`commitlint.config.js` 接入 `@commitlint/config-conventional`）：

```
feat: 新增技能模块支持
fix: 修复行首空格导致的渲染错误
chore: 升级 ant-design-vue 版本
docs: 补充 spec 文档
```

---

## ESLint 例外

`eslint.config.js` 中已关闭 `vue/multi-word-component-names`，`App.vue` 这类 Vue 官方约定的单词名不受影响。不要随意关闭其他规则。
