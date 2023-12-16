<script setup lang="ts">
import TRPC from './components/TRPC.vue'
</script>

<template>
  <svg
    class="hero-logo"
    viewBox="0 0 900 300"
  >
    <use xlink:href="./assets/icons.svg#electron" />
  </svg>
  <h2 class="hero-text">
    You've successfully created an Electron project with Vue and TypeScript
  </h2>
  <p class="hero-tagline">
    Please try pressing <code>F12</code> to open the devTool
  </p>

  <Suspense>
    <TRPC />
  </Suspense>
</template>
