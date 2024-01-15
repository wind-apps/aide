<template>
  <n-config-provider
    :theme="lightTheme"
    :theme-overrides="theme"
  >
    <n-global-style />
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <SuspenseWrapper />
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { lightTheme } from 'naive-ui'

import theme from '@renderer/theme'

import SuspenseWrapper from './SuspenseWrapper.vue'
</script>
