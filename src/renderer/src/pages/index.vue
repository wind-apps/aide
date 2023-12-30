<script setup lang="ts">
const trpc = useTRPC()

</script>

<template>
  <div>
    <Link :to="{ name: '/items/create' }">
      Create Item
    </Link>
    <Link :to="{ name: '/items/[id]', params: { id: '' } }">
      View Item
    </Link>
  </div>
</template>
