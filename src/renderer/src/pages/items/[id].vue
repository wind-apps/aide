<template>
  <p>Edit existing</p>
  <p>{{ route.params }}</p>
  <!-- <Editor
    v-if="data?.content"
    :intial-content="data.content"
  /> -->
</template>

<script lang="ts" setup>
const route = useRoute('/items/[id]')
// const data = await trpc.itemById.query({ id: route.params.id })
// console.log(data)
</script>
