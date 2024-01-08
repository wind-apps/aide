<template>
  <ItemLayout>
    <template #title>
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
      <n-button
        type="primary"
        size="large"
        flex="grow-0 shrink-0"
        :loading="isLoading"
        :disabled="isLoading"
        @click="execute()"
      >
        {{ $t('save-button') }}
        <template #icon>
          <NIcon>
            <IconSave />
          </NIcon>
        </template>
      </n-button>
    </template>
    <template #tags>
      <TagsAutoComplete v-model="tags" />
    </template>
    <template #editor>
      <Editor v-model="content" />
    </template>
  </ItemLayout>
</template>

<script lang="ts" setup>
import { klona } from 'klona'
import type { SaveContent } from '@renderer/components/Editor/types'

const title = ref('')
const tags = ref<string[]>([])
const content = ref<SaveContent>()

const validationErrors = ref<Record<string, string>>({})

function validationStatus(field: string) {
  return Reflect.has(validationErrors.value, field) ? 'error' : undefined
}

const message = useMessage()
const router = useRouter()
const { $t } = useFluent()

const { execute, isLoading } = useAsyncState(async () => {
  try {
    return await trpc.item.create.mutate(klona({
      title: toValue(title),
      tags: toValue(tags),
      content: content.value?.json,
      textContent: content.value?.text,
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
    message.error($t('error-message'), { closable: true })
  },
  onSuccess: (data) => {
    message.success($t('success-message'), { closable: true })

    if (data) {
      router.push({ name: '/items/[id]', params: { id: data?.id } })
    }
  },
})
</script>

<fluent locale="en">
title-placeholder = Title
title-aria-label = Add a title for this item

save-button = Save

error-message = Error saving note - please try again
success-message = Successfully saved note
</fluent>
