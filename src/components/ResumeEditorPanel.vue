<script setup lang="ts">
import { ref } from 'vue'
import BulletEditor from './BulletEditor.vue'
import { createBulletNode } from '../constants/defaultResume'
import type { ResumeDocument, ResumeSectionType } from '../types/resume'
import { compressImageFileToDataUrl } from '../utils/localImage'
import {
  blockLeadingSpaceBeforeInput,
  blockLeadingSpaceKeydown,
  inputTrimLeading,
  inputTrimOnBlur,
  onPasteTrimLeading,
} from '../utils/inputTrim'

/** 粘贴：合并后去行首空白 */
function pasteTrim(set: (v: string) => void) {
  return (e: Event) => onPasteTrimLeading(e as ClipboardEvent, set)
}

const props = defineProps<{
  resume: ResumeDocument
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const avatarLoading = ref(false)

async function onAvatarFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) {
    return
  }
  if (file.size > 12 * 1024 * 1024) {
    window.alert('文件过大，请选择 12MB 以内的图片')
    return
  }
  try {
    avatarLoading.value = true
    // 压缩后写入 profile，与简历一并持久化到 localStorage
    props.resume.profile.avatarUrl = await compressImageFileToDataUrl(file)
  } catch (error) {
    console.error(error)
    window.alert(error instanceof Error ? error.message : '处理照片失败')
  } finally {
    avatarLoading.value = false
  }
}

function clearAvatar() {
  props.resume.profile.avatarUrl = ''
}

function openFilePicker() {
  fileInputRef.value?.click()
}

const emit = defineEmits<{
  (event: 'add-section', type: ResumeSectionType): void
  (event: 'remove-section', sectionIndex: number): void
  (event: 'move-section', payload: { sectionIndex: number; direction: 'up' | 'down' }): void
  (event: 'add-entry', sectionIndex: number): void
  (event: 'remove-entry', payload: { sectionIndex: number; entryIndex: number }): void
  (event: 'add-personal-field'): void
  (event: 'remove-personal-field', fieldIndex: number): void
  (event: 'reset'): void
}>()
</script>

