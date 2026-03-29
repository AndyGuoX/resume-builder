import { ref, watch } from 'vue'
import {
  createDefaultResume,
  createDefaultPersonalFields,
  createEmptyEntry,
  createPersonalField,
  createSectionByType,
} from '../constants/defaultResume'
import type { ResumeDocument, ResumeSectionType } from '../types/resume'
import { ensureResumeBulletTrees } from '../utils/bulletTree'

const STORAGE_KEY = 'resume-template-generator-v1'

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

/** 将旧版 profile 或残缺数据规范化为当前结构 */
function normalizeResumeDocument(raw: unknown): ResumeDocument | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const doc = raw as Partial<ResumeDocument>
  if (!doc.profile || typeof doc.profile !== 'object') {
    return null
  }
  const p = doc.profile as unknown as Record<string, unknown>

  // 新结构：含 personalFields 数组（可为空）
  if (Array.isArray(p.personalFields)) {
    return {
      sections: Array.isArray(doc.sections) ? (doc.sections as ResumeDocument['sections']) : [],
      profile: {
        resumeTitle: String(p.resumeTitle ?? '校招通用简历模板'),
        themeColor: String(p.themeColor || '#f59e0b'),
        avatarUrl: String(p.avatarUrl ?? ''),
        personalFields: (p.personalFields as { id?: string; label?: string; value?: string }[]).map(
          (item) => ({
            id: item.id && String(item.id).length ? String(item.id) : generateId('pf'),
            label: String(item.label ?? ''),
            value: String(item.value ?? ''),
          }),
        ),
      },
    }
  }

  // 兼容旧版：name 曾作为主标题，phone / wechat 等平铺字段
  const legacyName = p.name != null ? String(p.name) : ''
  const legacyPhone = p.phone != null ? String(p.phone) : ''
  const fields = createDefaultPersonalFields()
  const phoneIdx = fields.findIndex((f) => f.label === '电话')
  if (phoneIdx >= 0 && legacyPhone) {
    fields[phoneIdx] = { ...fields[phoneIdx], value: legacyPhone }
  }

  return {
    sections: Array.isArray(doc.sections) ? (doc.sections as ResumeDocument['sections']) : [],
    profile: {
      resumeTitle: legacyName || '校招通用简历模板',
      themeColor: String(p.themeColor || '#f59e0b'),
      avatarUrl: String(p.avatarUrl ?? ''),
      personalFields: fields,
    },
  }
}

function safeParseResume(raw: string | null): ResumeDocument | null {
  if (!raw) {
    return null
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    const normalized = normalizeResumeDocument(parsed)
    if (normalized) {
      return normalized
    }
  } catch (error) {
    console.warn('解析本地简历数据失败，使用默认值。', error)
  }
  return null
}

export function useResumeStore() {
  const resume = ref<ResumeDocument>(createDefaultResume())

  const persisted = safeParseResume(localStorage.getItem(STORAGE_KEY))
  if (persisted) {
    resume.value = persisted
    ensureResumeBulletTrees(resume.value)
  }

  watch(
    resume,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch (error) {
        console.error('写入 localStorage 失败', error)
        window.alert('保存到本地失败（可能超出浏览器存储上限），请尝试更换较小的照片或清理浏览器数据。')
      }
    },
    { deep: true },
  )

  function addSection(type: ResumeSectionType) {
    resume.value.sections.push(createSectionByType(type))
  }

  function removeSection(sectionIndex: number) {
    resume.value.sections.splice(sectionIndex, 1)
  }

  function moveSection(sectionIndex: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1
    if (targetIndex < 0 || targetIndex >= resume.value.sections.length) {
      return
    }
    const [section] = resume.value.sections.splice(sectionIndex, 1)
    resume.value.sections.splice(targetIndex, 0, section)
  }

  function addEntry(sectionIndex: number) {
    resume.value.sections[sectionIndex]?.entries.push(createEmptyEntry())
  }

  function removeEntry(sectionIndex: number, entryIndex: number) {
    resume.value.sections[sectionIndex]?.entries.splice(entryIndex, 1)
  }

  function addPersonalField() {
    resume.value.profile.personalFields.push(createPersonalField('自定义', ''))
  }

  function removePersonalField(fieldIndex: number) {
    resume.value.profile.personalFields.splice(fieldIndex, 1)
  }

  function resetToDefault() {
    resume.value = createDefaultResume()
  }

  return {
    resume,
    addSection,
    removeSection,
    moveSection,
    addEntry,
    removeEntry,
    addPersonalField,
    removePersonalField,
    resetToDefault,
  }
}
