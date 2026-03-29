<script setup lang="ts">
const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (event: 'export-pdf'): void
  (event: 'export-word'): void
  (event: 'export-png'): void
}>()
</script>

<template>
  <div class="export-toolbar">
    <button type="button" :disabled="props.loading" @click="emit('export-word')">导出 Word</button>
    <button type="button" :disabled="props.loading" @click="emit('export-pdf')">导出 PDF</button>
    <button type="button" :disabled="props.loading" @click="emit('export-png')">导出图片</button>
  </div>
</template>
