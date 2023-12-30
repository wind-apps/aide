<template>
  <div
    container="~"
    m="x-auto b-12"
  >
    <NPageHeader
      :title="$t('title')"
      :subtitle="$t('subtitle')"
    />
    <!-- Tried doing a table, but got too weird -->
    <div
      m="t-8"
      w="full"
    >
      <div
        v-for="(section, i) in sections"
        :key="i"
        w="full"
        m="b-8"
      >
        <NH3
          prefix="bar"
          text="capitalize"
        >
          {{ section.title }}
        </NH3>
        <div
          flex="~ col"
          w="full"
        >
          <RouterLink
            v-for="item in section.items"
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
          </RouterLink>
        </div>
      </div>
      <div
        v-if="state?.pageInfo.more"
        ref="loadMoreEl"
      >
        <p>Loading More!</p>
        <n-spin
          v-if="isLoading"
          size="medium"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '@renderer/composables/trpc'
import dayjs from 'dayjs'

const { $t } = useFluent()

type ListOutput = RouterOutput['home']['list']

const items = ref<ListOutput['items']>([])

const { state, isLoading, execute } = useAsyncState(async (after?: string) => {
  return await trpc.home.list.query({ after })
}, undefined, {
  immediate: true,
  onSuccess: (data) => {
    console.log('got data', data)
    if (data?.items) {
      items.value.push(...data.items)
    }
  },
})

const loadMoreEl = ref(null)
const targetIsVisible = useElementVisibility(loadMoreEl)
whenever(targetIsVisible, async () => {
  console.log('load more!')
  const res = await execute(0, state.value?.pageInfo.cursor)
  console.log('got res', res)


}, {once: false})

function formatDate(value: string | dayjs.Dayjs) {
  return dayjs(value).format('DD MMMM YYYY')
}

const currentMonthStr = formatDate(dayjs())

// TODO: Not sure if this is the most efficient way to do this or not...?
const sections = computed(() => {
  const groups = items.value.reduce((group, item) => {
    const dateStr = formatDate(item.xata.updatedAt)
    const existing = group.get(dateStr) ?? []

    return group.set(dateStr, [...existing, item])
  }, new Map<string, ListOutput['items']>())

  return Array.from(groups).map(([title, items]) => {
    return {
      items,
      title: title === currentMonthStr ? $t('header-this-month') : title,
    }
  })
})
</script>

<fluent locale="en">
title = All Notes
subtitle = View all your notes, and sort or filter them

# Replaces the current months name
header-this-month = Earlier this month
</fluent>
