<template>
  <Suspense>
    <n-config-provider :theme="lightTheme">
      <router-view />
      <n-global-style />
    </n-config-provider>
  </Suspense>
</template>

<script lang="ts" setup>
import { lightTheme } from 'naive-ui'
</script>
