import type { PaginatedPage, ResumeEntry, ResumeSection } from '../types/resume'

// 浮点高度比较容差，减轻 subpixel 导致的“少塞一条”留白
const HEIGHT_EPS = 1

interface PaginationByMeasurementOptions {
  firstPageLimit: number
  nextPageLimit: number
  sectionGap: number
  measureSectionTitle: (title: string) => number
  measureEntry: (entry: ResumeEntry) => number
}

/** 顶层多条要点：按顶层节点切片 */
function splitTopLevelBullets(
  entry: ResumeEntry,
  availableHeight: number,
  measureEntry: (entry: ResumeEntry) => number,
  splitIndexSeed: number,
): { fittedEntry: ResumeEntry; remainingEntry: ResumeEntry | null; nextSplitIndexSeed: number } | null {
  if (entry.bullets.length <= 1) {
    return null
  }

  let left = 1
  let right = entry.bullets.length
  let bestFitCount = 0

  while (left <= right) {
    const middle = Math.floor((left + right) / 2)
    const candidateEntry: ResumeEntry = {
      ...entry,
      bullets: entry.bullets.slice(0, middle),
    }
    const candidateHeight = measureEntry(candidateEntry)
    if (candidateHeight <= availableHeight + HEIGHT_EPS) {
      bestFitCount = middle
      left = middle + 1
    } else {
      right = middle - 1
    }
  }

  if (bestFitCount === 0) {
    return null
  }

  const fittedEntry: ResumeEntry = {
    ...entry,
    id: `${entry.id}-split-${splitIndexSeed}`,
    bullets: entry.bullets.slice(0, bestFitCount),
  }
  const remainingBullets = entry.bullets.slice(bestFitCount)

  if (!remainingBullets.length) {
    return {
      fittedEntry,
      remainingEntry: null,
      nextSplitIndexSeed: splitIndexSeed + 1,
    }
  }

  return {
    fittedEntry,
    remainingEntry: {
      ...entry,
      id: `${entry.id}-remain-${splitIndexSeed}`,
      bullets: remainingBullets,
      showMeta: false,
    },
    nextSplitIndexSeed: splitIndexSeed + 1,
  }
}

/** 仅一条顶层要点但有多条子要点：在子节点之间拆分 */
function splitSingleParentChildren(
  entry: ResumeEntry,
  availableHeight: number,
  measureEntry: (entry: ResumeEntry) => number,
  splitIndexSeed: number,
): { fittedEntry: ResumeEntry; remainingEntry: ResumeEntry | null; nextSplitIndexSeed: number } | null {
  if (entry.bullets.length !== 1) {
    return null
  }
  const parent = entry.bullets[0]
  if (parent.children.length <= 1) {
    return null
  }

  let left = 1
  let right = parent.children.length
  let bestFitCount = 0

  while (left <= right) {
    const middle = Math.floor((left + right) / 2)
    const candidateEntry: ResumeEntry = {
      ...entry,
      bullets: [{ ...parent, children: parent.children.slice(0, middle) }],
    }
    const candidateHeight = measureEntry(candidateEntry)
    if (candidateHeight <= availableHeight + HEIGHT_EPS) {
      bestFitCount = middle
      left = middle + 1
    } else {
      right = middle - 1
    }
  }

  if (bestFitCount === 0) {
    return null
  }

  const fittedEntry: ResumeEntry = {
    ...entry,
    id: `${entry.id}-split-${splitIndexSeed}`,
    bullets: [{ ...parent, id: `${parent.id}-split`, children: parent.children.slice(0, bestFitCount) }],
  }
  const remainingChildren = parent.children.slice(bestFitCount)

  if (!remainingChildren.length) {
    return {
      fittedEntry,
      remainingEntry: null,
      nextSplitIndexSeed: splitIndexSeed + 1,
    }
  }

  return {
    fittedEntry,
    remainingEntry: {
      ...entry,
      id: `${entry.id}-remain-${splitIndexSeed}`,
      bullets: remainingChildren,
      showMeta: false,
    },
    nextSplitIndexSeed: splitIndexSeed + 1,
  }
}

function splitEntryByAvailableHeight(
  entry: ResumeEntry,
  availableHeight: number,
  measureEntry: (entry: ResumeEntry) => number,
  splitIndexSeed: number,
): { fittedEntry: ResumeEntry; remainingEntry: ResumeEntry | null; nextSplitIndexSeed: number } | null {
  const top = splitTopLevelBullets(entry, availableHeight, measureEntry, splitIndexSeed)
  if (top) {
    return top
  }
  return splitSingleParentChildren(entry, availableHeight, measureEntry, splitIndexSeed)
}

export function paginateSectionsByMeasurement(
  sections: ResumeSection[],
  options: PaginationByMeasurementOptions,
): PaginatedPage[] {
  const pages: PaginatedPage[] = []
  let currentPageSections: ResumeSection[] = []
  let usedHeight = 0
  let pageNumber = 1
  let splitIndexSeed = 1

  const currentPageLimit = () => (pageNumber === 1 ? options.firstPageLimit : options.nextPageLimit)

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
    usedHeight = 0
  }

  for (const section of sections) {
    const pendingEntries = [...section.entries]
    let sectionChunkIndex = 1

    while (pendingEntries.length) {
      const isSectionFirstChunk = sectionChunkIndex === 1
      const sectionTitle = section.title
      const shouldShowTitle = pageNumber === 1 && isSectionFirstChunk
      const titleHeight = shouldShowTitle ? options.measureSectionTitle(sectionTitle) : 0
      const sectionStartGap = currentPageSections.length ? options.sectionGap : 0
      const sectionStartHeight = titleHeight + sectionStartGap

      if (usedHeight + sectionStartHeight > currentPageLimit() && currentPageSections.length) {
        pushPage()
        continue
      }

      const chunkEntries: ResumeEntry[] = []
      let chunkHeight = sectionStartHeight

      while (pendingEntries.length) {
        const currentEntry = pendingEntries[0]
        const entryHeight = options.measureEntry(currentEntry)
        const availableHeight = currentPageLimit() - (usedHeight + chunkHeight)

        if (entryHeight <= availableHeight + HEIGHT_EPS) {
          chunkEntries.push(currentEntry)
          chunkHeight += entryHeight
          pendingEntries.shift()
          continue
        }

        if (chunkEntries.length) {
          break
        }

        const splitResult = splitEntryByAvailableHeight(
          currentEntry,
          availableHeight,
          options.measureEntry,
          splitIndexSeed,
        )
        if (splitResult) {
          splitIndexSeed = splitResult.nextSplitIndexSeed
          chunkEntries.push(splitResult.fittedEntry)
          chunkHeight += options.measureEntry(splitResult.fittedEntry)
          if (splitResult.remainingEntry) {
            pendingEntries[0] = splitResult.remainingEntry
          } else {
            pendingEntries.shift()
          }
          break
        }

        if (currentPageSections.length) {
          pushPage()
          break
        }

        // 单条目即使在空页也放不下时兜底放入，防止无限循环
        chunkEntries.push(currentEntry)
        chunkHeight += entryHeight
        pendingEntries.shift()
        break
      }

      if (chunkEntries.length) {
        currentPageSections.push({
          ...section,
          title: sectionTitle,
          showTitle: shouldShowTitle,
          entries: chunkEntries,
        })
        usedHeight += chunkHeight
      }

      if (pendingEntries.length) {
        pushPage()
      }
      sectionChunkIndex += 1
    }
  }

  pushPage()
  if (!pages.length) {
    return [{ pageNumber: 1, sections: [] }]
  }
  return pages
}
