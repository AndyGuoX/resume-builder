import { saveAs } from 'file-saver'
import { toCanvas, toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
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

function getPageElements(previewRoot: HTMLElement): HTMLElement[] {
  return Array.from(previewRoot.querySelectorAll<HTMLElement>('.resume-page'))
}

function mmRectFitA4(canvas: HTMLCanvasElement): { x: number; y: number; w: number; h: number } {
  const pageW = 210
  const pageH = 1123
  const mmPerPx = 25.4 / 96
  const pageH_mm = pageH * mmPerPx
  const cw = canvas.width
  const ch = canvas.height
  if (!cw || !ch) {
    return { x: 0, y: 0, w: pageW, h: pageH_mm }
  }
  const r = cw / ch
  let w = pageW
  let h = pageW / r
  if (h > pageH_mm) {
    h = pageH_mm
    w = pageH_mm * r
  }
  return {
    x: (pageW - w) / 2,
    y: (pageH_mm - h) / 2,
    w,
    h,
  }
}

export async function exportPdf(previewRoot: HTMLElement, fileBaseName: string) {
  const pages = getPageElements(previewRoot)
  if (!pages.length) {
    throw new Error('未找到可导出的简历页面')
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  for (let index = 0; index < pages.length; index += 1) {
    const canvas = await toCanvas(pages[index], {
      pixelRatio: CAPTURE_SCALE,
      backgroundColor: '#ffffff',
      cacheBust: true,
    })
    const imageData = canvas.toDataURL('image/png')
    if (index > 0) {
      pdf.addPage('a4', 'p')
    }
    const { x, y, w, h } = mmRectFitA4(canvas)
    pdf.addImage(imageData, 'PNG', x, y, w, h)
  }

  pdf.save(`${fileBaseName}.pdf`)
}

export async function exportPng(previewRoot: HTMLElement, fileBaseName: string) {
  const pages = getPageElements(previewRoot)
  if (!pages.length) {
    throw new Error('未找到可导出的简历页面')
  }

  if (pages.length === 1) {
    const singleImage = await toPng(pages[0], {
      pixelRatio: CAPTURE_SCALE,
      backgroundColor: '#ffffff',
    })
    saveAs(singleImage, `${fileBaseName}.png`)
    return
  }

  const zip = new JSZip()
  // 多页图片会打成 zip，避免浏览器连续弹下载框影响体验
  for (let index = 0; index < pages.length; index += 1) {
    const imageUrl = await toPng(pages[index], {
      pixelRatio: CAPTURE_SCALE,
      backgroundColor: '#ffffff',
    })
    const base64Data = imageUrl.split(',')[1]
    zip.file(`${fileBaseName}-${index + 1}.png`, base64Data, { base64: true })
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${fileBaseName}.zip`)
}

function buildWordHtml(previewRoot: HTMLElement): string {
  const styleContent = `
    <style>
      body { background:#ffffff; font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif; }
      .resume-page { width: 210mm; min-height: 1123px; box-sizing: border-box; page-break-after: always; }
      .resume-page:last-child { page-break-after: auto; }
    </style>
  `
  return `<!DOCTYPE html><html><head><meta charset="utf-8" />${styleContent}</head><body>${previewRoot.innerHTML}</body></html>`
}

export async function exportWord(previewRoot: HTMLElement, fileBaseName: string) {
  const pages = getPageElements(previewRoot)
  if (!pages.length) {
    throw new Error('未找到可导出的简历页面')
  }
  const html = buildWordHtml(previewRoot)
  const blob = await asBlob(html)
  saveAs(blob as Blob, `${fileBaseName}.docx`)
}
