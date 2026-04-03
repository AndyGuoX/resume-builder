import { createBulletNode } from './bulletNodes'
import type { BulletNode, ResumeDocument } from '../types/resume'
import { inlineBoldToHtml } from './inlineBold'

function renderNodeHtml(node: BulletNode, depth: number): string {
  const childDepth = depth + 1
  const childHtml = node.children.length ? bulletNodesToHtml(node.children, childDepth) : ''
  const depthClass = `resume-bullet-tree resume-bullet-tree--depth-${childDepth % 4}`
  const nested = childHtml ? `<ul class="${depthClass}">${childHtml}</ul>` : ''
  
  let contentHtml = ''
  if (node.subheading) {
    contentHtml = `<span class="bullet-subheading">${inlineBoldToHtml(node.subheading)}</span>`
  }
  if (node.content) {
    contentHtml += `<span class="bullet-content">${inlineBoldToHtml(node.content)}</span>`
  }
  if (!node.subheading && !node.content) {
    contentHtml = inlineBoldToHtml('')
  }
  
  return `<li>${contentHtml}${nested}</li>`
}

/** 将要点树渲染为与预览一致的嵌套 ul/li HTML（用于测量高度）；depth 与 BulletList 层级 class 一致 */
export function bulletNodesToHtml(nodes: BulletNode[], depth = 0): string {
  if (!nodes.length) {
    return ''
  }
  const items = nodes.map((node) => renderNodeHtml(node, depth)).join('')
  return items
}

/** 兼容旧版 string[] 要点 */
export function migrateBulletNode(raw: unknown): BulletNode {
  if (typeof raw === 'string') {
    return createBulletNode(raw)
  }
  if (raw && typeof raw === 'object') {
    const r = raw as { id?: string; text?: string; content?: string; subheading?: string; children?: unknown[] }
    return {
      id: typeof r.id === 'string' && r.id.length ? r.id : `bl-${Math.random().toString(36).slice(2, 10)}`,
      subheading: r.subheading,
      content: r.content ?? r.text ?? '',
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
