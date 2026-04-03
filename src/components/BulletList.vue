<script setup lang="ts">
import type { BulletNode } from '../types/resume'
import BulletList from './BulletList.vue'
import FormattedText from './FormattedText.vue'

withDefaults(
  defineProps<{
    nodes: BulletNode[]
    depth?: number
    themeColor?: string
  }>(),
  { depth: 0 },
)
</script>

<template>
  <ul class="resume-bullet-tree" :class="`resume-bullet-tree--depth-${depth % 4}`">
    <li v-for="node in nodes" :key="node.id" class="resume-bullet-item">
      <span class="resume-bullet-text">
        <template v-if="node.subheading">
          <FormattedText :text="node.subheading" :theme-color="themeColor" class="bullet-subheading" />
          <FormattedText v-if="node.content" :text="node.content" :theme-color="themeColor" class="bullet-content" />
        </template>
        <FormattedText v-else :text="node.content ?? ''" :theme-color="themeColor" />
      </span>
      <BulletList v-if="node.children.length" :nodes="node.children" :depth="depth + 1" :theme-color="themeColor" />
    </li>
  </ul>
</template>
