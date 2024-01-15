<template>
  <div
    container="~"
    m="auto"
    h="min-screen"
    flex="~"
    p="x-4"
  >
    <div
      m="auto"
      w="md:max-1/2"
    >
      <n-steps v-model:current="currentStep">
        <n-step
          v-for="({ step }, i) in steps"
          :key="i"
          :title="$t(`step-${step}-title`)"
          :disabled="currentStep < step"
        />
      </n-steps>
      <div
        w="full"
        m="t-8"
      >
        <component
          :is="currentStepComp"
          @next="currentStep++"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DefineComponent } from 'vue'

const stepImports = import.meta.glob<DefineComponent>('./steps/*.vue', { eager: true, import: 'default' })
const steps = Object.entries(stepImports).sort(([a], [b]) => a.localeCompare(b)).map(([, comp], i) => ({ ...comp, step: i + 1 }))

const currentStep = ref(1)

const currentStepComp = computed(() => steps[currentStep.value - 1])
</script>

<fluent locale="en">
step-1-title = API Key
step-2-title = Workspace
step-3-title = Database
step-4-title = Migrations
step-5-title = Finish Up
</fluent>
