# 目录结构

> 本项目前端代码的组织方式。

---

## 概览

这是一个 Vue 3 单页应用（SPA），使用 Vite 构建，TypeScript 全覆盖。所有源码位于 `src/`。

---

## 目录布局

```
src/
├── App.vue                      # 根组件，仅路由出口
├── main.ts                      # 应用入口
├── env.d.ts                     # Vite/TS 环境类型声明
├── style.less                   # 全局样式
├── assets/                      # 静态资源（图片等）
├── components/                  # 可复用 UI 组件
│   ├── BulletList/
│   │   └── BulletList.vue       # 递归要点树（自引用）
│   ├── ExportToolbar/
│   │   └── ExportToolbar.vue    # 导出工具栏（PNG/Word/PDF）
│   ├── FormattedText/
│   │   └── FormattedText.vue    # 行内加粗 + 标签渲染
│   ├── ResumeEditorPanel/
│   │   ├── ResumeEditorPanel.vue
│   │   └── style.less
│   └── ResumePreview/
│       ├── ResumePreview.vue
│       └── style.less
├── constants/
│   └── defaultResume.ts         # 默认简历数据与工厂函数
├── router/
│   └── index.ts                 # Vue Router 路由配置
├── stores/
│   └── useResumeStore.ts        # Pinia store（全局唯一）
├── tests/
│   ├── inlineBold.test.ts
│   └── modulesMarkdown.test.ts
├── types/
│   └── resume.ts                # 所有业务类型定义（唯一来源）
├── utils/                       # 纯函数工具库
│   ├── bulletNodes.ts           # BulletNode 创建 / ID 生成
│   ├── bulletTree.ts            # BulletNode 迁移 / HTML 渲染
│   ├── exporters.ts             # PNG / Word 导出逻辑
│   ├── inlineBold.ts            # 行内 **加粗** 解析
│   ├── inputTrim.ts             # 输入框行首空白拦截工具
│   ├── localImage.ts            # 本地图片压缩为 DataURL
│   └── modulesMarkdown.ts       # Markdown ↔ ResumeSection 互转
└── views/
    └── ResumeView/
        ├── ResumeView.vue       # 简历编辑主视图
        └── style.less
```

---

## 模块组织规则

### 组件目录

每个组件独占一个以 **PascalCase** 命名的目录，目录内放同名 `.vue` 文件，样式单独放 `style.less`：

```
components/
└── ResumePreview/
    ├── ResumePreview.vue   ✅
    └── style.less          ✅（有样式时）
```

不要把多个无关组件平铺在同一目录下。

### views 与 components 的区别

- `views/`：路由对应的页面级组件，通常通过 `ResumeView.vue` 组合子组件
- `components/`：可复用的功能块，不直接挂路由

### 工具函数

- `utils/` 只放 **纯函数**（无 Vue 响应式、无副作用）
- Store 逻辑放 `stores/`，不要混入 utils

### 类型

- 所有业务类型 **只在** `src/types/resume.ts` 中定义和导出
- 组件或工具内的临时局部类型（如 `interface InlineSegment`）可以放在对应文件内

---

## 命名约定

| 类型       | 规范               | 示例                 |
| ---------- | ------------------ | -------------------- |
| 组件目录   | PascalCase         | `ResumePreview/`     |
| 组件文件   | PascalCase         | `ResumePreview.vue`  |
| 工具文件   | camelCase          | `modulesMarkdown.ts` |
| Store 文件 | `use` + PascalCase | `useResumeStore.ts`  |
| 类型文件   | camelCase          | `resume.ts`          |
| 测试文件   | `*.test.ts`        | `inlineBold.test.ts` |
| 样式文件   | `style.less`       | 固定名称             |

---

## 参考文件

- 典型组件结构：`src/components/FormattedText/FormattedText.vue`
- 典型视图结构：`src/views/ResumeView/ResumeView.vue`
- 纯函数工具：`src/utils/inlineBold.ts`
