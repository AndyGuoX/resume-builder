import type { BulletNode, ResumeEntry, ResumeSection, ResumeSectionType } from '../types/resume'
import { createBulletNode, generateResumeId } from './bulletNodes'

/** 二级标题 ##：允许行首空白、## 与标题之间可无空格；不与 ### 混淆 */
function matchH2Line(line: string): RegExpMatchArray | null {
  return line.match(/^\s*##\s*(?!#)(.*)$/)
}

/** 三级标题 ### */
function matchH3Line(line: string): RegExpMatchArray | null {
  return line.match(/^\s*###\s*(?!#)(.*)$/)
}

/** 是否为模块/条目标题行（元信息区、列表块遇到此行则结束） */
function isSectionHeadingLine(line: string): boolean {
  return matchH2Line(line) !== null || matchH3Line(line) !== null
}

/** 判断一行是否像「时间」行（含年份或日期片段），用于区分时间行与副标题 */
function looksLikePeriodLine(line: string): boolean {
  const t = line.trim()
  if (!t) {
    return false
  }
  return /\d{4}/.test(t) || /\d{1,2}[./-]\d{1,2}/.test(t)
}

/** 将要点树转为 Markdown 列表行（2 空格一级缩进） */
function bulletsToMarkdownLines(nodes: BulletNode[], depth = 0): string[] {
  const lines: string[] = []
  const pad = '  '.repeat(depth)
  for (const node of nodes) {
    lines.push(`${pad}- ${node.text}`)
    if (node.children.length) {
      lines.push(...bulletsToMarkdownLines(node.children, depth + 1))
    }
  }
  return lines
}

/** 将扁平的缩进列表行构造成 BulletNode 树（每 2 个前导空格为一级子项） */
function indentedLinesToBulletTree(rows: { indent: number; text: string }[]): BulletNode[] {
  if (!rows.length) {
    return [createBulletNode('')]
  }
  const roots: BulletNode[] = []
  // lastAtDepth[d]：深度 d 上最近一个节点，用于挂接子级
  const lastAtDepth: BulletNode[] = []

  for (const row of rows) {
    const node = createBulletNode(row.text)
    const d = row.indent

    if (d === 0) {
      roots.push(node)
      lastAtDepth[0] = node
      lastAtDepth.length = 1
      continue
    }

    const parent = lastAtDepth[d - 1]
    if (parent) {
      parent.children.push(node)
      lastAtDepth[d] = node
      lastAtDepth.length = d + 1
    } else {
      roots.push(node)
      lastAtDepth[0] = node
      lastAtDepth.length = 1
    }
  }

  return roots.length ? roots : [createBulletNode('')]
}

/** 解析无序列表行：前导空格（每 2 格一级）+ `-` 或 `*` */
function parseBulletBlock(lines: string[], startIndex: number): { rows: { indent: number; text: string }[]; nextIndex: number } {
  const rows: { indent: number; text: string }[] = []
  let i = startIndex
  while (i < lines.length) {
    const raw = lines[i]
    if (isSectionHeadingLine(raw)) {
      break
    }
    const bulletMatch = raw.match(/^(\s*)[-*]\s+(.*)$/)
    if (bulletMatch) {
      const lead = bulletMatch[1] ?? ''
      const indent = Math.min(Math.floor(lead.length / 2), 32)
      rows.push({ indent, text: bulletMatch[2] ?? '' })
      i += 1
      continue
    }
    if (raw.trim() === '') {
      i += 1
      continue
    }
    break
  }
  return { rows, nextIndex: i }
}

/** 按树形位置合并 id，减少编辑 Markdown 时列表重渲染 */
function mergeBulletNodeIds(prev: BulletNode[], next: BulletNode[]): void {
  const n = Math.min(prev.length, next.length)
  for (let i = 0; i < n; i += 1) {
    next[i].id = prev[i].id
    mergeBulletNodeIds(prev[i].children, next[i].children)
  }
}

/** 从 start 起下一行 ## / ### 的索引（不含），无则 length */
function findNextHeadingLineIndex(lines: string[], start: number): number {
  for (let j = start; j < lines.length; j += 1) {
    if (matchH2Line(lines[j]) || matchH3Line(lines[j])) {
      return j
    }
  }
  return lines.length
}

/**
 * 解析「### 之后」或「无 ### 时一整块」的正文：时间/副标题 + 列表；slice 内剩余行在已有列表时追加为要点，否则并入副标题
 */
function parseEntryBodyInSlice(blockLines: string[]): {
  period: string
  subheading: string
  bullets: BulletNode[]
} {
  let i = 0
  while (i < blockLines.length && blockLines[i].trim() === '') {
    i += 1
  }
  if (i >= blockLines.length) {
    return { period: '', subheading: '', bullets: [createBulletNode('')] }
  }

  const meta: string[] = []
  while (i < blockLines.length) {
    const peek = blockLines[i]
    if (isSectionHeadingLine(peek)) {
      break
    }
    if (/^\s*[-*]\s+/.test(peek)) {
      break
    }
    if (peek.trim() === '') {
      i += 1
      continue
    }
    meta.push(peek.trim())
    i += 1
    if (meta.length >= 2) {
      break
    }
  }

  let period = ''
  let subheading = ''
  if (meta.length === 0) {
    period = ''
    subheading = ''
  } else if (meta.length === 1) {
    const only = meta[0] ?? ''
    if (looksLikePeriodLine(only)) {
      period = only
      subheading = ''
    } else {
      period = ''
      subheading = only
    }
  } else {
    const a = meta[0] ?? ''
    const b = meta[1] ?? ''
    // 说明行 + 时间行 或 时间行 + 副标题（两行顺序不固定）
    if (looksLikePeriodLine(a) && !looksLikePeriodLine(b)) {
      period = a
      subheading = b
    } else if (!looksLikePeriodLine(a) && looksLikePeriodLine(b)) {
      period = b
      subheading = a
    } else {
      period = a
      subheading = b
    }
  }

  let bulletParse = parseBulletBlock(blockLines, i)
  i = bulletParse.nextIndex
  if (
    bulletParse.rows.length === 0 &&
    i < blockLines.length &&
    !isSectionHeadingLine(blockLines[i] ?? '') &&
    !/^\s*[-*]\s+/.test(blockLines[i] ?? '') &&
    (blockLines[i] ?? '').trim() !== ''
  ) {
    i += 1
    bulletParse = parseBulletBlock(blockLines, i)
    i = bulletParse.nextIndex
  }

  let bullets = indentedLinesToBulletTree(bulletParse.rows)

  if (i < blockLines.length) {
    const tailLines = blockLines.slice(i)
    const tail = tailLines.join('\n').trim()
    if (tail) {
      if (bulletParse.rows.length === 0) {
        subheading = subheading ? `${subheading}\n${tail}` : tail
      } else {
        for (const tl of tailLines) {
          const t = tl.trim()
          if (t) {
            bullets.push(createBulletNode(t))
          }
        }
      }
    }
  }

  return { period, subheading, bullets }
}

function preserveStructureIds(parsed: ResumeSection[], previous: ResumeSection[] | undefined): void {
  if (!previous?.length) {
    return
  }
  for (let si = 0; si < parsed.length; si += 1) {
    const pSec = previous[si]
    const nSec = parsed[si]
    if (!pSec || !nSec) {
      continue
    }
    nSec.id = pSec.id
    nSec.type = pSec.type
    for (let ei = 0; ei < nSec.entries.length; ei += 1) {
      const pEn = pSec.entries[ei]
      const nEn = nSec.entries[ei]
      if (!pEn || !nEn) {
        continue
      }
      nEn.id = pEn.id
      mergeBulletNodeIds(pEn.bullets, nEn.bullets)
    }
  }
}

/** 从 Markdown 解析模块区，生成与原先表单一致的 sections 结构（预览样式不变） */
export function parseModulesMarkdown(source: string, previous?: ResumeSection[]): ResumeSection[] {
  const text = source.replace(/\r\n/g, '\n')
  const lines = text.split('\n')
  const sections: ResumeSection[] = []
  let currentSection: ResumeSection | null = null

  const ensureSection = (): ResumeSection => {
    if (currentSection) {
      return currentSection
    }
    const fallback: ResumeSection = {
      id: generateResumeId('section'),
      type: 'custom' as ResumeSectionType,
      title: '未命名模块',
      entries: [],
    }
    sections.push(fallback)
    currentSection = fallback
    return fallback
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const h2 = matchH2Line(line)
    if (h2) {
      currentSection = {
        id: generateResumeId('section'),
        type: 'custom',
        title: (h2[1] ?? '').trim() || '未命名模块',
        entries: [],
      }
      sections.push(currentSection)
      i += 1
      continue
    }

    const h3 = matchH3Line(line)
    if (h3) {
      const section = ensureSection()
      const heading = (h3[1] ?? '').trim()
      i += 1
      const bodyEnd = findNextHeadingLineIndex(lines, i)
      const bodySlice = lines.slice(i, bodyEnd)
      const { period, subheading, bullets } = parseEntryBodyInSlice(bodySlice)
      section.entries.push({
        id: generateResumeId('entry'),
        heading,
        subheading,
        period,
        bullets,
      })
      i = bodyEnd
      continue
    }

    // 有 ## 模块但删掉了 ###：从当前行到下一标题之间的内容解析为一条「无主标题」条目
    if (line.trim() !== '' && currentSection) {
      const bodyEnd = findNextHeadingLineIndex(lines, i)
      const bodySlice = lines.slice(i, bodyEnd)
      const onlyWs = bodySlice.every((l) => l.trim() === '')
      if (!onlyWs) {
        const { period, subheading, bullets } = parseEntryBodyInSlice(bodySlice)
        currentSection.entries.push({
          id: generateResumeId('entry'),
          heading: '',
          subheading,
          period,
          bullets,
        })
        i = bodyEnd
        continue
      }
    }

    if (line.trim() === '') {
      i += 1
      continue
    }

    i += 1
  }

  preserveStructureIds(sections, previous)
  return sections
}

function serializeEntryMarkdown(entry: ResumeEntry): string {
  const lines: string[] = []
  const h = entry.heading.trim()
  if (h) {
    lines.push(`### ${entry.heading}`)
  }
  const p = entry.period.trim()
  const s = entry.subheading.trim()
  if (p) {
    lines.push(p)
  }
  if (s) {
    lines.push(s)
  }
  const bulletLines = bulletsToMarkdownLines(entry.bullets)
  lines.push('')
  if (bulletLines.length) {
    lines.push(...bulletLines)
  } else {
    lines.push('- ')
  }
  return lines.join('\n')
}

/** 将 sections 序列化为模块区 Markdown（## 模块、### 主标题） */
export function serializeModulesMarkdown(sections: ResumeSection[]): string {
  const chunks: string[] = []
  for (const section of sections) {
    const block: string[] = [`## ${section.title}`]
    for (const entry of section.entries) {
      block.push('')
      block.push(serializeEntryMarkdown(entry))
    }
    chunks.push(block.join('\n'))
  }
  return chunks.join('\n\n')
}
