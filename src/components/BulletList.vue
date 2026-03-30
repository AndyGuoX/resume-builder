<script setup lang="ts">
import type { BulletNode } from '../types/resume'
import BulletList from './BulletList.vue'
import FormattedText from './FormattedText.vue'

withDefaults(
  defineProps<{
    nodes: BulletNode[]
    /** 嵌套深度，用于区分每级列表符号 */
    depth?: number
  }>(),
  { depth: 0 },
)
</script>

<template>
  <ul class="resume-bullet-tree" :class="`resume-bullet-tree--depth-${depth % 4}`">
    <li v-for="node in nodes" :key="node.id" class="resume-bullet-item">
      <span class="resume-bullet-text"><FormattedText :text="node.text" /></span>
      <BulletList v-if="node.children.length" :nodes="node.children" :depth="depth + 1" />
    </li>
  </ul>
</template>
