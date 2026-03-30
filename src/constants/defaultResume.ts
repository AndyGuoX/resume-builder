import type { ResumeDocument, ResumeSection, ResumeSectionType } from '../types/resume'
import type { PersonalInfoField } from '../types/resume'
import { createBulletNode, generateResumeId } from '../utils/bulletNodes'
import { serializeModulesMarkdown } from '../utils/modulesMarkdown'

export { createBulletNode }

function generateId(prefix: string): string {
  return generateResumeId(prefix)
}

export function createEmptyEntry() {
  return {
    id: generateId('entry'),
    heading: '',
    subheading: '',
    period: '',
    bullets: [createBulletNode('')],
  }
}

export function createPersonalField(label = '自定义', value = ''): PersonalInfoField {
  return {
    id: generateId('pf'),
    label,
    value,
  }
}

/** 默认个人信息条目 */
export function createDefaultPersonalFields(): PersonalInfoField[] {
  return [
    createPersonalField('姓名', '张三'),
    createPersonalField('性别', '男'),
    createPersonalField('年龄', '24岁'),
    createPersonalField('工作经验', '3年'),
    createPersonalField('电话', '13800138000'),
    createPersonalField('邮箱', 'zhangsan@example.com'),
    createPersonalField('目前状态', '在职 · 看机会'),
  ]
}

export function createSectionByType(type: ResumeSectionType): ResumeSection {
  const titleMap: Record<ResumeSectionType, string> = {
    education: '教育背景',
    honor: '个人荣誉',
    work: '实习经历',
    project: '项目经历',
    skill: '技能证书/其他',
    custom: '自定义模块',
  }

  return {
    id: generateId('section'),
    type,
    title: titleMap[type],
    entries: [createEmptyEntry()],
  }
}

export function createDefaultResume(): ResumeDocument {
  const sections: ResumeSection[] = [
      {
        id: generateId('section'),
        type: 'education',
        title: '教育背景',
        entries: [
          {
            id: generateId('entry'),
            heading: '上海交通大学 · 本科 · 软件工程',
            subheading: '985 · 双一流',
            period: '2021.09 - 2025.07',
            bullets: [
              createBulletNode('曾获奖项：掘金优秀创作者'),
              createBulletNode('校园经历：ACM 社团技术负责人'),
            ],
          },
        ],
      },
      {
        id: generateId('section'),
        type: 'work',
        title: '实习经历',
        entries: [
          {
            id: generateId('entry'),
            heading: '阿里巴巴集团',
            subheading: '后端开发',
            period: '2021.06 - 2021.09',
            bullets: [
              createBulletNode('参与云平台微服务改造'),
              createBulletNode('使用 Java 和 Spring Boot 进行接口开发'),
            ],
          },
          {
            id: generateId('entry'),
            heading: '字节跳动',
            subheading: '后端开发',
            period: '2022.06 - 2022.09',
            bullets: [
              createBulletNode('参与推荐系统后端开发'),
              createBulletNode('使用 Flink 与 Kafka 优化实时数据链路'),
            ],
          },
        ],
      },
      {
        id: generateId('section'),
        type: 'project',
        title: '项目经历',
        entries: [
          {
            id: generateId('entry'),
            heading: '高并发实时订单处理系统',
            subheading: '',
            period: '2022.06 - 2022.09',
            bullets: [
              createBulletNode('基于 Spring Cloud 微服务架构', [
                createBulletNode('服务拆分与网关路由'),
                createBulletNode('配置中心与链路追踪'),
              ]),
              createBulletNode('通过分布式锁保证订单一致性'),
            ],
          },
        ],
      },
  ]
  return {
    profile: {
      resumeTitle: '校招通用简历模板',
      avatarUrl: '',
      themeColor: '#f59e0b',
      personalFields: createDefaultPersonalFields(),
    },
    modulesMarkdown: serializeModulesMarkdown(sections),
    sections,
  }
}
