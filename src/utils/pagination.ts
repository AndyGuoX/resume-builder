import type { BulletNode, PaginatedPage, ResumeEntry, ResumeSection } from '../types/resume'

const SECTION_TITLE_LINES = 2
const SECTION_MARGIN_LINES = 1
const ENTRY_BASE_LINES = 3
const BULLET_LINE_FACTOR = 1
const TEXT_WRAP_BASE = 28

function calculateTextLines(text: string): number {
  if (!text.trim()) {
    return 0
  }
  return Math.max(1, Math.ceil(text.length / TEXT_WRAP_BASE))
}

function bulletSubtreeLines(node: BulletNode): number {
  const self = Math.max(1, calculateTextLines(node.text))
  const child = node.children.reduce((sum, c) => sum + bulletSubtreeLines(c), 0)
  return self + child
}

function estimateEntryLines(entry: ResumeEntry): number {
  const bulletLines = entry.bullets.reduce((sum, bullet) => sum + bulletSubtreeLines(bullet), 0)
  const headingLines = calculateTextLines(entry.heading)
  const subheadingLines = calculateTextLines(entry.subheading)
  const periodLines = calculateTextLines(entry.period)
  return ENTRY_BASE_LINES + headingLines + subheadingLines + periodLines + bulletLines * BULLET_LINE_FACTOR
}

function sectionBaseLines(): number {
  return SECTION_TITLE_LINES + SECTION_MARGIN_LINES
}

function splitEntryByAvailableLines(
  entry: ResumeEntry,
  availableLines: number,
  segmentIndex: number,
): { fittedEntry: ResumeEntry; fittedLines: number; remainingEntry: ResumeEntry | null } | null {
  const fixedLines =
    ENTRY_BASE_LINES + calculateTextLines(entry.heading) + calculateTextLines(entry.subheading) + calculateTextLines(entry.period)

  if (availableLines <= fixedLines + 1) {
    return null
  }

  let usedBulletLines = 0
  let splitIndex = 0

  for (let index = 0; index < entry.bullets.length; index += 1) {
    const bullet = entry.bullets[index]
    const bulletLines = bulletSubtreeLines(bullet)
    if (fixedLines + usedBulletLines + bulletLines > availableLines) {
      break
    }
    usedBulletLines += bulletLines
    splitIndex = index + 1
  }

  if (splitIndex === 0) {
    return null
  }

  const fittedBullets = entry.bullets.slice(0, splitIndex)
  const remainingBullets = entry.bullets.slice(splitIndex)

  const fittedEntry: ResumeEntry = {
    ...entry,
    id: `${entry.id}-seg-${segmentIndex}`,
    bullets: fittedBullets,
  }
  const fittedLines = fixedLines + usedBulletLines

  if (!remainingBullets.length) {
    return {
      fittedEntry,
      fittedLines,
      remainingEntry: null,
    }
  }

  return {
    fittedEntry,
    fittedLines,
    remainingEntry: {
      ...entry,
      id: `${entry.id}-remain-${segmentIndex}`,
      bullets: remainingBullets,
    },
  }
}

export function paginateSections(sections: ResumeSection[], pageLineLimit = 56): PaginatedPage[] {
  const pages: PaginatedPage[] = []
  let currentPageSections: ResumeSection[] = []
  let usedLines = 0
  let pageNumber = 1
  let segmentIndex = 1

  const getCurrentPageLimit = (): number => {
    // 首页面带头部，后续页面无头部，可容纳更多内容
    return pageNumber === 1 ? pageLineLimit : pageLineLimit + 10
  }

  const pushPage = () => {
    if (!currentPageSections.length) {
      return
    }
    pages.push({
      pageNumber,
      sections: currentPageSections,
    })
    pageNumber += 1
    currentPageSections = []
    usedLines = 0
  }

  sections.forEach((section) => {
    let chunkEntries: ResumeEntry[] = []
    let chunkLines = sectionBaseLines()
    let chunkIndex = 1

    const pushChunkToPage = () => {
      if (!chunkEntries.length) {
        return
      }
      const shouldSuffixTitle = chunkIndex > 1
      const chunkTitle = shouldSuffixTitle ? `${section.title}（续${chunkIndex}）` : section.title
      const nextSection: ResumeSection = {
        ...section,
        title: chunkTitle,
        entries: chunkEntries,
      }
      currentPageSections.push(nextSection)
      usedLines += chunkLines
      chunkEntries = []
      chunkLines = sectionBaseLines()
      chunkIndex += 1
    }

    const pendingEntries = [...section.entries]
    while (pendingEntries.length) {
      const currentEntry = pendingEntries.shift()
      if (!currentEntry) {
        continue
      }

      const currentLimit = getCurrentPageLimit()
      const entryLines = estimateEntryLines(currentEntry)
      const availableLines = currentLimit - (usedLines + chunkLines)

      if (entryLines <= availableLines) {
        chunkEntries.push(currentEntry)
        chunkLines += entryLines
        continue
      }

      if (chunkEntries.length) {
        pushChunkToPage()
        if (usedLines >= getCurrentPageLimit() - sectionBaseLines()) {
          pushPage()
        }
        pendingEntries.unshift(currentEntry)
        continue
      }

      const splitResult = splitEntryByAvailableLines(currentEntry, availableLines, segmentIndex)
      if (splitResult) {
        segmentIndex += 1
        chunkEntries.push(splitResult.fittedEntry)
        chunkLines += splitResult.fittedLines
        pushChunkToPage()
        pushPage()
        if (splitResult.remainingEntry) {
          pendingEntries.unshift(splitResult.remainingEntry)
        }
        continue
      }

      if (currentPageSections.length) {
        pushPage()
        pendingEntries.unshift(currentEntry)
        continue
      }

      const emptyPageAvailable = getCurrentPageLimit() - sectionBaseLines()
      const forceSplit = splitEntryByAvailableLines(currentEntry, emptyPageAvailable, segmentIndex)
      if (forceSplit) {
        segmentIndex += 1
        chunkEntries.push(forceSplit.fittedEntry)
        chunkLines += forceSplit.fittedLines
        pushChunkToPage()
        pushPage()
        if (forceSplit.remainingEntry) {
          pendingEntries.unshift(forceSplit.remainingEntry)
        }
      } else {
        // 极端情况下兜底，防止出现无限循环
        chunkEntries.push(currentEntry)
        chunkLines += entryLines
        pushChunkToPage()
        pushPage()
      }
    }

    pushChunkToPage()
  })

  pushPage()
  return pages.length ? pages : [{ pageNumber: 1, sections: [] }]
}
