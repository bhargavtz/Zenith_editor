import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EditorState {
    content: string
    fileName: string | null
    filePath: string | null
    fileHandle: FileSystemFileHandle | null
    isDirty: boolean
    lastSaved: Date | null
    cursorPosition: { line: number; column: number }

    // Actions
    setContent: (content: string) => void
    setFileName: (name: string | null) => void
    setFilePath: (path: string | null) => void
    setFileHandle: (handle: FileSystemFileHandle | null) => void
    setIsDirty: (dirty: boolean) => void
    setLastSaved: (date: Date | null) => void
    setCursorPosition: (line: number, column: number) => void
    resetDocument: () => void
}

const initialContent = `# Welcome to Zenith ✨

> **Zero Friction, Maximum Power**

Start writing your markdown here. Your content is automatically saved locally.

## Features

- ✅ **Live Preview** - See your markdown rendered in real-time
- ✅ **Auto-save** - Never lose your work
- ✅ **Dark Mode** - Easy on the eyes
- ✅ **Local First** - Your data stays on your machine
- 🚀 **AI Powered** - Coming soon!

## Quick Start

1. Start typing in the editor
2. Use the toolbar to format your text
3. Toggle the preview panel with \`Ctrl+P\`
4. Open files with \`Ctrl+O\`

---

Happy writing! 🎉
`

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            content: initialContent,
            fileName: null,
            filePath: null,
            fileHandle: null,
            isDirty: false,
            lastSaved: null,
            cursorPosition: { line: 1, column: 1 },

            setContent: (content) => set({ content, isDirty: true }),
            setFileName: (fileName) => set({ fileName }),
            setFilePath: (filePath) => set({ filePath }),
            setFileHandle: (fileHandle) => set({ fileHandle }),
            setIsDirty: (isDirty) => set({ isDirty }),
            setLastSaved: (lastSaved) => set({ lastSaved }),
            setCursorPosition: (line, column) => set({ cursorPosition: { line, column } }),
            resetDocument: () => set({
                content: '',
                fileName: null,
                filePath: null,
                fileHandle: null,
                isDirty: false,
                lastSaved: null,
                cursorPosition: { line: 1, column: 1 },
            }),
        }),
        {
            name: 'zenith-editor-storage',
            partialize: (state) => ({
                content: state.content,
                fileName: state.fileName,
                // Note: fileHandle cannot be persisted
            }),
        }
    )
)
