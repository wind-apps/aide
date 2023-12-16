<template>
  <div
    border="1 solid $surface-300"
    pos="relative"
    style="border-radius: var(--border-radius);"
    overflow="hidden"
    text="$text-color"
  >
    <LexicalComposer
      :initial-config="config"
      @error="onError"
    >
      <div
        class="editor-container"
        h="full"
        flex="~ col"
      >
        <ToolbarPlugin flex="shrink-0 grow-0" />
        <div
          className="editor-inner"
          flex="grow"
          pos="relative"
          m="4"
          overflow="auto"
          scrollbar="~ thin thumb-rounded-md thumb-gray-400 track-gray-100"
          overscroll="auto"
        >
          <LexicalRichTextPlugin>
            <template #contentEditable>
              <LexicalContentEditable
                class="editor-input"
                outline="none"
                h="full"
                p="r-4"
              />
            </template>
            <template #placeholder>
              <div
                class="editor-placeholder"
                pos="absolute top-0 left-0"
              >
                Enter some text...
              </div>
            </template>
          </LexicalRichTextPlugin>
          <LexicalHistoryPlugin />
          <LexicalAutoFocusPlugin />
          <CodeHighlightPlugin />
          <LexicalListPlugin />
          <LexicalLinkPlugin />
          <AutoLinkPlugin />
          <LexicalMarkdownShortcutPlugin />
          <LexicalOnChangePlugin
            @change="onChange"
          />
        </div>
      </div>
    </LexicalComposer>
  </div>
</template>

<script lang="ts" setup>
import {
  LexicalAutoFocusPlugin,
  LexicalComposer,
  LexicalContentEditable,
  LexicalHistoryPlugin,
  LexicalLinkPlugin,
  LexicalListPlugin,
  LexicalMarkdownShortcutPlugin,
  LexicalOnChangePlugin,
  LexicalRichTextPlugin,
} from 'lexical-vue'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import type { CreateEditorArgs, EditorState } from 'lexical'

import AutoLinkPlugin from './Editor/AutoLinkPlugin.vue'
import CodeHighlightPlugin from './Editor/CodeHighlightPlugin.vue'
import ToolbarPlugin from './Editor/ToolbarPlugin.vue'

interface Emits {
  (name: 'update:content', value: EditorState): void
}

// interface Props {
//   content: EditorState
// }

// const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const config: CreateEditorArgs = {
  editable: true,
  theme: {
    // Theme styling goes here
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
}

function onError(error: Error) {
  console.error(error)
  throw error
}

// const content = useVModel(props, 'content', emits, { deep: true, passive: true })
// watchEffect(() => {
//   console.log(content.value)
// })
function onChange(content: EditorState) {
  emits('update:content', content)
}
</script>
