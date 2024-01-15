<template>
  <div>
    <n-h3>{{ $t('subtitle') }}</n-h3>
    <p
      class="step-content"
      v-html="$t('content')"
    />
    <n-divider />
    <n-form-item
      :label="$ta('database-select').label"
      :validation-status="saveDatabaseError ? 'error' : undefined"
      :feedback="unpackError(saveDatabaseError)"
    >
      <n-input-group>
        <n-select
          v-model:value="selectedDatabase"
          :placeholder="$ta('database-select').placeholder"
          :options="databases"
          :loading="isLoadingDatabases"
          :disabled="isSavingDatabase"
          label-field="name"
          value-field="name"
          remote
        />
        <n-button
          type="primary"
          secondary
          w="1/4"
          :loading="isSavingDatabase"
          :disabled="isLoadingDatabases"
          @click="saveDatabase()"
        >
          {{ $ta('database-select').button }}
        </n-button>
      </n-input-group>
    </n-form-item>
    <n-divider title-placement="left">
      Or
    </n-divider>
    <n-form-item
      :label="$ta('database-create').label"
      :validation-status="createDatabaseError ? 'error' : undefined"
      :feedback="unpackError(createDatabaseError)"
    >
      <n-input-group>
        <n-input
          v-model:value="newDatabase.name"
          :placeholder="$ta('database-create').placeholder"
          :disabled="isCreatingDatabase"
        />
        <n-select
          v-model:value="newDatabase.region"
          :placeholder="$ta('database-region').placeholder"
          :options="regions"
          :loading="isLoadingRegions"
          :disabled="isCreatingDatabase"
          :default-value="defaultRegion"
          label-field="name"
          value-field="id"
          remote
        />
        <n-button
          type="primary"
          secondary
          w="1/4"
          :loading="isCreatingDatabase"
          :disabled="isLoadingRegions"
          @click="createDatabase()"
        >
          {{ $ta('database-create').button }}
        </n-button>
      </n-input-group>
    </n-form-item>
  </div>
</template>

<script lang="ts" setup>
interface Emits {
  (name: 'next'): void
}

const emits = defineEmits<Emits>()

const { $ta } = useFluent()

console.log($ta('database-create'))

const { state: databases, isLoading: isLoadingDatabases } = useAsyncState(async () => await trpc.auth.listDatabases.query({ workspaceId: undefined }), [], { immediate: true })
const { state: regions, isLoading: isLoadingRegions } = useAsyncState(async () => await trpc.auth.listDatabaseRegions.query(), [], { immediate: true })

const selectedDatabase = ref<string>()

const { error: saveDatabaseError, isLoading: isSavingDatabase, execute: saveDatabase } = useAsyncState(async () => {
  if (!selectedDatabase.value) { throw new Error($ta('database-select').required) }

  await trpc.auth.saveDatabase.mutate({ database: selectedDatabase.value })

  emits('next')
}, undefined, { immediate: false })

const defaultRegion = computed(() => regions.value[0]?.id)
const newDatabase = reactive({
  name: '',
  region: defaultRegion.value,
})

const { error: createDatabaseError, isLoading: isCreatingDatabase, execute: createDatabase } = useAsyncState(async () => {
  if (!newDatabase.name) { throw new Error($ta('database-create').required) }

  const region = newDatabase.region ?? defaultRegion.value

  await trpc.auth.createDatabase.mutate({ name: newDatabase.name, region })

  emits('next')
}, undefined, { immediate: false })

function unpackError(error?: unknown) {
  return error && error instanceof Error ? error.message : ''
}
</script>

<fluent locale="en">
title = Configure
subtitle = Setup Xata Database
content = Next you'll need to either create a new Xata database, or select an existing database if you have one.

database-create =
  .button = Create
  .placeholder = Your database name
  .label = Create new Database
  .required = You must provide the database name and region

database-region =
  .placeholder = Select a region
  .required = You must select a region

database-select =
  .label = Select an existing Database
  .placeholder = Choose a database from your account
  .required = You must select a database
  .button = Save

next-button = Next
back-button = Back
</fluent>
