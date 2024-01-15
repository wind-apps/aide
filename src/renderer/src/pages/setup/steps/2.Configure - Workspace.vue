<template>
  <div>
    <n-h3>{{ $t('subtitle') }}</n-h3>
    <p
      class="step-content"
      v-html="$t('content')"
    />
    <n-divider />
    <n-form-item
      :label="$ta('workspace-select').label"
      :validation-status="saveWorkspaceError ? 'error' : undefined"
      :feedback="unpackError(saveWorkspaceError)"
    >
      <n-input-group>
        <n-select
          v-model:value="selectedWorkspace"
          :placeholder="$ta('workspace-select').placeholder"
          :options="workspaces"
          :loading="isLoadingWorkspaces"
          :disabled="isSavingWorkspace"
          label-field="name"
          value-field="id"
          clearable
          remote
        />
        <n-button
          type="primary"
          secondary
          w="1/4"
          :loading="isSavingWorkspace"
          :disabled="isLoadingWorkspaces"
          @click="saveWorkspace()"
        >
          {{ $ta('workspace-select').button }}
        </n-button>
      </n-input-group>
    </n-form-item>
    <n-divider title-placement="left">
      Or
    </n-divider>
    <n-form-item
      :label="$ta('workspace-create').label"
      :validation-status="createWorkspaceError ? 'error' : undefined"
      :feedback="unpackError(createWorkspaceError)"
    >
      <n-input-group>
        <n-input
          v-model:value="newWorkspaceName"
          :placeholder="$ta('workspace-create').placeholder"
          :disabled="isCreatingWorkspace"
        />
        <n-button
          type="primary"
          secondary
          w="1/4"
          :loading="isCreatingWorkspace"
          @click="createWorkspace()"
        >
          {{ $ta('workspace-create').button }}
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

const { state: workspaces, isLoading: isLoadingWorkspaces } = useAsyncState(async () => await trpc.auth.listWorkspaces.query(), [], { immediate: true })

const selectedWorkspace = ref<string>()

const { error: saveWorkspaceError, isLoading: isSavingWorkspace, execute: saveWorkspace } = useAsyncState(async () => {
  if (!selectedWorkspace.value) { throw new Error($ta('workspace-select').required) }

  await trpc.auth.saveWorkspace.mutate({ workspaceId: selectedWorkspace.value })

  emits('next')
}, undefined, { immediate: false })

const newWorkspaceName = ref<string>()
const { error: createWorkspaceError, isLoading: isCreatingWorkspace, execute: createWorkspace } = useAsyncState(async () => {
  if (!newWorkspaceName.value) { throw new Error($ta('workspace-create').required) }

  await trpc.auth.createWorkspace.mutate({ name: newWorkspaceName.value })

  emits('next')
}, undefined, { immediate: false })

function unpackError(error?: unknown) {
  return error && error instanceof Error ? error.message : ''
}
</script>

<fluent locale="en">
title = Configure
subtitle = Setup Xata
content = Now we can start configuring Xata - you'll need to either create a new Xata workspace, or select an existing Workspace if you already have one you'd like to use.

workspace-create =
  .button = Create
  .placeholder = Your workspace name
  .label = Create new Workspace

workspace-select =
  .label = Select an existing Workspace
  .placeholder = Choose a workspace from your account
  .required = You must select a workspace
  .button = Save

next-button = Next
back-button = Back
</fluent>
