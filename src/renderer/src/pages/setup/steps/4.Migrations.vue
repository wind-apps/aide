<template>
  <div>
    <n-h3>{{ $t('subtitle') }}</n-h3>
    <p
      class="step-content"
      v-html="$t('content')"
    />
    <n-divider />
    <n-form-item
      :validation-status="error ? 'error' : undefined"
      :feedback="error ? unpackError(error) : ''"
    >
      <n-button
        type="primary"
        secondary
        :disabled="isLoading"
        :loading="isLoading"
        @click="execute()"
      >
        {{ $t('start-button') }}
      </n-button>
    </n-form-item>
  </div>
</template>

<script lang="ts" setup>
interface Emits {
  (name: 'next'): void
}

const emits = defineEmits<Emits>()

const { error, isLoading, execute } = useAsyncState(async () => {
  await trpc.migrations.initialise.mutate()

  emits('next')
}, undefined, { immediate: false })

function unpackError(error?: unknown) {
  return error && error instanceof Error ? error.message : ''
}
</script>

<fluent locale="en">
title = Configure
subtitle = Setup Xata Tables
content = Great work so far! Now we need to initialise the Xata database to add the tables we'll need - just click the button below to get started.

start-button = Start Migrations
next-button = Next
</fluent>
