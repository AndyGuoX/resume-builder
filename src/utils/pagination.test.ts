import { describe, expect, it } from 'vitest'
import { createBulletNode } from '../constants/defaultResume'
import { paginateSections } from './pagination'
import type { ResumeSection } from '../types/resume'

function createSection(id: string, title: string, entryCount: number, bulletCount = 2): ResumeSection {
  return {
    id,
    type: 'custom',
    title,
    entries: Array.from({ length: entryCount }, (_, index) => ({
      id: `${id}-entry-${index + 1}`,
      heading: `${title}条目${index + 1}`,
      subheading: '子标题',
      period: '2024.01 - 2024.12',
      bullets: Array.from({ length: bulletCount }, (_, bulletIndex) => createBulletNode(`要点 ${bulletIndex + 1}`)),
    })),
  }
}

describe('paginateSections', () => {
  it('内容较少时应只生成一页', () => {
    const sections = [createSection('s1', '教育背景', 1), createSection('s2', '个人荣誉', 1)]
    const pages = paginateSections(sections, 42)
    expect(pages).toHaveLength(1)
    expect(pages[0].sections).toHaveLength(2)
  })

  it('内容较多时应拆成多页且顺序不变', () => {
    const sections = [createSection('s1', '实习经历', 5, 3), createSection('s2', '项目经历', 6, 3)]
    const pages = paginateSections(sections, 35)
    expect(pages.length).toBeGreaterThan(1)
    const sectionTitles = pages.flatMap((page) => page.sections.map((section) => section.title))
    expect(sectionTitles[0]).toBe('实习经历')
    expect(sectionTitles.some((title) => title === '项目经历')).toBe(true)
  })

  it('单个超长模块应自动拆分为多个分段模块', () => {
    const sections = [createSection('s1', '项目经历', 12, 4)]
    const pages = paginateSections(sections, 28)
    const flattened = pages.flatMap((page) => page.sections)
    expect(flattened.length).toBeGreaterThan(1)
    expect(flattened.every((section) => section.title.startsWith('项目经历'))).toBe(true)
    expect(flattened.reduce((count, section) => count + section.entries.length, 0)).toBe(12)
  })

  it('单条目超长时应按要点拆分到多页并保持总要点数', () => {
    const sections: ResumeSection[] = [
      {
        id: 's-bullet',
        type: 'project',
        title: '项目经历',
        entries: [
          {
            id: 'entry-bullet',
            heading: '超长项目',
            subheading: '后端开发',
            period: '2022.01 - 2022.12',
            bullets: Array.from({ length: 20 }, (_, index) =>
              createBulletNode(`要点 ${index + 1}：这是用于分页拆分的长描述内容`),
            ),
          },
        ],
      },
    ]
    const pages = paginateSections(sections, 20)
    expect(pages.length).toBeGreaterThan(1)
    const totalBullets = pages
      .flatMap((page) => page.sections)
      .flatMap((section) => section.entries)
      .reduce((sum, entry) => sum + entry.bullets.length, 0)
    expect(totalBullets).toBe(20)
  })
})
