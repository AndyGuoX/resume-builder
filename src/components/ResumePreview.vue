<script setup lang="ts">
import BulletList from './BulletList.vue'
import FormattedText from './FormattedText.vue'
import type { PaginatedPage } from '../types/resume'
import type { ResumeProfile } from '../types/resume'

const props = defineProps<{
  profile: ResumeProfile
  pages: PaginatedPage[]
}>()
</script>

<template>
  <div class="preview-scroll" :style="{ '--resume-theme-color': profile.themeColor || '#f59e0b' }">
    <article v-for="page in pages" :key="page.pageNumber" class="resume-page">
      <header v-if="page.pageNumber === 1" class="resume-header">
        <div class="resume-header-inner">
          <div class="resume-header-main">
            <h1 class="resume-doc-title"><FormattedText :text="profile.resumeTitle" :theme-color="profile.themeColor" /></h1>
            <div class="personal-info-grid">
              <div
                v-for="field in profile.personalFields"
                :key="field.id"
                class="personal-info-cell"
              >
                <span class="personal-info-label">{{ field.label }}</span>
                <span class="personal-info-value">{{ field.value }}</span>
              </div>
            </div>
          </div>
          <div class="resume-header-photo">
            <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="照片" />
            <div v-else class="resume-header-photo-placeholder">照片</div>
          </div>
        </div>
      </header>

      <section v-for="section in page.sections" :key="section.id + section.title" class="resume-section">
        <h2 v-if="section.showTitle !== false"><FormattedText :text="section.title" :theme-color="profile.themeColor" /></h2>
        <div v-for="entry in section.entries" :key="entry.id" class="resume-entry">
          <div
            v-if="entry.showMeta !== false && (entry.heading.trim() || entry.period.trim() || entry.tags?.length)"
            class="entry-head"
          >
            <span class="entry-heading-text"><FormattedText :text="entry.heading" :theme-color="profile.themeColor" /></span>
            <span class="entry-period"><FormattedText :text="entry.period" :theme-color="profile.themeColor" /></span>
          </div>
          <div v-if="entry.showMeta !== false && entry.tags?.length" class="entry-tags">
            <span
              v-for="tag in entry.tags"
              :key="tag"
              class="resume-tag"
              :style="{ '--tag-bg-color': profile.themeColor + '20', '--tag-text-color': profile.themeColor }"
            >{{ tag }}</span>
          </div>
          <p v-if="entry.showMeta !== false && entry.subheading" class="entry-sub">
            <FormattedText :text="entry.subheading" :theme-color="profile.themeColor" />
          </p>
          <BulletList v-if="entry.bullets.length && entry.bullets.some(b => b.content || b.subheading || b.children.length)" :nodes="entry.bullets" :theme-color="profile.themeColor" />
        </div>
      </section>
    </article>
  </div>
</template>
