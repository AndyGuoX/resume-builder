import { describe, expect, it } from 'vitest'
import { inlineBoldToHtml, parseInlineBold } from './inlineBold'

describe('inlineBold', () => {
  it('解析 **加粗**', () => {
    expect(parseInlineBold('aa**bb**cc')).toEqual([
      { text: 'aa' },
      { text: 'bb', bold: true },
      { text: 'cc' },
    ])
  })

  it('多处加粗', () => {
    const s = parseInlineBold('**A**与**B**')
    expect(s).toEqual([
      { text: 'A', bold: true },
      { text: '与' },
      { text: 'B', bold: true },
    ])
  })

  it('无 ** 时整段为普通文本', () => {
    expect(parseInlineBold('纯文本')).toEqual([{ text: '纯文本' }])
  })

  it('仅空格或无内容的 ** 不应加粗', () => {
    const withSpaces = parseInlineBold('前缀**   **后缀')
    expect(withSpaces.every((seg) => !seg.bold)).toBe(true)
    expect(withSpaces.map((seg) => seg.text).join('')).toBe('前缀**   **后缀')
    expect(parseInlineBold('****')).toEqual([{ text: '****' }])
  })

  it('其他符号不应触发加粗', () => {
    expect(parseInlineBold('*x*')).toEqual([{ text: '*x*' }])
    expect(parseInlineBold('__x__')).toEqual([{ text: '__x__' }])
  })

  it('inlineBoldToHtml 转义并包 strong', () => {
    expect(inlineBoldToHtml('a**b<c**')).toContain('&lt;')
    expect(inlineBoldToHtml('**x**')).toContain('<strong>')
  })
})
