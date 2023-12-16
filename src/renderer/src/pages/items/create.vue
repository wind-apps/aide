<template>
  <div
    container="~"
    m="x-auto"
    pos="relative"
    h="screen max-screen"
    p="y-8"
  >
    <div
      grid="~ cols-1"
      style="grid-template-rows: auto auto 1fr;"
      gap="4"
      m="x-4"
      w="full"
      h="full"
      overflow="hidden"
    >
      <div
        flex="~ row"
        align="items-center"
        gap="8"
      >
        <n-form-item
          flex="grow"
          label="Title"
          :validation-status="validationStatus('title')"
          :feedback="validationErrors.title"
        >
          <n-input
            v-model:value="title"
            size="large"
            name="title"
            placeholder="Title"
            aria-label="Add a title for this item"
          >
            <template #prefix>
              <n-icon>
                <IconType />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-button
          type="primary"
          size="large"
          flex="grow-0 shrink-0"
          @click="save"
        >
          Save
          <template #icon>
            <NIcon>
              <IconSave />
            </NIcon>
          </template>
        </n-button>
      </div>
      <div
        w="full"
        flex="~ col"
        gap="2"
      >
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
      </div>
      <Editor ref="editor" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { klona } from 'klona'
import type { SaveContent } from '@renderer/components/Editor.vue'

const title = ref('')

const tagInput = ref('')
const initialTags = ['design', 'frontend', 'sdk']
const options = computed(() => tagInput.value ? initialTags.filter(tag => tag.toLowerCase().includes(tagInput.value.toLowerCase())) : initialTags)

const tags = ref<string[]>([])
function handleEnterTag(cb: (value: string) => void) {
  cb(tagInput.value)
  tagInput.value = ''
}

const tagInputEl = ref<HTMLElement | null>()
function mountedInput() {
  tagInputEl.value?.focus()
}

const editor = ref<{ save: () => SaveContent }>()

const trpc = useTRPC()

const validationErrors = ref<Record<string, string>>({})

function validationStatus(field: string) {
  return Reflect.has(validationErrors.value, field) ? 'error' : undefined
}

async function save() {
  try {
    const content = editor.value?.save()
    if (!content) { return }

    await trpc.itemCreate.mutate(klona({
      title: toValue(title),
      tags: toValue(tags),
      content: content.json,
      textContent: content.text,
    }))
  }
  catch (err) {
    const error = err as Error & { data?: { validation?: { message: string, field: string }[] } }
    console.error(error)

    if (error.data?.validation) {
      console.log(error.data.validation)
      console.log(Object.fromEntries(error.data.validation.map(err => [err.field, err.message])))
      validationErrors.value = Object.fromEntries(error.data.validation.map(err => [err.field, err.message]))
    }
  }
}
</script>
