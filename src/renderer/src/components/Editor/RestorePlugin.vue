<template>
  <span />
</template>

<script lang="ts" setup>
import { useEditor } from 'lexical-vue'

interface Props {
  content?: any
}

const props = defineProps<Props>()

const editor = useEditor()

console.log('content', props.content)
if (props.content) {
  const state = editor.parseEditorState(props.content)
  editor.setEditorState(state)
}
</script>
