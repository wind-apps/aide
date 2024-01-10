<template>
  <DefineTemplate #="{ item }">
    <RouterLink
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
      <div
        v-if="item.tags?.length"
        display="hidden md:flex"
        gap="2"
        m="l-8"
      >
        <n-tag
          v-for="(tag, i) in item.tags"
          :key="i"
          :bordered="false"
          size="small"
        >
          {{ tag }}
        </n-tag>
      </div>
      <n-divider
        v-if="!grouped"
        m="!l-auto"
        vertical
      />
      <p
        v-if="!grouped"
      >
        {{ formatDate(item.xata.updatedAt) }}
      </p>
    </RouterLink>
  </DefineTemplate>
  <div
    v-if="!grouped && items.length"
    m="t-8"
    w="full"
  >
    <ReuseTemplate
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
  <div
    v-if="grouped && items.length"
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
        <ReuseTemplate
          v-for="item in section.items"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
    <div
      v-if="hasMore"
      ref="loadMoreEl"
    >
      <p>Loading More!</p>
      <n-spin
        v-if="loading"
        size="medium"
      />
    </div>
  </div>
  <div
    v-if="!items.length && !hideEmpty"
    m="t-8"
  >
    <n-empty
      :description="emptyMessage ?? $t('empty-message-fallback')"
      size="small"
    >
      <template #icon>
        <n-icon>
          <IconFileStack />
        </n-icon>
      </template>
      <template #extra>
        <n-button
          type="primary"
          icon-placement="right"
          @click="$router.push('/items/create')"
        >
          <template #icon>
            <n-icon>
              <IconFilePlus2 />
            </n-icon>
          </template>
          Create Note
        </n-button>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import type { RouterOutput } from '@renderer/composables/trpc'

type ListOutput = RouterOutput['home']['list']
type Item = ListOutput['items'][0]

interface Props {
  items: Item[]
  /** Whether these items are grouped by date */
  grouped?: boolean
  loading?: boolean
  /** Whether we have more items to load */
  hasMore?: boolean
  /** Whether we should hide the empty message component */
  hideEmpty?: boolean
  /** A note to show if no items */
  emptyMessage?: string
}

interface Emits {
  (name: 'loadMore'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { $t } = useFluent()
const { formatDate } = useFormat()

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ item: Item }>()

const items = computed(() => props.items)

// Infinite scroll is a bit annoying if we view an item, then go back, then are forced to scroll all the way back down again.
// TODO: See if we can store the last cursor, and auto scroll to that page, somehow?

const loadMoreEl = ref(null)
const targetIsVisible = useElementVisibility(loadMoreEl)
whenever(targetIsVisible, () => emits('loadMore'))

const currentMonthStr = formatDate()

// TODO: Not sure if this is the most efficient way to do this or not...? WE could possibly do this in the backend, but may mess up with pagination
const sections = computed(() => {
  if (!props.grouped) { return [] }

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

loading-message = Loading More...

empty-message-fallback = No items yet - start your organization journey below
</fluent>
