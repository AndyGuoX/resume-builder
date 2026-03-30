import { describe, expect, it } from 'vitest'
import { createDefaultResume } from '../constants/defaultResume'
import { parseModulesMarkdown, serializeModulesMarkdown } from './modulesMarkdown'

describe('modulesMarkdown', () => {
  it('默认简历序列化后再解析，模块数量与标题一致', () => {
    const doc = createDefaultResume()
    const md = serializeModulesMarkdown(doc.sections)
    const parsed = parseModulesMarkdown(md)
    expect(parsed.length).toBe(doc.sections.length)
    expect(parsed[0]?.title).toBe('教育背景')
    expect(parsed[0]?.entries[0]?.heading).toContain('上海交通大学')
  })

  it('删掉 ### 后，模块下正文与列表仍解析为一条无主标题条目', () => {
    const md = `## 实习

这是一段说明文字
2023 — 2024
- 负责功能 A
- 负责功能 B`

    const sections = parseModulesMarkdown(md)
    expect(sections[0]?.entries).toHaveLength(1)
    const e = sections[0]?.entries[0]
    expect(e?.heading).toBe('')
    expect(e?.period).toBe('2023 — 2024')
    expect(e?.subheading).toContain('说明')
    expect(e?.bullets.length).toBeGreaterThanOrEqual(2)
  })

  it('仅有 ## 无 ### 时仍保留模块（entries 为空）', () => {
    const md = `## 仅占位的模块

## 下面才有条目

### 某公司
- 1`

    const sections = parseModulesMarkdown(md)
    expect(sections).toHaveLength(2)
    expect(sections[0]?.title).toBe('仅占位的模块')
    expect(sections[0]?.entries).toHaveLength(0)
    expect(sections[1]?.entries).toHaveLength(1)
  })

  it('多个 ## 模块、行首空格、## 后无空格均可识别', () => {
    const md = `## 第一块

### A
- a

  ## 第二块

### B
- b

##无空格模块
### C
- c`

    const sections = parseModulesMarkdown(md)
    expect(sections).toHaveLength(3)
    expect(sections[0]?.title).toBe('第一块')
    expect(sections[1]?.title).toBe('第二块')
    expect(sections[2]?.title).toBe('无空格模块')
    expect(sections[2]?.entries[0]?.heading).toBe('C')
  })

  it('## 为模块、### 为主标题，要点为列表', () => {
    const md = `## 测试模块

### 某公司
2020.01 - 2021.01
副标题说明

- 要点一
  - 子要点`

    const sections = parseModulesMarkdown(md)
    expect(sections).toHaveLength(1)
    expect(sections[0]?.title).toBe('测试模块')
    const e = sections[0]?.entries[0]
    expect(e?.heading).toBe('某公司')
    expect(e?.period).toBe('2020.01 - 2021.01')
    expect(e?.subheading).toBe('副标题说明')
    expect(e?.bullets[0]?.text).toBe('要点一')
    expect(e?.bullets[0]?.children[0]?.text).toBe('子要点')
  })
})
