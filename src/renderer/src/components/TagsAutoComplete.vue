<template>
  <n-dynamic-tags
    v-model:value="tags"
    size="medium"
  >
    <template #input="{ submit, deactivate }">
      <n-auto-complete
        ref="tagInputEl"
        v-model:value="tagInput"
        :options="options"
        placeholder="Search for tags"
        clear-after-select
        clearable
        :loading="isSearching"
        size="small"
        @select="submit($event)"
        @keyup.enter="handleEnterTag(submit)"
        @blur="deactivate"
        @vue:mounted="mountedInput"
      />
    </template>
    <template #trigger="{ activate, disabled }">
      <n-button
        type="primary"
        dashed
        size="small"
        :disabled="disabled"
        @click="activate()"
      >
        <template #icon>
          <n-icon>
            <IconPlus />
          </n-icon>
        </template>
        New Tag
      </n-button>
    </template>
  </n-dynamic-tags>
</template>

<script lang="ts" setup>
interface Props {
  options?: string[]
  modelValue: string[]
}

interface Emits {
  (name: 'update:modelValue', value: string[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const tagInput = ref('')
const tagInputDebounced = refDebounced(tagInput, 300)

const isSearching = ref(false)
const searchedTags = computedAsync(async () => {
  return await trpc.item.tags.query({query: tagInputDebounced.value })
}, [], {lazy: false, evaluating: isSearching })

const suggestions = computed(() => props.options ? [...props.options, ...searchedTags.value] : searchedTags.value)

const options = computed(() =>
  tagInput.value
    ? suggestions.value.filter(tag => tag.toLowerCase().includes(tagInput.value.toLowerCase()))
    : suggestions.value)

const tags = useVModel(props, 'modelValue', emits)

function handleEnterTag(cb: (value: string) => void) {
  cb(tagInput.value)
  tagInput.value = ''
}

const tagInputEl = ref<HTMLElement | null>()
function mountedInput() {
  tagInputEl.value?.focus()
}
</script>
