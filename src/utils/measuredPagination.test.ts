import { describe, expect, it } from 'vitest'
import { createBulletNode } from '../constants/defaultResume'
import type { ResumeEntry, ResumeSection } from '../types/resume'
import { paginateSectionsByMeasurement } from './measuredPagination'

const measureSectionTitle = () => 10

function measureEntry(entry: ResumeEntry) {
  // 每条顶层要点记为 6 高度，showMeta=false 时不再计算标题行高度
  const metaHeight = entry.showMeta === false ? 0 : 8
  return metaHeight + entry.bullets.length * 6
}

describe('paginateSectionsByMeasurement', () => {
  it('应使用更大的续页容量减少分页数量', () => {
    const sections: ResumeSection[] = [
      {
        id: 's1',
        type: 'project',
        title: '项目经历',
        entries: [
          {
            id: 'e1',
            heading: 'A',
            subheading: '',
            period: '',
            bullets: [createBulletNode('1'), createBulletNode('2'), createBulletNode('3')],
          },
          {
            id: 'e2',
            heading: 'B',
            subheading: '',
            period: '',
            bullets: [createBulletNode('1'), createBulletNode('2'), createBulletNode('3')],
          },
          {
            id: 'e3',
            heading: 'C',
            subheading: '',
            period: '',
            bullets: [createBulletNode('1'), createBulletNode('2'), createBulletNode('3')],
          },
        ],
      },
    ]

    const pages = paginateSectionsByMeasurement(sections, {
      firstPageLimit: 45,
      nextPageLimit: 80,
      sectionGap: 0,
      measureSectionTitle,
      measureEntry,
    })
    expect(pages.length).toBe(2)
    expect(pages[1].sections.every((section) => section.showTitle === false)).toBe(true)
  })

  it('单条目超高时应按 bullet 拆分并保持总 bullet 数', () => {
    const sections: ResumeSection[] = [
      {
        id: 's2',
        type: 'project',
        title: '项目经历',
        entries: [
          {
            id: 'e1',
            heading: '超长项目',
            subheading: '',
            period: '',
            bullets: Array.from({ length: 12 }, (_, index) => createBulletNode(`要点${index + 1}`)),
          },
        ],
      },
    ]

    const pages = paginateSectionsByMeasurement(sections, {
      firstPageLimit: 55,
      nextPageLimit: 55,
      sectionGap: 0,
      measureSectionTitle,
      measureEntry,
    })
    expect(pages.length).toBeGreaterThan(1)
    const totalBullets = pages
      .flatMap((page) => page.sections)
      .flatMap((section) => section.entries)
      .reduce((sum, entry) => sum + entry.bullets.length, 0)
    expect(totalBullets).toBe(12)

    const flattenedSections = pages.flatMap((page) => page.sections)
    expect(flattenedSections[0].showTitle).toBe(true)
    expect(flattenedSections.slice(1).every((section) => section.showTitle === false)).toBe(true)

    const flattenedEntries = flattenedSections.flatMap((section) => section.entries)
    expect(flattenedEntries[0].showMeta).not.toBe(false)
    expect(flattenedEntries.slice(1).every((entry) => entry.showMeta === false)).toBe(true)
  })

  it('本页尾部空间不足另起一页时，新模块首块仍应显示 h2（showTitle）', () => {
    const sections: ResumeSection[] = [
      {
        id: 's-work',
        type: 'work',
        title: '工作经历',
        entries: [
          {
            id: 'e-w',
            heading: '某公司',
            subheading: '',
            period: '',
            bullets: [createBulletNode('一条要点')],
          },
        ],
      },
      {
        id: 's-proj',
        type: 'project',
        title: '项目经历',
        entries: [
          {
            id: 'e-p',
            heading: '某项目',
            subheading: '',
            period: '',
            bullets: [createBulletNode('单条不可拆分')],
          },
        ],
      },
    ]

    const measureEntryProject = (entry: ResumeEntry) => {
      if (entry.id === 'e-w') {
        return 70
      }
      return 50
    }

    const pages = paginateSectionsByMeasurement(sections, {
      firstPageLimit: 100,
      nextPageLimit: 100,
      sectionGap: 5,
      measureSectionTitle,
      measureEntry: measureEntryProject,
    })

    const projSection = pages.flatMap((p) => p.sections).find((s) => s.title === '项目经历')
    expect(projSection).toBeDefined()
    expect(projSection?.showTitle).toBe(true)
  })

  it('新模块从第 2 页开始时仍应显示该模块 h2（showTitle）', () => {
    const sections: ResumeSection[] = [
      {
        id: 's-a',
        type: 'education',
        title: '教育背景',
        entries: [
          {
            id: 'e-a',
            heading: '学校',
            subheading: '',
            period: '',
            bullets: [createBulletNode('1'), createBulletNode('2'), createBulletNode('3')],
          },
        ],
      },
      {
        id: 's-b',
        type: 'work',
        title: '实习经历',
        entries: [
          {
            id: 'e-b',
            heading: '公司',
            subheading: '',
            period: '',
            bullets: [createBulletNode('a')],
          },
        ],
      },
    ]

    // 首页容量仅够放下「教育背景」整块，「实习经历」从第 2 页开始
    const pages = paginateSectionsByMeasurement(sections, {
      firstPageLimit: 40,
      nextPageLimit: 80,
      sectionGap: 0,
      measureSectionTitle,
      measureEntry,
    })
    expect(pages.length).toBeGreaterThanOrEqual(2)
    const page2FirstSection = pages[1]?.sections[0]
    expect(page2FirstSection?.title).toBe('实习经历')
    expect(page2FirstSection?.showTitle).toBe(true)
  })

  it('entries 为空时仍分页输出该模块（仅模块标题高度）', () => {
    const sections: ResumeSection[] = [
      {
        id: 's-empty',
        type: 'custom',
        title: '仅占位',
        entries: [],
      },
    ]

    const pages = paginateSectionsByMeasurement(sections, {
      firstPageLimit: 100,
      nextPageLimit: 100,
      sectionGap: 0,
      measureSectionTitle,
      measureEntry,
    })
    expect(pages[0]?.sections).toHaveLength(1)
    expect(pages[0]?.sections[0]?.title).toBe('仅占位')
    expect(pages[0]?.sections[0]?.entries).toHaveLength(0)
    expect(pages[0]?.sections[0]?.showTitle).toBe(true)
  })
})
