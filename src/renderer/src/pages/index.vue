<template>
  <div
    container="~"
    m="x-auto b-12"
    p="x-4"
  >
    <NPageHeader
      :title="$t('title')"
      :subtitle="$t('subtitle')"
    />
    <ItemList
      grouped
      :items="items"
      :has-more="state?.pageInfo.more"
      :loading="isLoading"
      @load-more="handleLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '@renderer/composables/trpc'

const { $t } = useFluent()

type ListOutput = RouterOutput['home']['list']

const items = ref<ListOutput['items']>([])

const { state, isLoading, execute } = useAsyncState(async (after?: string) => {
  return await trpc.home.list.query({ after })
}, undefined, {
  immediate: true,
  onSuccess: (data) => {
    if (data?.items) {
      items.value.push(...data.items)
    }
  },
})

async function handleLoadMore() {
  await execute(0, state.value?.pageInfo.cursor)
}
</script>

<fluent locale="en">
title = All Notes
subtitle = View all your notes, and sort or filter them

# Replaces the current months name
header-this-month = Earlier this month
</fluent>
