<script setup lang="ts">
import { computed } from 'vue'
import { parseInlineBold } from '../utils/inlineBold'

const props = defineProps<{
  text: string
  themeColor?: string
}>()

const segments = computed(() => parseInlineBold(props.text))
const tagStyle = computed(() => ({
  '--tag-bg-color': props.themeColor ? `${props.themeColor}20` : '#fef3c7',
  '--tag-text-color': props.themeColor || '#b45309',
}))
</script>

<template>
  <span class="formatted-text">
    <template v-for="(seg, idx) in segments" :key="idx">
      <strong v-if="seg.bold">{{ seg.text }}</strong>
      <span v-else-if="seg.tag" class="resume-tag" :style="tagStyle">{{ seg.text }}</span>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>
