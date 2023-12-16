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
  <PButton @click="navigate">
    <slot />
  </PButton>
</template>
