import type { BulletNode } from '../types/resume'

export function generateResumeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function createBulletNode(
  subheading = '',
  content = '',
  children: BulletNode[] = [],
): BulletNode {
  return {
    id: generateResumeId('bl'),
    subheading,
    content,
    children: children.length ? [...children] : [],
  }
}
