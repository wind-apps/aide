<template>
  <div
    container="~"
    m="x-auto b-12"
    p="x-4"
  >
    <NPageHeader :title="$t('title')" />
    <p>Placeholder for when tags are implemented as a seperate table</p>
  </div>
</template>

<script setup lang="ts">
const { $t } = useFluent()
</script>

<fluent locale="en">
title = Tags
</fluent>