<template>
  <div class="editor-panel">
    <section class="editor-card">
      <h3>个人信息</h3>
      <label>
        简历主标题
        <input
          :value="props.resume.profile.resumeTitle"
          type="text"
          placeholder="显示在简历顶部的主标题"
          @beforeinput="blockLeadingSpaceBeforeInput"
          @keydown="blockLeadingSpaceKeydown"
          @input="props.resume.profile.resumeTitle = inputTrimLeading($event)"
          @blur="props.resume.profile.resumeTitle = inputTrimOnBlur($event)"
          @paste="pasteTrim((v) => (props.resume.profile.resumeTitle = v))"
        />
      </label>
      <label>
        主题色
        <div class="theme-color-row">
          <input v-model="props.resume.profile.themeColor" type="color" class="theme-color-picker" />
          <input
            :value="props.resume.profile.themeColor"
            type="text"
            placeholder="#f59e0b"
            @beforeinput="blockLeadingSpaceBeforeInput"
            @keydown="blockLeadingSpaceKeydown"
            @input="props.resume.profile.themeColor = inputTrimLeading($event)"
            @blur="props.resume.profile.themeColor = inputTrimOnBlur($event)"
            @paste="pasteTrim((v) => (props.resume.profile.themeColor = v))"
          />
        </div>
      </label>
      <div class="avatar-field">
        <span class="avatar-field-label">证件照</span>
        <input
          ref="fileInputRef"
          type="file"
          class="avatar-file-input"
          accept="image/*"
          @change="onAvatarFileChange"
        />
        <div class="avatar-field-actions">
          <button type="button" :disabled="avatarLoading" @click="openFilePicker">
            {{ avatarLoading ? '处理中…' : '从本地选择照片' }}
          </button>
          <button v-if="props.resume.profile.avatarUrl" type="button" class="danger" @click="clearAvatar">
            清除照片
          </button>
        </div>
        <div v-if="props.resume.profile.avatarUrl" class="avatar-preview-wrap">
          <img :src="props.resume.profile.avatarUrl" alt="预览" class="avatar-preview-thumb" />
        </div>
        <p class="editor-hint">照片会压缩后写入本地缓存（与简历数据一起保存在浏览器中）。</p>
      </div>
      <p class="editor-hint">下方每条为「标签 + 内容」，预览区每行展示三项；可增删。</p>

      <div
        v-for="(field, fieldIndex) in props.resume.profile.personalFields"
        :key="field.id"
        class="personal-field-editor"
      >
        <label>
          标签
          <input
            :value="field.label"
            type="text"
            @beforeinput="blockLeadingSpaceBeforeInput"
            @keydown="blockLeadingSpaceKeydown"
            @input="field.label = inputTrimLeading($event)"
            @blur="field.label = inputTrimOnBlur($event)"
            @paste="pasteTrim((v) => (field.label = v))"
          />
        </label>
        <label>
          内容
          <input
            :value="field.value"
            type="text"
            @beforeinput="blockLeadingSpaceBeforeInput"
            @keydown="blockLeadingSpaceKeydown"
            @input="field.value = inputTrimLeading($event)"
            @blur="field.value = inputTrimOnBlur($event)"
            @paste="pasteTrim((v) => (field.value = v))"
          />
        </label>
        <button type="button" class="danger personal-field-remove" @click="emit('remove-personal-field', fieldIndex)">
          删除
        </button>
      </div>

      <button type="button" @click="emit('add-personal-field')">新增个人信息项</button>
      <button type="button" class="reset-btn" @click="emit('reset')">恢复默认数据</button>
    </section>

    <section class="editor-card">
      <h3>新增模块</h3>
      <div class="button-row">
        <button type="button" @click="emit('add-section', 'education')">教育背景</button>
        <button type="button" @click="emit('add-section', 'honor')">个人荣誉</button>
        <button type="button" @click="emit('add-section', 'work')">实习经历</button>
        <button type="button" @click="emit('add-section', 'project')">项目经历</button>
        <button type="button" @click="emit('add-section', 'skill')">技能证书</button>
        <button type="button" @click="emit('add-section', 'custom')">自定义模块</button>
      </div>
    </section>

    <section v-for="(section, sectionIndex) in props.resume.sections" :key="section.id" class="editor-card">
      <div class="section-title">
        <h3>模块 {{ sectionIndex + 1 }}</h3>
        <div class="button-row">
          <button type="button" @click="emit('move-section', { sectionIndex, direction: 'up' })">上移</button>
          <button type="button" @click="emit('move-section', { sectionIndex, direction: 'down' })">下移</button>
          <button type="button" class="danger" @click="emit('remove-section', sectionIndex)">删除模块</button>
        </div>
      </div>

      <label>
        模块标题
        <input
          :value="section.title"
          type="text"
          @beforeinput="blockLeadingSpaceBeforeInput"
          @keydown="blockLeadingSpaceKeydown"
          @input="section.title = inputTrimLeading($event)"
          @blur="section.title = inputTrimOnBlur($event)"
          @paste="pasteTrim((v) => (section.title = v))"
        />
      </label>

      <div class="entries">
        <div v-for="(entry, entryIndex) in section.entries" :key="entry.id" class="entry-editor">
          <label>
            主标题
            <input
              :value="entry.heading"
              type="text"
              @beforeinput="blockLeadingSpaceBeforeInput"
              @keydown="blockLeadingSpaceKeydown"
              @input="entry.heading = inputTrimLeading($event)"
              @blur="entry.heading = inputTrimOnBlur($event)"
              @paste="pasteTrim((v) => (entry.heading = v))"
            />
          </label>
          <label>
            副标题
            <input
              :value="entry.subheading"
              type="text"
              @beforeinput="blockLeadingSpaceBeforeInput"
              @keydown="blockLeadingSpaceKeydown"
              @input="entry.subheading = inputTrimLeading($event)"
              @blur="entry.subheading = inputTrimOnBlur($event)"
              @paste="pasteTrim((v) => (entry.subheading = v))"
            />
          </label>
          <label>
            时间
            <input
              :value="entry.period"
              type="text"
              @beforeinput="blockLeadingSpaceBeforeInput"
              @keydown="blockLeadingSpaceKeydown"
              @input="entry.period = inputTrimLeading($event)"
              @blur="entry.period = inputTrimOnBlur($event)"
              @paste="pasteTrim((v) => (entry.period = v))"
            />
          </label>

          <div class="bullet-list">
            <label>要点列表（支持子项）</label>
            <BulletEditor :nodes="entry.bullets" />
            <button type="button" @click="entry.bullets.push(createBulletNode(''))">新增顶层要点</button>
          </div>

          <button
            type="button"
            class="danger"
            @click="emit('remove-entry', { sectionIndex, entryIndex })"
          >
            删除条目
          </button>
        </div>
      </div>
      <button type="button" @click="emit('add-entry', sectionIndex)">新增条目</button>
    </section>
  </div>
</template>
