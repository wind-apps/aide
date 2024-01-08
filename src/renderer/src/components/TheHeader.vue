<template>
  <header
    p="4"
    flex="~ row"
    justify="between"
    w="full"
    pos="sticky top-0"
    m="b-8"
    bg="white"
    z="50"
  >
    <n-menu
      v-model:value="activeOption"
      mode="horizontal"
      :options="menuOptions"
      responsive
    />
    <div>
      <Link
        to="/items/create"
        type="primary"
      >
        <template #icon>
          <NIcon>
            <icon-plus />
          </NIcon>
        </template>
        Create
      </Link>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { FileSearchIcon, FileTextIcon, TagsIcon } from 'lucide-vue-next'
import { type MenuOption, NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router/auto'

const data = await trpc.navigation.recentItems.query()

const recentItems = ref(data ?? [])

// A pretty naive implementation, for now
trpc.navigation.subscribeRecentItems.subscribe(undefined, {
  onData: (updatedItems) => {
    recentItems.value = updatedItems
  }
})

const route = useRoute()

const activeOption = ref()
syncRef(
  activeOption,
  computed(() => route.path),
  {
    direction: 'rtl',
    immediate: true,
  },
)

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = computed<MenuOption[]>(() => {
  const home: MenuOption = {
    key: '/',
    label: () => h(RouterLink, { to: '/' }, { default: () => 'Home' }),
    children: [
      {
        type: 'group',
        label: 'Recent',
        children: recentItems.value.map(item => ({
          key: item.id,
          icon: renderIcon(FileTextIcon),
          label: () => h(RouterLink, { to: { name: '/items/[id]', params: { id: item.id } } }, { default: () => item.title }),
        })),
      },
    ],
  }

  return [
    home,
    {
      key: 'collections',
      label: () => h(RouterLink, { to: '/' }, { default: () => 'Collections' }),
      icon: renderIcon(TagsIcon),
    },
    {
      key: 'search',
      label: () => h(RouterLink, { to: '/search' }, { default: () => 'Search' }),
      icon: renderIcon(FileSearchIcon),
    },
  ]
})
</script>
