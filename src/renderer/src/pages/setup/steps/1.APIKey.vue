<template>
  <n-form
    @submit.prevent="saveKey()"
  >
    <n-h3>{{ $t('subtitle') }}</n-h3>
    <p
      class="step-content"
      v-html="$t('content')"
    />
    <n-divider />
    <n-form-item
      :label="$ta('key-input').label"
      :validation-status="saveKeyError ? 'error' : undefined"
      :feedback="saveKeyErrorMessage"
    >
      <n-input
        v-model:value="apiKey"
        :placeholder="$ta('key-input').placeholder"
        :disabled="isSavingKey"
        required
      />
    </n-form-item>
    <n-form-item>
      <n-button
        type="primary"
        secondary
        attr-type="submit"
        m="l-auto"
        :loading="isSavingKey"
      >
        {{ $t('next-button') }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
interface Emits {
  (name: 'next'): void
}

const emits = defineEmits<Emits>()

const { $ta, $t } = useFluent()


defineExpose({
  title: $t('title'),
})

const apiKey = ref()

const { isLoading: isSavingKey, execute: saveKey, error: saveKeyError } = useAsyncState(async () => {
  if (!apiKey.value) { throw new Error($ta('key-input').required) }

  await trpc.auth.authenticate.mutate({
    apiKey: apiKey.value,
    branch: undefined,
  })

  emits('next')
}, undefined, {
  immediate: false,
  resetOnExecute: true,
})

const saveKeyErrorMessage = computed(() => saveKeyError.value instanceof Error ? saveKeyError.value.message : '')
</script>

<fluent locale="en">
title = Authenticate
subtitle = Xata API Key
content = To start, you'll need an Xata API key. To find this, head to the <a href="https://app.xata.io/signin?mode=signup">Xata website</a> and sign in/create an account. Once you are logged in, go to your <a href="https://app.xata.io/settings">account settings</a>. Scroll down to the <strong>Personal API Keys</strong> section, and click <strong>Add a key</strong> - name this key Aide, click save, then copy the resulting API key and paste it below.

key-input =
  .label = API Key
  .placeholder = Enter your Xata API Key
  .required = An API Key is required

next-button = Next
back-button = Back
</fluent>
