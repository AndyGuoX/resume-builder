# 组件规范

> 本项目 Vue 3 组件的编写约定。

---

## 概览

所有组件使用 `<script setup lang="ts">` + Composition API。组件目录结构、Props 类型、样式方式在项目内保持一致。

---

## 组件结构

标准文件顺序：`<script setup>` → `<template>` → `<style>`（使用单独的 `style.less` 时不写内联 style 块）。

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { BulletNode } from '../../types/resume';

const props = defineProps<{
  nodes: BulletNode[];
  themeColor?: string;
}>();

// 逻辑放在 script 里
const hasChildren = computed(() => props.nodes.some((n) => n.children.length));
</script>

<template>
  <!-- 模板放这里 -->
</template>
```

参考：`src/components/FormattedText/FormattedText.vue`

---

## Props 约定

### TypeScript 泛型语法（必须）

用 `defineProps<{...}>()` 的泛型形式声明 Props，**不用** `defineProps({ ... })` 对象形式：

```ts
// ✅ 正确
const props = defineProps<{
  profile: ResumeProfile;
  sections: ResumeSection[];
}>();

// ❌ 错误 - 不用运行时对象写法
defineProps({ profile: Object, sections: Array });
```

### 有默认值时用 `withDefaults`

```ts
// ✅ 正确
withDefaults(
  defineProps<{
    nodes: BulletNode[];
    depth?: number;
    themeColor?: string;
  }>(),
  { depth: 0, themeColor: '' },
);
```

参考：`src/components/BulletList/BulletList.vue`

### Emits 声明

```ts
// ✅ 正确
const emit = defineEmits<{
  (event: 'add-personal-field'): void;
  (event: 'remove-personal-field', fieldIndex: number): void;
  (event: 'reset'): void;
}>();
```

参考：`src/components/ResumeEditorPanel/ResumeEditorPanel.vue`

---

## 样式规范

### 独立 Less 文件

有明显私有样式的组件使用同目录下的 `style.less`，在 `<script setup>` 顶部（或单独的 `<style>` 块末尾）通过 `import './style.less'` 引入。

### CSS 变量传主题色

主题色通过 CSS 变量下传，不要直接绑定 Tailwind 或行内颜色：

```vue
<!-- ✅ 正确 -->
<div :style="{ '--resume-theme-color': profile.themeColor }">

<!-- 组件内 Less 文件中 -->
<!-- .entry-heading { color: var(--resume-theme-color); } -->
```

标签背景色也用变量：

```vue
<span
  class="resume-tag"
  :style="{
    '--tag-bg-color': profile.themeColor + '20',
    '--tag-text-color': profile.themeColor,
  }"
/>
```

参考：`src/components/ResumePreview/ResumePreview.vue`

---

## 递归组件

`BulletList` 是本项目唯一的递归组件，自引用写法：

```vue
<script setup lang="ts">
import BulletList from './BulletList.vue'; // ← 引用自身
</script>

<template>
  <BulletList v-if="node.children.length" :nodes="node.children" :depth="depth + 1" />
</template>
```

递归时 `depth` 属性控制样式层级：`:class="\`resume-bullet-tree--depth-${depth % 4}\`"`

参考：`src/components/BulletList/BulletList.vue`

---

## 自动导入组件

`unplugin-vue-components` 配置了 `AntDesignVueResolver` 和 `AntDesignXVueResolver`，Ant Design Vue 和 Ant Design X Vue 的组件**无需手动 import**，直接在模板里用即可。

```vue
<!-- ✅ 直接使用，无需 import -->
<a-button type="primary">导出</a-button>
<a-spin :spinning="loading" />
```

自动导入配置见：`vite.config.ts` → `Components({ resolvers: [...] })`

---

## 常见错误

- **不要**用 `ref` 直接 mutate prop 对象（`props.resume.profile.xxx = ...` 在有 `eslint-disable vue/no-mutating-props` 注释的地方是项目有意为之，不要随意照搬到其他组件）
- **不要**在 `utils/` 里引入 Vue 响应式 API，工具函数必须是纯函数
- **不要**把 `style.less` 内的类命名设计为全局复用，建议加组件前缀（`.resume-preview-xxx`）
