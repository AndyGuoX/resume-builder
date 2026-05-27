<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import HowToUseSection from './components/HowToUseSection.vue';
import WhyChooseSection from './components/WhyChooseSection.vue';
import FooterSection from './components/FooterSection.vue';
</script>

<template>
  <div class="home-view">
    <NavBar />
    <main>
      <HeroSection />
      <HowToUseSection />
      <WhyChooseSection />
    </main>
    <FooterSection />
  </div>
</template>

<style lang="less" src="./style.less" />
