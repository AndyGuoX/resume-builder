<script setup lang="ts">
const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'print-for-pdf'): void
  (event: 'export-word'): void
  (event: 'export-png'): void
  (event: 'enter-preview'): void
}>()
</script>

<template>
  <div class="flex gap-2 flex-wrap">
    <button
      type="button"
      class="border border-gray-300 py-2 px-3.5 rounded-md bg-white text-gray-900 cursor-pointer"
      title="仅全屏显示简历；Esc 退出。可用 Ctrl+P（或打印）选择「另存为 PDF」"
      @click="emit('enter-preview')"
    >
      预览
    </button>
    <button
      type="button"
      class="border-none py-2 px-3.5 rounded-md bg-gray-900 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      :disabled="props.loading"
      @click="emit('export-word')"
    >
      导出 Word
    </button>
    <button
      type="button"
      class="border-none py-2 px-3.5 rounded-md bg-gray-900 text-white cursor-pointer"
      title="打开系统打印，在目标打印机中选「另存为 PDF」或「Microsoft Print to PDF」"
      @click="emit('print-for-pdf')"
    >
      打印为 PDF
    </button>
    <button
      type="button"
      class="border-none py-2 px-3.5 rounded-md bg-gray-900 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      :disabled="props.loading"
      @click="emit('export-png')"
    >
      导出图片
    </button>
  </div>
</template>
