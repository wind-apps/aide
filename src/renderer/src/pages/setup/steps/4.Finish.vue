<template>
  <div>
    <n-h3>{{ $t('subtitle') }}</n-h3>
    <p
      class="step-content"
      v-html="$t('content')"
    />
    <div
      flex="~ row"
      gap="4"
      justify="between"
      w="full"
      m="t-12"
    >
      <div />
      <Link
        type="primary"
        to="/items/create"
      >
        <template #icon>
          <n-icon>
            <IconEdit />
          </n-icon>
        </template>
        {{ $t('create-button') }}
      </Link>
      <Link to="/">
        <template #icon>
            <n-icon>
              <IconHome />
            </n-icon>
          </template>
        {{ $t('finish-button') }}
      </Link>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<fluent locale="en">
title = Configure
subtitle = Finished
content = Amazing! You're now all ready to get started adding notes.

create-button = Create a note
finish-button = Finish
</fluent>
