<script setup lang="ts">
import type { BulletNode } from '../types/resume'
import { createBulletNode } from '../constants/defaultResume'
import {
  blockLeadingSpaceBeforeInput,
  blockLeadingSpaceKeydown,
  inputTrimLeading,
  inputTrimOnBlur,
  onPasteTrimLeading,
} from '../utils/inputTrim'

function pasteTrim(set: (v: string) => void) {
  return (e: Event) => onPasteTrimLeading(e as ClipboardEvent, set)
}
import BulletEditor from './BulletEditor.vue'

const props = withDefaults(
  defineProps<{
    nodes: BulletNode[]
    depth?: number
  }>(),
  { depth: 0 },
)

function addChild(parent: BulletNode) {
  parent.children.push(createBulletNode(''))
}

function addSibling(nodes: BulletNode[], index: number) {
  nodes.splice(index + 1, 0, createBulletNode(''))
}

function removeNode(nodes: BulletNode[], index: number) {
  nodes.splice(index, 1)
  if (!nodes.length) {
    nodes.push(createBulletNode(''))
  }
}
</script>

<template>
  <ul class="bullet-editor-tree" :class="{ 'bullet-editor-tree--root': props.depth === 0 }">
    <li v-for="(node, idx) in props.nodes" :key="node.id" class="bullet-editor-item">
      <div class="bullet-editor-row">
        <input
          :value="node.text"
          type="text"
          placeholder="要点内容"
          @beforeinput="blockLeadingSpaceBeforeInput"
          @keydown="blockLeadingSpaceKeydown"
          @input="node.text = inputTrimLeading($event)"
          @blur="node.text = inputTrimOnBlur($event)"
          @paste="pasteTrim((v) => (node.text = v))"
        />
        <button type="button" @click="addChild(node)">子项</button>
        <button type="button" @click="addSibling(props.nodes, idx)">同级</button>
        <button type="button" class="danger" @click="removeNode(props.nodes, idx)">删</button>
      </div>
      <BulletEditor v-if="node.children.length" :nodes="node.children" :depth="props.depth + 1" />
    </li>
  </ul>
</template>
