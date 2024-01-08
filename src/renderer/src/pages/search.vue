<template>
  <div
    container="~"
    m="x-auto b-12"
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
    <div
      m="t-8"
      w="full"
    >
      <RouterLink
        v-for="item in items"
        :key="item.id"
        flex="inline row"
        gap="4"
        align="items-center"
        border="not-last:b-1 solid gray-100"
        p="y-4 x-4"
        bg="hover:light-200"
        class="group"
        :to="{ name: '/items/[id]', params: { id: item.id } }"
        cursor="pointer"
        w="full"
      >
        <NIcon size="18">
          <IconFile />
        </NIcon>
        <p
          text="base capitalize"
          font="group-hover:medium"
        >
          {{ item.title }}
        </p>
        <p>
          {{ formatDate(item.xata.updatedAt) }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

const { $t } = useFluent()

const query = ref()

const { execute, isLoading, state: items } = useAsyncState(async (query: string) => {
  return await trpc.search.items.query({ query })
}, [], {
  immediate: false,
  resetOnExecute: true,
})

async function handleSearch() {
  await execute(undefined, query.value)
}

function formatDate(value: string | dayjs.Dayjs) {
  return dayjs(value).format('dddd, DD MMMM YYYY')
}
</script>

<fluent locale="en">
title = Search

search-placeholder = Search for notes or tags
</fluent>
