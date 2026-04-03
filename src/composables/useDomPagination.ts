import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type { PaginatedPage, ResumeDocument } from '../types/resume'
import { createDomMeasurer } from '../utils/domMeasurer'
import { paginateSectionsByMeasurement } from '../utils/measuredPagination'

export function useDomPagination(resume: Ref<ResumeDocument>) {
  const pages = ref<PaginatedPage[]>([])
  const isPaginating = ref(false)
  let rafId = 0

  const repaginate = async () => {
    await nextTick()
    if (!document?.body) {
      return
    }
    const measurer = createDomMeasurer()
    try {
      isPaginating.value = true
      const headerHeight = measurer.measureHeader(resume.value.profile)
      // 首屏可用高度 = 整页内容区 - 头部（含 margin），不再用魔法数 floor，避免误判容量
      const firstPageLimit = Math.max(0, measurer.pageContentHeight - headerHeight)
      const sectionGap = measurer.measureSectionGap()
      pages.value = paginateSectionsByMeasurement(resume.value.sections, {
        firstPageLimit,
        nextPageLimit: measurer.pageContentHeight,
        sectionGap,
        measureSectionTitle: measurer.measureSectionTitle,
        measureEntry: measurer.measureEntry,
      })
    } finally {
      isPaginating.value = false
      measurer.dispose()
    }
  }

  const queueRepaginate = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    rafId = requestAnimationFrame(() => {
      repaginate()
    })
  }

  watch(resume, queueRepaginate, { deep: true })

  onMounted(() => {
    queueRepaginate()
    window.addEventListener('resize', queueRepaginate)
  })

  onUnmounted(() => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    window.removeEventListener('resize', queueRepaginate)
  })

  return {
    pages,
    isPaginating,
    repaginate,
  }
}
