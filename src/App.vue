<script setup lang="ts">
import { ref } from 'vue'
import ExportToolbar from './components/ExportToolbar.vue'
import ResumeEditorPanel from './components/ResumeEditorPanel.vue'
import ResumePreview from './components/ResumePreview.vue'
import { useDomPagination } from './composables/useDomPagination'
import { useResumeStore } from './composables/useResumeStore'
import { exportPdf, exportPng, exportWord, sanitizeResumeFileName } from './utils/exporters'

const previewRootRef = ref<HTMLElement | null>(null)
const exporting = ref(false)

const {
  resume,
  addSection,
  removeSection,
  moveSection,
  addEntry,
  removeEntry,
  addPersonalField,
  removePersonalField,
  resetToDefault,
} = useResumeStore()
const { pages, isPaginating } = useDomPagination(resume)

function onMoveSection(payload: { sectionIndex: number; direction: 'up' | 'down' }) {
  moveSection(payload.sectionIndex, payload.direction)
}

function onRemoveEntry(payload: { sectionIndex: number; entryIndex: number }) {
  removeEntry(payload.sectionIndex, payload.entryIndex)
}

async function runExport(task: () => Promise<void>) {
  if (!previewRootRef.value) {
    window.alert('预览区域未准备好，请稍后再试。')
    return
  }
  try {
    exporting.value = true
    await task()
  } catch (error) {
    console.error('导出失败', error)
    window.alert('导出失败，请检查图片链接或稍后重试。')
  } finally {
    exporting.value = false
  }
}

function exportFileBaseName() {
  return sanitizeResumeFileName(resume.value.profile.resumeTitle)
}

function onExportPdf() {
  if (!previewRootRef.value) {
    return
  }
  runExport(() => exportPdf(previewRootRef.value as HTMLElement, exportFileBaseName()))
}

function onExportWord() {
  if (!previewRootRef.value) {
    return
  }
  runExport(() => exportWord(previewRootRef.value as HTMLElement, exportFileBaseName()))
}

function onExportPng() {
  if (!previewRootRef.value) {
    return
  }
  runExport(() => exportPng(previewRootRef.value as HTMLElement, exportFileBaseName()))
}
</script>

<template>
  <main class="app-layout">
    <aside class="left-panel">
      <ExportToolbar
        :loading="exporting"
        @export-pdf="onExportPdf"
        @export-word="onExportWord"
        @export-png="onExportPng"
      />
      <ResumeEditorPanel
        :resume="resume"
        @add-section="addSection"
        @remove-section="removeSection"
        @move-section="onMoveSection"
        @add-entry="addEntry"
        @remove-entry="onRemoveEntry"
        @add-personal-field="addPersonalField"
        @remove-personal-field="removePersonalField"
        @reset="resetToDefault"
      />
    </aside>

    <section class="right-panel" ref="previewRootRef">
      <p v-if="isPaginating" class="paginate-hint">正在根据真实内容高度分页...</p>
      <ResumePreview :profile="resume.profile" :pages="pages" />
    </section>
  </main>
</template>
