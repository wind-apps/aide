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
        flex="~ col"
        justify="start"
        align="items-start"
      >
        <PInputText
          name="title"
          placeholder="Title"
          size="large"
          w="full"
          aria-label="Add a title for this item"
        />
      </div>
      <div
        flex="~ col"
        justify="start"
        align="items-start"
      >
        <PChips
          v-model="tags"
          w="full children:full"
          placeholder="Tags"
          :style="{ width: '100%' }"
          :allow-duplicate="false"
          aria-label="Add tags to this item"
        />
      </div>
      <Editor />
    </div>
  </div>
</template>

<script lang="ts" setup>


const tags = ref([])


</script>
