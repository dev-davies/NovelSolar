<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { onBeforeUnmount, ref, watch } from 'vue'
import { htmlToMarkdown, markdownToHtml } from '~/utils/blogMarkdown'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = ref<Editor | null>(null)
const isSyncingFromProp = ref(false)

editor.value = new Editor({
  content: markdownToHtml(props.modelValue || ''),
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose prose-slate max-w-none min-h-[280px] focus:outline-none px-5 py-4',
    },
  },
  onUpdate({ editor: e }) {
    if (isSyncingFromProp.value) return
    emit('update:modelValue', htmlToMarkdown(e.getHTML()))
  },
})

watch(
  () => props.modelValue,
  (next) => {
    if (!editor.value) return
    const currentMarkdown = htmlToMarkdown(editor.value.getHTML())
    if (next === currentMarkdown) return
    isSyncingFromProp.value = true
    editor.value.commands.setContent(markdownToHtml(next || ''), false)
    isSyncingFromProp.value = false
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
  editor.value = null
})

const exec = (fn: (chain: any) => any) => {
  if (!editor.value) return
  fn(editor.value.chain().focus()).run()
}

const isActive = (name: string, attrs?: Record<string, unknown>) => {
  if (!editor.value) return false
  return editor.value.isActive(name, attrs)
}
</script>

<template>
  <div class="border-2 border-slate-100 rounded-2xl bg-white overflow-hidden focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
    <div class="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/60 px-3 py-2 text-xs font-semibold">
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('heading', { level: 2 }) ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleHeading({ level: 2 }))"
      >H2</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('heading', { level: 3 }) ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleHeading({ level: 3 }))"
      >H3</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('bold') ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleBold())"
      >Bold</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('italic') ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleItalic())"
      >Italic</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('bulletList') ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleBulletList())"
      >• List</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('orderedList') ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleOrderedList())"
      >1. List</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('blockquote') ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleBlockquote())"
      >Quote</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition"
        :class="isActive('codeBlock') ? 'bg-white text-purple-700' : 'text-slate-600'"
        @click="exec(c => c.toggleCodeBlock())"
      >Code</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition text-slate-600"
        @click="exec(c => c.undo())"
      >Undo</button>
      <button
        type="button"
        class="px-2 py-1 rounded hover:bg-white transition text-slate-600"
        @click="exec(c => c.redo())"
      >Redo</button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
