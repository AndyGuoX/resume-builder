<script setup lang="ts">
import { ref } from 'vue'
import type { ResumeDocument } from '../types/resume'
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

    <section class="editor-card modules-markdown-card">
      <h3>经历与模块（Markdown）</h3>
      <p class="editor-hint">
        使用 <code>##</code> 表示<strong>模块标题</strong>（右侧 <code>h2</code> 样式不变），<code>###</code> 表示<strong>主标题</strong>（条目主标题行）。
        <code>##</code> 与标题之间可以没有空格；行首也可缩进。模块下可以暂时没有 <code>###</code>（仅显示模块标题）。紧跟 <code>###</code> 的前两行可为时间、副标题：第一行若含年份/日期则视为时间，否则视为副标题；两行则依次为时间、副标题。要点使用 <code>-</code> 列表，子项缩进两个空格。标题、时间、副标题、要点中可用 <code>**文字**</code> 表示加粗。
      </p>
      <textarea
        v-model="props.resume.modulesMarkdown"
        class="modules-markdown-textarea"
        spellcheck="false"
        rows="28"
        placeholder="## 教育背景

### 学校 · 学历 · 专业
2021.09 - 2025.07
985 · 双一流

- 要点一
- 要点二"
      />
    </section>
  </div>
</template>
