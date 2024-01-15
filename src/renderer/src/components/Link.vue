<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router/auto'

interface Props {
  to: RouteLocationRaw
}

const props = defineProps<Props>()

const router = useRouter()
function navigate() {
  router.push(props.to)
}
</script>

<template>
  <NButton
    secondary
    @click="navigate"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </NButton>
</template>
