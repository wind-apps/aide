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
          <LexicalRichTextPlugin >
            <template #contentEditable>
              <LexicalContentEditable
      ref="editor"
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
          <RestorePlugin :content="intialContent" />
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
  LexicalRichTextPlugin

} from 'lexical-vue'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { $getRoot, type CreateEditorArgs, type EditorState } from 'lexical'

import RestorePlugin from './Editor/RestorePlugin.vue'
import AutoLinkPlugin from './Editor/AutoLinkPlugin.vue'
import CodeHighlightPlugin from './Editor/CodeHighlightPlugin.vue'
import ToolbarPlugin from './Editor/ToolbarPlugin.vue'

export interface SaveContent {
  json: any
  text: string
}

interface Emits {
  (name: 'update:content', value: SaveContent): void
}

interface Props {
  intialContent?: any
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const editor = ref()
watch(editor, editor => {
  console.log({ editor })
})
const config: CreateEditorArgs = {
  editable: true,
  editorState: undefined,
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

const content = ref<EditorState>()

const onChange = useDebounceFn((state: EditorState) => {
  content.value = state
  emits('update:content', {
    json: state.toJSON(),
    text: state.read(() => $getRoot().getTextContent()),
  })
}, 1000)

function save(): SaveContent {
  console.log('content', content.value)
  if (!content.value) {
    return {
      json: {},
      text: '',
    }
  }

  return {
    json: content.value?.toJSON(),
    text: content.value?.read(() => $getRoot().getTextContent()),
  }
}

defineExpose({ save })
</script>
