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
    <div
      m="t-12 x-auto"
      w="full md:1/2"
    >
      <NInputGroup>
        <NInput
          size="large"
          round
          :placeholder="$ta('search-input').placeholder"
          @keyup.enter="handleSearch"
          v-model:value="query"
        >
          <template #prefix>
            <NIcon>
              <IconBot />
            </NIcon>
          </template>
        </NInput>
        <NButton
          size="large"
          type="primary"
          secondary
          round
          :loading="isLoading"
          @click="handleSearch"
        >
          {{ $ta('search-input').text }}
        </NButton>
      </NInputGroup>
    </div>
    <div
      v-if="state?.answer"
      m="t-8"
    >
      <NH3>{{ state.answer }}</NH3>
      <ItemList
        v-if="state.items"
        :items="state.items"
        hide-empty
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $t } = useFluent()

const query = ref('')

const { execute, isLoading, state } = useAsyncState(async (query: string) => {
  return await trpc.ask.items.query({ query })
}, undefined, {
  immediate: false,
  resetOnExecute: true,
})

async function handleSearch() {
  if (query.value.length < 2) { return }

  await execute(undefined, query.value)
}
</script>

<fluent locale="en">
title = Ask Aide AI
subtitle = Use Aide to query your notes - you can ask them anything!

search-input =
  .placeholder = Find me some notes that mention databases
  .text = Search
</fluent>
