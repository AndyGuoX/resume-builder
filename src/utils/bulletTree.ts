import { createBulletNode } from '../constants/defaultResume'
import type { BulletNode, ResumeDocument } from '../types/resume'

/** 将要点树渲染为与预览一致的嵌套 ul/li HTML（用于测量高度）；depth 与 BulletList 层级 class 一致 */
export function bulletNodesToHtml(nodes: BulletNode[], depth = 0): string {
  if (!nodes.length) {
    return ''
  }
  const items = nodes
    .map((node) => {
      const childDepth = depth + 1
      const childHtml = node.children.length ? bulletNodesToHtml(node.children, childDepth) : ''
      const depthClass = `resume-bullet-tree resume-bullet-tree--depth-${childDepth % 4}`
      const nested = childHtml ? `<ul class="${depthClass}">${childHtml}</ul>` : ''
      return `<li>${escapeHtml(node.text)}${nested}</li>`
    })
    .join('')
  return items
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 兼容旧版 string[] 要点 */
export function migrateBulletNode(raw: unknown): BulletNode {
  if (typeof raw === 'string') {
    return createBulletNode(raw)
  }
  if (raw && typeof raw === 'object' && 'text' in raw) {
    const r = raw as { id?: string; text?: string; children?: unknown[] }
    return {
      id: typeof r.id === 'string' && r.id.length ? r.id : `bl-${Math.random().toString(36).slice(2, 10)}`,
      text: String(r.text ?? ''),
      children: Array.isArray(r.children) ? r.children.map(migrateBulletNode) : [],
    }
  }
  return createBulletNode('')
}

export function migrateBulletsArray(raw: unknown): BulletNode[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [createBulletNode('')]
  }
  if (typeof raw[0] === 'string') {
    return (raw as string[]).map((line) => createBulletNode(line))
  }
  return raw.map(migrateBulletNode)
}

/** 遍历简历，将条目的要点统一为 BulletNode 树 */
export function ensureResumeBulletTrees(doc: ResumeDocument): void {
  for (const section of doc.sections) {
    for (const entry of section.entries) {
      entry.bullets = migrateBulletsArray(entry.bullets as unknown)
    }
  }
}
