import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const styleCss = readFileSync(fileURLToPath(new URL('./style.css', import.meta.url)), 'utf8')

describe('style.css print fonts', () => {
  it('uses a broad CJK font stack for resume printing', () => {
    expect(styleCss).toContain('--resume-screen-font-family')
    expect(styleCss).toContain('--resume-print-font-family')
    expect(styleCss).toContain('"PingFang SC"')
    expect(styleCss).toContain('"Microsoft YaHei"')
    expect(styleCss).toContain('"Hiragino Sans GB"')
    expect(styleCss).toContain('"Songti SC"')
    expect(styleCss).toContain('"Noto Sans CJK SC"')
    expect(styleCss).toContain('"Source Han Sans SC"')
    expect(styleCss).toContain('"Heiti SC"')
    expect(styleCss).toContain('"SimSun"')
    expect(styleCss).toMatch(/@media print[\s\S]*font-family:\s*var\(--resume-print-font-family\)/)
    expect(styleCss).toMatch(/@media print[\s\S]*\.resume-page \*[\s\S]*-webkit-text-fill-color:\s*currentColor !important/)
    expect(styleCss).not.toMatch(/--resume-print-font-family:[^;]*PingFang SC/)
    expect(styleCss).not.toMatch(/--resume-print-font-family:[^;]*Heiti SC/)
  })
})

describe('style.css print layout', () => {
  it('keeps personal info values on one line when printing', () => {
    expect(styleCss).toMatch(/@media print[\s\S]*\.personal-info-value[\s\S]*white-space:\s*nowrap !important/)
    expect(styleCss).toMatch(/@media print[\s\S]*\.personal-info-value[\s\S]*overflow-wrap:\s*normal !important/)
    expect(styleCss).toMatch(/@media print[\s\S]*\.personal-info-value[\s\S]*word-break:\s*normal !important/)
  })
})
