<template>
  <ItemLayout :loading="isLoading || !item">
    <template #title>
      <n-form-item
        flex="grow"
        label="Title"
        :validation-status="validationStatus('title')"
        :feedback="validationErrors.title"
      >
        <n-input
          v-model:value="input.title"
          size="large"
          name="title"
          :placeholder="$t('title-placeholder')"
          :aria-label="$t('title-aria-label')"
        >
          <template #prefix>
            <n-icon>
              <IconType />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>
      <n-button-group>
        <n-button
          type="primary"
          size="large"
          flex="grow-0 shrink-0"
          :loading="isSaving"
          :disabled="isSaving || isDeleting"
          @click="executeSave()"
        >
          {{ $t('save-button') }}
          <template #icon>
            <NIcon>
              <IconSave />
            </NIcon>
          </template>
        </n-button>
        <n-button
          type="error"
          size="large"
          flex="grow-0 shrink-0"
          :loading="isDeleting"
          :disabled="isDeleting || isSaving"
          @click="confirmDelete"
        >
          {{ $t('delete-button') }}
          <template #icon>
            <NIcon>
              <IconSave />
            </NIcon>
          </template>
        </n-button>
      </n-button-group>
    </template>
    <template #tags>
      <TagsAutoComplete v-model="input.tags" />
    </template>
    <template #editor>
      <Editor
        v-if="item"
        v-model="input.content"
        :initial-content="item.content"
      />
    </template>
  </ItemLayout>
</template>

<script lang="ts" setup>
import type { SaveContent } from '@renderer/components/Editor/types'
import { klona } from 'klona'

const dialog = useDialog()
const message = useMessage()
const route = useRoute('/items/[id]')
const router = useRouter()
const { $t } = useFluent()

// TODO: Figure out how to make this better!
// Thinking we can use components for each part, then pass new data via props, which is set as the defaultValue in useVModel?

const { state: item, execute, isLoading } = useAsyncState(async (id) => {
  const item = await trpc.item.item.query({ id })
  if (!item) {
    message.error($t('not-found-message'))
    router.push({ name: '/' })
    return
  }

  return item
}, undefined, { immediate: true })

const input = reactive<{ title: string, tags: string[], content: SaveContent | null }>({
  title: '',
  tags: [],
  content: null
})

watch(() => route.params, async ({ id }) => {
  console.log({ id })
  const item = await execute(undefined, id)
  if (!item) return

  input.content = null
  input.title = item.title ?? ''
  input.tags = item.tags ?? []
}, { immediate: true })

const validationErrors = ref<Record<string, string>>({})

function validationStatus(field: string) {
  return Reflect.has(validationErrors.value, field) ? 'error' : undefined
}

const { execute: executeSave, isLoading: isSaving } = useAsyncState(async () => {
  try {
    return await trpc.item.update.mutate(klona({
      id: route.params.id,
      ...input,
      content: input.content?.json,
      textContent: input.content?.text,
    }))
  }
  catch (err) {
    const error = err as Error & { data?: { validation?: { message: string, field: string }[] } }
    console.error(error)

    if (error.data?.validation) {
      console.log(error.data.validation)
      validationErrors.value = Object.fromEntries(error.data.validation.map(err => [err.field, err.message]))
    }

    throw error
  }
}, undefined, {
  immediate: false,
  onError: () => {
    message.error($t('save-error-message'), { closable: true })
  },
  onSuccess: () => {
    message.success($t('save-success-message'))
  },
})

const { execute: executeDelete, isLoading: isDeleting } = useAsyncState(async () => {
  try {
    return await trpc.item.delete.mutate({ id: route.params.id })
  }
  catch (err) {
    const error = err as Error & { data?: { validation?: { message: string, field: string }[] } }
    console.error(error)

    if (error.data?.validation) {
      console.log(error.data.validation)
      validationErrors.value = Object.fromEntries(error.data.validation.map(err => [err.field, err.message]))
    }

    throw error
  }
}, undefined, {
  immediate: false,
  onError: () => {
    message.error($t('delete-error-message'), { closable: true })
  },
  onSuccess: () => {
    message.success($t('delete-success-message'))
    router.push('/')
  },
})

function confirmDelete() {
  return dialog.error({
    title: $t('delete-modal-title'),
    content: $t('delete-modal-content'),
    positiveText: $t('delete-modal-confirm'),
    negativeText: $t('delete-modal-cancel'),
    onPositiveClick: () => executeDelete(),
  })
}
</script>

<fluent locale="en">
not-found-message = No item found with this ID.

title-placeholder = Title
title-aria-label = Add a title for this item

save-button = Save
delete-button = Delete

delete-modal-title = Delete Note
delete-modal-content = Are you sure you want to delete this note? It will be permanently removed.
delete-modal-confirm = Yes, Delete
delete-modal-cancel = No, Cancel

save-error-message = Error saving note - please try again
save-success-message = Successfully saved note

delete-error-message = Error deleting note - please try again
delete-success-message = Successfully delete note
</fluent>
