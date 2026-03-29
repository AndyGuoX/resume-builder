<script setup lang="ts">
import BulletList from './BulletList.vue'
import type { PaginatedPage } from '../types/resume'
import type { ResumeProfile } from '../types/resume'

defineProps<{
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
            <h1 class="resume-doc-title">{{ profile.resumeTitle }}</h1>
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
        <h2 v-if="section.showTitle !== false">{{ section.title }}</h2>
        <div v-for="entry in section.entries" :key="entry.id" class="resume-entry">
          <div v-if="entry.showMeta !== false" class="entry-head">
            <strong>{{ entry.heading }}</strong>
            <span>{{ entry.period }}</span>
          </div>
          <p v-if="entry.showMeta !== false && entry.subheading" class="entry-sub">{{ entry.subheading }}</p>
          <BulletList :nodes="entry.bullets" />
        </div>
      </section>
    </article>
  </div>
</template>
