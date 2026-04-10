export interface InlineSegment {
  text: string
  bold?: boolean
  tag?: boolean
}

/** 将 `**加粗**` 解析为片段（仅 `**...**` 且内容含非空白；未闭合保留原文） */
export function parseInlineBold(source: string): InlineSegment[] {
  if (!source) {
    return [{ text: '' }]
  }
  const segments: InlineSegment[] = []
  const pattern = /(\*\*([^*]+)\*\*)|(\{([^}]+)\})/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(source)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ text: source.slice(lastIndex, m.index) })
    }
    if (m[2] !== undefined) {
      const boldContent = m[2]
      // 仅当 **...** 中存在非空白字符时才视为加粗，避免空格触发
      if (boldContent.trim().length > 0) {
        segments.push({ text: boldContent, bold: true })
      } else {
        segments.push({ text: m[0] })
      }
    } else if (m[4] !== undefined) {
      segments.push({ text: m[4], tag: true })
    }
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
export function inlineBoldToHtml(source: string, themeColor?: string): string {
  if (!source) {
    return ''
  }
  const tagStyle = themeColor
    ? `style="--tag-bg-color:${themeColor}20;--tag-text-color:${themeColor}"`
    : ''
  return parseInlineBold(source)
    .map((s) => {
      const e = escapeHtml(s.text)
      if (s.bold) return `<strong>${e}</strong>`
      if (s.tag) return `<span class="resume-tag"${tagStyle}>${e}</span>`
      return e
    })
    .join('')
}
