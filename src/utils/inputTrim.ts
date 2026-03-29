/** 行首 Unicode 空白（含普通空格、NBSP、全角空格等） */
const LEADING_WHITE_SPACE = /^\p{White_Space}+/u

/** 去掉行首空白（输入过程中禁止以空白开头） */
export function trimLeading(s: string): string {
  return s.replace(LEADING_WHITE_SPACE, '')
}

/** 失焦时去掉首尾空白 */
export function trimBothEnds(s: string): string {
  return s.trim()
}

/**
 * insertText 时在插入位置为 0 且插入内容仅为空白时阻止，避免空格先进入 DOM
 * IME 组合输入过程中不拦截，避免影响中文输入
 */
export function blockLeadingSpaceBeforeInput(e: Event): void {
  const ie = e as InputEvent
  if (ie.isComposing) {
    return
  }
  if (ie.inputType !== 'insertText' || ie.data == null) {
    return
  }
  if (!/^\p{White_Space}+$/u.test(ie.data)) {
    return
  }
  const t = ie.target as HTMLInputElement
  if ((t.selectionStart ?? 0) > 0) {
    return
  }
  ie.preventDefault()
}

/**
 * 不支持 beforeinput 时的兜底：光标在行首且无选区时拦截空格键
 */
export function blockLeadingSpaceKeydown(e: KeyboardEvent): void {
  if (e.key !== ' ' && e.code !== 'Space') {
    return
  }
  if (e.isComposing) {
    return
  }
  const t = e.target as HTMLInputElement
  const start = t.selectionStart ?? 0
  const end = t.selectionEnd ?? 0
  // 有选区时交给 input 去 trim（例如替换行首选中内容）
  if (start !== 0 || end !== 0) {
    return
  }
  e.preventDefault()
}

/**
 * @input：同步去掉行首空白并修正光标（受控组件仅靠赋值可能仍短暂显示行首空格）
 */
export function inputTrimLeading(e: Event): string {
  const el = e.target as HTMLInputElement
  const raw = el.value
  const next = trimLeading(raw)
  if (raw !== next) {
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const removed = raw.length - next.length
    el.value = next
    const newStart = Math.max(0, start - removed)
    const newEnd = Math.max(0, end - removed)
    el.setSelectionRange(newStart, newEnd)
  }
  return next
}

/** 粘贴后合并文本并去掉整段行首空白，并尽量恢复光标 */
export function onPasteTrimLeading(e: ClipboardEvent, apply: (v: string) => void): void {
  e.preventDefault()
  const el = e.target as HTMLInputElement
  const text = e.clipboardData?.getData('text/plain') ?? ''
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const merged = el.value.slice(0, start) + text + el.value.slice(end)
  const next = trimLeading(merged)
  apply(next)
  const removed = merged.length - next.length
  const pos = Math.min(next.length, Math.max(0, start + text.length - removed))
  queueMicrotask(() => {
    try {
      el.setSelectionRange(pos, pos)
    } catch {
      /* 失焦等情况下忽略 */
    }
  })
}

/** @blur：去掉首尾空白 */
export function inputTrimOnBlur(e: Event): string {
  return trimBothEnds((e.target as HTMLInputElement).value)
}
