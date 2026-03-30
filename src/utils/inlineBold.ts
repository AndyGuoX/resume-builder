export interface InlineSegment {
  text: string
  bold?: boolean
}

/** 将 `**加粗**` 解析为片段（内容中不含 `*`；未闭合的 `**` 保留原文） */
export function parseInlineBold(source: string): InlineSegment[] {
  if (!source) {
    return [{ text: '' }]
  }
  const segments: InlineSegment[] = []
  const pattern = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(source)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ text: source.slice(lastIndex, m.index) })
    }
    segments.push({ text: m[1] ?? '', bold: true })
    lastIndex = m.index + (m[0]?.length ?? 0)
  }
  if (lastIndex < source.length) {
    segments.push({ text: source.slice(lastIndex) })
  }
  if (segments.length === 0) {
    return [{ text: source }]
  }
  return segments
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 用于测量高度：与预览一致的 HTML（仅 strong + 转义） */
export function inlineBoldToHtml(source: string): string {
  if (!source) {
    return ''
  }
  return parseInlineBold(source)
    .map((s) => {
      const e = escapeHtml(s.text)
      return s.bold ? `<strong>${e}</strong>` : e
    })
    .join('')
}
