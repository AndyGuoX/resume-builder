<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ExportToolbar from './components/ExportToolbar.vue'
import ResumeEditorPanel from './components/ResumeEditorPanel.vue'
import ResumePreview from './components/ResumePreview.vue'
import { useResumeStore } from './composables/useResumeStore'
import { exportPng, exportWord, sanitizeResumeFileName } from './utils/exporters'

const previewRootRef = ref<HTMLElement | null>(null)
const exporting = ref(false)
/** 仅显示右侧简历预览，隐藏编辑区 */
const previewOnly = ref(false)

function exitPreviewOnly() {
  previewOnly.value = false
}

const { resume, addPersonalField, removePersonalField, resetToDefault } = useResumeStore()

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

/** 由浏览器打印对话框「另存为 PDF」；短暂改写标题以便部分浏览器默认 PDF 文件名 */
function onPrintForPdf() {
  if (!previewRootRef.value?.querySelector('.resume-page')) {
    window.alert('预览区域未准备好，请稍后再试。')
    return
  }
  const base = exportFileBaseName()
  const prevTitle = document.title
  document.title = base
  let restored = false
  const restoreTitle = () => {
    if (restored) {
      return
    }
    restored = true
    document.title = prevTitle
    window.removeEventListener('afterprint', restoreTitle)
  }
  window.addEventListener('afterprint', restoreTitle)
  window.print()
  window.setTimeout(restoreTitle, 2_000)
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

function onKeydownPreview(ev: KeyboardEvent) {
  if (ev.key === 'Escape' && previewOnly.value) {
    exitPreviewOnly()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydownPreview)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydownPreview)
})
</script>

<template>
  <main class="app-layout" :class="{ 'app-layout--preview-only': previewOnly }">
    <aside v-show="!previewOnly" class="left-panel">
      <ExportToolbar
        :loading="exporting"
        @print-for-pdf="onPrintForPdf"
        @export-word="onExportWord"
        @export-png="onExportPng"
        @enter-preview="previewOnly = true"
      />
      <ResumeEditorPanel
        :resume="resume"
        @add-personal-field="addPersonalField"
        @remove-personal-field="removePersonalField"
        @reset="resetToDefault"
      />
    </aside>

    <section class="right-panel">
      <!-- 导出仅包含简历 DOM；预览模式无顶栏，用 Esc 退出，用 Ctrl+P / 打印 另存为 PDF -->
      <div ref="previewRootRef" class="preview-root-inner">
        <ResumePreview :profile="resume.profile" :sections="resume.sections" />
      </div>
    </section>
  </main>
</template>
