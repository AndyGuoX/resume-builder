import { saveAs } from 'file-saver'
import { toPng } from 'html-to-image'
import { asBlob } from 'html-docx-js-typescript'

/** 与 PNG 导出一致，用 html-to-image 光栅化，文字与列表符号通常比 html2canvas 更稳 */
const CAPTURE_SCALE = 2

/** 将简历主标题转为安全、可用的文件名（无扩展名） */
export function sanitizeResumeFileName(resumeTitle: string): string {
  const trimmed = (resumeTitle || '').trim() || '简历'
  const safe = trimmed
    .replace(/[/\\?%*:|"<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
  return safe || '简历'
}

function getResumePageElement(previewRoot: HTMLElement): HTMLElement | null {
  return previewRoot.querySelector<HTMLElement>('.resume-page')
}

export async function exportPng(previewRoot: HTMLElement, fileBaseName: string) {
  const pageEl = getResumePageElement(previewRoot)
  if (!pageEl) {
    throw new Error('未找到可导出的简历页面')
  }

  const singleImage = await toPng(pageEl, {
    pixelRatio: CAPTURE_SCALE,
    backgroundColor: '#ffffff',
  })
  saveAs(singleImage, `${fileBaseName}.png`)
}

function buildWordHtml(previewRoot: HTMLElement): string {
  const styleContent = `
    <style>
      body { background:#ffffff; font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif; }
      .resume-page { width: 210mm; max-width: 210mm; height: auto; box-sizing: border-box; padding: 5mm 10mm 20mm 10mm; }
    </style>
  `
  return `<!DOCTYPE html><html><head><meta charset="utf-8" />${styleContent}</head><body>${previewRoot.innerHTML}</body></html>`
}

export async function exportWord(previewRoot: HTMLElement, fileBaseName: string) {
  if (!getResumePageElement(previewRoot)) {
    throw new Error('未找到可导出的简历页面')
  }
  const html = buildWordHtml(previewRoot)
  const blob = await asBlob(html)
  saveAs(blob as Blob, `${fileBaseName}.docx`)
}
