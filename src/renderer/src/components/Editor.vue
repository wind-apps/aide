<template>
  <EditorContent :editor="editor" />
</template>

<script lang="ts" setup>
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import type { JSONContent } from '@tiptap/vue-3'
import { EditorContent, VueNodeViewRenderer, useEditor } from '@tiptap/vue-3'
import { common, createLowlight } from 'lowlight'
import CodeBlockComponent from './Editor/CodeBlockComponent.vue'
import type { SaveContent } from './Editor/types'

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const lowlight = createLowlight(common)

CodeBlockLowlight.configure({
  lowlight,
})

interface Props {
  modelValue?: JSONContent | null
}

interface Emits {
  (name: 'update:modelValue', value: SaveContent): void
}

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emits('update:modelValue', {
      json: editor.getJSON(),
      text: editor.getText(),
    })
  },
  extensions: [
    StarterKit,
    CodeBlockLowlight
      .extend({
        addNodeView: () => VueNodeViewRenderer(CodeBlockComponent),
      })
      .configure({ lowlight }),
  ],
})
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  @apply h-full;
  @apply p-4;
  @apply border-1 border-solid border-gray-300 rounded-sm;
  @apply focus:outline-none;

  >*+* {
    margin-top: 0.75em;
  }

  ul {
    list-style: disc;
  }

  code {
    @apply font-mono;
    @apply rounded-md;
    @apply text-white;
    @apply bg-dark-400;
    @apply px-2 py-1;
  }

  pre {
    @apply font-mono;
    @apply rounded-md;
    @apply text-white;
    @apply bg-dark-400;
    @apply p-4;

    code {
      color: inherit;
      padding: 0;
      background: none;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #F98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #FBBC88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #B9F18D;
    }

    .hljs-title,
    .hljs-section {
      color: #FAF594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70CFF8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>
