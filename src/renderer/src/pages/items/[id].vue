<template>
  <p>Edit existing</p>
  <Editor
    v-if="data?.content"
    :intial-content="data.content"
  />
</template>

<script lang="ts" setup>
const route = useRoute('/items/[id]')
const trpc = useTRPC()
const data = await trpc.itemById.query({ id: route.params.id })
console.log(data)
</script>
