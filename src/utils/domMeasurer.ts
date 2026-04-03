import type { ResumeEntry, ResumeProfile } from '../types/resume'
import { bulletNodesToHtml } from './bulletTree'
import { inlineBoldToHtml } from './inlineBold'

const PAGE_WIDTH = 794
const PAGE_HEIGHT = 1123
const PAGE_PADDING_VERTICAL = 152
const PAGE_PADDING_HORIZONTAL = 42 * 2

function getOuterHeight(element: HTMLElement): number {
  const style = window.getComputedStyle(element)
  const marginTop = Number.parseFloat(style.marginTop || '0') || 0
  const marginBottom = Number.parseFloat(style.marginBottom || '0') || 0
  return element.getBoundingClientRect().height + marginTop + marginBottom
}

export function createDomMeasurer() {
  const root = document.createElement('div')
  root.style.position = 'fixed'
  root.style.left = '-20000px'
  root.style.top = '0'
  root.style.width = `${PAGE_WIDTH - PAGE_PADDING_HORIZONTAL}px`
  root.style.visibility = 'hidden'
  root.style.pointerEvents = 'none'
  document.body.appendChild(root)

  const dispose = () => {
    root.remove()
  }

  /** 与 ResumePreview 中页头 DOM 结构一致，保证分页高度准确 */
  const measureHeader = (profile: ResumeProfile): number => {
    const header = document.createElement('header')
    header.className = 'resume-header'
    const inner = document.createElement('div')
    inner.className = 'resume-header-inner'
    const main = document.createElement('div')
    main.className = 'resume-header-main'
    const h1 = document.createElement('h1')
    h1.className = 'resume-doc-title'
    h1.innerHTML = inlineBoldToHtml(profile.resumeTitle || '')
    const grid = document.createElement('div')
    grid.className = 'personal-info-grid'
    profile.personalFields.forEach((f) => {
      const cell = document.createElement('div')
      cell.className = 'personal-info-cell'
      const lab = document.createElement('span')
      lab.className = 'personal-info-label'
      lab.textContent = f.label
      const val = document.createElement('span')
      val.className = 'personal-info-value'
      val.textContent = f.value
      cell.appendChild(lab)
      cell.appendChild(val)
      grid.appendChild(cell)
    })
    main.appendChild(h1)
    main.appendChild(grid)
    const photo = document.createElement('div')
    photo.className = 'resume-header-photo'
    if (profile.avatarUrl?.trim()) {
      const img = document.createElement('img')
      img.alt = '照片'
      img.src = profile.avatarUrl
      photo.appendChild(img)
    } else {
      const ph = document.createElement('div')
      ph.className = 'resume-header-photo-placeholder'
      ph.textContent = '照片'
      photo.appendChild(ph)
    }
    inner.appendChild(main)
    inner.appendChild(photo)
    header.appendChild(inner)
    root.appendChild(header)
    const height = getOuterHeight(header)
    header.remove()
    return height
  }

  const measureSectionTitle = (title: string): number => {
    const section = document.createElement('section')
    section.className = 'resume-section'
    section.innerHTML = `<h2>${inlineBoldToHtml(title || '')}</h2>`
    root.appendChild(section)
    const heading = section.querySelector('h2') as HTMLElement
    const height = getOuterHeight(heading)
    section.remove()
    return height
  }

  /**
   * 实测相邻两个模块之间的垂直间距（与 .resume-section + .resume-section 一致）
   * 避免手写像素与 CSS 不一致导致分页过早换页、第一页留白过大
   */
  const measureSectionGap = (): number => {
    const first = document.createElement('section')
    first.className = 'resume-section'
    first.innerHTML =
      '<h2>测</h2><div class="resume-entry"><div class="entry-head"><strong>标题</strong><span>时间</span></div><ul><li>要点</li></ul></div>'
    const second = document.createElement('section')
    second.className = 'resume-section'
    second.innerHTML = '<h2>测</h2><div class="resume-entry"><ul><li></li></ul></div>'
    root.appendChild(first)
    root.appendChild(second)
    const gap = second.getBoundingClientRect().top - first.getBoundingClientRect().bottom
    first.remove()
    second.remove()
    return Math.max(0, gap)
  }

  const measureEntry = (entry: ResumeEntry): number => {
    const wrapper = document.createElement('div')
    wrapper.className = 'resume-entry'
    const bulletsHtml = bulletNodesToHtml(entry.bullets)
    const showMeta = entry.showMeta !== false
    wrapper.innerHTML = `
      ${showMeta ? `<div class="entry-head"><span class="entry-heading-text">${inlineBoldToHtml(entry.heading || '')}</span><span class="entry-period">${inlineBoldToHtml(entry.period || '')}</span></div>` : ''}
      ${showMeta && entry.subheading ? `<p class="entry-sub">${inlineBoldToHtml(entry.subheading)}</p>` : ''}
      <ul class="resume-bullet-tree resume-bullet-tree--depth-0">${bulletsHtml || ''}</ul>
    `
    root.appendChild(wrapper)
    const height = getOuterHeight(wrapper)
    wrapper.remove()
    return height
  }

  const pageContentHeight = PAGE_HEIGHT - PAGE_PADDING_VERTICAL

  return {
    pageContentHeight,
    measureHeader,
    measureSectionTitle,
    measureSectionGap,
    measureEntry,
    dispose,
  }
}
