<script setup lang="ts">
import { computed } from 'vue'
import { parseInlineBold } from '../utils/inlineBold'

const props = defineProps<{
  text: string
}>()

const segments = computed(() => parseInlineBold(props.text))
</script>

<template>
  <span class="formatted-text">
    <template v-for="(seg, idx) in segments" :key="idx">
      <strong v-if="seg.bold">{{ seg.text }}</strong>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>
