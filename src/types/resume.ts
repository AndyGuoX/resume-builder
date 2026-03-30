export type ResumeSectionType =
  | 'education'
  | 'honor'
  | 'work'
  | 'project'
  | 'skill'
  | 'custom'

/** 要点树节点：支持无限层级子要点 */
export interface BulletNode {
  id: string
  text: string
  children: BulletNode[]
}

export interface ResumeEntry {
  id: string
  heading: string
  subheading: string
  period: string
  bullets: BulletNode[]
  // 仅用于分页预览：续页同条目可隐藏标题行和副标题
  showMeta?: boolean
}

export interface ResumeSection {
  id: string
  type: ResumeSectionType
  title: string
  entries: ResumeEntry[]
  // 仅用于预览分页结果：续页同模块可隐藏标题
  showTitle?: boolean
}

/** 个人信息一项：标签 + 内容，可增删 */
export interface PersonalInfoField {
  id: string
  label: string
  value: string
}

export interface ResumeProfile {
  /** 简历主标题（与姓名独立，原「校招通用简历模板」） */
  resumeTitle: string
  themeColor: string
  /** 右侧证件照 URL，空则显示占位 */
  avatarUrl: string
  /** 个人信息条目，预览区一行展示三项 */
  personalFields: PersonalInfoField[]
}

export interface ResumeDocument {
  profile: ResumeProfile
  /** 模块区 Markdown 源码（## 模块标题、### 主标题）；解析结果写入 sections 供预览与分页 */
  modulesMarkdown: string
  sections: ResumeSection[]
}

export interface PaginatedPage {
  pageNumber: number
  sections: ResumeSection[]
}
