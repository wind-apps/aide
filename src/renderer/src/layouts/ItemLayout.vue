<template>
  <div
    container="~"
    m="x-auto"
    pos="relative"
    h="screen max-screen"
    p="y-8"
  >
    <div
      grid="~ cols-1"
      style="grid-template-rows: auto auto 1fr;"
      gap="4"
      m="x-4"
      w="full"
      h="full"
      overflow="hidden"
    >
      <div
        flex="~ row"
        align="items-center"
        gap="8"
      >
        <slot
          v-if="!loading"
          name="title"
        />
        <n-skeleton
          v-if="loading"
          size="medium"
        />
        <n-skeleton
          v-if="loading"
          size="medium"
          width="10%"
        />
      </div>
      <div
        w="full"
        flex="~ col"
        gap="2"
      >
        <slot
          v-if="!loading"
          name="tags"
        />
        <n-skeleton
          v-if="loading"
          size="medium"
        />
      </div>
      <slot
        v-if="!loading"
        name="editor"
      />
      <n-skeleton
        height="100%"
        v-if="loading"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  loading: boolean
}

defineProps<Props>()
</script>
