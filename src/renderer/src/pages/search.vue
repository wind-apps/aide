<template>
  <div
    container="~"
    m="x-auto b-12"
    p="x-4"
  >
    <NPageHeader
      :title="$t('title')"
    />
    <div
      m="t-8"
      w="full"
    >
      <n-input-group>
        <n-input
          v-model:value="query"
          type="text"
          :placeholder="$t('search-placeholder')"
          :loading="isLoading"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <n-icon>
              <IconSearch />
            </n-icon>
          </template>
        </n-input>
        <n-button
          type="primary"
          @click="handleSearch"
        >
          Search
        </n-button>
      </n-input-group>
    </div>
    <ItemList
      :items="items"
      :hide-empty="!showEmpty"
      :empty-message="$t('search-results-empty')"
    />
  </div>
</template>

<script lang="ts" setup>
const { $t } = useFluent()

const query = ref('')
const hasSearched = ref(false)

const { execute, isLoading, state: items } = useAsyncState(async (query: string) => {
  return await trpc.search.items.query({ query })
}, [], {
  immediate: false,
  resetOnExecute: true,
})

async function handleSearch() {
  if (query.value.length < 2) { return }

  await execute(undefined, query.value)
  hasSearched.value = true
}

const showEmpty = computed(() => {
  return hasSearched.value && !items.value.length && !isLoading.value
})
</script>

<fluent locale="en">
title = Search

search-placeholder = Search for notes or tags

search-results-empty = No items found for this query. Add one?
</fluent>
