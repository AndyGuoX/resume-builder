<!-- src/views/HomeView/HomeView.vue -->
<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import HowToSection from './components/HowToSection.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import FooterSection from './components/FooterSection.vue';
import './style.less';
</script>

<template>
  <div>
    <NavBar />
    <HeroSection />
    <HowToSection />
    <FeaturesSection />
    <FooterSection />
  </div>
</template>
