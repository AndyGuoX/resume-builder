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
})
