<template>
  <Suspense>
    <n-config-provider :theme="darkTheme">
      <router-view />
      <n-global-style />
    </n-config-provider>
  </Suspense>
</template>

<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
</script>
