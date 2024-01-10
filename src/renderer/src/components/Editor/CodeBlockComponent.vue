<template>
  <NodeViewWrapper
    class="code-block"
    pos="relative"
  >
    <n-select
      v-model:value="selectedLanguage"
      :options="options"
      size="tiny"
      pos="!absolute top-4 right-4"
      w="max-32"
    />
    <pre><code><NodeViewContent /></code></pre>
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

const props = defineProps(nodeViewProps)

const languages = computed<string[]>(() => props.extension.options.lowlight.listLanguages())

const selectedLanguage = computed({
  get: () => props.node.attrs.language,
  set: language => props.updateAttributes({ language }),
})

const options = computed<SelectMixedOption[]>(() => {
  const options: SelectMixedOption[] = languages.value.map(language => ({
    label: language,
    value: language,
  }))

  return [
    {
      label: 'Auto',
      value: '',
    },
    {
      label: '----',
      disabled: true,
      type: 'ignored'
    },
    ...options,
  ]
})
</script>
