import type { ResumeDocument, ResumeSection } from '../types/resume'
import type { PersonalInfoField } from '../types/resume'
import { createBulletNode, generateResumeId } from '../utils/bulletNodes'
import { serializeModulesMarkdown } from '../utils/modulesMarkdown'

export { createBulletNode }

function generateId(prefix: string): string {
  return generateResumeId(prefix)
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
        title: '工作经历',
        entries: [
          {
            id: generateId('entry'),
            heading: '阿里巴巴集团',
            subheading: '基于 {LangChain} 构建企业级智能问答系统，打通埋点文档、SQL与指标体系',
            period: '2023.07 - 至今',
            tags: ['React', 'TypeScript', 'Webpack', 'RAG', 'LangChain', 'Redis', 'MySQL'],
            bullets: [
              createBulletNode('主导构建工具从 Webpack 迁移至 RsPack，重构构建链路与缓存策略，打包耗时从 120s 降至 20s（↓83%），显著提升 CI/CD 效率与开发体验'),
              createBulletNode('搭建完整RAG流程（文本切分 → {Embedding} → 向量检索 → LLM生成），设计混合检索策略（关键词 + 向量召回），提升检索准确率与召回率'),
              createBulletNode('引入多Query改写与路由机制，增强复杂问题理解能力，构建分层模型架构：轻量模型负责分类/路由/摘要，主模型负责生成，兼顾性能与成本'),
              createBulletNode('基于 {Redis} + {MySQL} 实现对话记忆与上下文管理，数据分析能力智能化升级：支持自然语言直接查询埋点数据，业务侧数据获取效率提升 3倍+'),
            ],
          },
          {
            id: generateId('entry'),
            heading: '字节跳动',
            subheading: '使用 {Flink} 与 {Kafka} 优化实时数据链路，封装通用 {Hooks} 与业务组件体系',
            period: '2021.07 - 2023.06',
            tags: ['React', 'Flink', 'Kafka', 'ECharts', 'Hooks'],
            bullets: [
              createBulletNode('参与推荐系统后端开发，使用 Flink 与 Kafka 优化实时数据链路'),
              createBulletNode('可视化与前端架构沉淀：封装通用 Hooks 与业务组件体系，构建可复用的数据可视化方案（基于 ECharts），提升图表表达能力与交互体验'),
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
            heading: '恒星B端系统（微前端架构） - 核心负责人',
            subheading: '基于Qiankun搭建的微前端基座系统，负责职位管理、集团账号、数据中心等10+子应用，实现技术栈无关的独立开发与部署。',
            period: '2024.07 - 至今',
            tags: ['React', 'QianKun', 'Redux', 'Webpack', 'Axios', 'Micro-frontend'],
            bullets: [
              createBulletNode('设计统一请求层（Axios封装+拦截器+错误码体系），实现接口异常治理，线上错误率降低 35%'),
              createBulletNode('设计跨应用通信机制（PostMessage+全局状态），解决复杂业务场景数据同步问题，减少重复请求 50%+'),
              createBulletNode('从0-1设计集团账号资产管理项目(复杂数据管理、逻辑处理)，支撑集团会员大客复杂业务场景'),
              createBulletNode('实现子应用按需加载与资源预取策略，首屏关键资源加载时间优化 40%'),
            ],
          },
          {
            id: generateId('entry'),
            heading: '高并发实时订单处理系统',
            subheading: '核心开发 | 技术突破',
            period: '2022.06 - 2022.09',
            tags: ['Spring Cloud', 'Java', '分布式锁'],
            bullets: [
              createBulletNode('基于 Spring Cloud 微服务架构', '', [
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
      resumeTitle: '前端工程体系升级：主导构建工具从 Webpack 迁移至 RsPack',
      avatarUrl: '',
      themeColor: '#f59e0b',
      personalFields: createDefaultPersonalFields(),
    },
    modulesMarkdown: serializeModulesMarkdown(sections),
    sections,
  }
}
